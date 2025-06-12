import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function scheduleWaterReminders() {
  if (!Device.isDevice) {
    console.log('Must use physical device');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permission not granted');
    return;
  }

  // Cancel existing to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule every 4 hours (in seconds)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Stay Hydrated!",
      body: "Log your water intake now.",
      sound: "default",
    },
    trigger: {
      seconds: 4 * 60 * 60, // 4 hours
      repeats: true,
    },
  });

  console.log("Water reminder scheduled every 4 hours.");
}
