// // src/firebase/services.js
// import { 
//     collection, 
//     doc, 
//     getDocs, 
//     getDoc, 
//     addDoc, 
//     updateDoc, 
//     query, 
//     where,
//     serverTimestamp 
//   } from 'firebase/firestore';
//   import { db, auth } from '../../../FirebaseConfig';
  
//   // Doctor services
//   export const getDoctors = async () => {
//     try {
//       const doctorsRef = collection(db, 'doctors');
//       const snapshot = await getDocs(doctorsRef);
//       return snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//     } catch (error) {
//       console.error("Error getting doctors:", error);
//       throw error;
//     }
//   };
  
//   export const getDoctorById = async (doctorId: string) => {
//     try {
//       const doctorRef = doc(db, 'doctors', doctorId);
//       const doctorSnap = await getDoc(doctorRef);
      
//       if (doctorSnap.exists()) {
//         return {
//           id: doctorSnap.id,
//           ...doctorSnap.data()
//         };
//       } else {
//         throw new Error("Doctor not found");
//       }
//     } catch (error) {
//       console.error("Error getting doctor:", error);
//       throw error;
//     }
//   };
  
//   // Appointment services
//   export const getAvailableSlots = async (doctorId: unknown, date: unknown) => {
//     try {
//       // Get doctor's general availability
//       const doctor = await getDoctorById(doctorId);
      
//       // Get the day of the week from the date
//       const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
      
//       // Get all slots for that day from doctor's availability
//       const allSlots = doctor.availability[dayOfWeek] || [];
      
//       // Get booked appointments for that doctor and date
//       const appointmentsRef = collection(db, 'appointments');
//       const q = query(
//         appointmentsRef, 
//         where("doctorId", "==", doctorId),
//         where("date", "==", date),
//         where("status", "==", "booked")
//       );
      
//       const bookedAppointments = await getDocs(q);
//       const bookedSlots = bookedAppointments.docs.map(doc => doc.data().timeSlot);
      
//       // Filter out booked slots
//       return allSlots.filter(slot => !bookedSlots.includes(slot));
//     } catch (error) {
//       console.error("Error getting available slots:", error);
//       throw error;
//     }
//   };
  
//   export const bookAppointment = async (appointmentData: { doctorId: unknown; date: unknown; timeSlot: any; }) => {
//     try {
//       // Verify the user is authenticated
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error("User not authenticated");
//       }
      
//       // First check if the slot is still available
//       const availableSlots = await getAvailableSlots(
//         appointmentData.doctorId, 
//         appointmentData.date
//       );
      
//       if (!availableSlots.includes(appointmentData.timeSlot)) {
//         throw new Error("This time slot is no longer available");
//       }
      
//       // Create the appointment
//       const appointmentsRef = collection(db, 'appointments');
//       const newAppointment = {
//         ...appointmentData,
//         userId: user.uid,
//         status: "booked",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       };
      
//       const docRef = await addDoc(appointmentsRef, newAppointment);
//       return { id: docRef.id, ...newAppointment };
//     } catch (error) {
//       console.error("Error booking appointment:", error);
//       throw error;
//     }
//   };
  
//   export const updateAppointmentStatus = async (appointmentId: string, status: any) => {
//     try {
//       const appointmentRef = doc(db, 'appointments', appointmentId);
//       await updateDoc(appointmentRef, {
//         status: status,
//         updatedAt: serverTimestamp()
//       });
//       return true;
//     } catch (error) {
//       console.error("Error updating appointment:", error);
//       throw error;
//     }
//   };
  
//   export const getUserAppointments = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error("User not authenticated");
//       }
      
//       const appointmentsRef = collection(db, 'appointments');
//       const q = query(appointmentsRef, where("userId", "==", user.uid));
//       const snapshot = await getDocs(q);
      
//       return snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//     } catch (error) {
//       console.error("Error getting user appointments:", error);
//       throw error;
//     }
//   };

// src/screens/DoctorProfileScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator
// } from 'react-native';

// const DoctorProfileScreen = ({ route, navigation }) => {
//   const { doctorId } = route.params;
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   //   export const getDoctors = async () => {
// //     try {
// //       const doctorsRef = collection(db, 'doctors');
// //       const snapshot = await getDocs(doctorsRef);
// //       return snapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data()
// //       }));
// //     } catch (error) {
// //       console.error("Error getting doctors:", error);
// //       throw error;
// //     }
// //   };
  
