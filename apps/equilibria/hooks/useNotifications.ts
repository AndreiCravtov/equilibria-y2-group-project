import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { A } from "@mobily/ts-belt";
import { useState } from "react";

// const NOTIF_BANK: { title: string; body: string }[] = [
//   { title: "Time to take a sip!", body: "TODO" },
//   { title: "Stay healthy, stay hydrated!", body: "TODO" },
//   { title: "Fancy a glass of water?", body: "TODO" },
//   {
//     title: "Don't give up - you've almost reached your daily target!",
//     body: "TODO",
//   },
//   { title: "Feeling parched? Take a drink!", body: "TODO" },
//   { title: "Fancy a glass of water?", body: "TODO" },
//   { title: "Give it a shot", body: "TODO" },
// ];

const NOTIF_BANK: { title: string; body: string }[] = [
  {
    title: "Time to take a sip!",
    body: "Don't give up - you've almost reached your daily target!",
  },
  {
    title: "Feeling parched? Take a drink!",
    body: "Stay healthy, stay hydrated!",
  },
  { title: "Fancy a glass of water?", body: "Give it a shot" },
];

const randomElement = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export async function scheduleWaterReminders() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Permission not granted");
    return;
  }

  // Cancel existing to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule every 4 hours (in seconds)
  await Notifications.scheduleNotificationAsync({
    content: {
      sound: "default",
      ...randomElement(NOTIF_BANK),
    },

    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      // seconds: 2 * 60 * 60,
      seconds: 2,
      repeats: true,
    },
  });

  console.log("Water reminder scheduled every 2 hours.");
}
