import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useMutation,
} from "convex/react";
import {
  Text,
  View,
  ScrollView,
  YStack,
  XStack,
  Card,
  Input,
  Button,
  Group,
  H3,
  useTheme,
  Separator,
} from "tamagui";
import {
  GlassWater,
  ActivitySquare,
  AirVent,
  Edit3,
} from "@tamagui/lucide-icons";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { Result } from "@/util/result";
import { extractDate, date_to_string } from "@/components/date-selector";
import { computeDailyScore } from "@/util/hydrationScore"; // <── NEW

export default function AddWaterScreen() {
  const date = new Date();
  const theme = useTheme();


  const waterEntries = useQuery(api.water.getWaterByDate, {
    date: extractDate(date),
  });

  const addWater = useMutation(api.water.addWaterEntry);
  const [newAmount, setNewAmount] = useState("");

  if (!waterEntries) return <Text>Loading water entries...</Text>;


  // SCORE CALCULATION

  const DAILY_GOAL_ML = 2000;

  const todayScore = useMemo(() => {
    const events = waterEntries.map((item) => ({
      timestamp: new Date(item.date || item._creationTime), // adjust field name
      volumeMl: Number(item.waterIntake),
    }));

    return computeDailyScore(events, DAILY_GOAL_ML);
  }, [waterEntries]);


  const handleAddEntry = async (amount: number | bigint) => {
    await addWater({ date: date.toISOString(), waterIntake: BigInt(amount) });
    setNewAmount("");
  };

  function createGroupButton({
    icon,
    value,
    bgColor,
  }: {
    icon: any;
    value: number;
    bgColor: string;
  }) {
    return (
      <Group.Item key={value}>
        <Button
          flex={1}
          onPress={() => handleAddEntry(value)}
          icon={icon}
          color="$blue8Dark"
          fontWeight="bold"
          bg={bgColor}
        >
          <Text color="$blue8Dark" fontWeight="bold" fontSize="$5">
            {value}ml
          </Text>
        </Button>
      </Group.Item>
    );
  }


  return (
    <ScrollView padding="$4" bounces={false} bg="#FFFFFF">
      <YStack space="$4">
        <H3 fontWeight="bold" textAlign="center" color="$indigo8Dark">
          Add records
        </H3>

        {/* Quick‑add buttons */}
        <Group orientation="horizontal" width="100%">
          {[
            { value: 200, bgColor: "$blue12Dark" },
            { value: 250, bgColor: "$indigo2" },
            { value: 500, bgColor: "$blue12Dark" },
          ].map(({ value, bgColor }) =>
            createGroupButton({ icon: GlassWater, value, bgColor }),
          )}
        </Group>

        {/* Custom input */}
        <YStack space="$2">
          <Input
            placeholder="Enter water in mL"
            keyboardType="numeric"
            value={newAmount}
            onChangeText={setNewAmount}
            placeholderTextColor="$indigo8Dark"
            color="$indigo8Dark"
            bg="$indigo2"
          />
          <Button
            onPress={() => handleAddEntry(Number(newAmount))}
            color="$blue8Dark"
            bg="$indigo2"
          >
            Add Entry
          </Button>
        </YStack>

        {/* Daily score */}
        <YStack alignItems="center" space="$1">
          <H3 fontWeight="bold" color="$indigo8Dark">
            Today\'s Score
          </H3>
          <Text fontSize="$9" fontWeight="bold" color="$blue8Dark">
            {todayScore}
          </Text>
          <Text color="$indigo8Dark">out of 100</Text>
        </YStack>

        <Separator my={15} bg="$indigo8Dark" />

        <H3 fontWeight="bold" textAlign="center" color="$indigo8Dark">
          {date_to_string(date)} entries
        </H3>

        {/* Entries list */}
        {waterEntries.length === 0 ? (
          <Text>No water entries yet.</Text>
        ) : (
          waterEntries.map((item) => (
            <Card key={item._id} padded bordered elevate>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="$6" color="$indigo8Dark">
                  {item.waterIntake} mL
                </Text>
                <Button size="$3" chromeless onPress={() => handleEdit(item)}>
                  <Edit3 size={24} color="$indigo8Dark" />
                </Button>
              </XStack>
            </Card>
          ))
        )}
      </YStack>
    </ScrollView>
  );
}
