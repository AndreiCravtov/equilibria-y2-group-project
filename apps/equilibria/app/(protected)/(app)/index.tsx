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
import { DatePicker, useDatePicker } from "@/components/DatePicker";
import { scheduleWaterReminders } from "@/hooks/useNotifications";

export default function TabTwoScreen() {
  const { selectedDayTimestamp } = useDatePicker();
  useEffect(() => {
    scheduleWaterReminders();
  }, []);

  const waterEntries = useQuery(api.water.getWaterByDate, {
    dateUnixTimestamp: BigInt(selectedDayTimestamp),
  });

  function getTotalWaterIntake(entries: { waterIntake: number | bigint }[]) {
    return entries.reduce(
      (total, entry) => total + Number(entry.waterIntake),
      0
    );
  }

  const totalWaterIntake = getTotalWaterIntake(waterEntries ?? []);
  const userGoal = 2000;

  const waterPercentage = (totalWaterIntake / userGoal) * 100;

  return (
    <ZStack flex={1} width="100%">
      {/* Render content that's NOT under water - normal styling */}
      <Content
        bg="$background"
        color="$indigo8Dark"
        totalWaterIntake={totalWaterIntake}
        userGoal={userGoal}
      />
      {/* Create masked view based on water progress */}
      <MaskedView
        style={{
          height: "100%",
          width: "100%",
        }}
        maskElement={<WaterProgress percentage={waterPercentage} />}
      >
        {/* Render content that IS under water - inverted styling */}
        <Content
          bg="$indigo8Dark"
          color="$background"
          totalWaterIntake={totalWaterIntake}
          userGoal={userGoal}
        />
      </MaskedView>
      {/* Create hidden clickable item to act as the button */}
      <Link href="/add-water" asChild>
        <Pressable
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            bottom: "20%", // This puts it 75% down from the top (25% from bottom)
            left: "50%",
            transform: [{ translateX: -50 }],
          }}
        />
      </Link>
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
  totalWaterIntake: number;
  userGoal: number;
}

function Content({ bg, color, totalWaterIntake, userGoal }: ContentProps) {
  return (
    <YStack flex={1} items="center" bg={bg}>
      <H2 color={color} fontWeight={"bold"} pt={"$10"} fontSize={50}>
        {totalWaterIntake}/{userGoal} ml
      </H2>
      {/* Relative button */}
      <View
        style={{
          position: "absolute",
          bottom: "20%", // This puts it 75% down from the top (25% from bottom)
          left: "50%",
          transform: [{ translateX: -50 }],
        }}
      >
        <DropletPlusFill
          size={100}
          // @ts-ignore
          color={color}
        />
      </View>
    </YStack>
  );
}
