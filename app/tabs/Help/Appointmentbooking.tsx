// // app/tabs/Help/Appointmentbooking.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Switch
// } from 'react-native';
// import { format } from 'date-fns';
// import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { collection, query, where, getDocs, addDoc, doc, updateDoc, serverTimestamp, getDoc, DocumentData } from 'firebase/firestore';
// import { auth, db } from '../../../FirebaseConfig';

// // Define types
// interface Doctor {
//   id: string;
//   name: string;
//   availability: {
//     [key: string]: string[];
//   };
//   [key: string]: any;
// }

// interface AppointmentData {
//   doctorId: string;
//   date: string;
//   timeSlot: string;
//   concerns: string;
//   visitPrep: {
//     lastPeriod: string;
//     symptoms: string[];
//     questions: string;
//   } | null;
// }

// // Firebase service functions
// const getDoctorById = async (doctorId: string): Promise<Doctor> => {
//   try {
//     const docRef = doc(db, 'doctors', doctorId);
//     const docSnap = await getDoc(docRef);
    
//     if (docSnap.exists()) {
//       return { id: docSnap.id, ...docSnap.data() } as Doctor;
//     } else {
//       throw new Error("Doctor not found");
//     }
//   } catch (error) {
//     console.error("Error getting doctor:", error);
//     throw error;
//   }
// };

// const getAvailableSlots = async (doctorId: string, date: string): Promise<string[]> => {
//   try {
//     // Get doctor's general availability
//     const doctor = await getDoctorById(doctorId);
    
//     // Get the day of the week from the date
//     const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
//     // Get all slots for that day from doctor's availability
//     const allSlots = doctor.availability[dayOfWeek] || [];
    
//     // Get booked appointments for that doctor and date
//     const appointmentsRef = collection(db, 'appointments');
//     const q = query(
//       appointmentsRef, 
//       where("doctorId", "==", doctorId),
//       where("date", "==", date),
//       where("status", "==", "booked")
//     );
    
//     const bookedAppointments = await getDocs(q);
//     const bookedSlots = bookedAppointments.docs.map(doc => doc.data().timeSlot);
    
//     // Filter out booked slots
//     return allSlots.filter(slot => !bookedSlots.includes(slot));
//   } catch (error) {
//     console.error("Error getting available slots:", error);
//     throw error;
//   }
// };

// const bookAppointment = async (appointmentData: AppointmentData) => {
//   try {
//     // Verify the user is authenticated
//     const user = auth.currentUser;
//     if (!user) {
//       throw new Error("User not authenticated");
//     }
    
//     // First check if the slot is still available
//     const availableSlots = await getAvailableSlots(
//       appointmentData.doctorId, 
//       appointmentData.date
//     );
    
//     if (!availableSlots.includes(appointmentData.timeSlot)) {
//       throw new Error("This time slot is no longer available");
//     }
    
//     // Create the appointment
//     const appointmentsRef = collection(db, 'appointments');
//     const newAppointment = {
//       ...appointmentData,
//       userId: user.uid,
//       status: "booked",
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     };
    
//     const docRef = await addDoc(appointmentsRef, newAppointment);
//     return { id: docRef.id, ...newAppointment };
//   } catch (error) {
//     console.error("Error booking appointment:", error);
//     throw error;
//   }
// };

// const BookAppointmentScreen = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const doctorId = params.doctorId as string;
//   const [doctor, setDoctor] = useState<Doctor | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [concerns, setConcerns] = useState('');
//   const [showPrepTool, setShowPrepTool] = useState(false);
//   const [lastPeriodDate, setLastPeriodDate] = useState(new Date());
//   const [symptoms, setSymptoms] = useState<string[]>([]);
//   const [questions, setQuestions] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [datePickerMode, setDatePickerMode] = useState<'appointmentDate' | 'lastPeriod'>('appointmentDate');
//   const [availableSlots, setAvailableSlots] = useState<string[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
//   // Common symptoms list
//   const symptomOptions = [
//     'Cramping', 'Headache', 'Bloating', 
//     'Mood swings', 'Fatigue', 'Acne', 
//     'Breast tenderness', 'Nausea'
//   ];

//   useEffect(() => {
//     const fetchDoctorAndSlots = async () => {
//       try {
//         setLoading(true);
//         // Get doctor information
//         const doctorData = await getDoctorById(doctorId);
//         setDoctor(doctorData);
        
