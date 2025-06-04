import { ExternalLink } from "@tamagui/lucide-icons";
import { Anchor, H2, Paragraph, XStack, YStack } from "tamagui";
import { ToastControl } from "@/app/CurrentToast";
import { SignIn } from "../SignIn";
import { Authenticated, Unauthenticated } from "convex/react";
import Animated, {
  useSharedValue,
  useFrameCallback,
  Easing as ReanimatedEasing,
  useDerivedValue as useReanimatedDerivedValue,
} from "react-native-reanimated";
import AppAnimated from "@/components/app-animated";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

const WAVE_HEIGHT = 30; // Amplitude of the wave - Made shallower
const WAVE_SPEED = 0.01; // Speed of the wave animation - Made slower
const WATER_COLOR = "#0077FF"; // Blue color for the water

interface TestAnimatedProps {
  percentage: number; // 0 to 100, represents how full the water level is
  yPad: number; // Percentage of parent height for top/bottom padding
}

const TestAnimated = ({ percentage, yPad }: TestAnimatedProps) => {
  const phase = useSharedValue(0);
  const layoutWidth = useSharedValue(0);
  const layoutHeight = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    "worklet";
    const timeDelta = frameInfo.timeSincePreviousFrame ?? 1 / 60;
    const newPhase =
      (phase.value + timeDelta * WAVE_SPEED * 0.1) % (2 * Math.PI);
    phase.value = newPhase;
  });

  const path = useReanimatedDerivedValue(() => {
    "worklet";
    if (layoutWidth.value === 0 || layoutHeight.value === 0) {
      return Skia.Path.Make(); // Return an empty path if layout is not determined yet
    }

    const currentWidth = layoutWidth.value;
    const currentHeight = layoutHeight.value;
    const currentWaveLength = currentWidth; // Wave length is the full width of the component

    const p = Skia.Path.Make();

    const normalizedUserPercentage =
      Math.max(0, Math.min(100, percentage)) / 100;
    const normalizedYPad = Math.max(0, yPad) / 100; // yPad is a percentage e.g. 5 for 5%

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

    p.moveTo(0, waveBaseline);

    for (let x = 0; x <= currentWidth; x += 5) {
      const y =
        waveBaseline +
        (WAVE_HEIGHT / 2) *
          Math.sin((x / currentWaveLength) * 2 * Math.PI + phase.value);
      p.lineTo(x, y);
    }

    p.lineTo(currentWidth, currentHeight); // Bottom-right corner of the component
    p.lineTo(0, currentHeight); // Bottom-left corner of the component
    p.close(); // Close the path to fill it
    return p;
  }, [phase, percentage, layoutWidth, layoutHeight, yPad]); // Added yPad to dependencies

  return (
    <Canvas
      style={{ flex: 1 }} // Canvas fills its parent container
      onLayout={(event) => {
        layoutWidth.value = event.nativeEvent.layout.width;
        layoutHeight.value = event.nativeEvent.layout.height;
      }}
    >
      <Path path={path} color={WATER_COLOR} />
    </Canvas>
  );
};

export default function TabFourScreen() {
  return (
    <AppAnimated.YStack flex={1} bg="$background">
      <TestAnimated yPad={1} percentage={0} />
      {/* You can add other UI elements on top of TestAnimated here, using absolute positioning if needed */}
      {/* For example, the "Hello Jane" text and the "+" button from the reference */}
      {/* <YStack position="absolute" top={50} left={20} >
        <H2>Hello Jane</H2>
      </YStack> */}
    </AppAnimated.YStack>
  );
}
