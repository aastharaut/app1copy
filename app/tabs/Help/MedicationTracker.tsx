// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   Platform,
// // //   Alert,
// // //   ActivityIndicator
// // // } from 'react-native';
// // // import { auth, db } from '../../../FirebaseConfig';
// // // import DateTimePicker from '@react-native-community/datetimepicker';
// // // import * as Notifications from 'expo-notifications';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import MultiSelect from 'react-native-multiple-select';

// // // // Configure notifications
// // // Notifications.setNotificationHandler({
// // //   handleNotification: async () => ({
// // //     shouldShowAlert: true,
// // //     shouldPlaySound: true,
// // //     shouldSetBadge: false,
// // //   }),
// // // });

// // // const MedicationReminderScreen = () => {
// // //   // State variables
// // //   const [medicationName, setMedicationName] = useState('');
// // //   const [dosage, setDosage] = useState('');
// // //   const [time, setTime] = useState(new Date());
// // //   const [showTimePicker, setShowTimePicker] = useState(false);
// // //   const [selectedDays, setSelectedDays] = useState([]);
// // //   const [medications, setMedications] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   // Days of the week for selection
// // //   const days = [
// // //     { id: '1', name: 'Monday' },
// // //     { id: '2', name: 'Tuesday' },
// // //     { id: '3', name: 'Wednesday' },
// // //     { id: '4', name: 'Thursday' },
// // //     { id: '5', name: 'Friday' },
// // //     { id: '6', name: 'Saturday' },
// // //     { id: '7', name: 'Sunday' },
// // //   ];

// // //   // Request permissions for notifications
// // //   useEffect(() => {
// // //     registerForPushNotificationsAsync();
    
// // //     // Fetch existing medications
// // //     const userId = firebase.auth().currentUser.uid;
// // //     const unsubscribe = firebase
// // //       .firestore()
// // //       .collection('users')
// // //       .doc(userId)
// // //       .collection('medications')
// // //       .onSnapshot(querySnapshot => {
// // //         const medicationList = [];
// // //         querySnapshot.forEach(doc => {
// // //           const medication = doc.data();
// // //           medicationList.push({ id: doc.id, ...medication });
// // //         });
// // //         setMedications(medicationList);
// // //         setLoading(false);
// // //       });

// // //     return () => unsubscribe();
// // //   }, []);

// // //   // Function to request notification permissions
// // //   async function registerForPushNotificationsAsync() {
// // //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
// // //     let finalStatus = existingStatus;
    
// // //     if (existingStatus !== 'granted') {
// // //       const { status } = await Notifications.requestPermissionsAsync();
// // //       finalStatus = status;
// // //     }
    
// // //     if (finalStatus !== 'granted') {
// // //       Alert.alert('Permission Required', 'You need to enable notifications to receive medication reminders.');
// // //       return false;
// // //     }
// // //     return true;
// // //   }

// // //   // Function to schedule notifications
// // //   async function scheduleNotifications(medicationId, medicationData) {
// // //     const { medicationName, dosage, time, days } = medicationData;
// // //     const hasPermission = await registerForPushNotificationsAsync();
    
// // //     if (!hasPermission) return;

// // //     // Create notification triggers for each selected day
// // //     const notificationIds = [];
    
// // //     for (const dayId of days) {
// // //       const dayNumber = parseInt(dayId);
// // //       const weekday = dayNumber % 7; // 0 = Sunday, 1 = Monday, etc.
      
// // //       const notificationTime = new Date(time);
      
// // //       // Schedule weekly repeating notification
// // //       const trigger = {
// // //         hour: notificationTime.getHours(),
// // //         minute: notificationTime.getMinutes(),
// // //         weekday,
// // //         repeats: true
// // //       };

// // //       const notificationId = await Notifications.scheduleNotificationAsync({
// // //         content: {
// // //           title: `Time to take ${medicationName}`,
// // //           body: `Remember to take ${dosage} of ${medicationName}`,
// // //           sound: true,
// // //           data: { medicationId },
// // //         },
// // //         trigger,
// // //       });

// // //       notificationIds.push(notificationId);
// // //     }

// // //     // Save notification IDs to Firestore
// // //     const userId = firebase.auth().currentUser.uid;
// // //     firebase
// // //       .firestore()
// // //       .collection('users')
// // //       .doc(userId)
// // //       .collection('medications')
// // //       .doc(medicationId)
// // //       .update({
// // //         notificationIds,
// // //       });
// // //   }

// // //   // Handle time picker change
// // //   const onTimeChange = (event, selectedTime) => {
// // //     const currentTime = selectedTime || time;
// // //     setShowTimePicker(Platform.OS === 'ios');
// // //     setTime(currentTime);
// // //   };

// // //   // Handle form submission
// // //   const addMedicationReminder = async () => {
// // //     if (!medicationName.trim()) {
// // //       Alert.alert('Error', 'Medication name is required');
// // //       return;
// // //     }

// // //     if (!dosage.trim()) {
// // //       Alert.alert('Error', 'Dosage is required');
// // //       return;
// // //     }

// // //     if (selectedDays.length === 0) {
// // //       Alert.alert('Error', 'Please select at least one day');
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       const userId = firebase.auth().currentUser.uid;
      
// // //       // Create medication document in Firestore
// // //       const medicationRef = firebase
// // //         .firestore()
// // //         .collection('users')
// // //         .doc(userId)
// // //         .collection('medications')
// // //         .doc();

// // //       const medicationData = {
// // //         medicationName,
// // //         dosage,
// // //         time: time.toISOString(),
// // //         days: selectedDays,
// // //         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
// // //       };

// // //       await medicationRef.set(medicationData);
      
// // //       // Schedule notifications
// // //       await scheduleNotifications(medicationRef.id, medicationData);
      
// // //       // Reset form
// // //       setMedicationName('');
// // //       setDosage('');
// // //       setTime(new Date());
// // //       setSelectedDays([]);
      
// // //       Alert.alert('Success', 'Medication reminder added successfully');
// // //     } catch (error) {
// // //       console.error('Error adding medication reminder:', error);
// // //       Alert.alert('Error', 'Failed to add medication reminder');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Delete medication reminder
// // //   const deleteMedication = async (medication) => {
// // //     try {
// // //       const userId = firebase.auth().currentUser.uid;
      
// // //       // Cancel scheduled notifications
// // //       if (medication.notificationIds) {
// // //         for (const notificationId of medication.notificationIds) {
// // //           await Notifications.cancelScheduledNotificationAsync(notificationId);
// // //         }
// // //       }
      
// // //       // Delete from Firestore
// // //       await firebase
// // //         .firestore()
// // //         .collection('users')
// // //         .doc(userId)
// // //         .collection('medications')
// // //         .doc(medication.id)
// // //         .delete();
        
// // //       Alert.alert('Success', 'Medication reminder deleted');
// // //     } catch (error) {
// // //       console.error('Error deleting medication:', error);
// // //       Alert.alert('Error', 'Failed to delete medication reminder');
// // //     }
// // //   };

// // //   // Format time for display
// // //   const formatTime = (dateString) => {
// // //     const date = new Date(dateString);
// // //     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // //   };

// // //   // Format days for display
// // //   const formatDays = (dayIds) => {
// // //     return dayIds.map(id => days.find(day => day.id === id).name.substring(0, 3)).join(', ');
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={styles.title}>Medication Reminders</Text>
      
// // //       {/* Add Medication Form */}
// // //       <View style={styles.formContainer}>
// // //         <TextInput
// // //           style={styles.input}
// // //           placeholder="Medication Name*"
// // //           value={medicationName}
// // //           onChangeText={setMedicationName}
// // //         />
        
// // //         <TextInput
// // //           style={styles.input}
// // //           placeholder="Dosage (e.g., 1 pill)*"
// // //           value={dosage}
// // //           onChangeText={setDosage}
// // //         />
        
// // //         {/* Time Picker */}
// // //         <TouchableOpacity 
// // //           style={styles.timeSelector} 
// // //           onPress={() => setShowTimePicker(true)}
// // //         >
// // //           <Text style={styles.timeSelectorText}>
// // //             Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //           </Text>
// // //           <Ionicons name="time" size={24} color="#2c3e50" />
// // //         </TouchableOpacity>
        
// // //         {showTimePicker && (
// // //           <DateTimePicker
// // //             value={time}
// // //             mode="time"
// // //             display="default"
// // //             onChange={onTimeChange}
// // //           />
// // //         )}
        
// // //         {/* Days Selector */}
// // //         <View style={styles.daysContainer}>
// // //           <Text style={styles.sectionLabel}>Select Days:</Text>
// // //           <MultiSelect
// // //             items={days}
// // //             uniqueKey="id"
// // //             onSelectedItemsChange={setSelectedDays}
// // //             selectedItems={selectedDays}
// // //             selectText="Select Days"
// // //             searchInputPlaceholderText="Search Days..."
// // //             tagRemoveIconColor="#CCC"
// // //             tagBorderColor="#CCC"
// // //             tagTextColor="#333"
// // //             selectedItemTextColor="#2c3e50"
// // //             selectedItemIconColor="#2c3e50"
// // //             itemTextColor="#000"
// // //             displayKey="name"
// // //             submitButtonColor="#2c3e50"
// // //             submitButtonText="Done"
// // //             styleMainWrapper={styles.multiSelect}
// // //           />
// // //         </View>
        
