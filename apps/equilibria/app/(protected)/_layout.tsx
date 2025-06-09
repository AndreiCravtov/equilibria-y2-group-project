import { LoadingView } from "@/components/Loading";
import { api } from "@/convex/_generated/api";
import { useQueries, useQuery } from "convex/react";
import { Stack } from "expo-router";
import { use, useEffect } from "react";
import { useTheme } from "tamagui";

export const unstable_settings = {
  initialRouteName: "(app)", // anchor
};

export default function ProtectedLayout() {
  const theme = useTheme();

  // load user profile
  const userProfile = useQuery(api.userProfiles.tryGetUserProfile);
  if (userProfile === undefined) return <LoadingView />;
  const userOnboarded = userProfile !== "USER_PROFILE_MISSING";

  // TODO: save it to some kind of global state?? maybe even with some useEffect/zustand thing??
  // if (userProfile !== "USER_PROFILE_MISSING") {
  //   zustand-set-user-profile-func()
  // }

  return (
    <Stack>
      {/* If user profile does not exist, perform onboarding flow */}
      <Stack.Protected guard={!userOnboarded}>
        <Stack.Screen
          name="onboard"
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
              backgroundColor: theme.background.val,
            },
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            title: "Tamagui + Expo",
            presentation: "modal",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
