import { Redirect, Stack } from "expo-router";
import { useTheme } from "tamagui";
import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useConvexAuth,
} from "convex/react";
import { LoadingView } from "@/components/Loading";

export const unstable_settings = {
  initialRouteName: "(tabs)", // anchor
};

export default function ProtectedLayout() {
  const theme = useTheme();

  // Load authentication state
  const authState = useConvexAuth();
  if (authState.isLoading) return <LoadingView />;

  // If not authenticated, go to login screen
  if (!authState.isAuthenticated) return <Redirect href={"/login"} />;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
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
    </Stack>
  );
}