//         // Get available slots for today
//         const formattedDate = format(selectedDate, 'yyyy-MM-dd');
//         const slots = await getAvailableSlots(doctorId, formattedDate);
//         setAvailableSlots(slots);
        
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load appointment information');
//         setLoading(false);
//         console.error(err);
//       }
//     };

//     fetchDoctorAndSlots();
//   }, [doctorId]);

//   const handleDateChange = async (event: DateTimePickerEvent, selectedDate?: Date) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       if (datePickerMode === 'appointmentDate') {
//         setSelectedDate(selectedDate);
//         setSelectedSlot(null); // Reset selected slot when date changes
        
//         try {
//           // Get available slots for the new date
//           const formattedDate = format(selectedDate, 'yyyy-MM-dd');
//           const slots = await getAvailableSlots(doctorId, formattedDate);
//           setAvailableSlots(slots);
//         } catch (err) {
//           setError('Failed to load available slots');
//           console.error(err);
//         }
//       } else if (datePickerMode === 'lastPeriod') {
//         setLastPeriodDate(selectedDate);
//       }
//     }
//   };

//   const toggleSymptom = (symptom: string) => {
//     if (symptoms.includes(symptom)) {
//       setSymptoms(symptoms.filter(s => s !== symptom));
//     } else {
//       setSymptoms([...symptoms, symptom]);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedSlot) {
//       Alert.alert('Error', 'Please select a time slot');
//       return;
//     }

//     if (!concerns.trim()) {
//       Alert.alert('Error', 'Please describe your concerns');
//       return;
//     }

//     try {
//       setSubmitting(true);
      
//       const appointmentData: AppointmentData = {
//         doctorId,
//         date: format(selectedDate, 'yyyy-MM-dd'),
//         timeSlot: selectedSlot,
//         concerns,
//         visitPrep: showPrepTool ? {
//           lastPeriod: format(lastPeriodDate, 'yyyy-MM-dd'),
//           symptoms,
//           questions
//         } : null
//       };
      
//       await bookAppointment(appointmentData);
//       setSubmitting(false);
      
//       Alert.alert(
//         'Success', 
//         'Your appointment has been booked successfully',
//         [{ text: 'OK', onPress: () => router.push('/tabs/Help/DoctorList') }] //This should navigate back after apointment booking is done.
//       );
//     } catch (err) {
//       setSubmitting(false);
//       Alert.alert('Error', err instanceof Error ? err.message : 'Failed to book appointment');
//       console.error(err);
//     }
//   };

//   const showPeriodDatePicker = () => {
//     setDatePickerMode('lastPeriod');
//     setShowDatePicker(true);
//   };

//   const showAppointmentDatePicker = () => {
//     setDatePickerMode('appointmentDate');
//     setShowDatePicker(true);
//   };

//   if (loading) {
//     return (
//       <View style={styles.centeredContainer}>
//         <ActivityIndicator size="large" color="#FF6B6B" />
//       </View>
//     );
//   }

//   if (error || !doctor) {
//     return (
//       <View style={styles.centeredContainer}>
//         <Text style={styles.errorText}>{error || 'Doctor not found'}</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Book an Appointment</Text>
//         <Text style={styles.headerSubtitle}>with {doctor.name}</Text>
//       </View>

//       <View style={styles.formSection}>
//         <Text style={styles.sectionTitle}>Your Concerns</Text>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Describe your symptoms or concerns..."
//           value={concerns}
//           onChangeText={setConcerns}
//           multiline
//           numberOfLines={4}
//         />
//       </View>

//       <View style={styles.formSection}>
//         <View style={styles.prepToolHeader}>
//           <Text style={styles.sectionTitle}>Visit Prep Tool</Text>
//           <View style={styles.switchContainer}>
//             <Text style={styles.switchLabel}>Use Prep Tool</Text>
//             <Switch
//               value={showPrepTool}
//               onValueChange={setShowPrepTool}
//               trackColor={{ false: "#D1D1D6", true: "#FF6B6B" }}
//               thumbColor={showPrepTool ? "#FFFFFF" : "#FFFFFF"}
//             />
//           </View>
//         </View>

//         {showPrepTool && (
//           <View style={styles.prepToolContent}>
//             <Text style={styles.inputLabel}>Last Period Date</Text>
//             <TouchableOpacity 
//               style={styles.dateSelector}
//               onPress={showPeriodDatePicker}
//             >
//               <Text>{format(lastPeriodDate, 'MMMM d, yyyy')}</Text>
//             </TouchableOpacity>