// // //         {/* Submit Button */}
// // //         <TouchableOpacity
// // //           style={styles.addButton}
// // //           onPress={addMedicationReminder}
// // //           disabled={loading}
// // //         >
// // //           <Text style={styles.addButtonText}>Add Reminder</Text>
// // //           {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
// // //         </TouchableOpacity>
// // //       </View>
      
// // //       {/* Medications List */}
// // //       <Text style={styles.sectionTitle}>Your Medications</Text>
// // //       {loading ? (
// // //         <ActivityIndicator size="large" color="#2c3e50" />
// // //       ) : medications.length === 0 ? (
// // //         <Text style={styles.emptyText}>No medications added yet.</Text>
// // //       ) : (
// // //         <ScrollView style={styles.listContainer}>
// // //           {medications.map((medication) => (
// // //             <View key={medication.id} style={styles.medicationItem}>
// // //               <View style={styles.medicationInfo}>
// // //                 <Text style={styles.medicationName}>{medication.medicationName}</Text>
// // //                 <Text style={styles.medicationDetails}>
// // //                   {medication.dosage} • {formatTime(medication.time)}
// // //                 </Text>
// // //                 <Text style={styles.medicationDays}>
// // //                   {formatDays(medication.days)}
// // //                 </Text>
// // //               </View>
// // //               <TouchableOpacity
// // //                 style={styles.deleteButton}
// // //                 onPress={() => deleteMedication(medication)}
// // //               >
// // //                 <Ionicons name="trash-outline" size={24} color="#e74c3c" />
// // //               </TouchableOpacity>
// // //             </View>
// // //           ))}
// // //         </ScrollView>
// // //       )}
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: 16,
// // //     backgroundColor: '#f5f5f5',
// // //   },
// // //   title: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     marginBottom: 16,
// // //     color: '#2c3e50',
// // //   },
// // //   formContainer: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 8,
// // //     padding: 16,
// // //     marginBottom: 16,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   input: {
// // //     height: 50,
// // //     borderWidth: 1,
// // //     borderColor: '#ddd',
// // //     borderRadius: 8,
// // //     marginBottom: 16,
// // //     paddingHorizontal: 12,
// // //     fontSize: 16,
// // //   },
// // //   timeSelector: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     height: 50,
// // //     borderWidth: 1,
// // //     borderColor: '#ddd',
// // //     borderRadius: 8,
// // //     marginBottom: 16,
// // //     paddingHorizontal: 12,
// // //   },
// // //   timeSelectorText: {
// // //     fontSize: 16,
// // //   },
// // //   daysContainer: {
// // //     marginBottom: 16,
// // //   },
// // //   sectionLabel: {
// // //     fontSize: 16,
// // //     marginBottom: 8,
// // //     color: '#2c3e50',
// // //   },
// // //   multiSelect: {
// // //     borderWidth: 1,
// // //     borderColor: '#ddd',
// // //     borderRadius: 8,
// // //   },
// // //   addButton: {
// // //     backgroundColor: '#2c3e50',
// // //     borderRadius: 8,
// // //     height: 50,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     flexDirection: 'row',
// // //   },
// // //   addButtonText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //   },
// // //   loader: {
// // //     marginLeft: 10,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     marginBottom: 8,
// // //     color: '#2c3e50',
// // //   },
// // //   emptyText: {
// // //     fontSize: 16,
// // //     color: '#7f8c8d',
// // //     textAlign: 'center',
// // //     marginTop: 20,
// // //   },
// // //   listContainer: {
// // //     flex: 1,
// // //   },
// // //   medicationItem: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 8,
// // //     padding: 16,
// // //     marginBottom: 8,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 2,
// // //     elevation: 1,
// // //   },
// // //   medicationInfo: {
// // //     flex: 1,
// // //   },
// // //   medicationName: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#2c3e50',
// // //   },
// // //   medicationDetails: {
// // //     fontSize: 14,
// // //     color: '#7f8c8d',
// // //     marginTop: 4,
// // //   },
// // //   medicationDays: {
// // //     fontSize: 14,
// // //     color: '#7f8c8d',
// // //     marginTop: 2,
// // //   },
// // //   deleteButton: {
// // //     padding: 8,
// // //   },
// // // });

// // // export default MedicationReminderScreen;

// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   Platform,
// // //   Alert,
// // //   ActivityIndicator
// // // } from 'react-native';
// // // import { auth, db, } from '../../../FirebaseConfig';
// // // import DateTimePicker from '@react-native-community/datetimepicker';
// // // import * as Notifications from 'expo-notifications';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import MultiSelect from 'react-native-multiple-select';

// // // // Type definitions
// // // interface DayItem {
// // //   id: string;
// // //   name: string;
// // // }

// // // interface Medication {
// // //   id: string;
// // //   medicationName: string;
// // //   dosage: string;
// // //   time: string;
// // //   days: string[];
// // //   createdAt: any;
// // //   notificationIds?: string[];
// // // }

// // // interface MedicationData {
// // //   medicationName: string;
// // //   dosage: string;
// // //   time: string;
// // //   days: string[];
// // //   createdAt: any;
// // // }

// // // // Configure notifications
// // // Notifications.setNotificationHandler({
// // //   handleNotification: async () => ({
// // //     shouldShowAlert: true,
// // //     shouldPlaySound: true,
// // //     shouldSetBadge: false,
// // //   }),
// // // });

// // // const MedicationReminderScreen: React.FC = () => {
// // //   // State variables
// // //   const [medicationName, setMedicationName] = useState<string>('');
// // //   const [dosage, setDosage] = useState<string>('');
// // //   const [time, setTime] = useState<Date>(new Date());
// // //   const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
// // //   const [selectedDays, setSelectedDays] = useState<string[]>([]);
// // //   const [medications, setMedications] = useState<Medication[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(true);

// // //   // Days of the week for selection
// // //   const days: DayItem[] = [
// // //     { id: '1', name: 'Monday' },
// // //     { id: '2', name: 'Tuesday' },
// // //     { id: '3', name: 'Wednesday' },
// // //     { id: '4', name: 'Thursday' },
// // //     { id: '5', name: 'Friday' },
// // //     { id: '6', name: 'Saturday' },
// // //     { id: '7', name: 'Sunday' },
// // //   ];

// // //   // Request permissions for notifications
// // //   useEffect(() => {
// // //     registerForPushNotificationsAsync();
    
// // //     // Fetch existing medications
// // //     const userId = auth.currentUser?.uid;
// // //     if (!userId) {
// // //       setLoading(false);
// // //       return;
// // //     }
    
// // //     const unsubscribe = db
// // //       .collection('users')
// // //       .doc(userId)
// // //       .collection('medications')
// // //       .onSnapshot(querySnapshot => {
// // //         const medicationList: Medication[] = [];
// // //         querySnapshot.forEach(doc => {
// // //           const medication = doc.data() as Omit<Medication, 'id'>;
// // //           medicationList.push({ id: doc.id, ...medication });
// // //         });
// // //         setMedications(medicationList);
// // //         setLoading(false);
// // //       });

// // //     return () => unsubscribe();
// // //   }, []);

// // //   // Function to request notification permissions
// // //   async function registerForPushNotificationsAsync(): Promise<boolean> {
// // //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
// // //     let finalStatus = existingStatus;
    
// // //     if (existingStatus !== 'granted') {
// // //       const { status } = await Notifications.requestPermissionsAsync();
// // //       finalStatus = status;
// // //     }
    
// // //     if (finalStatus !== 'granted') {
// // //       Alert.alert('Permission Required', 'You need to enable notifications to receive medication reminders.');
// // //       return false;
// // //     }
// // //     return true;
// // //   }

// // //   // Function to schedule notifications
// // //   async function scheduleNotifications(medicationId: string, medicationData: MedicationData): Promise<void> {
// // //     const { medicationName, dosage, time, days } = medicationData;
// // //     const hasPermission = await registerForPushNotificationsAsync();
    
// // //     if (!hasPermission) return;

// // //     // Create notification triggers for each selected day
// // //     const notificationIds: string[] = [];
    
// // //     for (const dayId of days) {
// // //       const dayNumber = parseInt(dayId);
// // //       const weekday = dayNumber % 7; // 0 = Sunday, 1 = Monday, etc.
      
// // //       const notificationTime = new Date(time);
      
// // //       // Schedule weekly repeating notification
// // //       const trigger: Notifications.NotificationTriggerInput = {
// // //         hour: notificationTime.getHours(),
// // //         minute: notificationTime.getMinutes(),
// // //         weekday,
// // //         repeats: true
// // //       };

