import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useEffect } from "react";
import Animated, {
  useFrameCallback,
  useSharedValue,
  useDerivedValue as useReanimatedDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/animation/springUtils";

const WAVE_HEIGHT = 30; // Amplitude of the wave - Made shallower
const WAVE_LENGTH = 2_000; // Speed of the wave animation - Made slower
const WATER_COLOR = "#0077FF"; // Blue color for the water
const WIDTH_MARGIN = 0.1; // Draws wave wider than actual, to prevent weird artifacts around edges
const WAVE_RES = 5; // Number of pixels between each wave-point

interface WaterProgressProps {
  /// 0% to 100%, represents how full the water level is
  percentage: number;
  // Percentage of parent height for top/bottom padding
  yPad?: number;
}

export function WaterProgress(props: WaterProgressProps) {
  const { percentage, yPad } = {
    yPad: 1,
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

  const path = useReanimatedDerivedValue(() => {
    "worklet";
    if (layoutWidth.value === 0 || layoutHeight.value === 0) {
      return Skia.Path.Make(); // Return an empty path if layout is not determined yet
    }

    const currentWidth = layoutWidth.value;
    const currentHeight = layoutHeight.value;

    const currentWidthMargin = currentWidth * WIDTH_MARGIN;
    const leftMostPoint = -currentWidthMargin;
    const rightMostPoint = currentWidth + currentWidthMargin;
    const currentWaveLength = rightMostPoint - leftMostPoint; // Wave length is the full width of the component

    const p = Skia.Path.Make();

    const normalizedUserPercentage =
      Math.max(0, Math.min(100, animatedPercentageSV.value)) / 100;
    const normalizedYPad = Math.max(0, animatedYPadSV.value) / 100; // yPad is a percentage e.g. 5 for 5%

    const pixelYPad = normalizedYPad * currentHeight;

    // Top Y where wave crest should be at 100% water level
    const waveCrestAtTopLimit = pixelYPad;
    // Bottom Y where wave trough should be at 0% water level
    const waveTroughAtBottomLimit = currentHeight - pixelYPad;

    // Calculate baseline limits
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

    p.moveTo(leftMostPoint, waveBaseline);

    for (let x = leftMostPoint; x < rightMostPoint; x += WAVE_RES) {
      const y =
        waveBaseline +
        (WAVE_HEIGHT / 2) *
          Math.sin((x / currentWaveLength) * 2 * Math.PI + phase.value);
      p.lineTo(x, y);
    }

    p.lineTo(rightMostPoint, currentHeight); // Bottom-right corner of the component
    p.lineTo(leftMostPoint, currentHeight); // Bottom-left corner of the component
    p.close(); // Close the path to fill it
    return p;
  }, [phase, animatedPercentageSV, layoutWidth, layoutHeight, yPad]); // Use animatedPercentageSV in dependencies

  return (
    <Animated.View
      style={{
        // Transparent background because mask is based off alpha channel.
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        style={{ flex: 1 }} // Canvas fills its parent container
        onLayout={(event) => {
          layoutWidth.value = event.nativeEvent.layout.width;
          layoutHeight.value = event.nativeEvent.layout.height;
        }}
      >
        <Path path={path} color={WATER_COLOR} />
      </Canvas>
    </Animated.View>
  );
}
