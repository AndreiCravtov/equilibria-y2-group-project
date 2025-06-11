import { useQuery } from "convex/react";
import { View, Text, H2, H3, YStack, XStack, Spacer } from 'tamagui'
import { api } from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

export default function LeaderboardStaticView() {

  const leaderboardList = useQuery(api.friends.getLeaderboardList);
  if (!leaderboardList) {
    return <Text>Loading friends data...</Text>;
  }

  console.log("leaderboardList: ", leaderboardList);

  return (
    <YStack gap="$3" p="$4" alignItems="center">
      {/* Top 3 */}
      <YStack width="100%" gap="$2">
        <LeaderboardRow place={1} name="Alice" score={420} color="#FBBF24" />
        <LeaderboardRow place={2} name="Bob" score={420} color="$gray11Dark" />
        <LeaderboardRow place={3} name="Charlie" score={420} color="#A18072" />
      </YStack>

      {/* Separator */}
      <XStack gap="$2" my="$2">
        <Dot />
        <Dot />
        <Dot />
      </XStack>

      {/* User */}
      <LeaderboardRow place={42} name="You" score={24.1} color="#3B82F6" />
    </YStack>
  )
}

// Leaderboard Row Component
function LeaderboardRow({ place, name, score, color }: { place: number, name: string, score: number | string, color: string }) {
  return (
    <XStack
      // @ts-ignore
      justifyContent="space-between"
      alignItems="center"
      padding="$3"
      borderRadius="$4"
      backgroundColor={color}
      width="100%"
    >
      <Text fontWeight="bold">{place}. {name}</Text>
      <Text>{score} score</Text>
    </XStack>
  )
}

// Dot separator
function Dot() {
  // @ts-ignore
  return <View width={8} height={8} borderRadius={4} backgroundColor="#AAA" />
}

function getLeaderboardData(id: string) {
  const username = "John Doe";
  const score = 69420;
  return [id, username, score]
}