// //   export const getDoctorById = async (doctorId: string) => {
// //     try {
// //       const doctorRef = doc(db, 'doctors', doctorId);
// //       const doctorSnap = await getDoc(doctorRef);
      
// //       if (doctorSnap.exists()) {
// //         return {
// //           id: doctorSnap.id,
// //           ...doctorSnap.data()
// //         };
// //       } else {
// //         throw new Error("Doctor not found");
// //       }
// //     } catch (error) {
// //       console.error("Error getting doctor:", error);
// //       throw error;
// //     }
// //   };
//   useEffect(() => {
//     const fetchDoctorData = async () => {
//       try {
//         setLoading(true);
//         const doctorData = await getDoctorById(doctorId);
//         setDoctor(doctorData);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load doctor profile');
//         setLoading(false);
//         console.error(err);
//       }
//     };

//     fetchDoctorData();
//   }, [doctorId]);

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

//   const handleBookAppointment = () => {
//     navigation.navigate('BookAppointment', { doctorId: doctor.id });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Image
//           source={{ uri: doctor.imageUrl || 'https://via.placeholder.com/150' }}
//           style={styles.profileImage}
//         />
//         <Text style={styles.doctorName}>{doctor.name}</Text>
//         <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
//         <Text style={styles.doctorLocation}>{doctor.location}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>About</Text>
//         <Text style={styles.bioText}>{doctor.bio}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Availability</Text>
//         <Text style={styles.availabilityText}>
//           This doctor is currently accepting new appointments.
//           {'\n\n'}
//           Please use the button below to schedule a visit.
//         </Text>
//       </View>

//       <TouchableOpacity
//         style={styles.bookButton}
//         onPress={handleBookAppointment}
//       >
//         <Text style={styles.bookButtonText}>Book an Appointment</Text>
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
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#FFFFFF',
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 16,
//   },
//   doctorName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   doctorSpecialty: {
//     fontSize: 18,
//     color: '#FF6B6B',
//     marginBottom: 4,
//   },
//   doctorLocation: {
//     fontSize: 16,
//     color: '#888',
//   },
//   section: {
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
//     marginBottom: 12,
//   },
//   bioText: {
//     fontSize: 16,
//     color: '#555',
//     lineHeight: 24,
//   },
//   availabilityText: {
//     fontSize: 16,
//     color: '#555',
//     lineHeight: 24,
//   },
//   bookButton: {
//     backgroundColor: '#FF6B6B',
//     padding: 16,
//     borderRadius: 12,
//     margin: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   bookButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
// });

// export default DoctorProfileScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator
// } from 'react-native';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../../FirebaseConfig';
// import { NavigationProp, ParamListBase } from '@react-navigation/native';
// import { useLocalSearchParams, useRouter } from 'expo-router';

// interface Doctor {
//   id: string;
//   name: string;
//   specialty: string;
//   bio: string;
//   location: string;
//   imageUrl: string;
//   availability: {
//     [day: string]: string[];
//   };
// }
// const DoctorProfileScreen = () => {
//     const router = useRouter();
//     const params = useLocalSearchParams();
    
//     const [doctor, setDoctor] = useState<Doctor | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
  
//     // Get initial data from navigation params
//     const initialDoctorData = {
//       id: params.doctorId as string,
//       name: params.doctorName as string,
//       specialty: params.doctorSpecialty as string,
//       imageUrl: params.doctorImage as string,
//       // Other fields will be fetched from Firestore
//       bio: '',
//       location: '',
//       availability: {}
//     };
  
//     const getDoctorById = async (id: string): Promise<Doctor> => {
//       try {
//         const doctorRef = doc(db, 'doctors', id);
//         const doctorSnap = await getDoc(doctorRef);
        
//         if (doctorSnap.exists()) {
//           return {
//             ...initialDoctorData, // Use the params data first
//             ...doctorSnap.data(), // Override with Firestore data
//             id: doctorSnap.id
//           } as Doctor;
//         } else {
//           // If not in Firestore, use the params data only
//           return initialDoctorData;
//         }
//       } catch (error) {
//         console.error("Error getting doctor:", error);
//         throw error;
//       }
//     };
  