// // //       const notificationId = await Notifications.scheduleNotificationAsync({
// // //         content: {
// // //           title: `Time to take ${medicationName}`,
// // //           body: `Remember to take ${dosage} of ${medicationName}`,
// // //           sound: true,
// // //           data: { medicationId },
// // //         },
// // //         trigger,
// // //       });

// // //       notificationIds.push(notificationId);
// // //     }

// // //     // Save notification IDs to Firestore
// // //     const userId = auth.currentUser?.uid;
// // //     if (!userId) return;
    
// // //     db
// // //       .collection('users')
// // //       .doc(userId)
// // //       .collection('medications')
// // //       .doc(medicationId)
// // //       .update({
// // //         notificationIds,
// // //       });
// // //   }

// // //   // Handle time picker change
// // //   const onTimeChange = (event: any, selectedTime?: Date) => {
// // //     const currentTime = selectedTime || time;
// // //     setShowTimePicker(Platform.OS === 'ios');
// // //     setTime(currentTime);
// // //   };

// // //   // Handle form submission
// // //   const addMedicationReminder = async (): Promise<void> => {
// // //     if (!medicationName.trim()) {
// // //       Alert.alert('Error', 'Medication name is required');
// // //       return;
// // //     }

// // //     if (!dosage.trim()) {
// // //       Alert.alert('Error', 'Dosage is required');
// // //       return;
// // //     }

// // //     if (selectedDays.length === 0) {
// // //       Alert.alert('Error', 'Please select at least one day');
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       const userId = auth.currentUser?.uid;
// // //       if (!userId) {
// // //         Alert.alert('Error', 'User not authenticated');
// // //         setLoading(false);
// // //         return;
// // //       }
      
// // //       // Create medication document in Firestore
// // //       const medicationRef = db
// // //         .collection('users')
// // //         .doc(userId)
// // //         .collection('medications')
// // //         .doc();

// // //       const medicationData: MedicationData = {
// // //         medicationName,
// // //         dosage,
// // //         time: time.toISOString(),
// // //         days: selectedDays,
// // //         createdAt: db.FieldValue.serverTimestamp(),
// // //       };

// // //       await medicationRef.set(medicationData);
      
// // //       // Schedule notifications
// // //       await scheduleNotifications(medicationRef.id, medicationData);
      
// // //       // Reset form
// // //       setMedicationName('');
// // //       setDosage('');
// // //       setTime(new Date());
// // //       setSelectedDays([]);
      
// // //       Alert.alert('Success', 'Medication reminder added successfully');
// // //     } catch (error) {
// // //       console.error('Error adding medication reminder:', error);
// // //       Alert.alert('Error', 'Failed to add medication reminder');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Delete medication reminder
// // //   const deleteMedication = async (medication: Medication): Promise<void> => {
// // //     try {
// // //       const userId = auth.currentUser?.uid;
// // //       if (!userId) return;
      
// // //       // Cancel scheduled notifications
// // //       if (medication.notificationIds) {
// // //         for (const notificationId of medication.notificationIds) {
// // //           await Notifications.cancelScheduledNotificationAsync(notificationId);
// // //         }
// // //       }
      
// // //       // Delete from Firestore
// // //       await db
// // //         .collection('users')
// // //         .doc(userId)
// // //         .collection('medications')
// // //         .doc(medication.id)
// // //         .delete();
        
// // //       Alert.alert('Success', 'Medication reminder deleted');
// // //     } catch (error) {
// // //       console.error('Error deleting medication:', error);
// // //       Alert.alert('Error', 'Failed to delete medication reminder');
// // //     }
// // //   };

// // //   // Format time for display
// // //   const formatTime = (dateString: string): string => {
// // //     const date = new Date(dateString);
// // //     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // //   };

// // //   // Format days for display
// // //   const formatDays = (dayIds: string[]): string => {
// // //     return dayIds.map(id => {
// // //       const day = days.find(day => day.id === id);
// // //       return day ? day.name.substring(0, 3) : '';
// // //     }).join(', ');
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={styles.title}>Medication Reminders</Text>
      
// // //       {/* Add Medication Form */}
// // //       <View style={styles.formContainer}>
// // //         <TextInput
// // //           style={styles.input}
// // //           placeholder="Medication Name*"
// // //           value={medicationName}
// // //           onChangeText={setMedicationName}
// // //         />
        
// // //         <TextInput
// // //           style={styles.input}
// // //           placeholder="Dosage (e.g., 1 pill)*"
// // //           value={dosage}
// // //           onChangeText={setDosage}
// // //         />
        
// // //         {/* Time Picker */}
// // //         <TouchableOpacity 
// // //           style={styles.timeSelector} 
// // //           onPress={() => setShowTimePicker(true)}
// // //         >
// // //           <Text style={styles.timeSelectorText}>
// // //             Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //           </Text>
// // //           <Ionicons name="time" size={24} color="#2c3e50" />
// // //         </TouchableOpacity>
        
// // //         {showTimePicker && (
// // //           <DateTimePicker
// // //             value={time}
// // //             mode="time"
// // //             display="default"
// // //             onChange={onTimeChange}
// // //           />
// // //         )}
        
// // //         {/* Days Selector */}
// // //         <View style={styles.daysContainer}>
// // //           <Text style={styles.sectionLabel}>Select Days:</Text>
// // //           <MultiSelect
// // //             items={days}
// // //             uniqueKey="id"
// // //             onSelectedItemsChange={setSelectedDays}
// // //             selectedItems={selectedDays}
// // //             selectText="Select Days"
// // //             searchInputPlaceholderText="Search Days..."
// // //             tagRemoveIconColor="#CCC"
// // //             tagBorderColor="#CCC"
// // //             tagTextColor="#333"
// // //             selectedItemTextColor="#2c3e50"
// // //             selectedItemIconColor="#2c3e50"
// // //             itemTextColor="#000"
// // //             displayKey="name"
// // //             submitButtonColor="#2c3e50"
// // //             submitButtonText="Done"
// // //             styleMainWrapper={styles.multiSelect}
// // //           />
// // //         </View>
        
// // //         {/* Submit Button */}
// // //         <TouchableOpacity
// // //           style={styles.addButton}
// // //           onPress={addMedicationReminder}
// // //           disabled={loading}
// // //         >
// // //           <Text style={styles.addButtonText}>Add Reminder</Text>
// // //           {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
// // //         </TouchableOpacity>
// // //       </View>
      
// // //       {/* Medications List */}
// // //       <Text style={styles.sectionTitle}>Your Medications</Text>
// // //       {loading ? (
// // //         <ActivityIndicator size="large" color="#2c3e50" />
// // //       ) : medications.length === 0 ? (
// // //         <Text style={styles.emptyText}>No medications added yet.</Text>
// // //       ) : (
// // //         <ScrollView style={styles.listContainer}>
// // //           {medications.map((medication) => (
// // //             <View key={medication.id} style={styles.medicationItem}>
// // //               <View style={styles.medicationInfo}>
// // //                 <Text style={styles.medicationName}>{medication.medicationName}</Text>
// // //                 <Text style={styles.medicationDetails}>
// // //                   {medication.dosage} • {formatTime(medication.time)}
// // //                 </Text>
// // //                 <Text style={styles.medicationDays}>
// // //                   {formatDays(medication.days)}
// // //                 </Text>
// // //               </View>
// // //               <TouchableOpacity
// // //                 style={styles.deleteButton}
// // //                 onPress={() => deleteMedication(medication)}
// // //               >
// // //                 <Ionicons name="trash-outline" size={24} color="#e74c3c" />
// // //               </TouchableOpacity>
// // //             </View>
// // //           ))}
// // //         </ScrollView>
// // //       )}
// // //     </View>
// // //   );
// // // };

// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   Platform,
// //   Alert,
// //   ActivityIndicator
// // } from 'react-native';
// // import { auth, db } from '../../../FirebaseConfig';
// // import DateTimePicker from '@react-native-community/datetimepicker';
// // import * as Notifications from 'expo-notifications';
// // import { Ionicons } from '@expo/vector-icons';
// // import { 
// //   collection, 
// //   doc, 
// //   onSnapshot, 
// //   setDoc, 
// //   updateDoc, 
// //   deleteDoc, 
// //   serverTimestamp, 
// //   QueryDocumentSnapshot, 
// //   DocumentData 
// // } from 'firebase/firestore';
// // import type { QuerySnapshot } from 'firebase/firestore';
// // import * as Localization from 'expo-localization';

// // // Type definitions
// // interface DayItem {
// //   id: string;
// //   name: string;
// // }

// // interface Medication {
// //   id: string;
// //   medicationName: string;
// //   dosage: string;
// //   time: string;
// //   days: string[];
// //   createdAt: any; // Using any for serverTimestamp compatibility
// //   notificationIds?: string[];
// // }

// // interface MedicationData {
// //   medicationName: string;
// //   dosage: string;
// //   time: string;
// //   days: string[];
// //   createdAt: any; // Using any for serverTimestamp compatibility
// // }

