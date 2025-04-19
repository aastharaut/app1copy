// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { auth, db } from '../../../FirebaseConfig';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Notifications from 'expo-notifications';
// import { Ionicons } from '@expo/vector-icons';
// import MultiSelect from 'react-native-multiple-select';

// // Configure notifications
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// const MedicationReminderScreen = () => {
//   // State variables
//   const [medicationName, setMedicationName] = useState('');
//   const [dosage, setDosage] = useState('');
//   const [time, setTime] = useState(new Date());
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [selectedDays, setSelectedDays] = useState([]);
//   const [medications, setMedications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Days of the week for selection
//   const days = [
//     { id: '1', name: 'Monday' },
//     { id: '2', name: 'Tuesday' },
//     { id: '3', name: 'Wednesday' },
//     { id: '4', name: 'Thursday' },
//     { id: '5', name: 'Friday' },
//     { id: '6', name: 'Saturday' },
//     { id: '7', name: 'Sunday' },
//   ];

//   // Request permissions for notifications
//   useEffect(() => {
//     registerForPushNotificationsAsync();
    
//     // Fetch existing medications
//     const userId = firebase.auth().currentUser.uid;
//     const unsubscribe = firebase
//       .firestore()
//       .collection('users')
//       .doc(userId)
//       .collection('medications')
//       .onSnapshot(querySnapshot => {
//         const medicationList = [];
//         querySnapshot.forEach(doc => {
//           const medication = doc.data();
//           medicationList.push({ id: doc.id, ...medication });
//         });
//         setMedications(medicationList);
//         setLoading(false);
//       });

//     return () => unsubscribe();
//   }, []);

//   // Function to request notification permissions
//   async function registerForPushNotificationsAsync() {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
    
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
    
//     if (finalStatus !== 'granted') {
//       Alert.alert('Permission Required', 'You need to enable notifications to receive medication reminders.');
//       return false;
//     }
//     return true;
//   }

//   // Function to schedule notifications
//   async function scheduleNotifications(medicationId, medicationData) {
//     const { medicationName, dosage, time, days } = medicationData;
//     const hasPermission = await registerForPushNotificationsAsync();
    
//     if (!hasPermission) return;

//     // Create notification triggers for each selected day
//     const notificationIds = [];
    
//     for (const dayId of days) {
//       const dayNumber = parseInt(dayId);
//       const weekday = dayNumber % 7; // 0 = Sunday, 1 = Monday, etc.
      
//       const notificationTime = new Date(time);
      
//       // Schedule weekly repeating notification
//       const trigger = {
//         hour: notificationTime.getHours(),
//         minute: notificationTime.getMinutes(),
//         weekday,
//         repeats: true
//       };

//       const notificationId = await Notifications.scheduleNotificationAsync({
//         content: {
//           title: `Time to take ${medicationName}`,
//           body: `Remember to take ${dosage} of ${medicationName}`,
//           sound: true,
//           data: { medicationId },
//         },
//         trigger,
//       });

//       notificationIds.push(notificationId);
//     }

//     // Save notification IDs to Firestore
//     const userId = firebase.auth().currentUser.uid;
//     firebase
//       .firestore()
//       .collection('users')
//       .doc(userId)
//       .collection('medications')
//       .doc(medicationId)
//       .update({
//         notificationIds,
//       });
//   }

//   // Handle time picker change
//   const onTimeChange = (event, selectedTime) => {
//     const currentTime = selectedTime || time;
//     setShowTimePicker(Platform.OS === 'ios');
//     setTime(currentTime);
//   };

//   // Handle form submission
//   const addMedicationReminder = async () => {
//     if (!medicationName.trim()) {
//       Alert.alert('Error', 'Medication name is required');
//       return;
//     }

//     if (!dosage.trim()) {
//       Alert.alert('Error', 'Dosage is required');
//       return;
//     }

//     if (selectedDays.length === 0) {
//       Alert.alert('Error', 'Please select at least one day');
//       return;
//     }

//     try {
//       setLoading(true);
//       const userId = firebase.auth().currentUser.uid;
      
//       // Create medication document in Firestore
//       const medicationRef = firebase
//         .firestore()
//         .collection('users')
//         .doc(userId)
//         .collection('medications')
//         .doc();

//       const medicationData = {
//         medicationName,
//         dosage,
//         time: time.toISOString(),
//         days: selectedDays,
//         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       };

//       await medicationRef.set(medicationData);
      
