// // src/screens/BookAppointmentScreen.js
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
// import DateTimePicker from '@react-native-community/datetimepicker';

// const BookAppointmentScreen = ({ route, navigation }) => {
//   const { doctorId } = route.params;
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [concerns, setConcerns] = useState('');
//   const [showPrepTool, setShowPrepTool] = useState(false);
//   const [lastPeriodDate, setLastPeriodDate] = useState(new Date());
//   const [symptoms, setSymptoms] = useState([]);
//   const [questions, setQuestions] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);
  
//   // Common symptoms list
//   const symptomOptions = [
//     'Cramping', 'Headache', 'Bloating', 
//     'Mood swings', 'Fatigue', 'Acne', 
//     'Breast tenderness', 'Nausea'
//   ];

//   // Appointment services
// //   export const getAvailableSlots = async (doctorId: unknown, date: unknown) => {
// //     try {
// //       // Get doctor's general availability
// //       const doctor = await getDoctorById(doctorId);
      
// //       // Get the day of the week from the date
// //       const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
      
// //       // Get all slots for that day from doctor's availability
// //       const allSlots = doctor.availability[dayOfWeek] || [];
      
// //       // Get booked appointments for that doctor and date
// //       const appointmentsRef = collection(db, 'appointments');
// //       const q = query(
// //         appointmentsRef, 
// //         where("doctorId", "==", doctorId),
// //         where("date", "==", date),
// //         where("status", "==", "booked")
// //       );
      
// //       const bookedAppointments = await getDocs(q);
// //       const bookedSlots = bookedAppointments.docs.map(doc => doc.data().timeSlot);
      
// //       // Filter out booked slots
// //       return allSlots.filter(slot => !bookedSlots.includes(slot));
// //     } catch (error) {
// //       console.error("Error getting available slots:", error);
// //       throw error;
// //     }
// //   };
  
// //   export const bookAppointment = async (appointmentData: { doctorId: unknown; date: unknown; timeSlot: any; }) => {
// //     try {
// //       // Verify the user is authenticated
// //       const user = auth.currentUser;
// //       if (!user) {
// //         throw new Error("User not authenticated");
// //       }
      
// //       // First check if the slot is still available
// //       const availableSlots = await getAvailableSlots(
// //         appointmentData.doctorId, 
// //         appointmentData.date
// //       );
      
// //       if (!availableSlots.includes(appointmentData.timeSlot)) {
// //         throw new Error("This time slot is no longer available");
// //       }
      
// //       // Create the appointment
// //       const appointmentsRef = collection(db, 'appointments');
// //       const newAppointment = {
// //         ...appointmentData,
// //         userId: user.uid,
// //         status: "booked",
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp()
// //       };
      
// //       const docRef = await addDoc(appointmentsRef, newAppointment);
// //       return { id: docRef.id, ...newAppointment };
// //     } catch (error) {
// //       console.error("Error booking appointment:", error);
// //       throw error;
// //     }
// //   };
  
// //   export const updateAppointmentStatus = async (appointmentId: string, status: any) => {
// //     try {
// //       const appointmentRef = doc(db, 'appointments', appointmentId);
// //       await updateDoc(appointmentRef, {
// //         status: status,
// //         updatedAt: serverTimestamp()
// //       });
// //       return true;
// //     } catch (error) {
// //       console.error("Error updating appointment:", error);
// //       throw error;
// //     }
// //   };
  
// //   export const getUserAppointments = async () => {
// //     try {
// //       const user = auth.currentUser;
// //       if (!user) {
// //         throw new Error("User not authenticated");
// //       }
      
// //       const appointmentsRef = collection(db, 'appointments');
// //       const q = query(appointmentsRef, where("userId", "==", user.uid));
// //       const snapshot = await getDocs(q);
      
// //       return snapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data()
// //       }));
// //     } catch (error) {
// //       console.error("Error getting user appointments:", error);
// //       throw error;
// //     }
// //   };

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

//   const handleDateChange = async (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setSelectedDate(selectedDate);
//       setSelectedSlot(null); // Reset selected slot when date changes
      
//       try {
//         // Get available slots for the new date
//         const formattedDate = format(selectedDate, 'yyyy-MM-dd');
//         const slots = await getAvailableSlots(doctorId, formattedDate);
//         setAvailableSlots(slots);
//       } catch (err) {
//         setError('Failed to load available slots');
//         console.error(err);
//       }
//     }
//   };

//   const toggleSymptom = (symptom) => {
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
      
//       const appointmentData = {
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
//         [{ text: 'OK', onPress: () => navigation.navigate('MyAppointments') }]
//       );
//     } catch (err) {
//       setSubmitting(false);
//       Alert.alert('Error', err.message || 'Failed to book appointment');
//       console.error(err);
//     }
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
//               onPress={() => setShowDatePicker(true)}
//             >
//               <Text>{format(lastPeriodDate, 'MMMM d, yyyy')}</Text>
//             </TouchableOpacity>
            
//             {showDatePicker && (
//               <DateTimePicker
//                 value={lastPeriodDate}
//                 mode="date"
//                 display="default"
//                 onChange={(event, selectedDate) => {
//                   setShowDatePicker(false);
//                   if (selectedDate) {
//                     setLastPeriodDate(selectedDate);
//                   }
//                 }}
//               />
//             )}

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
//           onPress={() => setShowDatePicker(true)}
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