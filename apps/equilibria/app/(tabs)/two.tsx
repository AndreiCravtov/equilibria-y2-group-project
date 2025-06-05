import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { Text, View, ScrollView, YStack, Card,
  Input, FlatList, Button } from "tamagui";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function TabTwoScreen() {
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
  const handleAddEntry = async () => {
    const amount = BigInt(newAmount);
    console.log("inputted amount", amount);
    await addWater({ uid: user._id, date, water_intake: amount });
    setNewAmount("");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <YStack space="$4">

        {/* Input to add water */}
        <YStack space="$2">
          <Input
            placeholder="Enter water in mL"
            keyboardType="numeric"
            value={newAmount}
            onChangeText={setNewAmount}
          />
          <Button onPress={handleAddEntry}>Add Entry</Button>
        </YStack>

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