//       // Schedule notifications
//       await scheduleNotifications(medicationRef.id, medicationData);
      
//       // Reset form
//       setMedicationName('');
//       setDosage('');
//       setTime(new Date());
//       setSelectedDays([]);
      
//       Alert.alert('Success', 'Medication reminder added successfully');
//     } catch (error) {
//       console.error('Error adding medication reminder:', error);
//       Alert.alert('Error', 'Failed to add medication reminder');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete medication reminder
//   const deleteMedication = async (medication) => {
//     try {
//       const userId = firebase.auth().currentUser.uid;
      
//       // Cancel scheduled notifications
//       if (medication.notificationIds) {
//         for (const notificationId of medication.notificationIds) {
//           await Notifications.cancelScheduledNotificationAsync(notificationId);
//         }
//       }
      
//       // Delete from Firestore
//       await firebase
//         .firestore()
//         .collection('users')
//         .doc(userId)
//         .collection('medications')
//         .doc(medication.id)
//         .delete();
        
//       Alert.alert('Success', 'Medication reminder deleted');
//     } catch (error) {
//       console.error('Error deleting medication:', error);
//       Alert.alert('Error', 'Failed to delete medication reminder');
//     }
//   };

//   // Format time for display
//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Format days for display
//   const formatDays = (dayIds) => {
//     return dayIds.map(id => days.find(day => day.id === id).name.substring(0, 3)).join(', ');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Medication Reminders</Text>
      
//       {/* Add Medication Form */}
//       <View style={styles.formContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Medication Name*"
//           value={medicationName}
//           onChangeText={setMedicationName}
//         />
        
//         <TextInput
//           style={styles.input}
//           placeholder="Dosage (e.g., 1 pill)*"
//           value={dosage}
//           onChangeText={setDosage}
//         />
        
//         {/* Time Picker */}
//         <TouchableOpacity 
//           style={styles.timeSelector} 
//           onPress={() => setShowTimePicker(true)}
//         >
//           <Text style={styles.timeSelectorText}>
//             Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//           <Ionicons name="time" size={24} color="#2c3e50" />
//         </TouchableOpacity>
        
//         {showTimePicker && (
//           <DateTimePicker
//             value={time}
//             mode="time"
//             display="default"
//             onChange={onTimeChange}
//           />
//         )}
        
//         {/* Days Selector */}
//         <View style={styles.daysContainer}>
//           <Text style={styles.sectionLabel}>Select Days:</Text>
//           <MultiSelect
//             items={days}
//             uniqueKey="id"
//             onSelectedItemsChange={setSelectedDays}
//             selectedItems={selectedDays}
//             selectText="Select Days"
//             searchInputPlaceholderText="Search Days..."
//             tagRemoveIconColor="#CCC"
//             tagBorderColor="#CCC"
//             tagTextColor="#333"
//             selectedItemTextColor="#2c3e50"
//             selectedItemIconColor="#2c3e50"
//             itemTextColor="#000"
//             displayKey="name"
//             submitButtonColor="#2c3e50"
//             submitButtonText="Done"
//             styleMainWrapper={styles.multiSelect}
//           />
//         </View>
        
//         {/* Submit Button */}
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={addMedicationReminder}
//           disabled={loading}
//         >
//           <Text style={styles.addButtonText}>Add Reminder</Text>
//           {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
//         </TouchableOpacity>
//       </View>
      
//       {/* Medications List */}
//       <Text style={styles.sectionTitle}>Your Medications</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#2c3e50" />
//       ) : medications.length === 0 ? (
//         <Text style={styles.emptyText}>No medications added yet.</Text>
//       ) : (
//         <ScrollView style={styles.listContainer}>
//           {medications.map((medication) => (
//             <View key={medication.id} style={styles.medicationItem}>
//               <View style={styles.medicationInfo}>
//                 <Text style={styles.medicationName}>{medication.medicationName}</Text>
//                 <Text style={styles.medicationDetails}>
//                   {medication.dosage} • {formatTime(medication.time)}
//                 </Text>
//                 <Text style={styles.medicationDays}>
//                   {formatDays(medication.days)}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => deleteMedication(medication)}
//               >
//                 <Ionicons name="trash-outline" size={24} color="#e74c3c" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#2c3e50',
//   },
//   formContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 12,
//     fontSize: 16,
//   },
//   timeSelector: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 12,
//   },
//   timeSelectorText: {
//     fontSize: 16,
//   },
//   daysContainer: {
//     marginBottom: 16,
//   },
//   sectionLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#2c3e50',
//   },
//   multiSelect: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//   },
//   addButton: {
//     backgroundColor: '#2c3e50',
//     borderRadius: 8,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   loader: {
//     marginLeft: 10,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#2c3e50',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#7f8c8d',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   listContainer: {
//     flex: 1,
//   },
//   medicationItem: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   medicationInfo: {
//     flex: 1,
//   },
//   medicationName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   medicationDetails: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginTop: 4,
//   },
//   medicationDays: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginTop: 2,
//   },
//   deleteButton: {
//     padding: 8,
//   },
// });

