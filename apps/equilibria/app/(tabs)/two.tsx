import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Text, View, ScrollView, YStack, Card } from "tamagui";
import { api } from "@/convex/_generated/api";

export default function TabTwoScreen() {
  const productItems = useQuery(api.products.list);

  // Show loading state
  if (!productItems) {
      return (
          <View flex={1} items="center" justify="center" bg="$background">
            <Text>Loading...</Text>
          </View>
        );
  }
  // Show empty state
  if (productItems.length === 0) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" bg="$background">
        <Text>No products in the database!</Text>
      </View>
    );
  }

  productItems.forEach(({ name, calories }, idx) => {
    console.log(`Product ${idx}: name = ${name}, calories = ${calories}`);
  });
  // Show list of products
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <YStack space="$4">
        {productItems.filter(Boolean).map((item) => (
          <Card key={item._id} padded bordered elevate>
            <Text fontWeight="bold" fontSize="$6">
              {item.name ?? "Unnamed Product" }
            </Text>
            <Text>Calories: { item.calories }</Text>
          </Card>
        ) )}
      </YStack>
    </ScrollView>
  );
}