//             <Text style={styles.inputLabel}>Symptoms (select all that apply)</Text>
//             <View style={styles.symptomsContainer}>
//               {symptomOptions.map((symptom) => (
//                 <TouchableOpacity
//                   key={symptom}
//                   style={[
//                     styles.symptomButton,
//                     symptoms.includes(symptom) && styles.symptomButtonSelected
//                   ]}
//                   onPress={() => toggleSymptom(symptom)}
//                 >
//                   <Text
//                     style={[
//                       styles.symptomButtonText,
//                       symptoms.includes(symptom) && styles.symptomButtonTextSelected
//                     ]}
//                   >
//                     {symptom}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <Text style={styles.inputLabel}>Questions for Doctor</Text>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Any specific questions you'd like to ask..."
//               value={questions}
//               onChangeText={setQuestions}
//               multiline
//               numberOfLines={3}
//             />
//           </View>
//         )}
//       </View>

//       <View style={styles.formSection}>
//         <Text style={styles.sectionTitle}>Select Date & Time</Text>
//         <TouchableOpacity 
//           style={styles.dateSelector}
//           onPress={showAppointmentDatePicker}
//         >
//           <Text>{format(selectedDate, 'MMMM d, yyyy')}</Text>
//         </TouchableOpacity>

//         <Text style={styles.inputLabel}>Available Time Slots</Text>
//         <View style={styles.timeSlotContainer}>
//           {availableSlots.length > 0 ? (
//             availableSlots.map((slot) => (
//               <TouchableOpacity
//                 key={slot}
//                 style={[
//                   styles.timeSlotButton,
//                   selectedSlot === slot && styles.timeSlotButtonSelected
//                 ]}
//                 onPress={() => setSelectedSlot(slot)}
//               >
//                 <Text
//                   style={[
//                     styles.timeSlotButtonText,
//                     selectedSlot === slot && styles.timeSlotButtonTextSelected
//                   ]}
//                 >
//                   {slot}
//                 </Text>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text style={styles.noSlotsText}>No available slots for this day</Text>
//           )}
//         </View>
//       </View>

//       {showDatePicker && (
//         <DateTimePicker
//           value={datePickerMode === 'appointmentDate' ? selectedDate : lastPeriodDate}
//           mode="date"
//           display="default"
//           onChange={handleDateChange}
//         />
//       )}

//       <TouchableOpacity
//         style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
//         onPress={handleSubmit}
//         disabled={submitting || !selectedSlot}
//       >
//         {submitting ? (
//           <ActivityIndicator color="#FFFFFF" size="small" />
//         ) : (
//           <Text style={styles.submitButtonText}>Book Appointment</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F8F8',
//   },
//   header: {
//     padding: 24,
//     backgroundColor: '#FFFFFF',
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 18,
//     color: '#FF6B6B',
//   },
//   formSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     margin: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 16,
//   },
//   prepToolHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   switchLabel: {
//     marginRight: 8,
//     fontSize: 14,
//     color: '#666',
//   },
//   prepToolContent: {
//     marginTop: 16,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#333',
//     backgroundColor: '#FAFAFA',
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   inputLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//     marginTop: 16,
//   },
//   dateSelector: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: '#FAFAFA',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   symptomsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 16,
//   },
//   symptomButton: {
//     backgroundColor: '#F0F0F0',
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     margin: 4,
//   },
//   symptomButtonSelected: {
//     backgroundColor: '#FF6B6B',
//   },
//   symptomButtonText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   symptomButtonTextSelected: {
//     color: '#FFFFFF',
//   },
//   timeSlotContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 16,
//   },
//   timeSlotButton: {
//     backgroundColor: '#F0F0F0',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     margin: 4,
//     minWidth: 80,
//     alignItems: 'center',
//   },
//   timeSlotButtonSelected: {
//     backgroundColor: '#FF6B6B',
//   },
//   timeSlotButtonText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   timeSlotButtonTextSelected: {
//     color: '#FFFFFF',
//   },
//   noSlotsText: {
//     color: '#666',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     padding: 16,
//   },
//   submitButton: {
//     backgroundColor: '#FF6B6B',
//     borderRadius: 12,
//     padding: 16,
//     margin: 16,
//     alignItems: 'center',
//     shadowColor: '#FF6B6B',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#CCCCCC',
//     shadowOpacity: 0,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: '#FF3B30',
//     fontSize: 16,
//     textAlign: 'center',
//   }
// });

// export default BookAppointmentScreen;