// export default MedicationReminderScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { auth, db, } from '../../../FirebaseConfig';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Notifications from 'expo-notifications';
// import { Ionicons } from '@expo/vector-icons';
// import MultiSelect from 'react-native-multiple-select';

// // Type definitions
// interface DayItem {
//   id: string;
//   name: string;
// }

// interface Medication {
//   id: string;
//   medicationName: string;
//   dosage: string;
//   time: string;
//   days: string[];
//   createdAt: any;
//   notificationIds?: string[];
// }

// interface MedicationData {
//   medicationName: string;
//   dosage: string;
//   time: string;
//   days: string[];
//   createdAt: any;
// }

// // Configure notifications
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// const MedicationReminderScreen: React.FC = () => {
//   // State variables
//   const [medicationName, setMedicationName] = useState<string>('');
//   const [dosage, setDosage] = useState<string>('');
//   const [time, setTime] = useState<Date>(new Date());
//   const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
//   const [selectedDays, setSelectedDays] = useState<string[]>([]);
//   const [medications, setMedications] = useState<Medication[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Days of the week for selection
//   const days: DayItem[] = [
//     { id: '1', name: 'Monday' },
//     { id: '2', name: 'Tuesday' },
//     { id: '3', name: 'Wednesday' },
//     { id: '4', name: 'Thursday' },
//     { id: '5', name: 'Friday' },
//     { id: '6', name: 'Saturday' },
//     { id: '7', name: 'Sunday' },
//   ];

//   // Request permissions for notifications
//   useEffect(() => {
//     registerForPushNotificationsAsync();
    
//     // Fetch existing medications
//     const userId = auth.currentUser?.uid;
//     if (!userId) {
//       setLoading(false);
//       return;
//     }
    
//     const unsubscribe = db
//       .collection('users')
//       .doc(userId)
//       .collection('medications')
//       .onSnapshot(querySnapshot => {
//         const medicationList: Medication[] = [];
//         querySnapshot.forEach(doc => {
//           const medication = doc.data() as Omit<Medication, 'id'>;
//           medicationList.push({ id: doc.id, ...medication });
//         });
//         setMedications(medicationList);
//         setLoading(false);
//       });

//     return () => unsubscribe();
//   }, []);

//   // Function to request notification permissions
//   async function registerForPushNotificationsAsync(): Promise<boolean> {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
    
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
    
//     if (finalStatus !== 'granted') {
//       Alert.alert('Permission Required', 'You need to enable notifications to receive medication reminders.');
//       return false;
//     }
//     return true;
//   }

//   // Function to schedule notifications
//   async function scheduleNotifications(medicationId: string, medicationData: MedicationData): Promise<void> {
//     const { medicationName, dosage, time, days } = medicationData;
//     const hasPermission = await registerForPushNotificationsAsync();
    
//     if (!hasPermission) return;

//     // Create notification triggers for each selected day
//     const notificationIds: string[] = [];
    
//     for (const dayId of days) {
//       const dayNumber = parseInt(dayId);
//       const weekday = dayNumber % 7; // 0 = Sunday, 1 = Monday, etc.
      
//       const notificationTime = new Date(time);
      
//       // Schedule weekly repeating notification
//       const trigger: Notifications.NotificationTriggerInput = {
//         hour: notificationTime.getHours(),
//         minute: notificationTime.getMinutes(),
//         weekday,
//         repeats: true
//       };

//       const notificationId = await Notifications.scheduleNotificationAsync({
//         content: {
//           title: `Time to take ${medicationName}`,
//           body: `Remember to take ${dosage} of ${medicationName}`,
//           sound: true,
//           data: { medicationId },
//         },
//         trigger,
//       });

//       notificationIds.push(notificationId);
//     }

//     // Save notification IDs to Firestore
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;
    
