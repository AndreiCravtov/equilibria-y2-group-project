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
  Separator, H2,
} from "tamagui";
import {
  GlassWater,
  ActivitySquare,
  AirVent,
  Edit3,
} from "@tamagui/lucide-icons";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Result } from "@/util/result";
import { extractDate } from "@/components/date-selector";
import { date_to_string } from "@/components/date-selector";
import { useDatePicker } from "@/components/DatePicker";
import { MS_IN_SEC, timestampToDate } from "@/util/date";
import {EquilibriaH2} from "@/app/custom-components";

export default function AddWaterScreen() {
  const theme = useTheme();
  const { selectedDayTimestamp } = useDatePicker();
  const selectedDate = timestampToDate(selectedDayTimestamp);

  const waterEntries = useQuery(api.water.getWaterByDate, {
    dateUnixTimestamp: BigInt(selectedDayTimestamp),
  });

  const addWater = useMutation(api.water.addWaterEntry);
  const [newAmount, setNewAmount] = useState("");

  if (!waterEntries) return <Text>Loading water entries...</Text>;

  console.log(`waterEntries: ${waterEntries}`);
  const handleAddEntry = async (amount: number | bigint) => {
    await addWater({
      dateUnixTimestamp: BigInt(selectedDayTimestamp),
      waterIntake: BigInt(amount),
    });
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
        <EquilibriaH2>Add entries</EquilibriaH2>
        {/* Input to add water */}
        <Group orientation="horizontal" width="100%">
          {[
            { value: 200, bgColor: "$blue12Dark" },
            { value: 250, bgColor: "$indigo2" },
            { value: 500, bgColor: "$blue12Dark" },
          ].map(({ value, bgColor }) =>
            createGroupButton({ icon: GlassWater, value, bgColor })
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
          <Button
            onPress={() => handleAddEntry(Number(newAmount))}
            color="$blue8Dark"
            bg="$indigo4"
            fontWeight={"bold"}
          >
            Add Entry
          </Button>
        </YStack>

        <Separator my={15} bg="$indigo8Dark" />

        <EquilibriaH2>
          {date_to_string(selectedDate)} entries
        </EquilibriaH2>

        {/* Show entries */}
        {waterEntries.length === 0 ? (
          <Text>No water entries yet.</Text>
        ) : (
          waterEntries.map((item) => (
            <Card key={item._id} p={"$3"} mb={"$3"} bg={"$indigo4"} radiused>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="$6" color="$indigo11">
                  {item.waterIntake} mL
                </Text>
                <Button size="$3" chromeless onPress={() => handleEdit(item)}>
                  <Edit3 size={24} color="$indigo11" />
                </Button>
              </XStack>
            </Card>
          ))
        )}
      </YStack>
    </ScrollView>
  );
}