// // // Configure notifications
// // Notifications.setNotificationHandler({
// //   handleNotification: async () => ({
// //     shouldShowAlert: true,
// //     shouldPlaySound: true,
// //     shouldSetBadge: false,
// //   }),
// // });

// // const MedicationReminderScreen: React.FC = () => {
// //   // State variables
// //   const [medicationName, setMedicationName] = useState<string>('');
// //   const [dosage, setDosage] = useState<string>('');
// //   const [time, setTime] = useState<Date>(new Date());
// //   const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
// //   const [selectedDays, setSelectedDays] = useState<string[]>([]);
// //   const [medications, setMedications] = useState<Medication[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

// //   // Days of the week for selection
// //   const days: DayItem[] = [
// //     { id: '1', name: 'Monday' },
// //     { id: '2', name: 'Tuesday' },
// //     { id: '3', name: 'Wednesday' },
// //     { id: '4', name: 'Thursday' },
// //     { id: '5', name: 'Friday' },
// //     { id: '6', name: 'Saturday' },
// //     { id: '7', name: 'Sunday' },
// //   ];

// //   // Request permissions and fetch medications on mount
// //   useEffect(() => {
// //     const setup = async () => {
// //       await registerForPushNotificationsAsync();
// //       fetchMedications();
// //     };
    
// //     setup();
    
// //     return () => {
// //       // Cleanup function will be called when component unmounts
// //     };
// //   }, []);

// //   // Fetch medications from Firestore
// //   const fetchMedications = () => {
// //     const userId = auth.currentUser?.uid;
// //     if (!userId) {
// //       setLoading(false);
// //       return;
// //     }
    
// //     const medicationsRef = collection(db, 'users', userId, 'medications');
// //     const unsubscribe = onSnapshot(
// //       medicationsRef, 
// //       (querySnapshot: QuerySnapshot) => {
// //         const medicationList: Medication[] = [];
// //         querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
// //           const medication = doc.data() as Omit<Medication, 'id'>;
// //           medicationList.push({ id: doc.id, ...medication });
// //         });
        
// //         // Sort medications by time
// //         medicationList.sort((a, b) => {
// //           const timeA = new Date(a.time).getTime();
// //           const timeB = new Date(b.time).getTime();
// //           return timeA - timeB;
// //         });
        
// //         setMedications(medicationList);
// //         setLoading(false);
// //       },
// //       (error) => {
// //         console.error('Error fetching medications:', error);
// //         setLoading(false);
// //       }
// //     );

// //     return unsubscribe;
// //   };

// //   // Function to request notification permissions
// //   async function registerForPushNotificationsAsync(): Promise<boolean> {
// //     try {
// //       const { status: existingStatus } = await Notifications.getPermissionsAsync();
// //       let finalStatus = existingStatus;
      
// //       if (existingStatus !== 'granted') {
// //         const { status } = await Notifications.requestPermissionsAsync();
// //         finalStatus = status;
// //       }
      
// //       if (finalStatus !== 'granted') {
// //         Alert.alert(
// //           'Permission Required', 
// //           'You need to enable notifications to receive medication reminders.',
// //           [{ text: 'OK' }]
// //         );
// //         return false;
// //       }
      
// //       // Create notification channel for Android
// //       if (Platform.OS === 'android') {
// //         await Notifications.setNotificationChannelAsync('medication-reminders', {
// //           name: 'Medication Reminders',
// //           importance: Notifications.AndroidImportance.HIGH,
// //           vibrationPattern: [0, 250, 250, 250],
// //           lightColor: '#FF231F7C',
// //           //sound: true,
// //         });
// //       }
      
// //       return true;
// //     } catch (error) {
// //       console.error('Error requesting notification permissions:', error);
// //       return false;
// //     }
// //   }

// //   // Schedule notifications for medication
// //   async function scheduleNotifications(medicationId: string, medicationData: MedicationData): Promise<string[]> {
// //     try {
// //       const hasPermission = await registerForPushNotificationsAsync();
// //       if (!hasPermission) return [];

// //       const notificationIds: string[] = [];
// //       const timeString = medicationData.time;
// //       const notificationTime = new Date(timeString);
// //       const hours = notificationTime.getHours();
// //       const minutes = notificationTime.getMinutes();
      
// //       const timezone = Localization.timezone;
      
// //       for (const dayId of medicationData.days) {
// //         // Use day ID directly as weekday (1-7 where 1 is Monday)
// //         const weekday = parseInt(dayId);
        
// //         const trigger: Notifications.NotificationTriggerInput = {
// //           hour: hours,
// //           minute: minutes,
// //           weekday: weekday,
// //           repeats: true,
// //           channelId: 'medication-reminders',
// //         };
        
// //         // iOS requires timeZone in the trigger
// //         if (Platform.OS === 'ios') {
// //           (trigger as any).timeZone = timezone;
// //         }

// //         const notificationId = await Notifications.scheduleNotificationAsync({
// //           content: {
// //             title: `Time to take ${medicationData.medicationName}`,
// //             body: `Remember to take ${medicationData.dosage} of ${medicationData.medicationName}`,
// //             sound: true,
// //             data: { medicationId },
// //           },
// //           trigger,
// //         });

// //         notificationIds.push(notificationId);
// //       }

// //       return notificationIds;
// //     } catch (error) {
// //       console.error('Failed to schedule notification:', error);
// //       Alert.alert('Error', 'Failed to schedule medication reminders');
// //       return [];
// //     }
// //   }
// //   // async function scheduleNotifications(medicationId: string, medicationData: MedicationData): Promise<void> {
// //   //   try {
// //   //     const hasPermission = await registerForPushNotificationsAsync();
// //   //     if (!hasPermission) return;
  
// //   //     const notificationIds: string[] = [];
// //   //     const timeString = medicationData.time;
// //   //     const notificationTime = new Date(timeString);
// //   //     const hours = notificationTime.getHours();
// //   //     const minutes = notificationTime.getMinutes();
      
// //   //     const timezone = Localization.timezone;
      
// //   //     for (const dayId of medicationData.days) {
// //   //       // Convert day ID to weekday number that matches Expo's expected format (1-7, where 1 is Monday)
// //   //       const weekday = parseInt(dayId);
        
// //   //       const trigger: Notifications.NotificationTriggerInput = {
// //   //         hour: hours,
// //   //         minute: minutes,
// //   //         weekday: weekday, // Expo expects 1-7 where 1 is Monday
// //   //         repeats: true,
// //   //         channelId: 'medication-reminders',
// //   //       };
        
// //   //       // iOS requires timeZone in the trigger
// //   //       if (Platform.OS === 'ios') {
// //   //         (trigger as any).timeZone = timezone;
// //   //       }
  
// //   //       const notificationId = await Notifications.scheduleNotificationAsync({
// //   //         content: {
// //   //           title: `Time to take ${medicationData.medicationName}`,
// //   //           body: `Remember to take ${medicationData.dosage} of ${medicationData.medicationName}`,
// //   //           sound: true,
// //   //           data: { medicationId },
// //   //         },
// //   //         trigger,
// //   //       });
  
// //   //       notificationIds.push(notificationId);
// //   //     }
  
// //   //     // Save notification IDs to Firestore
// //   //     const userId = auth.currentUser?.uid;
// //   //     if (userId) {
// //   //       const medicationRef = doc(db, 'users', userId, 'medications', medicationId);
// //   //       await updateDoc(medicationRef, { notificationIds });
// //   //     }
// //   //   } catch (error) {
// //   //     console.error('Failed to schedule notification:', error);
// //   //     Alert.alert('Error', 'Failed to schedule medication reminders');
// //   //   }
// //   // }
// //   // Handle time picker change
// //   const onTimeChange = (event: any, selectedTime?: Date) => {
// //     const currentTime = selectedTime || time;
// //     setShowTimePicker(Platform.OS === 'ios');
// //     setTime(currentTime);
// //   };

// //   // Validate form inputs
// //   const validateForm = (): boolean => {
// //     if (!medicationName.trim()) {
// //       Alert.alert('Error', 'Medication name is required');
// //       return false;
// //     }

// //     if (!dosage.trim()) {
// //       Alert.alert('Error', 'Dosage is required');
// //       return false;
// //     }

// //     if (selectedDays.length === 0) {
// //       Alert.alert('Error', 'Please select at least one day');
// //       return false;
// //     }

// //     return true;
// //   };

// //   // Handle form submission
// //   const addMedicationReminder = async (): Promise<void> => {
// //     if (!validateForm() || isSubmitting) return;

// //     try {
// //       setIsSubmitting(true);
// //       const userId = auth.currentUser?.uid;
// //       if (!userId) {
// //         Alert.alert('Error', 'User not authenticated');
// //         return;
// //       }
      
// //       // Create document reference
// //       const medicationsCollection = collection(db, 'users', userId, 'medications');
// //       const newMedicationRef = doc(medicationsCollection);