//     db
//       .collection('users')
//       .doc(userId)
//       .collection('medications')
//       .doc(medicationId)
//       .update({
//         notificationIds,
//       });
//   }

//   // Handle time picker change
//   const onTimeChange = (event: any, selectedTime?: Date) => {
//     const currentTime = selectedTime || time;
//     setShowTimePicker(Platform.OS === 'ios');
//     setTime(currentTime);
//   };

//   // Handle form submission
//   const addMedicationReminder = async (): Promise<void> => {
//     if (!medicationName.trim()) {
//       Alert.alert('Error', 'Medication name is required');
//       return;
//     }

//     if (!dosage.trim()) {
//       Alert.alert('Error', 'Dosage is required');
//       return;
//     }

//     if (selectedDays.length === 0) {
//       Alert.alert('Error', 'Please select at least one day');
//       return;
//     }

//     try {
//       setLoading(true);
//       const userId = auth.currentUser?.uid;
//       if (!userId) {
//         Alert.alert('Error', 'User not authenticated');
//         setLoading(false);
//         return;
//       }
      
//       // Create medication document in Firestore
//       const medicationRef = db
//         .collection('users')
//         .doc(userId)
//         .collection('medications')
//         .doc();

//       const medicationData: MedicationData = {
//         medicationName,
//         dosage,
//         time: time.toISOString(),
//         days: selectedDays,
//         createdAt: db.FieldValue.serverTimestamp(),
//       };

//       await medicationRef.set(medicationData);
      
//       // Schedule notifications
//       await scheduleNotifications(medicationRef.id, medicationData);
      
//       // Reset form
//       setMedicationName('');
//       setDosage('');
//       setTime(new Date());
//       setSelectedDays([]);
      
//       Alert.alert('Success', 'Medication reminder added successfully');
//     } catch (error) {
//       console.error('Error adding medication reminder:', error);
//       Alert.alert('Error', 'Failed to add medication reminder');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete medication reminder
//   const deleteMedication = async (medication: Medication): Promise<void> => {
//     try {
//       const userId = auth.currentUser?.uid;
//       if (!userId) return;
      
//       // Cancel scheduled notifications
//       if (medication.notificationIds) {
//         for (const notificationId of medication.notificationIds) {
//           await Notifications.cancelScheduledNotificationAsync(notificationId);
//         }
//       }
      
//       // Delete from Firestore
//       await db
//         .collection('users')
//         .doc(userId)
//         .collection('medications')
//         .doc(medication.id)
//         .delete();
        
//       Alert.alert('Success', 'Medication reminder deleted');
//     } catch (error) {
//       console.error('Error deleting medication:', error);
//       Alert.alert('Error', 'Failed to delete medication reminder');
//     }
//   };

//   // Format time for display
//   const formatTime = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Format days for display
//   const formatDays = (dayIds: string[]): string => {
//     return dayIds.map(id => {
//       const day = days.find(day => day.id === id);
//       return day ? day.name.substring(0, 3) : '';
//     }).join(', ');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Medication Reminders</Text>
      
//       {/* Add Medication Form */}
//       <View style={styles.formContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Medication Name*"
//           value={medicationName}
//           onChangeText={setMedicationName}
//         />
        
//         <TextInput
//           style={styles.input}
//           placeholder="Dosage (e.g., 1 pill)*"
//           value={dosage}
//           onChangeText={setDosage}
//         />
        
//         {/* Time Picker */}
//         <TouchableOpacity 
//           style={styles.timeSelector} 
//           onPress={() => setShowTimePicker(true)}
//         >
//           <Text style={styles.timeSelectorText}>
//             Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//           <Ionicons name="time" size={24} color="#2c3e50" />
//         </TouchableOpacity>
        
//         {showTimePicker && (
//           <DateTimePicker
//             value={time}
//             mode="time"
//             display="default"
//             onChange={onTimeChange}
//           />
//         )}
        
//         {/* Days Selector */}
//         <View style={styles.daysContainer}>
//           <Text style={styles.sectionLabel}>Select Days:</Text>
//           <MultiSelect
//             items={days}
//             uniqueKey="id"
//             onSelectedItemsChange={setSelectedDays}
//             selectedItems={selectedDays}
//             selectText="Select Days"
//             searchInputPlaceholderText="Search Days..."
//             tagRemoveIconColor="#CCC"
//             tagBorderColor="#CCC"
//             tagTextColor="#333"
//             selectedItemTextColor="#2c3e50"
//             selectedItemIconColor="#2c3e50"
//             itemTextColor="#000"
//             displayKey="name"
//             submitButtonColor="#2c3e50"
//             submitButtonText="Done"
//             styleMainWrapper={styles.multiSelect}
//           />
//         </View>
        
