// notificationService.js
import * as Notifications from "expo-notifications";
import { Platform } from 'react-native';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Setup notification channel for Android
export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      console.log('Notification channel created successfully');
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }
}

// Request notification permissions
export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

// Schedule medication reminder notifications
export async function scheduleMedicationReminder(medication) {
  const { medicationName, dosage, time, days, id } = medication;
  
  // Verify permissions
  const permissionGranted = await requestNotificationPermissions();
  if (!permissionGranted) {
    console.log('Notification permissions not granted');
    return [];
  }
  
  const notificationIds = [];
  const notificationTime = new Date(time);
  notificationTime.setSeconds(0, 0); // Clean time without seconds/millis
  
  for (const dayId of days) {
    const weekday = parseInt(dayId); // Days are 1-7 for Monday-Sunday
    const hour = notificationTime.getHours();
    const minute = notificationTime.getMinutes();

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time to take ${medicationName}`,
          body: `Remember to take ${dosage} of ${medicationName}`,
          sound: true,
          data: { medicationId: id },
        },
        trigger: {
          weekday,
          hour,
          minute,
          repeats: true,
          channelId: 'medication-reminders'
        },
      });

      notificationIds.push(notificationId);
      console.log(`Scheduled notification for ${weekday} at ${hour}:${minute}`);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }
  
  return notificationIds;
}

// Cancel scheduled notifications by IDs
export async function cancelNotifications(notificationIds) {
  if (!notificationIds || !notificationIds.length) return;
  
  for (const id of notificationIds) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (error) {
      console.error(`Failed to cancel notification ${id}:`, error);
    }
  }
}

// Send immediate welcome notification
export async function sendWelcomeNotification(username) {
  const permissionGranted = await requestNotificationPermissions();
  if (!permissionGranted) return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Welcome to MedTracker, ${username}!`,
      body: "Set up your medication reminders for better health management.",
    },
    trigger: null, // null trigger means send immediately
  });
}

// Send streak reminder notification
export async function sendStreakReminder(username) {
  const permissionGranted = await requestNotificationPermissions();
  if (!permissionGranted) return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🔥 Keep your streak, ${username}!`,
      body: "Don't forget to take your medications today to maintain your streak!",
    },
    trigger: { 
      hour: 9,  // 9 AM reminder
      minute: 0,
      repeats: true,
    },
  });
}

// Cancel all notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("❌ All notifications cancelled");
}