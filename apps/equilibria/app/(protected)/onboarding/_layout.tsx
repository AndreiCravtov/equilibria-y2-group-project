import { LoadingView } from "@/components/Loading";
import { api } from "@/convex/_generated/api";
import { useQueries, useQuery } from "convex/react";
import { Stack } from "expo-router";
import { use, useEffect } from "react";
import { useTheme } from "tamagui";

export const unstable_settings = {
  initialRouteName: "(app)", // anchor
};

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