//         {/* Submit Button */}
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={addMedicationReminder}
//           disabled={loading}
//         >
//           <Text style={styles.addButtonText}>Add Reminder</Text>
//           {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
//         </TouchableOpacity>
//       </View>
      
//       {/* Medications List */}
//       <Text style={styles.sectionTitle}>Your Medications</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#2c3e50" />
//       ) : medications.length === 0 ? (
//         <Text style={styles.emptyText}>No medications added yet.</Text>
//       ) : (
//         <ScrollView style={styles.listContainer}>
//           {medications.map((medication) => (
//             <View key={medication.id} style={styles.medicationItem}>
//               <View style={styles.medicationInfo}>
//                 <Text style={styles.medicationName}>{medication.medicationName}</Text>
//                 <Text style={styles.medicationDetails}>
//                   {medication.dosage} • {formatTime(medication.time)}
//                 </Text>
//                 <Text style={styles.medicationDays}>
//                   {formatDays(medication.days)}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => deleteMedication(medication)}
//               >
//                 <Ionicons name="trash-outline" size={24} color="#e74c3c" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// };

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { auth, db } from '../../../FirebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, serverTimestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { QuerySnapshot } from 'firebase/firestore';

// Type definitions
interface DayItem {
  id: string;
  name: string;
}

interface Medication {
  id: string;
  medicationName: string;
  dosage: string;
  time: string;
  days: string[];
  createdAt: any;
  notificationIds?: string[];
}