//     useEffect(() => {
//       const fetchDoctorData = async () => {
//         try {
//           setLoading(true);
//           const doctorData = await getDoctorById(params.doctorId as string);
//           setDoctor(doctorData);
//           setLoading(false);
//         } catch (err) {
//           setError('Failed to load doctor profile');
//           setLoading(false);
//           console.error(err);
//         }
//       };
  
//       fetchDoctorData();
//     }, [params.doctorId]);

// // interface DoctorProfileScreenProps {
// //   route: {
// //     params: {
// //       doctorId: string;
// //     };
// //   };
// //   navigation: NavigationProp<ParamListBase>;
// // }

// // const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({ route, navigation }) => {
// //   const { doctorId } = route.params;
// //   const [doctor, setDoctor] = useState<Doctor | null>(null);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const getDoctorById = async (id: string): Promise<Doctor> => {
// //     try {
// //       const doctorRef = doc(db, 'doctors', id);
// //       const doctorSnap = await getDoc(doctorRef);
      
// //       if (doctorSnap.exists()) {
// //         return {
// //           id: doctorSnap.id,
// //           ...doctorSnap.data()
// //         } as Doctor;
// //       } else {
// //         throw new Error("Doctor not found");
// //       }
// //     } catch (error) {
// //       console.error("Error getting doctor:", error);
// //       throw error;
// //     }
// //   };

// //   useEffect(() => {
// //     const fetchDoctorData = async () => {
// //       try {
// //         setLoading(true);
// //         const doctorData = await getDoctorById(doctorId);
// //         setDoctor(doctorData);
// //         setLoading(false);
// //       } catch (err) {
// //         setError('Failed to load doctor profile');
// //         setLoading(false);
// //         console.error(err);
// //       }
// //     };

// //     fetchDoctorData();
// //   }, [doctorId]);

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

//   const handleBookAppointment = () => {
//     navigation.navigate('BookAppointment', { 
//       doctorId: doctor.id,
//       doctorName: doctor.name,
//       doctorSpecialty: doctor.specialty
//     });
//   };

//   // Helper function to format availability
//   const renderAvailability = () => {
//     return Object.entries(doctor.availability).map(([day, times]) => (
//       <View key={day} style={styles.availabilityItem}>
//         <Text style={styles.availabilityDay}>{day.charAt(0).toUpperCase() + day.slice(1)}:</Text>
//         <Text style={styles.availabilityTimes}>{times.join(', ')}</Text>
//       </View>
//     ));
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Image
//           source={{ uri: doctor.imageUrl || 'https://via.placeholder.com/150' }}
//           style={styles.profileImage}
//         />
//         <Text style={styles.doctorName}>{doctor.name}</Text>
//         <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
//         <Text style={styles.doctorLocation}>{doctor.location}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>About</Text>
//         <Text style={styles.bioText}>{doctor.bio}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Availability</Text>
//         {renderAvailability()}
//       </View>

//       <TouchableOpacity
//         style={styles.bookButton}
//         onPress={handleBookAppointment}
//       >
//         <Text style={styles.bookButtonText}>Book an Appointment</Text>
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
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#FFFFFF',
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 16,
//   },
//   doctorName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   doctorSpecialty: {
//     fontSize: 18,
//     color: '#FF6B6B',
//     marginBottom: 4,
//   },
//   doctorLocation: {
//     fontSize: 16,
//     color: '#888',
//   },
//   section: {
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
//     marginBottom: 12,
//   },
//   bioText: {
//     fontSize: 16,
//     color: '#555',
//     lineHeight: 24,
//   },
//   availabilityItem: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   availabilityDay: {
//     fontWeight: 'bold',
//     width: 100,
//     color: '#555',
//   },
//   availabilityTimes: {
//     flex: 1,
//     color: '#555',
//   },
//   bookButton: {
//     backgroundColor: '#FF6B6B',
//     padding: 16,
//     borderRadius: 12,
//     margin: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   bookButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
// });

// export default DoctorProfileScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator
// } from 'react-native';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../../FirebaseConfig';
// import { useLocalSearchParams, useRouter } from 'expo-router';

// interface Doctor {
//   id: string;
//   name: string;
//   specialty: string;
//   bio: string;
//   location: string;
//   imageUrl: string;
//   availability: {
//     [day: string]: string[];
//   };
// }

// const DoctorProfileScreen = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
  
