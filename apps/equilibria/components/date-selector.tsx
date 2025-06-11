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
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "@tamagui/lucide-icons";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default function DateSelector() {
  let [day, setDay] = useState(new Date());
  let displayDate = `${days[day.getDay()]} ${day.getDate()}`;
  return (
    <YStack>
      <XStack alignItems="center" justifyContent="space-between">
        <Button>
          <ArrowLeft />
        </Button>
        <Text
          fontSize={30}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            width: "100%",
          }}
        >
          {displayDate}
        </Text>
        <Button>
          <ArrowRight />
        </Button>
      </XStack>
      <DaysContent day={day} />
    </YStack>
  );
}

export function DaysContent({ day }: { day: Date }) {
  const date = "2025-04-06"; // placeholder value
  const waterEntries = useQuery(api.water.getWaterByDate, { date: date });

  function getTotalWaterIntake(entries: { waterIntake: number | bigint }[]) {
    return entries.reduce(
      (total, entry) => total + Number(entry.waterIntake),
      0,
    );
  }

  const totalWaterIntake = getTotalWaterIntake(waterEntries ?? []);
  const userGoal = 2000;

  const waterPercentage = (totalWaterIntake / userGoal) * 100;

  return (
    <ZStack width="100%" height="100%">
      {/* Render content that's NOT under water - normal styling */}
      <Content
        bg="$background"
        color="$blue10"
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
          bg="$blue10"
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
      <H1 color={color} fontWeight={"bold"}>
        {totalWaterIntake}/{userGoal}ml
      </H1>

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
