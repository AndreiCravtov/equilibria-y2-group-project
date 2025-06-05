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
  H1,
  GetThemeValueForKey,
} from "tamagui";
import { ToastControl } from "@/app/CurrentToast";
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
import { useEffect, useMemo } from "react";
import CustomDropletIcon from "@/components/CustomDropletIcon";
import { OpaqueColorValue, Pressable, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { WaterProgress } from "@/components/WaterProgress";

export default function TabFourScreen() {
  const waterPercentage = 22;

  return (
    <ZStack width="100%" height="100%">
      {/* Render content that's NOT under water - normal styling */}
      <Content bg="$background" color="$blue10" />

      {/* Create masked view based on water progress */}
      <MaskedView
        style={{
          height: "100%",
          width: "100%",
        }}
        maskElement={<WaterProgress percentage={waterPercentage} />}
      >
        {/* Render content that IS under water - inverted styling */}
        <Content bg="$blue10" color="$background" />
      </MaskedView>
    </ZStack>
  );
}

interface ContentProps {
  bg?:
    | OpaqueColorValue
    | GetThemeValueForKey<"backgroundColor">
    | null
    | undefined;
  color?: OpaqueColorValue | GetThemeValueForKey<"color"> | undefined;
}

function Content({ bg, color }: ContentProps) {
  return (
    <YStack flex={1} items="center" gap="$8" px="$10" pt="$5" bg={bg}>
      <H1 color={color}>Foobar</H1>
      <H1 color={color}>Foobar</H1>
      <H1 color={color}>Foobar</H1>
      <H1 color={color}>Foobar</H1>
      <H1 color={color}>Foobar</H1>
      <H1 color={color}>Foobar</H1>
      <H1 color={color}>Foobar</H1>
      <H1 color={color}>Foobar</H1>
    </YStack>
  );
}
