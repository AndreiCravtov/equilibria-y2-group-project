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
  GetThemeValueForKey,
} from "tamagui";
import { api } from "@/convex/_generated/api";
import { BarChart } from "react-native-gifted-charts";
import { LoadingView } from "@/components/Loading";
import { MS_IN_SEC } from "@/util/date";
import { AppH2 } from "@/components/app-components";
import useProfile from "@/hooks/useProfile";
import { match, P } from "ts-pattern";
import { OpaqueColorValue } from "react-native";
import { A } from "@mobily/ts-belt";

export default function LeaderboardStaticView() {
  const user = useQuery(api.users.getCurrentUser);
  const dailyLeaderboard = useQuery(api.scores.getDailyLeaderboard);
  // const leaderboardList = useQuery(api.friends.getLeaderboardList);
  const weekData = useQuery(api.scores.getWeekScores);
  if (!user || !dailyLeaderboard || !weekData) {
    return <LoadingView />;
  }

  // console.log("leaderboardList: ", leaderboardList);
  // const [first, second, third] = leaderboardList || [];
  // const yourIndex = leaderboardList.findIndex(
  //   (item) => (item?.id || 0) === user._id
  // );
  // const you = leaderboardList[yourIndex];
  // console.log("weekData: ", weekData);

  // Process leaderboard data
  type EllipsisMode = "none" | "bottom" | "above-user";
  const ellipsis: EllipsisMode = (() => {
    // If there are only five people, no point showing ellipsis
    if (dailyLeaderboard.length <= 5) return "none";

    // If our username is within the top 4, show ellipsis at bottom
    for (let i = 0; i < 4; i++) {
      if (dailyLeaderboard[i].username === user.username) return "bottom";
    }

    // Otherwise, current is not in top of leaderboard so render ellipsis above them
    return "above-user";
  })();
  const renderLearboardRow = (
    background: string,
    v: {
      username: string;
      name: string;
      score: number;
      place: number;
    },
    key?: React.Key | null | undefined
  ) => {
    const you = v.username === user.username;
    const name = you ? "You" : v.username;
    return (
      <LeaderboardRow
        key={key}
        place={v.place}
        name={name}
        score={v.score}
        background={background}
        color={you ? "#FFFFFF" : undefined}
      />
    );
  };
  const Ellipsis = () => (
    <XStack gap="$2" my="$2" self="center">
      <Dot />
      <Dot />
      <Dot />
    </XStack>
  );

  // Process weekly data
  const formatLabel = (
    date: Date // Helper to format MM/DD label
  ) =>
    `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
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
    // console.log(dayTimestamp, score);

    // Create date from timestamp
    const date = new Date(dayTimestamp * MS_IN_SEC);
    processedWeekData.push({
      value: score,
      label: formatLabel(date),
      frontColor: score > 15 ? "#FBBF24" : "#0954A5",
    });
  }

  return (
    <ScrollView p="$4" bounces={false} bg="$background">
      <YStack gap="$3" items="center">
        {/* Top 3 */}
        <AppH2 self="center">Daily scores</AppH2>
        <YStack width="100%" gap="$2">
          {A.mapWithIndex(
            dailyLeaderboard.filter((v) => v.place <= 3),
            (ix, v) =>
              renderLearboardRow(
                match(v.place)
                  .with(1, (_) => "#FBBF24")
                  .with(2, (_) => "$gray11Dark")
                  .with(3, (_) => "#A18072")
                  .otherwise((_) => "#0954A5"),
                v,
                ix
              )
          )}

          {/* Ellipsis separator */}
          {match(ellipsis)
            .with("none", (_) =>
              A.mapWithIndex(
                dailyLeaderboard.filter((v) => v.place === 4 || v.place === 5),
                (ix, v) => renderLearboardRow("#0954A5", v, ix)
              )
            )
            .with("bottom", (_) => (
              <>
                {renderLearboardRow("#0954A5", dailyLeaderboard[3], 3)}
                <Ellipsis />
              </>
            ))
            .with("above-user", (_) => {
              // find username index
              let userIx = 0;
              while (dailyLeaderboard[userIx].username !== user.username) {
                userIx++;
              }

              return (
                <>
                  <Ellipsis />
                  {renderLearboardRow(
                    "#0954A5",
                    dailyLeaderboard[userIx],
                    userIx
                  )}
                </>
              );
            })
            .exhaustive()}
        </YStack>

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
  color?: OpaqueColorValue | GetThemeValueForKey<"color"> | undefined;
  background: string;
}) {
  return (
    <XStack
      justify="space-between"
      items="center"
      p="$3"
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
    <YStack pb="$4" items="center" width="100%">
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
