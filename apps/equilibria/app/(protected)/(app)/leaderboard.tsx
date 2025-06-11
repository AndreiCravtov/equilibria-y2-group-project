import {useQuery} from "convex/react";
import {View, Text, H2, H3, YStack, XStack, Separator, ScrollView} from 'tamagui'
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {BarChart} from "react-native-gifted-charts";


export default function LeaderboardStaticView() {

  const leaderboardList = useQuery(api.friends.getLeaderboardList);
  const weekData = useQuery(api.scores.getWeekData);
  if (!leaderboardList || !weekData) {
    return <Text>Loading friends data...</Text>;
  }

  console.log("leaderboardList: ", leaderboardList);
  console.log("weekData: ", weekData);


  return (
    <ScrollView p="$4" bounces={false} bg="#FFFFFF">
      <YStack gap="$3" alignItems="center">
        {/* Top 3 */}
        <YStack width="100%" gap="$2">
          <LeaderboardRow place={1} name="Alice" score={420} color="#FBBF24"/>
          <LeaderboardRow place={2} name="Bob" score={420} color="$gray11Dark"/>
          <LeaderboardRow place={3} name="Charlie" score={420} color="#A18072"/>
        </YStack>

        {/* Separator */}
        <XStack gap="$2" my="$2">
          <Dot/>
          <Dot/>
          <Dot/>
        </XStack>

        {/* User */}
        <LeaderboardRow place={42} name="You" score={24.1} color="#3B82F6"/>
        <View
          style={{
            alignSelf: 'stretch',
            height: 2,
            backgroundColor: '#0954A5',
            marginVertical: 10,
          }}
        />
        <ProgressChart data={weekData}/>
      </YStack>
    </ScrollView>
  )
}

// Leaderboard Row Component
function LeaderboardRow({place, name, score, color}: {
  place: number,
  name: string,
  score: number | string,
  color: string
}) {
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
  return <View width={8} height={8} borderRadius={4} backgroundColor="#AAA"/>
}

function ProgressChart({data}) {
  return (
    <YStack pb="$4" alignItems="center" width="100%">
      <H2 fontWeight="bold" color="$indigo8Dark" bg="#FFFFFF" pb={"$5"}>Your progress</H2>
        <BarChart
          data={data}
          frontColor="#0954A5"
          barBorderRadius={7.5}
          noOfSections={3}
          spacing={15}
          initialSpacing={10}
          endSpacing={10}
          barWidth={28}
        />
    </YStack>
  )
}