// //       const medicationData: MedicationData = {
// //         medicationName,
// //         dosage,
// //         time: time.toISOString(),
// //         days: selectedDays,
// //         createdAt: serverTimestamp(),
// //       };

// //       // Schedule notifications before saving to Firestore
// //       const notificationIds = await scheduleNotifications(newMedicationRef.id, medicationData);
      
// //       // Add notification IDs to medication data
// //       await setDoc(newMedicationRef, {
// //         ...medicationData,
// //         notificationIds
// //       });
      
// //       // Reset form
// //       setMedicationName('');
// //       setDosage('');
// //       setTime(new Date());
// //       setSelectedDays([]);
      
// //       Alert.alert('Success', 'Medication reminder added successfully');
// //     } catch (error) {
// //       console.error('Error adding medication reminder:', error);
// //       Alert.alert('Error', 'Failed to add medication reminder');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Delete medication reminder
// //   const deleteMedication = async (medication: Medication): Promise<void> => {
// //     Alert.alert(
// //       'Confirm Deletion',
// //       `Are you sure you want to delete reminder for ${medication.medicationName}?`,
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Delete',
// //           style: 'destructive',
// //           onPress: async () => {
// //             try {
// //               const userId = auth.currentUser?.uid;
// //               if (!userId) return;
              
// //               // Cancel scheduled notifications
// //               if (medication.notificationIds && medication.notificationIds.length > 0) {
// //                 await Promise.all(
// //                   medication.notificationIds.map(id => 
// //                     Notifications.cancelScheduledNotificationAsync(id)
// //                   )
// //                 );
// //               }
              
// //               // Delete document from Firestore
// //               const medicationRef = doc(db, 'users', userId, 'medications', medication.id);
// //               await deleteDoc(medicationRef);
                
// //               Alert.alert('Success', 'Medication reminder deleted');
// //             } catch (error) {
// //               console.error('Error deleting medication:', error);
// //               Alert.alert('Error', 'Failed to delete medication reminder');
// //             }
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   // Format time for display
// //   const formatTime = (dateString: string): string => {
// //     const date = new Date(dateString);
// //     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   };

// //   // Format days for display
// //   const formatDays = (dayIds: string[]): string => {
// //     return dayIds
// //       .sort((a, b) => parseInt(a) - parseInt(b))
// //       .map(id => {
// //         const day = days.find(day => day.id === id);
// //         return day ? day.name.substring(0, 3) : '';
// //       })
// //       .join(', ');
// //   };

// //   // Toggle day selection
// //   const toggleDaySelection = (dayId: string): void => {
// //     if (selectedDays.includes(dayId)) {
// //       setSelectedDays(selectedDays.filter(id => id !== dayId));
// //     } else {
// //       setSelectedDays([...selectedDays, dayId]);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Add Medication Form */}
// //       <View style={styles.formContainer}>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Medication Name*"
// //           value={medicationName}
// //           onChangeText={setMedicationName}
// //         />
        
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Dosage (e.g., 1 pill)*"
// //           value={dosage}
// //           onChangeText={setDosage}
// //         />
        
// //         {/* Time Picker */}
// //         <TouchableOpacity 
// //           style={styles.timeSelector} 
// //           onPress={() => setShowTimePicker(true)}
// //         >
// //           <Text style={styles.timeSelectorText}>
// //             Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //           </Text>
// //           <Ionicons name="time" size={24} color="#4B0082" />
// //         </TouchableOpacity>
        
// //         {showTimePicker && (
// //           <DateTimePicker
// //             value={time}
// //             mode="time"
// //             display="default"
// //             onChange={onTimeChange}
// //             is24Hour={false}
// //           />
// //         )}
        
// //         {/* Days Selector */}
// //         <View style={styles.daysWrapper}>
// //           {days.map((day) => {
// //             const isSelected = selectedDays.includes(day.id);
// //             return (
// //               <TouchableOpacity
// //                 key={day.id}
// //                 style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
// //                 onPress={() => toggleDaySelection(day.id)}
// //                 activeOpacity={0.7}
// //               >
// //                 <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
// //                   {day.name.slice(0, 3)}
// //                 </Text>
// //               </TouchableOpacity>
// //             );
// //           })}
// //         </View>

// //         {/* Submit Button */}
// //         <TouchableOpacity
// //           style={[styles.addButton, isSubmitting && styles.disabledButton]}
// //           onPress={addMedicationReminder}
// //           disabled={isSubmitting}
// //           activeOpacity={0.8}
// //         >
// //           <Text style={styles.addButtonText}>Add Reminder</Text>
// //           {isSubmitting && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
// //         </TouchableOpacity>
// //       </View>
      
// //       {/* Medications List */}
// //       <Text style={styles.sectionTitle}>Your Medications</Text>
// //       {loading ? (
// //         <View style={styles.centerContainer}>
// //           <ActivityIndicator size="large" color="#4B0082" />
// //         </View>
// //       ) : medications.length === 0 ? (
// //         <View style={styles.centerContainer}>
// //           <Text style={styles.emptyText}>No medications added yet.</Text>
// //         </View>
// //       ) : (
// //         <ScrollView style={styles.listContainer}>
// //           {medications.map((medication) => (
// //             <View key={medication.id} style={styles.medicationItem}>
// //               <View style={styles.medicationInfo}>
// //                 <Text style={styles.medicationName}>{medication.medicationName}</Text>
// //                 <Text style={styles.medicationDetails}>
// //                   {medication.dosage} • {formatTime(medication.time)}
// //                 </Text>
// //                 <Text style={styles.medicationDays}>
// //                   {formatDays(medication.days)}
// //                 </Text>
// //               </View>
// //               <TouchableOpacity
// //                 style={styles.deleteButton}
// //                 onPress={() => deleteMedication(medication)}
// //                 hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
// //               >
// //                 <Ionicons name="trash-outline" size={24} color="#4B0082" />
// //               </TouchableOpacity>
// //             </View>
// //           ))}
// //         </ScrollView>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F3F0FF', // Soft background
// //     padding: 16,
// //     borderRadius: 22, // Rounded background
// //   },
// //   centerContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   formContainer: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   input: {
// //     height: 50,
// //     borderWidth: 1,
// //     borderColor: '#D6CCF5', // Light indigo border
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     paddingHorizontal: 12,
// //     fontSize: 16,
// //     color: '#4B3F72',
// //   },
// //   timeSelector: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     height: 50,
// //     borderWidth: 1,
// //     borderColor: '#D6CCF5',
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     paddingHorizontal: 12,
// //     backgroundColor: '#EFEAFC',
// //   },
// //   timeSelectorText: {
// //     fontSize: 16,
// //     color: '#4B3F72',
// //   },
// //   daysContainer: {
// //     marginBottom: 16,
// //   },
// //   sectionLabel: {
// //     fontSize: 16,
// //     marginBottom: 8,
// //     color: '#2c3e50',
// //   },
// //   daysWrapper: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'center',
// //     marginTop: 10,
// //   },
// //   dayButton: {
// //     padding: 10,
// //     margin: 5,
// //     borderWidth: 1,
// //     borderColor: '#D6CCF5',
// //     borderRadius: 8,
// //     backgroundColor: '#EFEAFC',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: 70,
// //   },
// //   dayButtonSelected: {
// //     backgroundColor: '#4B3F72',
// //     borderColor: '#4B3F72',
// //   },
// //   dayText: {
// //     color: '#4B3F72',
// //     fontWeight: '500',
// //   },
// //   dayTextSelected: {
// //     color: '#FFFFFF',
// //   },
// //   addButton: {
// //     backgroundColor: '#4B0082',
// //     borderRadius: 10,
// //     height: 50,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //     marginTop: 10,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#9370DB',
// //   },
// //   addButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   loader: {
// //     marginLeft: 10,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginBottom: 8,
// //     color: '#4B3F72',
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     color: '#7f8c8d',
// //     textAlign: 'center',
// //     marginTop: 20,
// //   },
// //   listContainer: {
// //     flex: 1,
// //   },
// //   medicationItem: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 10,
// //     padding: 16,
// //     marginBottom: 8,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 1,
// //   },
// //   medicationInfo: {
// //     flex: 1,
// //   },
// //   medicationName: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#4B3F72',
// //   },
// //   medicationDetails: {
// //     fontSize: 14,
// //     color: '#7f8c8d',
// //     marginTop: 4,
// //   },
// //   medicationDays: {
// //     fontSize: 14,
// //     color: '#7f8c8d',
// //     marginTop: 2,
// //   },
// //   deleteButton: {
// //     padding: 8,
// //   },
// // });

// // export default MedicationReminderScreen;

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
// import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, serverTimestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
// import type { QuerySnapshot } from 'firebase/firestore';

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
    
