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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

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
}

const DoctorProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get initial data from navigation params
  const initialDoctorData = {
    id: params.doctorId as string,
    name: params.doctorName as string,
    specialty: params.doctorSpecialty as string,
    imageUrl: params.doctorImage as string,
    bio: '',
    location: '',
    availability: {}
  };

  const getDoctorById = async (id: string): Promise<Doctor> => {
    try {
      const doctorRef = doc(db, 'doctors', id);
      const doctorSnap = await getDoc(doctorRef);
      
      if (doctorSnap.exists()) {
        return {
          ...initialDoctorData, // Use the params data first
          ...doctorSnap.data(), // Override with Firestore data
          id: doctorSnap.id
        } as Doctor;
      } else {
        // If not in Firestore, use the params data only
        return initialDoctorData;
      }
    } catch (error) {
      console.error("Error getting doctor:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const doctorData = await getDoctorById(params.doctorId as string);
        setDoctor(doctorData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load doctor profile');
        setLoading(false);
        console.error(err);
      }
    };

    fetchDoctorData();
  }, [params.doctorId]);

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

  const handleBookAppointment = () => {
    router.push({
      pathname: '/tabs/Help/Appointmentbooking',
      params: { 
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty
      }
    });
  };

  // Helper function to format availability
  const renderAvailability = () => {
    return Object.entries(doctor.availability).map(([day, times]) => (
      <View key={day} style={styles.availabilityItem}>
        <Text style={styles.availabilityDay}>{day.charAt(0).toUpperCase() + day.slice(1)}:</Text>
        <Text style={styles.availabilityTimes}>{times.join(' ')}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: doctor.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
        <Text style={styles.doctorLocation}>{doctor.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{doctor.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        {renderAvailability()}
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookAppointment}
      >
        <Text style={styles.bookButtonText}>Book an Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0FF', // Soft lavender background
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082', // Primary heading
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 18,
    color: '#50C878', // Emerald specialty
    marginBottom: 4,
  },
  doctorLocation: {
    fontSize: 16,
    color: '#4B0082', // Optional: or use a muted indigo/gray tone
  },
  section: {
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
    color: '#4B0082',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  availabilityItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  availabilityDay: {
    fontWeight: 'bold',
    width: 100,
    color: '#4B0082',
  },
  availabilityTimes: {
    flex: 1,
    color: '#50C878', // Emerald time text
  },
  bookButton: {
    backgroundColor: '#4B0082',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
  },
});


export default DoctorProfileScreen;