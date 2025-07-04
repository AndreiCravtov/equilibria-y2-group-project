import { LoadingView } from "@/components/Loading";
import { api } from "@/convex/_generated/api";
import { useProfileStore } from "@/hooks/useProfile";
import { useQueries, useQuery } from "convex/react";
import { Stack } from "expo-router";
import { use, useEffect } from "react";
import { useTheme } from "tamagui";

export const unstable_settings = {
  initialRouteName: "(app)/index", // anchor
};

export default function ProtectedLayout() {
  const theme = useTheme();

  // load user profile
  const userProfile = useQuery(api.userProfiles.tryGetUserProfile);
  if (userProfile === undefined) return <LoadingView />;
  const userOnboarded = userProfile !== "USER_PROFILE_MISSING";

  return (
    <Stack>
      {/* If user profile does not exist, perform onboarding flow */}
      <Stack.Protected guard={!userOnboarded}>
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>

      {/* Otherwise finally allow user to access main app */}
      <Stack.Protected guard={userOnboarded}>
        <Stack.Screen
          name="(app)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="add-water"
          options={{
            title: "Add Water",
            presentation: "modal",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.indigo12.val,
              borderBottomColor: theme.borderColor.val,
            },
            headerStyle: {
              backgroundColor: theme.indigo12.val,
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              color: "#FFFFFF",
            },
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