//     //  syntax for collection and onSnapshot
//     const medicationsRef = collection(db, 'users', userId, 'medications');
//     const unsubscribe = onSnapshot(medicationsRef, (querySnapshot: QuerySnapshot) => {
//       const medicationList: Medication[] = [];
//       querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
//         const medication = doc.data() as Omit<Medication, 'id'>;
//         medicationList.push({ id: doc.id, ...medication });
//       });
//       setMedications(medicationList);
//       setLoading(false);
//     });

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

//   async function scheduleNotifications(medicationId: string, medicationData: MedicationData): Promise<void> {
//     const { medicationName, dosage, time, days } = medicationData;
//     const hasPermission = await registerForPushNotificationsAsync();
    
//     if (!hasPermission) return;
  
//     const notificationIds: string[] = [];
//     const notificationTime = new Date(time);
    
//     for (const dayId of days) {
//       const dayNumber = parseInt(dayId);
//       const weekday = dayNumber === 7 ? 1 : dayNumber + 1;
//       const hour = notificationTime.getHours();
//       const minute = notificationTime.getMinutes();
  
//       // Correct typing using the proper Expo Notifications interface
//       const trigger: Notifications.NotificationTriggerInput = {
//         repeats: true,
//         channelId: 'medication-reminders', // Optional but recommended
//         hour,
//         minute,
//         weekday,
//       };
  
//       try {
//         const notificationId = await Notifications.scheduleNotificationAsync({
//           content: {
//             title: `Time to take ${medicationName}`,
//             body: `Remember to take ${dosage} of ${medicationName}`,
//             sound: true,
//             data: { medicationId },
//           },
//           trigger,
//         });
  
//         notificationIds.push(notificationId);
//       } catch (error) {
//         console.error('Failed to schedule notification:', error);
//       }
//     }
  
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;
    
//     const medicationRef = doc(db, 'users', userId, 'medications', medicationId);
//     await updateDoc(medicationRef, {
//       notificationIds,
//     });
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
      
//       // syntax for creating document
//       const medicationsCollection = collection(db, 'users', userId, 'medications');
//       const newMedicationRef = doc(medicationsCollection);

//       const medicationData: MedicationData = {
//         medicationName,
//         dosage,
//         time: time.toISOString(),
//         days: selectedDays,
//         createdAt: serverTimestamp(),
//       };

//       await setDoc(newMedicationRef, medicationData);
      
//       // Schedule notifications
//       await scheduleNotifications(newMedicationRef.id, medicationData);
      
//       // Reset form
//       setMedicationName('');
//       setDosage('');
//       setTime(new Date());
//       setSelectedDays([]);
      
//       Alert.alert('Success', 'Medication reminder added successfully');
//     } catch (error: unknown) {
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
      
//       // syntax for deleting document
//       const medicationRef = doc(db, 'users', userId, 'medications', medication.id);
//       await deleteDoc(medicationRef);
        
//       Alert.alert('Success', 'Medication reminder deleted');
//     } catch (error: unknown) {
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
//           <Ionicons name="time" size={24} color="#4B0082" />
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
        
//         <View style={styles.daysWrapper}>
//   {days.map((day) => {
//     const isSelected = selectedDays.includes(day.id);
//     return (
//       <TouchableOpacity
//         key={day.id}
//         style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
//         onPress={() => {
//           if (isSelected) {
//             setSelectedDays(selectedDays.filter((id) => id !== day.id));
//           } else {
//             setSelectedDays([...selectedDays, day.id]);
//           }
//         }}
//       >
//         <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
//           {day.name.slice(0, 3)}
//         </Text>
//       </TouchableOpacity>
//     );
//   })}
// </View>

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
//         <ActivityIndicator size="large" color="#4B0082" />
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
//                 <Ionicons name="trash-outline" size={24} color="#4B0082" />
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
//     backgroundColor: '#F3F0FF', // Soft background
//     padding: 16,
//     borderRadius: 22, // <-- this gives the rounded background
//   },

//   formContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#D6CCF5', // Light indigo border
//     borderRadius: 10,
//     marginBottom: 16,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     color: '#4B3F72',
//   },
//   timeSelector: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#D6CCF5',
//     borderRadius: 10,
//     marginBottom: 16,
//     paddingHorizontal: 12,
//     backgroundColor: '#EFEAFC',
//   },
//   timeSelectorText: {
//     fontSize: 16,
//     color: '#4B3F72',
//   },
//   daysContainer: {
//     marginBottom: 16,
//   },
//   sectionLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#2c3e50',
//   },
//   dayButton: {
//     padding: 10,
//     margin: 5,
//     borderWidth: 1,
//     borderColor: '#D6CCF5',
//     borderRadius: 8,
//     backgroundColor: '#EFEAFC',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 70,
//   },
//   dayButtonSelected: {
//     backgroundColor: '#4B3F72',
//     borderColor: '#4B3F72',
//   },
//   dayText: {
//     color: '#4B3F72',
//     fontWeight: '500',
//   },
//   dayTextSelected: {
//     color: '#FFFFFF',
//   },
//   daysWrapper: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   addButton: {
//     backgroundColor: '#4B0082',
//     borderRadius: 10,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: '#FFFFFF',
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
//     color: '#4B3F72',
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
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   medicationInfo: {
//     flex: 1,
//   },
//   medicationName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4B3F72',
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
import { SchedulableTriggerInputTypes } from 'expo-notifications';

// Type definitions
interface DayItem {
  id: string;
  name: string;
}

interface MedicationData {
  medicationName: string;
  dosage: string;
  time: string;
  days: string[];
  createdAt: any;
  notificationIds?: string[];
}

interface Medication extends MedicationData {
  id: string;
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Testing function to verify notifications - call this from an admin screen or debug menu
async function testNotificationsSystem(): Promise<void> {
  try {
    // Test immediate notification
    const immediateId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is an immediate notification test"
      },
      trigger: null // null trigger means send immediately
    });
    console.log(`Immediate notification scheduled: ${immediateId}`);
    
    // Test notification in 5 seconds
    const inFiveSecondsId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "5 Second Test",
        body: "This notification was scheduled to arrive 5 seconds after setup"
      },
      trigger: {
        type: 'timeInterval',
        seconds: 5
      } as Notifications.TimeIntervalTriggerInput
    });
    console.log(`5-second notification scheduled: ${inFiveSecondsId}`);
    
    // Test daily notification at a specific time
    const now = new Date();
    const dailyTime = new Date();
    // Set for 1 minute from now
    dailyTime.setMinutes(now.getMinutes() + 1);
    
    const dailyId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Test",
        body: `This notification should arrive daily at ${dailyTime.getHours()}:${dailyTime.getMinutes()}`
      },
      trigger: {
        type: 'daily',
        hour: dailyTime.getHours(),
        minute: dailyTime.getMinutes(),
        repeats: true
      } as Notifications.DailyTriggerInput
    });
    console.log(`Daily notification scheduled: ${dailyId}`);
    
    // Get all scheduled notifications to verify
    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`Total scheduled notifications: ${allScheduled.length}`);
    console.log("Scheduled notification details:", JSON.stringify(allScheduled, null, 2));
    
    Alert.alert("Test Notifications", 
      `Scheduled ${allScheduled.length} test notifications.\n` +
      `- 1 immediate\n` +
      `- 1 in 5 seconds\n` +
      `- 1 daily at ${dailyTime.getHours()}:${dailyTime.getMinutes()}`
    );
  } catch (error) {
    console.error("Error testing notifications:", error);
    Alert.alert("Notification Test Failed", "Check console for details");
  }
}

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
    { id: '1', name: 'Sunday' },
    { id: '2', name: 'Monday' },
    { id: '3', name: 'Tuesday' },
    { id: '4', name: 'Wednesday' },
    { id: '5', name: 'Thursday' },
    { id: '6', name: 'Friday' },
    { id: '7', name: 'Saturday' },
  ];

  // Request permissions for notifications and setup channel
  useEffect(() => {
    const setupNotifications = async () => {
      await registerForPushNotificationsAsync();
      await setupNotificationChannel();
      
      // Add foreground notification listener for debugging
      const subscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });
      
      return () => subscription.remove();
    };

    setupNotifications();
    
    // Fetch existing medications
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }
    
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

  // Function to setup notification channel (Android)
  async function setupNotificationChannel() {
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('medication-reminders', {
          name: 'Medication Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default', // Use default notification sound
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
        console.log('Notification channel created successfully');
      } catch (error) {
        console.error('Error creating notification channel:', error);
      }
    }
  }

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

  async function scheduleNotifications(medicationId: string, medicationData: MedicationData): Promise<void> {
    const { medicationName, dosage, time, days } = medicationData;
    
    // Verify permissions
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permission Required', 'Notifications are required for medication reminders');
        return;
      }
    }
  
    const notificationIds: string[] = [];
    const notificationTime = new Date(time);
    notificationTime.setSeconds(0, 0);
  
    // Cancel existing notifications if any
    if (medicationData.notificationIds?.length) {
      for (const notificationId of medicationData.notificationIds) {
        try {
          await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
          console.error(`Failed to cancel notification ${notificationId}:`, error);
        }
      }
    }
  
    // Create weekly triggers for each selected day
    for (const dayId of days) {
      const weekday = parseInt(dayId); // 1-7
      const hour = notificationTime.getHours();
      const minute = notificationTime.getMinutes();
  
      try {
        // Use proper WeeklyTriggerInput with required type property
        const trigger: Notifications.WeeklyTriggerInput = {
          type: SchedulableTriggerInputTypes.WEEKLY,
          hour,
          minute,
          weekday,
          //repeats: true
        };
        
        // Create notification content with proper channel ID for Android
        const notificationContent: Notifications.NotificationContentInput = {
          title: `Time to take ${medicationName}`,
          body: `Remember to take ${dosage} of ${medicationName}`,
          sound: true,
          data: { medicationId },
        };
        
        // For Android, properly set the Android-specific options
        if (Platform.OS === 'android') {
          (notificationContent as any).androidNotificationChannelId = 'medication-reminders';
        }
  
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger,
        });
  
        notificationIds.push(notificationId);
        console.log(`Scheduled for ${weekdayToName(weekday)} at ${hour}:${minute}, ID: ${notificationId}`);
        
        // For debugging - check the scheduled notification
        if (__DEV__) {
          const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
          console.log(`Total scheduled notifications: ${allScheduled.length}`);
        }
      } catch (error) {
        console.error(`Failed to schedule for day ${weekday}:`, error);
      }
    }
  
    // Save to Firestore
    const userId = auth.currentUser?.uid;
    if (userId) {
      const medicationRef = doc(db, 'users', userId, 'medications', medicationId);
      await updateDoc(medicationRef, { notificationIds });
    }
  }
  
  // Helper function to convert weekday number to name
  function weekdayToName(weekday: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[weekday - 1] || `Day ${weekday}`;
  }
  
  // Handle time picker change
  const onTimeChange = (_event: any, selectedTime?: Date) => {
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
      if (medication.notificationIds?.length) {
        for (const notificationId of medication.notificationIds) {
          try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
          } catch (error) {
            console.error(`Failed to cancel notification ${notificationId}:`, error);
          }
        }
      }
      
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

  const formatDays = (dayIds?: string[] | null): string => {
    // Handle undefined/null cases
    if (!dayIds) return 'None selected';
    
    // Ensure it's an array
    if (!Array.isArray(dayIds)) return 'Invalid selection';
  
    // Handle empty array
    if (dayIds.length === 0) return 'None selected';
  
    // Process valid days
    const formatted = dayIds
      .map(id => days.find(day => day.id === id)?.name.substring(0, 3))
      .filter(Boolean);
  
    return formatted.length > 0 ? formatted.join(', ') : 'Invalid days';
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
          <Ionicons name="time" size={24} color="#4B0082" />
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
        
        {/* Test Button - Only show in development */}
        {__DEV__ && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: '#777', marginTop: 8 }]}
            onPress={testNotificationsSystem}
          >
            <Text style={styles.addButtonText}>Test Notifications</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Medications List */}
      <Text style={styles.sectionTitle}>Your Medications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B0082" />
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
                <Ionicons name="trash-outline" size={24} color="#4B0082" />
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
    backgroundColor: '#4B0082',
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
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   SafeAreaView,
//   Image
// } from 'react-native';
// import { auth, db } from '../../../FirebaseConfig';
// import * as Notifications from 'expo-notifications';
// import { Ionicons } from '@expo/vector-icons';
// import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, serverTimestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
// import type { QuerySnapshot } from 'firebase/firestore';

