//notificationService.ts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define notification content for each cycle phase
export const PHASE_NOTIFICATIONS = {
  menstruation: [
    { title: 'Menstrual Phase', body: 'You might have cramps today. Try resting and using a heating pad.' },
    { title: 'Self-Care Reminder', body: 'Remember to stay hydrated and take iron-rich foods during your period.' },
    { title: 'Period Tip', body: 'Light exercise like walking can help reduce period cramps.' }
  ],
  follicular: [
    { title: 'Follicular Phase', body: 'Energy levels are rising! Great time for starting new projects.' },
    { title: 'Wellness Tip', body: 'Your body is building up energy. Focus on nutrient-rich foods today.' },
    { title: 'Cycle Insight', body: 'Your estrogen is rising, which can boost your mood and energy.' }
  ],
  ovulation: [
    { title: 'Ovulation Day', body: "You're likely ovulating today. You might notice increased energy and libido." },
    { title: 'Fertility Window', body: "If you're trying to conceive, today is one of your most fertile days." },
    { title: 'Body Awareness', body: 'You might notice changes in cervical fluid. This is normal during ovulation.' }
  ],
  fertile: [
    { title: 'Fertile Window', body: "You're in your fertile window. Conception is more likely during this time." },
    { title: 'Cycle Tip', body: 'You might notice changes in your energy and mood during your fertile window.' },
    { title: 'Fertility Insight', body: 'Your body temperature may rise slightly during your fertile window.' }
  ],
  luteal: [
    { title: 'Luteal Phase', body: 'You might experience mood swings as your hormones change. Practice self-care.' },
    { title: 'PMS Management', body: 'Magnesium-rich foods like dark chocolate can help with PMS symptoms.' },
    { title: 'Wellness Reminder', body: "It's normal to feel more tired this week. Listen to your body's needs." }
  ]
};

// Register for push notifications
export const registerForPushNotifications = async () => {
  // Check if device is a physical device (not a simulator)
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  // If we don't have permission yet, ask for it
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  // If we still don't have permission, exit
  if (finalStatus !== 'granted') {
    return false;
  }
  
  // Get push token
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: "your-expo-project-id", // Replace with your Expo project ID
  });
  
  // Configure notification behavior based on platform
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('cycle-phases', {
      name: 'Cycle Phases',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B8B',
    });
  }
  
  // Store token in AsyncStorage and Firestore
  await AsyncStorage.setItem('pushToken', token.data);
  
  return token.data;
};

// Save user notification preferences to Firestore
export const saveNotificationPreferences = async (
  userId: string, 
  enabled: boolean = true, 
  preferences: { [key: string]: boolean } = {}
) => {
  try {
    const token = await AsyncStorage.getItem('pushToken');
    const db = getFirestore();
    
    await setDoc(doc(db, "user_notifications", userId), {
      pushToken: token,
      notificationsEnabled: enabled,
      updatedAt: new Date(),
      phaseNotifications: {
        menstruation: preferences.menstruation ?? true,
        follicular: preferences.follicular ?? true,
        ovulation: preferences.ovulation ?? true,
        fertile: preferences.fertile ?? true,
        luteal: preferences.luteal ?? true,
      }
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error saving notification preferences:", error);
    return false;
  }
};

// Get random notification message for a phase
const getRandomNotification = (phase: string) => {
  const phaseKey = phase.toLowerCase().includes('menstrual') ? 'menstruation' :
                   phase.toLowerCase().includes('follicular') ? 'follicular' :
                   phase.toLowerCase().includes('ovulation') ? 'ovulation' :
                   phase.toLowerCase().includes('fertile') ? 'fertile' : 'luteal';
                   
  const notifications = PHASE_NOTIFICATIONS[phaseKey as keyof typeof PHASE_NOTIFICATIONS];
  const randomIndex = Math.floor(Math.random() * notifications.length);
  return notifications[randomIndex];
};

// Schedule phase notification
export const schedulePhaseNotification = async (
  userId: string,
  phase: string,
  scheduledTime: Date = new Date(Date.now() + 1000 * 60 * 60) // Default 1 hour from now
) => {
  try {
    // Check if user has notifications enabled for this phase
    const db = getFirestore();
    const userPrefsDoc = await getDoc(doc(db, "user_notifications", userId));
    
    if (!userPrefsDoc.exists()) {
      return null; // No preferences set yet
    }
    
    const userPrefs = userPrefsDoc.data();
    
    if (!userPrefs.notificationsEnabled) {
      return null; // User has disabled notifications
    }
    
    const phaseKey = phase.toLowerCase().includes('menstrual') ? 'menstruation' :
                     phase.toLowerCase().includes('follicular') ? 'follicular' :
                     phase.toLowerCase().includes('ovulation') ? 'ovulation' :
                     phase.toLowerCase().includes('fertile') ? 'fertile' : 'luteal';
    
    if (!userPrefs.phaseNotifications[phaseKey]) {
      return null; // User has disabled notifications for this phase
    }
    
    // All checks passed, schedule notification
    const notification = getRandomNotification(phase);
    
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: notification.title,
            body: notification.body,
            data: { phase, userId }
            //   },
            //   trigger: {
            //     type: SchedulableTriggerInputTypes.DATE
            //   },
        },
        trigger: null
    });
    
    // Optionally store scheduled notification ID
    await AsyncStorage.setItem(`lastNotification_${phaseKey}`, notificationId);
    
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
};

// Schedule phase transition notification
export const schedulePhaseTransitionNotification = async (
  userId: string,
  currentPhase: string,
  nextPhase: string,
  daysUntilTransition: number
) => {
  // Only notify if transition is tomorrow
  if (daysUntilTransition !== 1) return null;
  
  try {
    // Schedule the notification for 9 AM tomorrow
    const scheduledTime = new Date();
    scheduledTime.setDate(scheduledTime.getDate() + 1);
    scheduledTime.setHours(9, 0, 0, 0);
    
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Phase Change Tomorrow',
            body: `Your cycle is changing from ${currentPhase} to ${nextPhase} tomorrow. Here's what to expect...`,
            data: { currentPhase, nextPhase, userId }
            //   },
            //   trigger: {
            //     type: SchedulableTriggerInputTypes.DATE
            //   },
        
        },
        trigger: null
    });
    
    return notificationId;
  } catch (error) {
    console.error("Error scheduling phase transition notification:", error);
    return null;
  }
};

// Cancel all pending notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};