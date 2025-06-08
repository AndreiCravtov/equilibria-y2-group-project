import { Stack } from "expo-router";
import { useTheme } from "tamagui";

export const unstable_settings = {
  initialRouteName: "(tabs)", // anchor
};

export default function ProtectedLayout() {
  const theme = useTheme();

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
