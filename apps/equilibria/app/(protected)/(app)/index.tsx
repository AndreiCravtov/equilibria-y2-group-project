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
  H4,
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
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DropletPlusFill } from "@/components/DropletPlusFill";
import { ColorValue, OpaqueColorValue, Pressable } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { WaterProgress } from "@/components/WaterProgress";
import { Link } from "expo-router";
import { api } from "@/convex/_generated/api";
import { DatePicker, useDatePicker } from "@/components/DatePicker";
import { scheduleWaterReminders } from "@/hooks/useNotifications";
import { LoadingView } from "@/components/Loading";
import Svg, { Path as SvgPath } from "react-native-svg";
import { match, P } from "ts-pattern";
import { RulerLines } from "@/components/RulerLines";

export default function TabTwoScreen() {
  const { selectedDayTimestamp } = useDatePicker();

  const waterEntries = useQuery(api.water.getWaterByDate, {
    dateUnixTimestamp: BigInt(selectedDayTimestamp),
  });
  const profile = useQuery(api.userProfiles.getUserProfile);
  const dailyScore = useQuery(api.scores.getDailyScore);

  function getTotalWaterIntake(entries: { waterIntake: number | bigint }[]) {
    return entries.reduce(
      (total, entry) => total + Number(entry.waterIntake),
      0
    );
  }

  // Loading screen
  if (
    waterEntries === undefined ||
    profile === undefined ||
    dailyScore === undefined
  ) {
    return <LoadingView />;
  }

  const totalWaterIntake = getTotalWaterIntake(waterEntries);
  const userGoal = Number(profile.dailyTarget);

  const waterPercentage = (totalWaterIntake / userGoal) * 100;

  return (
    <ZStack flex={1} width="100%">
      {/* Render content that's NOT under water - normal styling */}
      <Content
        bg="$background"
        color="$indigo8Dark"
        rulerStroke="$indigo12"
        totalWaterIntake={totalWaterIntake}
        userGoal={userGoal}
        score={dailyScore}
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
          rulerStroke="white"
          totalWaterIntake={totalWaterIntake}
          userGoal={userGoal}
          score={dailyScore}
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
  score: number;
  rulerStroke?: GetThemeValueForKey<"color"> | undefined;
}

function Content({
  bg,
  color,
  totalWaterIntake,
  userGoal,
  score,
  rulerStroke,
}: ContentProps) {
  const leftToDrinkMl = Math.max(0, userGoal - totalWaterIntake);
  const goalMessage = match(leftToDrinkMl)
    .when(
      (v) => v === 0,
      (_) => "Today's goal reached"
    )
    .otherwise((v) => `${v} ml remaining`);

  return (
    <ZStack flex={1} items="center" bg={bg}>
      <YStack flex={1} items="center" pt="$10">
        <H2 color={color} fontWeight="bold" fontSize="$8" lineHeight="$6">
          {goalMessage}
        </H2>
        <H4 color={color} fontSize="$5">
          Score: {score}
        </H4>
      </YStack>

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

      {/* Relative scale */}
      <RulerLines rulerStroke={rulerStroke} />
    </ZStack>
  );
}
