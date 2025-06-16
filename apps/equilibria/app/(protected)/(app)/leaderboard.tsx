import { useQuery } from "convex/react";
import {
  View,
  Text,
  H2,
  H3,
  YStack,
  XStack,
  Separator,
  ScrollView,
} from "tamagui";
import { api } from "@/convex/_generated/api";
import { BarChart } from "react-native-gifted-charts";
import { LoadingView } from "@/components/Loading";
import { MS_IN_SEC } from "@/util/date";
import { AppH2 } from "@/components/app-components";

export default function LeaderboardStaticView() {
  const leaderboardList = useQuery(api.friends.getLeaderboardList);
  const user = useQuery(api.users.getCurrentUser);
  const weekData = useQuery(api.scores.getWeekData);
  if (!leaderboardList || !weekData || !user) {
    return <LoadingView />;
  }

  console.log("leaderboardList: ", leaderboardList);
  const [first, second, third] = leaderboardList || [];
  const yourIndex = leaderboardList.findIndex(
    (item) => (item?.id || 0) === user._id
  );
  const you = leaderboardList[yourIndex];
  console.log("weekData: ", weekData);

  // Process leaderboard data
  const formatLabel = (
    date: Date // Helper to format MM.DD label
  ) =>
    `${(date.getMonth() + 1).toString().padStart(2, "0")}.${date
      .getDate()
      .toString()
      .padStart(2, "0")}`;
  const processedWeekData: {
    value: number;
    label: string;
    frontColor: string;
  }[] = [];
  for (const k of Object.keys(weekData)) {
    const dayTimestamp = Number(k);
    const score = weekData[k as unknown as number];
    console.log(dayTimestamp, score);

    // Create date from timestamp
    const date = new Date(dayTimestamp * MS_IN_SEC);
    processedWeekData.push({
      value: score,
      label: formatLabel(date),
      frontColor: score > 15 ? "#FBBF24" : "#0954A5",
    });
  }
  return (
    <ScrollView p="$4" bounces={false} bg="#FFFFFF">
      <YStack gap="$3" alignItems="center">
        {/* Top 3 */}
        <AppH2 self="center">Daily scores</AppH2>
        <YStack width="100%" gap="$2">
          <LeaderboardRow
            place={1}
            name={first?.username || "First placeholder"}
            score={String(first?.score || 0)}
            background="#FBBF24"
          />
          <LeaderboardRow
            place={2}
            name={second?.username || "Second placeholder"}
            score={String(second?.score || 0)}
            background="$gray11Dark"
          />
          <LeaderboardRow
            place={3}
            name={third?.username || "Third placeholder"}
            score={String(third?.score || 0)}
            background="#A18072"
          />
        </YStack>

        {/* Separator */}
        <XStack gap="$2" my="$2">
          <Dot />
          <Dot />
          <Dot />
        </XStack>

        {/* User */}
        <LeaderboardRow
          place={yourIndex + 1}
          name="You"
          score={you.score}
          background="#0954A5"
          color={"#FFFFFF"}
        />
        <View
          style={{
            alignSelf: "stretch",
            height: 2,
            backgroundColor: "#0954A5",
            marginVertical: 10,
          }}
        />
        <ProgressChart data={processedWeekData} />
      </YStack>
    </ScrollView>
  );
}

// Leaderboard Row Component
function LeaderboardRow({
  place,
  name,
  score,
  color,
  background,
}: {
  place: number;
  name: string;
  score: number | string;
  color: string;
  background: string;
}) {
  return (
    <XStack
      // @ts-ignore
      justifyContent="space-between"
      alignItems="center"
      padding="$3"
      borderRadius="$4"
      backgroundColor={background}
      width="100%"
    >
      <Text fontWeight="bold" color={color}>
        {place}. {name}
      </Text>
      <Text color={color}>{score} score</Text>
    </XStack>
  );
}

// Dot separator
function Dot() {
  // @ts-ignore
  return <View width={8} height={8} borderRadius={4} backgroundColor="#AAA" />;
}

function ProgressChart({ data }) {
  return (
    <YStack pb="$4" alignItems="center" width="100%">
      <AppH2 self="center">Weekly progress</AppH2>
      <BarChart
        data={data}
        frontColor="#0954A5"
        barBorderRadius={5}
        noOfSections={3}
        spacing={15}
        initialSpacing={10}
        endSpacing={10}
        barWidth={28}
        yAxisThickness={0}
        xAxisThickness={2}
      />
    </YStack>
  );
}
