import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Text, View } from "tamagui";
import { api } from "@/convex/_generated/api";

export default function TabTwoScreen() {
  const user = useQuery(api.users.getCurrentUser);

  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <Unauthenticated>
        <Text fontSize={20} color="$blue10">
          Not logged in
        </Text>
      </Unauthenticated>
      <Authenticated>
        <Text fontSize={20} color="$blue10">
          Email: {user?.email ?? "Missing email!!!"}
        </Text>
      </Authenticated>
    </View>
  );
}