//   const [doctor, setDoctor] = useState<Doctor | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Get initial data from navigation params
//   const initialDoctorData = {
//     id: params.doctorId as string,
//     name: params.doctorName as string,
//     specialty: params.doctorSpecialty as string,
//     imageUrl: params.doctorImage as string,
//     bio: '',
//     location: '',
//     availability: {}
//   };

//   const getDoctorById = async (id: string): Promise<Doctor> => {
//     try {
//       const doctorRef = doc(db, 'doctors', id);
//       const doctorSnap = await getDoc(doctorRef);
      
//       if (doctorSnap.exists()) {
//         return {
//           ...initialDoctorData, // Use the params data first
//           ...doctorSnap.data(), // Override with Firestore data
//           id: doctorSnap.id
//         } as Doctor;
//       } else {
//         // If not in Firestore, use the params data only
//         return initialDoctorData;
//       }
//     } catch (error) {
//       console.error("Error getting doctor:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const fetchDoctorData = async () => {
//       try {
//         setLoading(true);
//         const doctorData = await getDoctorById(params.doctorId as string);
//         setDoctor(doctorData);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load doctor profile');
//         setLoading(false);
//         console.error(err);
//       }
//     };

//     fetchDoctorData();
//   }, [params.doctorId]);

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

//   const handleBookAppointment = () => {
//     router.push({
//       pathname: '/tabs/Help/Appointmentbooking',
//       params: { 
//         doctorId: doctor.id,
//         doctorName: doctor.name,
//         doctorSpecialty: doctor.specialty
//       }
//     });
//   };

//   // Helper function to format availability
//   const renderAvailability = () => {
//     return Object.entries(doctor.availability).map(([day, times]) => (
//       <View key={day} style={styles.availabilityItem}>
//         <Text style={styles.availabilityDay}>{day.charAt(0).toUpperCase() + day.slice(1)}:</Text>
//         <Text style={styles.availabilityTimes}>{times.join(', ')}</Text>
//       </View>
//     ));
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Image
//           source={{ uri: doctor.imageUrl || 'https://via.placeholder.com/150' }}
//           style={styles.profileImage}
//         />
//         <Text style={styles.doctorName}>{doctor.name}</Text>
//         <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
//         <Text style={styles.doctorLocation}>{doctor.location}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>About</Text>
//         <Text style={styles.bioText}>{doctor.bio}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Availability</Text>
//         {renderAvailability()}
//       </View>

//       <TouchableOpacity
//         style={styles.bookButton}
//         onPress={handleBookAppointment}
//       >
//         <Text style={styles.bookButtonText}>Book an Appointment</Text>
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
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#FFFFFF',
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 16,
//   },
//   doctorName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   doctorSpecialty: {
//     fontSize: 18,
//     color: '#FF6B6B',
//     marginBottom: 4,
//   },
//   doctorLocation: {
//     fontSize: 16,
//     color: '#888',
//   },
//   section: {
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
//     marginBottom: 12,
//   },
//   bioText: {
//     fontSize: 16,
//     color: '#555',
//     lineHeight: 24,
//   },
//   availabilityItem: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   availabilityDay: {
//     fontWeight: 'bold',
//     width: 100,
//     color: '#555',
//   },
//   availabilityTimes: {
//     flex: 1,
//     color: '#555',
//   },
//   bookButton: {
//     backgroundColor: '#FF6B6B',
//     padding: 16,
//     borderRadius: 12,
//     margin: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   bookButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
// });

// export default DoctorProfileScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { useRouter } from 'expo-router';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  location: string;
  imageUrl: string;
  availability: {
    [day: string]: string[];
  };
  patientsCount: number; // New field for patients count
  experienceYears: number; // New field for experience years
  reviewsCount: number; // New field for reviews count
}

