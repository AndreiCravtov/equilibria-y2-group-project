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

const WAVE_HEIGHT = 100; // Amplitude of the wave
const WAVE_LENGTH = width; // Width of a single wave cycle
const WAVE_SPEED = 0.05; // Speed of the wave animation
const WATER_COLOR = "#0077FF"; // Blue color for the water

const TestAnimated = () => {
  const phase = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    "worklet";
    const timeDelta = frameInfo.timeSincePreviousFrame ?? 1 / 60; // Handle null on first frame, assume 60FPS
    const newPhase =
      (phase.value + timeDelta * WAVE_SPEED * 0.1) % (2 * Math.PI);
    phase.value = newPhase;
  });

  const path = useReanimatedDerivedValue(() => {
    "worklet";
    const p = Skia.Path.Make();
    const waveBaseline = screenHeight * 0.6; // 60% from the top

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
  }, [phase]);

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
      <TestAnimated />
      {/* You can add other UI elements on top of TestAnimated here, using absolute positioning if needed */}
      {/* For example, the "Hello Jane" text and the "+" button from the reference */}
      {/* <YStack position="absolute" top={50} left={20} >
        <H2>Hello Jane</H2>
      </YStack> */}
    </AppAnimated.YStack>
  );
}
