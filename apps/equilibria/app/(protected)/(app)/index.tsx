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
  Button,
  View,
} from "tamagui";
import { ToastControl } from "@/app/CurrentToast";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
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
import { DropletPlusFill } from "@/components/DropletPlusFill";
import { OpaqueColorValue, Pressable } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { WaterProgress } from "@/components/WaterProgress";
import { Link } from "expo-router";
import { api } from "@/convex/_generated/api";
import DateSelector from "@/components/date-selector";
import { DatePicker } from "@/components/date-picker";

export default function TabTwoScreen() {
  return <View />;
}
