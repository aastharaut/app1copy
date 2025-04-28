// tasks/backgroundNotificationTask.ts
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PHASE_NOTIFICATIONS } from './notifications';

const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

// Define the task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {
    // Get the current user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.log('No user ID found, skipping background task');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
    
    // Get notification preferences
    const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
    if (notificationsEnabled !== 'true') {
      console.log('Notifications disabled, skipping background task');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
    
    // Get the user's cycle data from Firestore
    const db = getFirestore();
    const cyclesRef = collection(db, "cycles");
    const q = query(cyclesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No cycle data found, skipping background task');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
    
    // Get the cycle data
    const cycleData = querySnapshot.docs[0].data();
    
    // Calculate the current day of the cycle
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastPeriodDate = cycleData.lastPeriodDate1 instanceof Timestamp 
      ? cycleData.lastPeriodDate1.toDate() 
      : new Date(cycleData.lastPeriodDate1);
    lastPeriodDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today.getTime() - lastPeriodDate.getTime());
    let currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Adjust if beyond cycle length
    if (currentDay > cycleData.cycleLength) {
      currentDay = currentDay % cycleData.cycleLength;
      if (currentDay === 0) currentDay = cycleData.cycleLength;
    }
    
    // Determine the current phase
    let currentPhase;
    if (currentDay <= cycleData.periodLength) {
      currentPhase = "menstruation";
    } else if (currentDay <= cycleData.cycleLength - 14) {
      currentPhase = "follicular";
    } else if (currentDay <= cycleData.cycleLength - 10) {
      currentPhase = "ovulation";
    } else {
      currentPhase = "luteal";
    }
    
    // Check if we've already sent a notification today for this phase
    const lastNotificationDate = await AsyncStorage.getItem(`lastNotification_${currentPhase}`);
    if (lastNotificationDate) {
      const lastDate = new Date(lastNotificationDate);
      lastDate.setHours(0, 0, 0, 0);
      
      if (lastDate.getTime() === today.getTime()) {
        console.log('Already sent notification today for this phase');
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }
    }
    
    // Get a random notification for the current phase
    const phaseNotifications = PHASE_NOTIFICATIONS[currentPhase as keyof typeof PHASE_NOTIFICATIONS];
    const randomIndex = Math.floor(Math.random() * phaseNotifications.length);
    const notification = phaseNotifications[randomIndex];
    
    // Schedule a notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: { phase: currentPhase, userId }
      },
      trigger: null, // Send immediately
    });
    
    // Update the last notification date
    await AsyncStorage.setItem(`lastNotification_${currentPhase}`, today.toISOString());
    
    console.log('Background notification sent successfully');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Error in background notification task:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register the background task
export async function registerBackgroundNotificationTask() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
      minimumInterval: 60 * 60, // Once per hour minimum
      stopOnTerminate: false,   // Continue running when app is terminated
      startOnBoot: true,        // Run when device restarts
    });
    console.log('Background notification task registered');
    return true;
  } catch (error) {
    console.error('Error registering background task:', error);
    return false;
  }
}

// Unregister the background task
export async function unregisterBackgroundNotificationTask() {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    console.log('Background notification task unregistered');
    return true;
  } catch (error) {
    console.error('Error unregistering background task:', error);
    return false;
  }
}

// Check if the background task is registered
export async function isBackgroundNotificationTaskRegistered() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    return status === BackgroundFetch.BackgroundFetchStatus.Available;
  } catch (error) {
    console.error('Error checking background task status:', error);
    return false;
  }
}

// Register the background task when the app starts
// Add this to your App.tsx or a startup component
export function initializeBackgroundNotificationTask() {
  AsyncStorage.getItem('notificationsEnabled')
    .then((enabled) => {
      if (enabled === 'true') {
        registerBackgroundNotificationTask();
      }
    })
    .catch((error) => {
      console.error('Error initializing background task:', error);
    });
}