interface MedicationData {
  medicationName: string;
  dosage: string;
  time: string;
  days: string[];
  createdAt: any;
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MedicationReminderScreen: React.FC = () => {
  // State variables
  const [medicationName, setMedicationName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('');
  const [time, setTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Days of the week for selection
  const days: DayItem[] = [
    { id: '1', name: 'Monday' },
    { id: '2', name: 'Tuesday' },
    { id: '3', name: 'Wednesday' },
    { id: '4', name: 'Thursday' },
    { id: '5', name: 'Friday' },
    { id: '6', name: 'Saturday' },
    { id: '7', name: 'Sunday' },
  ];

  // Request permissions for notifications
  useEffect(() => {
    registerForPushNotificationsAsync();
    
    // Fetch existing medications
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }
    
    //  syntax for collection and onSnapshot
    const medicationsRef = collection(db, 'users', userId, 'medications');
    const unsubscribe = onSnapshot(medicationsRef, (querySnapshot: QuerySnapshot) => {
      const medicationList: Medication[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const medication = doc.data() as Omit<Medication, 'id'>;
        medicationList.push({ id: doc.id, ...medication });
      });
      setMedications(medicationList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to request notification permissions
  async function registerForPushNotificationsAsync(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'You need to enable notifications to receive medication reminders.');
      return false;
    }
    return true;
  }

  // Function to schedule notifications
  async function scheduleNotifications(medicationId: string, medicationData: MedicationData): Promise<void> {
    const { medicationName, dosage, time, days } = medicationData;
    const hasPermission = await registerForPushNotificationsAsync();
    
    if (!hasPermission) return;

    // Create notification triggers for each selected day
    const notificationIds: string[] = [];
    
    for (const dayId of days) {
      const dayNumber = parseInt(dayId);
      const weekday = dayNumber % 7; // 0 = Sunday, 1 = Monday
      
      const notificationTime = new Date(time);
      
      // For weekly repeating notifications
      const trigger = {
        hour: notificationTime.getHours(),
        minute: notificationTime.getMinutes(),
        weekday,
        repeats: true
      } as Notifications.NotificationTriggerInput;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time to take ${medicationName}`,
          body: `Remember to take ${dosage} of ${medicationName}`,
          sound: true,
          data: { medicationId },
        },
        trigger,
      });

      notificationIds.push(notificationId);
    }

    // Save notification IDs to Firestore
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    
    // syntax for updating document
    const medicationRef = doc(db, 'users', userId, 'medications', medicationId);
    await updateDoc(medicationRef, {
      notificationIds,
    });
  }

  // Handle time picker change
  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  // Handle form submission
  const addMedicationReminder = async (): Promise<void> => {
    if (!medicationName.trim()) {
      Alert.alert('Error', 'Medication name is required');
      return;
    }

    if (!dosage.trim()) {
      Alert.alert('Error', 'Dosage is required');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        setLoading(false);
        return;
      }
      
      // syntax for creating document
      const medicationsCollection = collection(db, 'users', userId, 'medications');
      const newMedicationRef = doc(medicationsCollection);

      const medicationData: MedicationData = {
        medicationName,
        dosage,
        time: time.toISOString(),
        days: selectedDays,
        createdAt: serverTimestamp(),
      };

      await setDoc(newMedicationRef, medicationData);
      
      // Schedule notifications
      await scheduleNotifications(newMedicationRef.id, medicationData);
      
      // Reset form
      setMedicationName('');
      setDosage('');
      setTime(new Date());
      setSelectedDays([]);
      
      Alert.alert('Success', 'Medication reminder added successfully');
    } catch (error: unknown) {
      console.error('Error adding medication reminder:', error);
      Alert.alert('Error', 'Failed to add medication reminder');
    } finally {
      setLoading(false);
    }
  };

  // Delete medication reminder
  const deleteMedication = async (medication: Medication): Promise<void> => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      
      // Cancel scheduled notifications
      if (medication.notificationIds) {
        for (const notificationId of medication.notificationIds) {
          await Notifications.cancelScheduledNotificationAsync(notificationId);
        }
      }
      
      // syntax for deleting document
      const medicationRef = doc(db, 'users', userId, 'medications', medication.id);
      await deleteDoc(medicationRef);
        
      Alert.alert('Success', 'Medication reminder deleted');
    } catch (error: unknown) {
      console.error('Error deleting medication:', error);
      Alert.alert('Error', 'Failed to delete medication reminder');
    }
  };

  // Format time for display
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format days for display
  const formatDays = (dayIds: string[]): string => {
    return dayIds.map(id => {
      const day = days.find(day => day.id === id);
      return day ? day.name.substring(0, 3) : '';
    }).join(', ');
  };

  return (
    <View style={styles.container}>
      
      
      {/* Add Medication Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Medication Name*"
          value={medicationName}
          onChangeText={setMedicationName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Dosage (e.g., 1 pill)*"
          value={dosage}
          onChangeText={setDosage}
        />
        
        {/* Time Picker */}
        <TouchableOpacity 
          style={styles.timeSelector} 
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeSelectorText}>
            Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Ionicons name="time" size={24} color="#2c3e50" />
        </TouchableOpacity>
        
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
        
        {/* Days Selector */}
        
        <View style={styles.daysWrapper}>
  {days.map((day) => {
    const isSelected = selectedDays.includes(day.id);
    return (
      <TouchableOpacity
        key={day.id}
        style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
        onPress={() => {
          if (isSelected) {
            setSelectedDays(selectedDays.filter((id) => id !== day.id));
          } else {
            setSelectedDays([...selectedDays, day.id]);
          }
        }}
      >
        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
          {day.name.slice(0, 3)}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={addMedicationReminder}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>Add Reminder</Text>
          {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
        </TouchableOpacity>
      </View>
      
      {/* Medications List */}
      <Text style={styles.sectionTitle}>Your Medications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2c3e50" />
      ) : medications.length === 0 ? (
        <Text style={styles.emptyText}>No medications added yet.</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {medications.map((medication) => (
            <View key={medication.id} style={styles.medicationItem}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{medication.medicationName}</Text>
                <Text style={styles.medicationDetails}>
                  {medication.dosage} • {formatTime(medication.time)}
                </Text>
                <Text style={styles.medicationDays}>
                  {formatDays(medication.days)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteMedication(medication)}
              >
                <Ionicons name="trash-outline" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#F3F0FF', // Soft background
    padding: 16,
    borderRadius: 22, // <-- this gives the rounded background
  },

  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D6CCF5', // Light indigo border
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#4B3F72',
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#D6CCF5',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#EFEAFC',
  },
  timeSelectorText: {
    fontSize: 16,
    color: '#4B3F72',
  },
  daysContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#D6CCF5',
    borderRadius: 8,
    backgroundColor: '#EFEAFC',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  dayButtonSelected: {
    backgroundColor: '#4B3F72',
    borderColor: '#4B3F72',
  },
  dayText: {
    color: '#4B3F72',
    fontWeight: '500',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  daysWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#4B3F72',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4B3F72',
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    flex: 1,
  },
  medicationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B3F72',
  },
  medicationDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  medicationDays: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
});

export default MedicationReminderScreen;