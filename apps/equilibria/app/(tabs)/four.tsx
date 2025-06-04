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
import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

const { width, height: screenHeight } = Dimensions.get("window");

const WAVE_HEIGHT = 30; // Amplitude of the wave - Made shallower
const WAVE_LENGTH = width; // Width of a single wave cycle
const WAVE_SPEED = 0.01; // Speed of the wave animation - Made slower
const WATER_COLOR = "#0077FF"; // Blue color for the water

interface TestAnimatedProps {
  percentage: number; // 0 to 100, represents how full the water level is
}

const TestAnimated = ({ percentage }: TestAnimatedProps) => {
  const phase = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    "worklet";
    const timeDelta = frameInfo.timeSincePreviousFrame ?? 1 / 60;
    const newPhase =
      (phase.value + timeDelta * WAVE_SPEED * 0.1) % (2 * Math.PI);
    phase.value = newPhase;
  });

  const path = useReanimatedDerivedValue(() => {
    "worklet";
    const p = Skia.Path.Make();
    // Ensure percentage is within 0-100 range
    const normalizedPercentage = Math.max(0, Math.min(100, percentage)) / 100;
    const waveBaseline = (1 - normalizedPercentage) * screenHeight; // Water level based on percentage

    p.moveTo(0, waveBaseline);

    for (let x = 0; x <= width; x += 5) {
      const y =
        waveBaseline +
        (WAVE_HEIGHT / 2) *
          Math.sin((x / WAVE_LENGTH) * 2 * Math.PI + phase.value);
      p.lineTo(x, y);
    }

    p.lineTo(width, screenHeight); // Bottom-right corner
    p.lineTo(0, screenHeight); // Bottom-left corner
    p.close(); // Close the path to fill it
    return p;
  }, [phase, percentage]);

  return (
    <Canvas style={{ flex: 1, width, height: screenHeight }}>
      <Path path={path} color={WATER_COLOR} />
    </Canvas>
  );
};

export default function TabFourScreen() {
  return (
    <AppAnimated.YStack
      flex={1}
      // items="center" // Removed to allow TestAnimated to fill
      // gap="$8" // Removed for full screen effect
      // px="$10" // Removed for full screen effect
      // pt="$5" // Removed for full screen effect
      bg="$background"
    >
      <TestAnimated percentage={60} />
      {/* You can add other UI elements on top of TestAnimated here, using absolute positioning if needed */}
      {/* For example, the "Hello Jane" text and the "+" button from the reference */}
      {/* <YStack position="absolute" top={50} left={20} >
        <H2>Hello Jane</H2>
      </YStack> */}
    </AppAnimated.YStack>
  );
}