// app/tabs/Help/Appointmentbooking.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch
} from 'react-native';
import { format } from 'date-fns';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, serverTimestamp, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '../../../FirebaseConfig';

// Define types
interface Doctor {
  id: string;
  name: string;
  availability: {
    [key: string]: string[];
  };
  [key: string]: any;
}

interface AppointmentData {
  doctorId: string;
  date: string;
  timeSlot: string;
  concerns: string;
  visitPrep: {
    symptoms: string[];
    questions: string;
  } | null;
}

// Firebase service functions
const getDoctorById = async (doctorId: string): Promise<Doctor> => {
  try {
    const docRef = doc(db, 'doctors', doctorId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Doctor;
    } else {
      throw new Error("Doctor not found");
    }
  } catch (error) {
    console.error("Error getting doctor:", error);
    throw error;
  }
};

const getAvailableSlots = async (doctorId: string, date: string): Promise<string[]> => {
  try {
    // Get doctor's general availability
    const doctor = await getDoctorById(doctorId);
    
    // Get the day of the week from the date
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Get all slots for that day from doctor's availability
    const allSlots = doctor.availability[dayOfWeek] || [];
    
    // Get booked appointments for that doctor and date
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef, 
      where("doctorId", "==", doctorId),
      where("date", "==", date),
      where("status", "==", "booked")
    );
    
    const bookedAppointments = await getDocs(q);
    const bookedSlots = bookedAppointments.docs.map(doc => doc.data().timeSlot);
    
    // Filter out booked slots
    //return allSlots.filter(slot => !bookedSlots.includes(slot));
     let available = allSlots.filter(slot => !bookedSlots.includes(slot));
     // If selected date is today, filter out past time slots
      const today = format(new Date(), 'yyyy-MM-dd');
      if (date === today) {
        const now = new Date();
        available = available.filter(slot => {
          const [hour, minute] = slot.split(':').map(Number);
          const slotDate = new Date(date);
          slotDate.setHours(hour, minute, 0, 0);
          return slotDate > now;
        });
      }
      return available;
    } catch (error) {
      console.error("Error getting available slots:", error);
    throw error;
  }
};