// // Define frequency options
// const FREQUENCY_OPTIONS = [
//   { id: '1', label: 'Once a day', times: 1 },
//   { id: '2', label: 'Twice a day', times: 2 },
//   { id: '3', label: 'Three times a day', times: 3 },
//   { id: '4', label: 'Four times a day', times: 4 },
// ];

// // Define medication interfaces
// interface MedicationData {
//   medicationName: string;
//   dosage: string;
//   frequency: string; // '1', '2', '3', or '4'
//   startTime: string; // ISO string for first dose time
//   createdAt: any;
//   notificationIds?: string[];
// }

// interface Medication extends MedicationData {
//   id: string;
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
//   const [frequency, setFrequency] = useState<string>('1'); // Default to once a day
//   const [startTime, setStartTime] = useState<Date>(new Date());
//   const [medications, setMedications] = useState<Medication[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isAdding, setIsAdding] = useState<boolean>(false);

//   // Request permissions for notifications and setup channel
//   useEffect(() => {
//     const setupNotifications = async () => {
//       await registerForPushNotificationsAsync();
//       await setupNotificationChannel();
      
//       // Add foreground notification listener for debugging
//       const subscription = Notifications.addNotificationReceivedListener(notification => {
//         console.log('Notification received:', notification);
//       });
      
//       return () => subscription.remove();
//     };

//     setupNotifications();
    
//     // Fetch existing medications
//     const userId = auth.currentUser?.uid;
//     if (!userId) {
//       setLoading(false);
//       return;
//     }
    
//     const medicationsRef = collection(db, 'users', userId, 'medications');
//     const unsubscribe = onSnapshot(medicationsRef, (querySnapshot: QuerySnapshot) => {
//       const medicationList: Medication[] = [];
//       querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
//         const medication = doc.data() as Omit<Medication, 'id'>;
//         medicationList.push({ id: doc.id, ...medication });
//       });
//       setMedications(medicationList);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Function to setup notification channel (Android)
//   async function setupNotificationChannel() {
//     if (Platform.OS === 'android') {
//       try {
//         await Notifications.setNotificationChannelAsync('medication-reminders', {
//           name: 'Medication Reminders',
//           importance: Notifications.AndroidImportance.HIGH,
//           sound: 'default',
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: '#FF231F7C',
//         });
//         console.log('Notification channel created successfully');
//       } catch (error) {
//         console.error('Error creating notification channel:', error);
//       }
//     }
//   }

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

//   // Calculate notification times based on frequency
//   function calculateNotificationTimes(baseTime: Date, frequency: string): Date[] {
//     const times: Date[] = [];
//     const frequencyCount = parseInt(frequency);
    
//     // Calculate interval between doses in hours
//     const hoursInterval = 24 / frequencyCount;
    
//     for (let i = 0; i < frequencyCount; i++) {
//       const notificationTime = new Date(baseTime);
//       notificationTime.setHours(baseTime.getHours() + (i * hoursInterval));
//       notificationTime.setSeconds(0, 0); // Clean time without seconds/millis
//       times.push(notificationTime);
//     }
    
//     return times;
//   }

//   // Schedule notifications based on frequency
//   async function scheduleNotifications(medicationId: string, medicationData: MedicationData): Promise<void> {
//     const { medicationName, dosage, frequency, startTime } = medicationData;
    
//     // Verify permissions
//     const hasPermission = await registerForPushNotificationsAsync();
//     if (!hasPermission) return;
    
//     const notificationIds: string[] = [];
//     const baseTime = new Date(startTime);
//     const notificationTimes = calculateNotificationTimes(baseTime, frequency);
    
//     // Cancel any existing notifications for this medication
//     if (medicationData.notificationIds) {
//       for (const notificationId of medicationData.notificationIds) {
//         await Notifications.cancelScheduledNotificationAsync(notificationId);
//       }
//     }
  
//     // Schedule new notifications
//     for (const [index, time] of notificationTimes.entries()) {
//       try {
//         const hour = time.getHours();
//         const minute = time.getMinutes();
        
//         // Create a dose number text (1st dose, 2nd dose, etc.)
//         const doseNumber = notificationTimes.length > 1 ? getOrdinalSuffix(index + 1) : '';
//         const doseText = doseNumber ? ` (${doseNumber} dose)` : '';
        
//         const notificationId = await Notifications.scheduleNotificationAsync({
//           content: {
//             title: `Time to take ${medicationName}${doseText}`,
//             body: `Remember to take ${dosage} of ${medicationName}`,
//             sound: true,
//             data: { medicationId },
//           },
//           trigger: {
//             hour,
//             minute,
//             repeats: true,
//             channelId: 'medication-reminders'
//           },
//         });
  
//         notificationIds.push(notificationId);
//         console.log(`Scheduled notification for ${medicationName} at ${hour}:${minute}`);
//       } catch (error) {
//         console.error('Failed to schedule notification:', error);
//       }
//     }
  
//     // Verify the notifications were scheduled
//     const scheduled = await Notifications.getAllScheduledNotificationsAsync();
//     console.log('Scheduled notifications:', scheduled.length);
  
//     // Save notification IDs to Firestore
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;
    
//     const medicationRef = doc(db, 'users', userId, 'medications', medicationId);
//     await updateDoc(medicationRef, {
//       notificationIds,
//     });
//   }

//   // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
//   function getOrdinalSuffix(num: number): string {
//     const j = num % 10;
//     const k = num % 100;
    
