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
import { useRef, useState } from "react";
import { DatePicker } from "@/components/DatePicker";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
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
        name="analysis"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color }) => <ChartColumn color={color as any} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Button mr="$4" bg="$green8" color="$green12">
                Hello!
              </Button>
            </Link>
          ),
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
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => <BarChart color={color as any} />,
        }}
      />
    </Tabs>
  );
}
