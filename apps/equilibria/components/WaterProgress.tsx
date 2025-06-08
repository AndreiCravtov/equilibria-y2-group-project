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
const WAVE_LENGTH = 1_000; // Speed of the wave animation - Made slower
const WATER_COLOR = "#0077FF"; // Blue color for the water
const WIDTH_MARGIN = 0.1; // Draws wave wider than actual, to prevent weird artifacts around edges
const WAVE_RES = 100; // Number of pixels between each wave-point
const TARGET_FPS = 30; // Target frame rate for smoother performance

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
  const lastFrameTime = useSharedValue(0); // For 30fps throttling

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
    const currentTime = frameInfo.timestamp;
    const targetFrameInterval = 1000 / TARGET_FPS; // ~33.33ms for 30fps

    // Throttle to 30fps
    if (
      lastFrameTime.value === 0 ||
      currentTime - lastFrameTime.value >= targetFrameInterval
    ) {
      const timeDelta = frameInfo.timeSincePreviousFrame ?? 1 / 60; // Use original timing logic
      const newPhase = (phase.value + timeDelta / WAVE_LENGTH) % (2 * Math.PI);
      phase.value = newPhase;
      lastFrameTime.value = currentTime;
    }
  });

  // SVG path string generation for useAnimatedProps
  const animatedProps = useAnimatedProps(() => {
    "worklet";
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
    const waveBaseline =
      highestPossibleWaveBaseline +
      (1 - normalizedUserPercentage) * clampedBaselineSpan;

    const p = phase.value;
    const wH = WAVE_HEIGHT;
    const cwl = currentWaveLength;

    const yAtX = (xPos: number) => {
      "worklet";
      if (cwl === 0) return waveBaseline;
      return waveBaseline + (wH / 2) * Math.sin((xPos / cwl) * 2 * Math.PI + p);
    };

    // Calculate derivative for Hermite splines
    const dyAtX = (xPos: number) => {
      "worklet";
      if (cwl === 0) return 0;
      return (
        (wH / 2) *
        Math.cos((xPos / cwl) * 2 * Math.PI + p) *
        ((2 * Math.PI) / cwl)
      );
    };

    // Use WAVE_RES to determine sampling frequency, but keep consistent segment behavior
    const segmentLength = WAVE_RES;
    let d = [`M ${leftMostPoint} ${yAtX(leftMostPoint)}`];
    let currentX = leftMostPoint;

    // Hermite spline implementation for ultra-smooth curves
    while (currentX < rightMostPoint) {
      const nextX = Math.min(currentX + segmentLength, rightMostPoint);
      const segmentWidth = nextX - currentX;

      if (segmentWidth > 0) {
        const p0 = yAtX(currentX);
        const p1 = yAtX(nextX);
        // Scale tangents proportionally to segment width, but with a consistent multiplier
        const tangentScale = segmentWidth * 0.3; // Proportional to segment, but consistent scaling
        const m0 = dyAtX(currentX) * tangentScale;
        const m1 = dyAtX(nextX) * tangentScale;

        // Convert Hermite to cubic Bézier control points
        const cp1X = currentX + segmentWidth / 3;
        const cp1Y = p0 + m0;
        const cp2X = nextX - segmentWidth / 3;
        const cp2Y = p1 - m1;

        d.push(`C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${nextX} ${p1}`);
      }

      currentX = nextX;
    }

    d.push(`L ${rightMostPoint} ${currentHeight}`);
    d.push(`L ${leftMostPoint} ${currentHeight}`);
    d.push(`Z`);

    return { d: d.join(" ") };
  }, [phase, animatedPercentageSV, layoutWidth, layoutHeight, animatedYPadSV]);

  return (
    <Animated.View
      style={{
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
        }
        style={{ width: "100%", height: "100%" }}
      >
        <AnimatedSvgPath animatedProps={animatedProps} fill={fill} />
      </Svg>
    </Animated.View>
  );
}