// Send email notification after booking
const sendBookingConfirmationEmail = async (appointmentData: any, doctor: Doctor) => {
  try {
    // Get user email
    const user = auth.currentUser;
    if (!user || !user.email) {
      console.error("User email not available");
      return;
    }
    
    // Add the appointment details to a 'emailQueue' collection in Firestore
    // This collection will be monitored by a Firebase Cloud Function that sends emails
    const emailQueueRef = collection(db, 'emailQueue');
    
    await addDoc(emailQueueRef, {
      type: 'APPOINTMENT_CONFIRMATION',
      to: user.email,
      status: 'pending',
      createdAt: serverTimestamp(),
      appointmentDetails: {
        doctorName: doctor.name,
        doctorId: doctor.id,
        date: appointmentData.date,
        timeSlot: appointmentData.timeSlot,
        concerns: appointmentData.concerns,
        userId: user.uid,
        userName: user.displayName || user.email
      }
    });
    
    console.log(`Email confirmation queued for ${user.email}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    // Don't throw the error - we still want the booking to succeed
  }
};

const bookAppointment = async (appointmentData: AppointmentData, doctor: Doctor) => {
  try {
    // Verify the user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // First check if the slot is still available
    const availableSlots = await getAvailableSlots(
      appointmentData.doctorId, 
      appointmentData.date
    );
    
    if (!availableSlots.includes(appointmentData.timeSlot)) {
      throw new Error("This time slot is no longer available");
    }
    
    // Create the appointment
    const appointmentsRef = collection(db, 'appointments');
    const newAppointment = {
      ...appointmentData,
      userId: user.uid,
      status: "booked",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(appointmentsRef, newAppointment);
    
    // Send confirmation email
    await sendBookingConfirmationEmail(newAppointment, doctor);
    
    return { id: docRef.id, ...newAppointment };
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

const BookAppointmentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const doctorId = params.doctorId as string;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [concerns, setConcerns] = useState('');
  const [showPrepTool, setShowPrepTool] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [questions, setQuestions] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Common symptoms list
  const symptomOptions = [
    'Cramping', 'Headache', 'Bloating', 
    'Mood swings', 'Fatigue', 'Acne', 
    'Nausea', 'Dizziness'
  ];

  useEffect(() => {
    const fetchDoctorAndSlots = async () => {
      try {
        setLoading(true);
        // Get doctor information
        const doctorData = await getDoctorById(doctorId);
        setDoctor(doctorData);
        
        // Get available slots for today
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const slots = await getAvailableSlots(doctorId, formattedDate);
        setAvailableSlots(slots);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointment information');
        setLoading(false);
        console.error(err);
      }
    };

    fetchDoctorAndSlots();
  }, [doctorId]);

  const handleDateChange = async (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setSelectedSlot(null); // Reset selected slot when date changes
      
      try {
        // Get available slots for the new date
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const slots = await getAvailableSlots(doctorId, formattedDate);
        setAvailableSlots(slots);
      } catch (err) {
        setError('Failed to load available slots');
        console.error(err);
      }
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    if (!concerns.trim()) {
      Alert.alert('Error', 'Please describe your concerns');
      return;
    }

    if (!doctor) {
      Alert.alert('Error', 'Doctor information not available');
      return;
    }

    try {
      setSubmitting(true);
      
      const appointmentData: AppointmentData = {
        doctorId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedSlot,
        concerns,
        visitPrep: showPrepTool ? {
          symptoms,
          questions
        } : null
      };
      
      await bookAppointment(appointmentData, doctor);
      setSubmitting(false);
      
      Alert.alert(
        'Success', 
        'Your appointment has been booked successfully. A confirmation email has been sent to your registered email address.',
        [{ text: 'OK', onPress: () => router.push('/tabs/Help/DoctorList') }]
      );
    } catch (err) {
      setSubmitting(false);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to book appointment');
      console.error(err);
    }
  };

  const showAppointmentDatePicker = () => {
    setShowDatePicker(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  if (error || !doctor) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error || 'Doctor not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book an Appointment</Text>
        <Text style={styles.headerSubtitle}>with {doctor.name}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Your Concerns</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Describe your symptoms or concerns..."
          value={concerns}
          onChangeText={setConcerns}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formSection}>
        <View style={styles.prepToolHeader}>
          <Text style={styles.sectionTitle}>Visit Prep Tool</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Use Prep Tool</Text>
            <Switch
              value={showPrepTool}
              onValueChange={setShowPrepTool}
              trackColor={{ false: "#D1D1D6", true: "#4B0082" }}
              thumbColor={showPrepTool ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>

        {showPrepTool && (
          <View style={styles.prepToolContent}>
            <Text style={styles.inputLabel}>Symptoms (select all that apply)</Text>
            <View style={styles.symptomsContainer}>
              {symptomOptions.map((symptom) => (
                <TouchableOpacity
                  key={symptom}
                  style={[
                    styles.symptomButton,
                    symptoms.includes(symptom) && styles.symptomButtonSelected
                  ]}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text
                    style={[
                      styles.symptomButtonText,
                      symptoms.includes(symptom) && styles.symptomButtonTextSelected
                    ]}
                  >
                    {symptom}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Questions for Doctor</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Any specific questions you'd like to ask..."
              value={questions}
              onChangeText={setQuestions}
              multiline
              numberOfLines={3}
            />
          </View>
        )}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Select Date & Time</Text>
        <TouchableOpacity 
          style={styles.dateSelector}
          onPress={showAppointmentDatePicker}
        >
          <Text>{format(selectedDate, 'MMMM d, yyyy')}</Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Available Time Slots</Text>
        <View style={styles.timeSlotContainer}>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlotButton,
                  selectedSlot === slot && styles.timeSlotButtonSelected
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text
                  style={[
                    styles.timeSlotButtonText,
                    selectedSlot === slot && styles.timeSlotButtonTextSelected
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noSlotsText}>No available slots for this day</Text>
          )}
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()} //users should not be able to slect past dates for appointment dates
        />
      )}

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting || !selectedSlot}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>Book Appointment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#4B0082',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  prepToolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 8,
    fontSize: 14,
    color: '#666',
  },
  prepToolContent: {
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  dateSelector: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  symptomButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  symptomButtonSelected: {
    backgroundColor: '#4B0082',
  },
  symptomButtonText: {
    color: '#666',
    fontSize: 14,
  },
  symptomButtonTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  timeSlotButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotButtonSelected: {
    backgroundColor: '#50C878',
  },
  timeSlotButtonText: {
    color: '#666',
    fontSize: 14,
  },
  timeSlotButtonTextSelected: {
    color: '#FFFFFF',
  },
  noSlotsText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#50C878',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default BookAppointmentScreen;