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
import { AlarmClock, ActivitySquare, AirVent } from "@tamagui/lucide-icons";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Result } from "@/util/result";

export default function AddWaterScreen() {
  const theme = useTheme();
  const date = "2025-04-06"; // placeholder value

  const waterEntries = useQuery(api.water.getWaterByDate, {
    date: date,
  });

  const addWater = useMutation(api.water.addWaterEntry);
  const [newAmount, setNewAmount] = useState("");

  if (!waterEntries) return <Text>Loading water entries...</Text>;

  console.log(`waterEntries: ${waterEntries}`);
  const handleAddEntry = async (amount: number | bigint) => {
    await addWater({ date, waterIntake: BigInt(amount) });
    setNewAmount("");
  };

  return (
    <ScrollView style={{ padding: 16 }} bounces={false}>
      <YStack space="$4">
        <H3 fontWeight="bold" textAlign="center" color="$color.indigo10">
          Add records
        </H3>
        {/* Input to add water */}
        <Group orientation="horizontal">
          <Group.Item>
            <Button
              size="$5"
              onPress={() => handleAddEntry(200)}
              icon={AlarmClock}
            >
              200ml
            </Button>
          </Group.Item>
          <Group.Item>
            <Button
              size="$5"
              onPress={() => handleAddEntry(250)}
              icon={AlarmClock}
            >
              250ml
            </Button>
          </Group.Item>
          <Group.Item>
            <Button
              size="$5"
              onPress={() => handleAddEntry(500)}
              icon={AlarmClock}
            >
              500ml
            </Button>
          </Group.Item>
        </Group>
        <YStack space="$2">
          <Input
            placeholder="Enter water in mL"
            keyboardType="numeric"
            value={newAmount}
            onChangeText={setNewAmount}
          />
          <Button onPress={() => handleAddEntry(Number(newAmount))}>
            Add Entry
          </Button>
        </YStack>

        <Separator marginVertical={15} />

        <Text fontSize="$6" fontWeight="bold">
          Water Entries for {date}
        </Text>

        {/* Show entries */}
        {waterEntries.length === 0 ? (
          <Text>No water entries yet.</Text>
        ) : (
          waterEntries.map((item) => (
            <Card key={item._id} padded bordered elevate>
              <Text fontWeight="bold" fontSize="$6">
                {item.water_intake} mL
              </Text>
              <Text>Date: {item.date}</Text>
            </Card>
          ))
        )}
      </YStack>
    </ScrollView>
  );
}
