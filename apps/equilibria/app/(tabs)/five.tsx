import { ExternalLink } from "@tamagui/lucide-icons";
import {
  Anchor,
  H2,
  Paragraph,
  XStack,
  YStack,
  useTheme,
  Text,
  ZStack,
} from "tamagui";
import { ToastControl } from "@/app/CurrentToast";
import { SignIn } from "../SignIn";
import { Authenticated, Unauthenticated } from "convex/react";
import Animated, {
  useSharedValue,
  useFrameCallback,
  Easing as ReanimatedEasing,
  useDerivedValue as useReanimatedDerivedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import AppAnimated from "@/components/app-animated";
import {
  Canvas,
  Path,
  Skia,
  Text as SkiaText,
  Group,
  SkFont,
  SkTypeface,
  FontWeight,
  FontWidth,
  FontSlant,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import CustomDropletIcon from "@/components/CustomDropletIcon";
import { Pressable, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { WaterProgress } from "@/components/WaterProgress";

// Create an animated version of Pressable for Reanimated styles
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabFiveScreen() {
  return (
    <ZStack flex={1} bg="$background">
      {/* <MaskedView
        style={{
          height: "500%",
          width: "100%",
        }}
        maskElement={<WaterProgress percentage={30} />}
      >
        <View style={{ flex: 1, height: "100%", backgroundColor: "#324376" }} />
        <View style={{ flex: 1, height: "100%", backgroundColor: "#F5DD90" }} />
        <View style={{ flex: 1, height: "100%", backgroundColor: "#F76C5E" }} />
        <View style={{ flex: 1, height: "100%", backgroundColor: "#e1e1e1" }} />
      </MaskedView> */}

      <WaterProgress percentage={30} />
    </ZStack>
  );
}
