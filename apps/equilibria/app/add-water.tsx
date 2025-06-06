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
import {AlarmClock, ActivitySquare, AirVent, Edit3} from "@tamagui/lucide-icons";
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

  function createGroupButton({
    icon,
    value,
    bgColor,
  }: {
    icon: any
    value: number
    bgColor: string
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
          <Text color="$blue8Dark" fontWeight="bold" fontSize="$5">{value}ml</Text>
        </Button>
      </Group.Item>
    )
  }

  return (
    <ScrollView padding="$4" bounces={false} bg="#FFFFFF">
      <YStack space="$4">
        <H3 fontWeight="bold" textAlign="center" color="$indigo8Dark">Add records</H3>
        {/* Input to add water */}
        <Group orientation="horizontal" width="100%">
          {[
            { value: 200, bgColor: '$blue12Dark' },
            { value: 250, bgColor: '$indigo2' },
            { value: 500, bgColor: '$blue12Dark' },
          ].map(({ value, bgColor }) =>
            createGroupButton({ icon: AlarmClock, value, bgColor })
          )}
        </Group>
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
          <Button onPress={() => handleAddEntry(Number(newAmount))}
          color="$blue8Dark" bg="$indigo2">
            Add Entry
          </Button>
        </YStack>

        <Separator my={15} bg="$indigo8Dark"/>

        <H3 fontWeight="bold" textAlign="center" color="$indigo8Dark">{date} entries</H3>

        {/* Show entries */}
        {waterEntries.length === 0 ? (
          <Text>No water entries yet.</Text>
        ) : (
          waterEntries.map((item) => (
            <Card key={item._id} padded bordered elevate>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="$6" color="$indigo8Dark">
                  {item.water_intake} mL
                </Text>
                <Button
                  size="$3"
                  chromeless
                  onPress={() => handleEdit(item)}
                >
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