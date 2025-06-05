import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { Text, View, ScrollView, YStack, XStack, Card,
  Input, FlatList, Button, Icon, Group, H3, useTheme, Separator } from "tamagui";
import { AlarmClock, ActivitySquare, AirVent } from "@tamagui/lucide-icons";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function TabTwoScreen() {
  const theme = useTheme();
//   console.log(theme);
  const user = useQuery(api.users.getCurrentUser);

  if (!user) {
    return (
      <View flex={1} items="center" justify="center" bg="$background">
        <Text>Not authenticated!</Text>
      </View>
    );
  }

  const date = "2025-04-06"; // placeholder value

  const waterEntries = useQuery(api.water.getWaterByUserAndDate,
    { uid: user._id, date: date }
  );

  const addWater = useMutation(api.water.addWaterEntry);
  const [newAmount, setNewAmount] = useState("");


  if (!waterEntries) return <Text>Loading water entries...</Text>;

//   if (waterEntries.length === 0) {
//     return (
//       <View flex={1} justifyContent="center" alignItems="center" bg="$background">
//         <Text>No water records for this user and date in the database!</Text>
//       </View>
//     );
//   }

  console.log(`waterEntries: ${waterEntries}`);
  const handleAddEntry = async (amount: number | bigint) => {
    if (!user) return;
    await addWater({ uid: user._id, date, water_intake: BigInt(amount) });
    setNewAmount("");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} bounces={false}>
      <YStack space="$4">
        <H3 fontWeight="bold" textAlign="center" color={theme.color.indigo10}>Add records</H3>
        {/* Input to add water */}
        <Group orientation="horizontal">
          <Group.Item>
            <Button size="$5"onPress={() => handleAddEntry(200)}icon={AlarmClock}>
              200ml
            </Button>
          </Group.Item>
          <Group.Item>
            <Button size="$5"onPress={() => handleAddEntry(250)}icon={AlarmClock}>
              250ml
            </Button>
          </Group.Item>
          <Group.Item>
            <Button size="$5"onPress={() => handleAddEntry(500)}icon={AlarmClock}>
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
          <Button onPress={() => handleAddEntry(Number(newAmount))}>Add Entry</Button>
        </YStack>

        <Separator marginVertical={15} />

        <Text fontSize="$6" fontWeight="bold">Water Entries for {date}</Text>

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
