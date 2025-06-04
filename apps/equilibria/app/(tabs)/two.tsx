import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Text, View, ScrollView, YStack, Card, TextInput, FlatList } from "tamagui";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function TabTwoScreen() {
  const userId = useQuery(api.users.getCurrentUser);

  if (!userId) {
    return (
      <View flex={1} items="center" justify="center" bg="$background">
        <Text>Not authenticated!</Text>
      </View>
    );
  }

  const date = "2025-04-06"; // placeholder value

  // Only call the query when userId is available
  const waterEntries = useQuery(api.water.getWaterByUserAndDate,
    { uid: userId._id, date: date }
  );
  if (!waterEntries) return <Text>Loading water entries...</Text>;

  if (waterEntries.length === 0) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" bg="$background">
        <Text>No water records for this user and date in the database!</Text>
      </View>
    );
  }

  console.log(`waterEntries: ${waterEntries}`);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <YStack space="$4">
        {waterEntries.filter(Boolean).map((item) => (
          <Card key={item._id} padded bordered elevate>
            <Text fontWeight="bold" fontSize="$6">
              { item.water_intake }
            </Text>
            <Text>Calories: { item.date }</Text>
          </Card>
        ) )}
      </YStack>
    </ScrollView>
  );
}