const DoctorListScreen = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const initializeDoctorsIfEmpty = async () => {
    const snapshot = await getDocs(collection(db, 'doctors'));
    if (snapshot.empty) {
      const doctorsToAdd = [
        {
          name: "Dr. Sarah Johnson",
          specialty: "Gynecologist",
          bio: "Dr. Johnson has been practicing for 15 years...",
          location: "123 Medical Center, City",
          imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
          availability: {
            monday: ["9:00", "10:00", "11:00"],
            tuesday: ["14:00", "15:00", "16:00"],
          },
          patientsCount: 1200,
          experienceYears: 15,
          reviewsCount: 450,
        },
        {
          name: "Dr. Emily Brown",
          specialty: "OBGYN",
          bio: "Expert in hormonal therapy and menstrual disorders.",
          location: "456 Women's Clinic, Town",
          imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
          availability: {
            monday: ["10:00", "11:00", "12:00"],
            wednesday: ["9:00", "10:00", "11:00"],
          },
          patientsCount: 800,
          experienceYears: 10,
          reviewsCount: 300,
        },
        {
          name: "Dr. Amanda Chen",
          specialty: "Reproductive Endocrinologist",
          bio: "Specializes in PCOS and fertility treatments.",
          location: "789 Wellness Avenue, Metro",
          imageUrl: "https://randomuser.me/api/portraits/women/29.jpg",
          availability: {
            thursday: ["1:00", "2:00", "3:00"],
            friday: ["10:00", "11:00", "12:00"],
          },
          patientsCount: 950,
          experienceYears: 12,
          reviewsCount: 350,
        },
        {
          name: "Dr. Priya Patel",
          specialty: "Menstrual Health Specialist",
          bio: "Focused on adolescent and adult menstrual care.",
          location: "321 Care Blvd, District",
          imageUrl: "https://randomuser.me/api/portraits/women/10.jpg",
          availability: {
            tuesday: ["9:00", "10:00", "11:00"],
            friday: ["2:00", "3:00", "4:00"],
          },
          patientsCount: 1100,
          experienceYears: 14,
          reviewsCount: 400,
        },
        {
          name: "Dr. Laura Garcia",
          specialty: "PCOS Specialist",
          bio: "10+ years experience in managing PCOS symptoms.",
          location: "654 Hormone St, City",
          imageUrl: "https://randomuser.me/api/portraits/women/50.jpg",
          availability: {
            monday: ["12:00", "1:00", "12:00"],
            thursday: ["3:00", "4:00"],
          },
          patientsCount: 750,
          experienceYears: 10,
          reviewsCount: 250,
        },
      ];

      for (const doctor of doctorsToAdd) {
        await addDoc(collection(db, 'doctors'), doctor);
      }
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      await initializeDoctorsIfEmpty();
      const snapshot = await getDocs(collection(db, 'doctors'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Doctor[];
      setDoctors(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load doctors.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDoctorPress = (doctor: Doctor) => {
    router.push({
      pathname: '/tabs/Help/Doctorprofile',
      params: {
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.imageUrl,
      },
    });
  };

  const renderMetrics = (doctor: Doctor) => {
    return (
      <View style={styles.metricsContainer}>
        <View style={[styles.metricBox, styles.patientMetric]}>
          <Text style={styles.metricValue}>{doctor.patientsCount}+</Text>
          <Text style={styles.metricLabel}>Patients</Text>
        </View>
        <View style={[styles.metricBox, styles.experienceMetric]}>
          <Text style={styles.metricValue}>{doctor.experienceYears}+</Text>
          <Text style={styles.metricLabel}>Exp. years</Text>
        </View>
        <View style={[styles.metricBox, styles.reviewMetric]}>
          <Text style={styles.metricValue}>{doctor.reviewsCount}+</Text>
          <Text style={styles.metricLabel}>Reviews</Text>
        </View>
      </View>
    );
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => handleDoctorPress(item)}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
        style={styles.doctorImage}
      />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <Text style={styles.doctorLocation}>{item.location}</Text>
        {renderMetrics(item)}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.screenHeader}>Health Companion</Text>

          {/* Doctors Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Our Top Doctors</Text>
            </View>
            <FlatList
              data={doctors}
              renderItem={renderDoctorItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F0FF',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F0FF',
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  screenHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B3F72',
    marginBottom: 20,
    marginTop: 10,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B3F72',
  },
  listContainer: {
    paddingBottom: 8,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E6E0FF',
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3F72',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 4,
    fontWeight: '500',
  },
  doctorLocation: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metricBox: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  patientMetric: {
    backgroundColor: '#9C27B0', // Purple for patients
  },
  experienceMetric: {
    backgroundColor: '#4CAF50', // Green for experience
  },
  reviewMetric: {
    backgroundColor: '#FF9800', // Orange for reviews
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default DoctorListScreen;