//     if (j === 1 && k !== 11) {
//       return num + "st";
//     }
//     if (j === 2 && k !== 12) {
//       return num + "nd";
//     }
//     if (j === 3 && k !== 13) {
//       return num + "rd";
//     }
//     return num + "th";
//   }

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

//     try {
//       setIsAdding(true);
//       const userId = auth.currentUser?.uid;
//       if (!userId) {
//         Alert.alert('Error', 'User not authenticated');
//         setIsAdding(false);
//         return;
//       }
      
//       const medicationsCollection = collection(db, 'users', userId, 'medications');
//       const newMedicationRef = doc(medicationsCollection);

//       const medicationData: MedicationData = {
//         medicationName,
//         dosage,
//         frequency,
//         startTime: startTime.toISOString(),
//         createdAt: serverTimestamp(),
//       };

//       await setDoc(newMedicationRef, medicationData);
      
//       // Schedule notifications
//       await scheduleNotifications(newMedicationRef.id, medicationData);
      
//       // Reset form
//       setMedicationName('');
//       setDosage('');
//       setFrequency('1');
//       setStartTime(new Date());
      
//       Alert.alert('Success', 'Medication reminder added successfully');
//     } catch (error: unknown) {
//       console.error('Error adding medication reminder:', error);
//       Alert.alert('Error', 'Failed to add medication reminder');
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   // Delete medication reminder
//   const deleteMedication = async (medication: Medication): Promise<void> => {
//     Alert.alert(
//       'Delete Reminder',
//       `Are you sure you want to delete the reminder for ${medication.medicationName}?`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const userId = auth.currentUser?.uid;
//               if (!userId) return;
              
//               // Cancel scheduled notifications
//               if (medication.notificationIds) {
//                 for (const notificationId of medication.notificationIds) {
//                   await Notifications.cancelScheduledNotificationAsync(notificationId);
//                 }
//               }
              
//               const medicationRef = doc(db, 'users', userId, 'medications', medication.id);
//               await deleteDoc(medicationRef);
                
//               Alert.alert('Success', 'Medication reminder deleted');
//             } catch (error: unknown) {
//               console.error('Error deleting medication:', error);
//               Alert.alert('Error', 'Failed to delete medication reminder');
//             }
//           }
//         }
//       ]
//     );
//   };

//   // Get readable frequency text
//   const getFrequencyText = (frequencyId: string): string => {
//     const option = FREQUENCY_OPTIONS.find(opt => opt.id === frequencyId);
//     return option ? option.label : 'Unknown frequency';
//   };

//   // Format time for display
//   const formatTime = (timeString: string): string => {
//     const date = new Date(timeString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView 
//         style={styles.keyboardAvoid}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>Medication Reminders</Text>
//             <Text style={styles.headerSubtitle}>Never miss a dose again</Text>
//           </View>

//           {/* Add Medication Form */}
//           <View style={styles.formContainer}>
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Medication Name*</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter medication name"
//                 placeholderTextColor="#9A84D6"
//                 value={medicationName}
//                 onChangeText={setMedicationName}
//               />
//             </View>
            
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Dosage*</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., 1 pill, 5ml, etc."
//                 placeholderTextColor="#9A84D6"
//                 value={dosage}
//                 onChangeText={setDosage}
//               />
//             </View>
            
//             {/* Frequency Selection */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Frequency</Text>
//               <View style={styles.frequencyContainer}>
//                 {FREQUENCY_OPTIONS.map((option) => (
//                   <TouchableOpacity
//                     key={option.id}
//                     style={[
//                       styles.frequencyButton,
//                       frequency === option.id && styles.frequencyButtonSelected
//                     ]}
//                     onPress={() => setFrequency(option.id)}
//                   >
//                     <Text
//                       style={[
//                         styles.frequencyText,
//                         frequency === option.id && styles.frequencyTextSelected
//                       ]}
//                     >
//                       {option.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
            
//             {/* First Dose Time Information */}
//             <View style={styles.infoContainer}>
//               <Ionicons name="information-circle-outline" size={18} color="#7A65C5" />
//               <Text style={styles.infoText}>
//                 Your first dose will be scheduled at the current time. Subsequent doses will be spaced evenly.
//               </Text>
//             </View>
            
//             {/* Submit Button */}
//             <TouchableOpacity
//               style={styles.addButton}
//               onPress={addMedicationReminder}
//               disabled={isAdding}
//             >
//               {isAdding ? (
//                 <ActivityIndicator size="small" color="#FFF" />
//               ) : (
//                 <>
//                   <Ionicons name="add-circle-outline" size={20} color="#FFF" style={styles.buttonIcon} />
//                   <Text style={styles.addButtonText}>Add Reminder</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
          
//           {/* Medications List Section */}
//           <View style={styles.listSection}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Your Medications</Text>
//               <Text style={styles.sectionCount}>{medications.length} {medications.length === 1 ? 'item' : 'items'}</Text>
//             </View>
            
//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#5E38B5" />
//                 <Text style={styles.loadingText}>Loading your medications...</Text>
//               </View>
//             ) : medications.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <Ionicons name="medical-outline" size={50} color="#C7B8F5" />
//                 <Text style={styles.emptyText}>No medications added yet</Text>
//                 <Text style={styles.emptySubtext}>Add your first medication above</Text>
//               </View>
//             ) : (
//               <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
//                 {medications.map((medication) => (
//                   <View key={medication.id} style={styles.medicationItem}>
//                     <View style={styles.medicationIconContainer}>
//                       <Ionicons name="medical" size={24} color="#5E38B5" />
//                     </View>
//                     <View style={styles.medicationInfo}>
//                       <Text style={styles.medicationName}>{medication.medicationName}</Text>
//                       <Text style={styles.medicationDetails}>
//                         <Text style={styles.detailsLabel}>Dosage:</Text> {medication.dosage}
//                       </Text>
//                       <Text style={styles.medicationDetails}>
//                         <Text style={styles.detailsLabel}>Schedule:</Text> {getFrequencyText(medication.frequency)}
//                       </Text>
//                       <Text style={styles.medicationTiming}>
//                         <Text style={styles.detailsLabel}>First dose:</Text> {formatTime(medication.startTime)}
//                       </Text>
//                     </View>
//                     <TouchableOpacity
//                       style={styles.deleteButton}
//                       onPress={() => deleteMedication(medication)}
//                     >
//                       <Ionicons name="trash-outline" size={22} color="#FF4A6D" />
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F8F5FF',
//   },
//   keyboardAvoid: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#5E38B5',
//     letterSpacing: 0.5,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: '#7A65C5',
//     marginTop: 4,
//   },
//   formContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#5E38B5',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#5E38B5',
//     fontWeight: '600',
//   },
//   input: {
//     height: 50,
//     borderWidth: 1.5,
//     borderColor: '#E2D9F3',
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     fontSize: 16,
//     color: '#4B3F72',
//     backgroundColor: '#FAFAFE',
//   },
//   frequencyContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -4,
//   },
//   frequencyButton: {
//     flex: 1,
//     minWidth: '48%',
//     margin: 4,
//     padding: 12,
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: '#E2D9F3',
//     backgroundColor: '#F8F5FF',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   frequencyButtonSelected: {
//     backgroundColor: '#5E38B5',
//     borderColor: '#5E38B5',
//   },
//   frequencyText: {
//     color: '#7A65C5',
//     fontWeight: '600',
//     fontSize: 15,
//   },
//   frequencyTextSelected: {
//     color: '#FFFFFF',
//   },
//   infoContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#F3F0FF',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginBottom: 20,
//     marginTop: 4,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#7A65C5',
//     marginLeft: 8,
//     flex: 1,
//   },
//   addButton: {
//     backgroundColor: '#5E38B5',
//     borderRadius: 12,
//     height: 54,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     shadowColor: '#5E38B5',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonIcon: {
//     marginRight: 8,
//   },
//   addButtonText: {
//     color: '#FFFFFF',
//     fontSize: 17,
//     fontWeight: 'bold',
//   },
//   listSection: {
//     flex: 1,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#5E38B5',
//   },
//   sectionCount: {
//     fontSize: 16,
//     color: '#7A65C5',
//     fontWeight: '500',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#7A65C5',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#5E38B5',
//     marginTop: 16,
//   },
//   emptySubtext: {
//     fontSize: 16,
//     color: '#7A65C5',
//     marginTop: 8,
//   },
//   listContainer: {
//     flex: 1,
//   },
//   medicationItem: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#5E38B5',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   medicationIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F0FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   medicationInfo: {
//     flex: 1,
//   },
//   medicationName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4B3F72',
//     marginBottom: 6,
//   },
//   medicationDetails: {
//     fontSize: 15,
//     color: '#4B3F72',
//     marginBottom: 3,
//   },
//   detailsLabel: {
//     fontWeight: '600',
//     color: '#7A65C5',
//   },
//   medicationTiming: {
//     fontSize: 15,
//     color: '#4B3F72',
//   },
//   deleteButton: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 22,
//     backgroundColor: '#FFF0F3',
//   },
// });

// export default MedicationReminderScreen;