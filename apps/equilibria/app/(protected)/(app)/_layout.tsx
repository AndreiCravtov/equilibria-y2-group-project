import { Link, Tabs } from "expo-router";
import { Button, useTheme, View } from "tamagui";
import {
  Atom,
  AudioWaveform,
  AlarmClock,
  Droplet,
  House,
  Settings,
  ChartColumn,
  BarChart,
} from "@tamagui/lucide-icons";
import StatusBarView from "@/components/StatusBarView";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { scheduleWaterReminders } from "@/hooks/useNotifications";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingView } from "@/components/Loading";
import { useProfileStore } from "@/hooks/useProfile";

export const unstable_settings = {
  initialRouteName: "(app)", // anchor
};

export default function TabsLayout() {
  const theme = useTheme();

  // Start water reminders
  useEffect(() => {
    scheduleWaterReminders();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent12.val,
        tabBarStyle: {
          backgroundColor: theme.indigo12.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.indigo12.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.white1.val,
      }}
    >
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => <BarChart color={color as any} />,
        }}
      />

      {/* Home page: it has no header, and resets the date-picker state on blur */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House color={color as any} />,
          header: () => (
            <StatusBarView bg="$background">
              <DatePicker />
            </StatusBarView>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings color={color as any} />,
        }}
      />
    </Tabs>
  );
}
