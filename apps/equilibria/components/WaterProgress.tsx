import Svg, { Path as SvgPath } from "react-native-svg";
import { useEffect } from "react";
import Animated, {
  useFrameCallback,
  useSharedValue,
  useAnimatedProps,
  withSpring,
  SharedValue,
} from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/animation/springUtils";
import { ColorValue } from "react-native";

const WAVE_HEIGHT = 30; // Amplitude of the wave - Made shallower
const WAVE_LENGTH = 2_000; // Speed of the wave animation - Made slower
const WATER_COLOR = "#0077FF"; // Blue color for the water
const WIDTH_MARGIN = 0.1; // Draws wave wider than actual, to prevent weird artifacts around edges
const WAVE_RES = 10; // Number of pixels between each wave-point

// Create an Animated component for the SvgPath
const AnimatedSvgPath = Animated.createAnimatedComponent(SvgPath);

export interface WaterProgressProps {
  /// 0% to 100%, represents how full the water level is
  percentage: number;
  /// Percentage of parent height for top/bottom padding
  yPad?: number;
  /// The fill of the water
  fill?: ColorValue | SharedValue<ColorValue | undefined> | undefined;
}

export function WaterProgress(props: WaterProgressProps) {
  // Unpack & default props
  const { percentage, yPad, fill } = {
    yPad: props.yPad ?? 1,
    fill: props.fill ?? WATER_COLOR,
    ...props,
  };

  const phase = useSharedValue(0);
  const layoutWidth = useSharedValue(0);
  const layoutHeight = useSharedValue(0);
  const animatedPercentageSV = useSharedValue(percentage);
  const animatedYPadSV = useSharedValue(yPad);

  useEffect(() => {
    // Spring configuration - adjusted for a slower, smoother, water-like feel
    const springConfig: SpringConfig = {
      mass: 4, // Increased mass for a heavier, slower feel
      damping: 100, // Significantly increased damping to make it glide smoothly
      stiffness: 120, // Moderate stiffness
      overshootClamping: true, // Prevents the water level from overshooting the target
      restDisplacementThreshold: 0.01, // How close to the target to consider it settled
      restSpeedThreshold: 0.5, // How slow it needs to be moving to be considered settled
    };

    animatedPercentageSV.value = withSpring(percentage, springConfig);
    animatedYPadSV.value = withSpring(yPad, springConfig);
  }, [percentage, animatedPercentageSV, yPad, animatedYPadSV]);

  useFrameCallback((frameInfo) => {
    "worklet";
    const timeDelta = frameInfo.timeSincePreviousFrame ?? 1 / 60;
    const newPhase = (phase.value + timeDelta / WAVE_LENGTH) % (2 * Math.PI);
    phase.value = newPhase;
  });

  // SVG path string generation for useAnimatedProps
  const animatedProps = useAnimatedProps(() => {
    ("worklet");
    if (layoutWidth.value === 0 || layoutHeight.value === 0) {
      return { d: "" }; // Return an empty path string for SVG
    }

    const currentHeight = layoutHeight.value;

    // Compute margin, left/right-most points, and wave-length
    const currentWidthMargin = layoutWidth.value * WIDTH_MARGIN;
    const leftMostPoint = -currentWidthMargin;
    const rightMostPoint = layoutWidth.value + currentWidthMargin;
    const currentWaveLength = rightMostPoint - leftMostPoint;

    const normalizedUserPercentage =
      Math.max(0, Math.min(100, animatedPercentageSV.value)) / 100;
    const normalizedYPad = Math.max(0, animatedYPadSV.value) / 100;

    const pixelYPad = normalizedYPad * currentHeight;

    // Top Y where wave crest should be at 100% water level
    const waveCrestAtTopLimit = pixelYPad;
    // Bottom Y where wave trough should be at 0% water level
    const waveTroughAtBottomLimit = currentHeight - pixelYPad;

    const highestPossibleWaveBaseline = waveCrestAtTopLimit + WAVE_HEIGHT / 2;
    const lowestPossibleWaveBaseline =
      waveTroughAtBottomLimit - WAVE_HEIGHT / 2;

    // Span for the baseline to move. Must be non-negative.
    const availableBaselineSpan =
      lowestPossibleWaveBaseline - highestPossibleWaveBaseline;
    const clampedBaselineSpan = Math.max(0, availableBaselineSpan);

    // Final waveBaseline calculation
    // When percentage is 100% (normalizedUserPercentage=1), baseline is highestPossibleWaveBaseline.
    // When percentage is 0% (normalizedUserPercentage=0), baseline is lowestPossibleWaveBaseline (if span > 0).
    const waveBaseline =
      highestPossibleWaveBaseline +
      (1 - normalizedUserPercentage) * clampedBaselineSpan;

    // New path generation using Quadratic Bézier curves:
    const p = phase.value;
    const wH = WAVE_HEIGHT;
    const cwl = currentWaveLength;

    const yAtX = (xPos: number) => {
      "worklet";
      if (cwl === 0) return waveBaseline; // Avoid division by zero if width is 0
      return waveBaseline + (wH / 2) * Math.sin((xPos / cwl) * 2 * Math.PI + p);
    };

    let d = [`M ${leftMostPoint} ${yAtX(leftMostPoint)}`];
    let currentX = leftMostPoint;

    const step = WAVE_RES > 0 ? WAVE_RES : 1; // Use a safe step value
    while (currentX < rightMostPoint) {
      const controlPointXCandidate = currentX + step;
      const endPointXCandidate = currentX + 2 * step;

      if (endPointXCandidate <= rightMostPoint) {
        // Full quadratic segment
        const controlY = yAtX(controlPointXCandidate);
        const endY = yAtX(endPointXCandidate);
        d.push(
          `Q ${controlPointXCandidate} ${controlY}, ${endPointXCandidate} ${endY}`
        );
        currentX = endPointXCandidate;
      } else {
        // Last segment: from currentX to rightMostPoint
        if (rightMostPoint > currentX) {
          // If there's any remaining length
          const lastMidX = (currentX + rightMostPoint) / 2;
          const lastMidY = yAtX(lastMidX);
          const lastEndY = yAtX(rightMostPoint);
          d.push(`Q ${lastMidX} ${lastMidY}, ${rightMostPoint} ${lastEndY}`);
        }
        currentX = rightMostPoint; // Terminate loop
      }
    }

    d.push(`L ${rightMostPoint} ${currentHeight}`); // Bottom-right corner of the component
    d.push(`L ${leftMostPoint} ${currentHeight}`); // Bottom-left corner of the component
    d.push(`Z`); // Close the path to fill it

    return { d: d.join(" ") };
  }, [phase, animatedPercentageSV, layoutWidth, layoutHeight, animatedYPadSV]); // Ensure all dependencies are correct, including animatedYPadSV

  return (
    <Animated.View
      style={{
        // Transparent background because mask is based off alpha channel.
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
      }}
      onLayout={(event) => {
        layoutWidth.value = event.nativeEvent.layout.width;
        layoutHeight.value = event.nativeEvent.layout.height;
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={
          layoutWidth.value > 0 && layoutHeight.value > 0
            ? `0 0 ${layoutWidth.value} ${layoutHeight.value}`
            : undefined
        } // Set viewBox for proper scaling
        style={{ width: "100%", height: "100%" }} // Ensure Svg fills the view
      >
        <AnimatedSvgPath animatedProps={animatedProps} fill={fill} />
      </Svg>
    </Animated.View>
  );
}
