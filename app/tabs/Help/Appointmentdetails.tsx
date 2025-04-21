// // components/Appointmentdetails.tsx

// import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../../FirebaseConfig';
// import { useEffect, useState } from 'react';

// type Props = {
//   appointmentId: string;
// };

// export default function AppointmentSummary({ appointmentId }: Props) {
//   const [appointment, setAppointment] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAppointment = async () => {
//       try {
//         const docRef = doc(db, 'appointments', appointmentId);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           setAppointment(docSnap.data());
//         }
//       } catch (error) {
//         console.error('Error fetching appointment:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAppointment();
//   }, [appointmentId]);

//   if (loading) return <ActivityIndicator style={{ marginTop: 16 }} />;
//   if (!appointment) return null;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🩺 Your Last Appointment</Text>
//       <Text style={styles.label}>Doctor: <Text style={styles.value}>{appointment.doctorName}</Text></Text>
//       <Text style={styles.label}>Date: <Text style={styles.value}>{appointment.date}</Text></Text>
//       <Text style={styles.label}>Time: <Text style={styles.value}>{appointment.timeSlot}</Text></Text>
//       <Text style={styles.label}>Concern: <Text style={styles.value}>{appointment.concerns}</Text></Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 20,
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   value: {
//     fontWeight: '500',
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
// import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { db } from '../../../FirebaseConfig';
// import { getAuth } from 'firebase/auth';

// interface Appointment {
//   id: string;
//   doctorName: string;
//   doctorId: string;
//   doctorSpecialty: string;
//   date: string;
//   timeSlot: string;
//   concerns: string;
//   symptoms?: string;
//   userId: string;
//   status: string;
// }

// export default function AppointmentSummary() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         setLoading(true);

//         if (!currentUser) {
//           console.log('User not authenticated');
//           return;
//         }

//         const appointmentsQuery = query(
//           collection(db, 'appointments'),
//           where('userId', '==', currentUser.uid),
//           orderBy('date', 'asc')
//         );

//         const querySnapshot = await getDocs(appointmentsQuery);
//         const appointmentsData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Appointment[];

//         setAppointments(appointmentsData);
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="small" color="#6C63FF" />
//       </View>
//     );
//   }

//   if (appointments.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No appointments found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {appointments.map((appointment) => (
//         <View key={appointment.id} style={styles.appointmentCard}>
//           <Text style={styles.doctorName}>{appointment.doctorName}</Text>
//           <Text style={styles.doctorSpecialty}>{appointment.doctorSpecialty}</Text>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Date:</Text>
//             <Text style={styles.detailValue}>{appointment.date}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Time:</Text>
//             <Text style={styles.detailValue}>{appointment.timeSlot}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Concerns:</Text>
//             <Text style={styles.detailValue}>{appointment.concerns}</Text>
//           </View>

//           {appointment.symptoms ? (
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Symptoms:</Text>
//               <Text style={styles.detailValue}>{appointment.symptoms}</Text>
//             </View>
//           ) : null}
//         </View>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 10,
//   },
//   loadingContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#888',
//     marginBottom: 15,
//   },
//   bookButton: {
//     backgroundColor: '#6C63FF',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   bookButtonText: {
//     color: 'white',
//     fontWeight: '500',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   appointmentCard: {
//     backgroundColor: '#FAF8FF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#6C63FF',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   doctorName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#4B3F72',
//     marginBottom: 4,
//   },
//   doctorSpecialty: {
//     fontSize: 13,
//     color: '#50C878',
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     marginBottom: 6,
//   },
//   detailLabel: {
//     fontWeight: '500',
//     color: '#333',
//     width: 90,
//   },
//   detailValue: {
//     color: '#555',
//     flex: 1,
//     flexWrap: 'wrap',
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
// import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { db } from '../../../FirebaseConfig';
// import { getAuth } from 'firebase/auth';

// interface Appointment {
//   id: string;
//   name: string;
//   speciality: string;
//   location: string;
//   date: string;
//   timeSlot: string;
//   concerns: string;
//   symptoms?: string;
//   userId: string;
//   status: string;
// }

// export default function AppointmentDetails() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         setLoading(true);

//         if (!currentUser) {
//           console.log('User not authenticated');
//           return;
//         }

//         const appointmentsQuery = query(
//           collection(db, 'appointments'),
//           where('userId', '==', currentUser.uid),
//           orderBy('date', 'asc')
//         );

//         const querySnapshot = await getDocs(appointmentsQuery);
//         const appointmentsData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Appointment[];

//         setAppointments(appointmentsData);
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="small" color="#6C63FF" />
//       </View>
//     );
//   }

//   if (appointments.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No appointments found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {appointments.map((appointment) => (
//         <View key={appointment.id} style={styles.appointmentCard}>
//           <View style={styles.header}>
//             <Text style={styles.doctorName}>{appointment.name}</Text>
//             <View style={styles.statusBadge}>
//               <Text style={styles.statusText}>{appointment.status}</Text>
//             </View>
//           </View>

//           <Text style={styles.doctorSpecialty}>{appointment.speciality}</Text>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Date:</Text>
//             <Text style={styles.detailValue}>{appointment.date}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Time:</Text>
//             <Text style={styles.detailValue}>{appointment.timeSlot}</Text>
//           </View>

//           <View style={styles.detailSection}>
//             <Text style={styles.sectionTitle}>Your Concerns</Text>
//             <Text style={styles.sectionContent}>{appointment.concerns}</Text>
//           </View>

//           {appointment.symptoms && (
//             <View style={styles.detailSection}>
//               <Text style={styles.sectionTitle}>Symptoms</Text>
//               <Text style={styles.sectionContent}>{appointment.symptoms}</Text>
//             </View>
//           )}
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   loadingContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#888',
//     marginBottom: 15,
//   },
//   appointmentCard: {
//     backgroundColor: '#FAF8FF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#6C63FF',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   statusBadge: {
//     backgroundColor: '#E4E4FF',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#6C63FF',
//   },
//   doctorName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#4B3F72',
//   },
//   doctorSpecialty: {
//     fontSize: 13,
//     color: '#50C878',
//     marginTop: 4,
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     marginBottom: 6,
//   },
//   detailLabel: {
//     fontWeight: '500',
//     color: '#333',
//     width: 90,
//   },
//   detailValue: {
//     color: '#555',
//     flex: 1,
//     flexWrap: 'wrap',
//   },
//   detailSection: {
//     marginTop: 12,
//   },
//   sectionTitle: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 4,
//   },
//   sectionContent: {
//     color: '#555',
//     lineHeight: 20,
//   },
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet, ScrollView, RefreshControl } from 'react-native';
// import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
// import { db } from '../../../FirebaseConfig';
// import { getAuth } from 'firebase/auth';

// // Define types
// interface Doctor {
//   id: string;
//   name: string;
//   speciality?: string;
//   location?: string;
// }

// interface AppointmentData {
//   id: string;
//   doctorId: string;
//   date: string;
//   timeSlot: string;
//   concerns: string;
//   visitPrep?: {
//     symptoms: string[];
//     questions: string;
//   };
//   userId: string;
//   status: string;
// }

// // Combined data for display
// interface DisplayAppointment {
//   id: string;
//   doctorName: string;
//   location: string;
//   date: string;
//   timeSlot: string;
//   concerns: string;
//   symptoms: string;
//   questions: string;
//   status: string;
// }

// export default function AppointmentDetails() {
//   const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   // Function to get doctor information
//   const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
//     try {
//       const docRef = doc(db, 'doctors', doctorId);
//       const docSnap = await getDoc(docRef);
      
//       if (docSnap.exists()) {
//         return { id: docSnap.id, ...docSnap.data() } as Doctor;
//       } else {
//         console.warn(`Doctor with ID ${doctorId} not found`);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error getting doctor:", error);
//       return null;
//     }
//   };

//   const fetchAppointments = async () => {
//     try {
//       if (!currentUser) {
//         console.log('User not authenticated');
//         return;
//       }

//       // Query appointments for the current user
//       const appointmentsQuery = query(
//         collection(db, 'appointments'),
//         where('userId', '==', currentUser.uid),
//         orderBy('date', 'asc')
//       );

//       const querySnapshot = await getDocs(appointmentsQuery);
//       console.log(`Found ${querySnapshot.size} appointments`);
      
//       // Transform raw appointment data
//       const processedAppointments = await Promise.all(
//         querySnapshot.docs.map(async (doc) => {
//           const appointmentData = { id: doc.id, ...doc.data() } as AppointmentData;
          
//           // Fetch doctor information
//           const doctor = await getDoctorById(appointmentData.doctorId);
          
//           // Format symptoms and questions
//           let symptomsString = '';
//           let questionsString = '';
          
//           if (appointmentData.visitPrep) {
//             if (appointmentData.visitPrep.symptoms) {
//               symptomsString = appointmentData.visitPrep.symptoms.join(', ');
//             }
//             questionsString = appointmentData.visitPrep.questions || '';
//           }
          
//           return {
//             id: appointmentData.id,
//             doctorName: doctor?.name || 'Unknown Doctor',
//             location: 
//             date: appointmentData.date,
//             timeSlot: appointmentData.timeSlot,
//             concerns: appointmentData.concerns,
//             symptoms: symptomsString,
//             questions: questionsString,
//             status: appointmentData.status
//           };
//         })
//       );
      
//       setAppointments(processedAppointments);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchAppointments();
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       await fetchAppointments();
//       setLoading(false);
//     };

//     loadData();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//         <Text style={styles.loadingText}>Loading your appointments...</Text>
//       </View>
//     );
//   }

//   if (appointments.length === 0) {
//     return (
//       <ScrollView 
//         contentContainerStyle={styles.emptyContainer}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <Text style={styles.emptyText}>No appointments found</Text>
//         <Text style={styles.emptySubtext}>Pull down to refresh</Text>
//       </ScrollView>
//     );
//   }

//   return (
//     <ScrollView 
//       contentContainerStyle={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <Text style={styles.pageTitle}>Your Appointments</Text>
      
//       {appointments.map((appointment) => (
//         <View key={appointment.id} style={styles.appointmentCard}>
//           <View style={styles.header}>
//             <Text style={styles.doctorName}>{appointment.doctorName}</Text>
//             <View style={styles.statusBadge}>
//               <Text style={styles.statusText}>{appointment.status}</Text>
//             </View>
//           </View>

//           {appointment.location && (
//             <Text style={styles.doctorSpecialty}>{appointment.location}</Text>
//           )}

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Date:</Text>
//             <Text style={styles.detailValue}>{appointment.date}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Time:</Text>
//             <Text style={styles.detailValue}>{appointment.timeSlot}</Text>
//           </View>

//           <View style={styles.detailSection}>
//             <Text style={styles.sectionTitle}>Your Concerns</Text>
//             <Text style={styles.sectionContent}>{appointment.concerns}</Text>
//           </View>

//           {appointment.symptoms && (
//             <View style={styles.detailSection}>
//               <Text style={styles.sectionTitle}>Symptoms</Text>
//               <Text style={styles.sectionContent}>{appointment.symptoms}</Text>
//             </View>
//           )}
          
//           {appointment.questions && (
//             <View style={styles.detailSection}>
//               <Text style={styles.sectionTitle}>Questions</Text>
//               <Text style={styles.sectionContent}>{appointment.questions}</Text>
//             </View>
//           )}
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#666',
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//   },
//   pageTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#4B3F72',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   appointmentCard: {
//     backgroundColor: '#FAF8FF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#6C63FF',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   statusBadge: {
//     backgroundColor: '#E4E4FF',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#6C63FF',
//   },
//   doctorName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#4B3F72',
//   },
//   doctorSpecialty: {
//     fontSize: 13,
//     color: '#50C878',
//     marginTop: 4,
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     marginBottom: 6,
//   },
//   detailLabel: {
//     fontWeight: '500',
//     color: '#333',
//     width: 90,
//   },
//   detailValue: {
//     color: '#555',
//     flex: 1,
//     flexWrap: 'wrap',
//   },
//   detailSection: {
//     marginTop: 12,
//   },
//   sectionTitle: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 4,
//   },
//   sectionContent: {
//     color: '#555',
//     lineHeight: 20,
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { getAuth } from 'firebase/auth';

// Define types
interface Doctor {
  id: string;
  name: string;
  speciality?: string;
  location?: string;
}

interface AppointmentData {
  id: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  concerns: string;
  visitPrep?: {
    symptoms: string[];
    questions: string;
  };
  userId: string;
  status: string;
}

// Combined data for display
interface DisplayAppointment {
  id: string;
  doctorName: string;
  location: string;
  speciality?: string;
  date: string;
  timeSlot: string;
  concerns: string;
  symptoms: string;
  questions: string;
  status: string;
  dateTime: Date;
}

export default function AppointmentDetails() {
  const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Function to get doctor information
  const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
    try {
      const docRef = doc(db, 'doctors', doctorId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Doctor;
      } else {
        console.warn(`Doctor with ID ${doctorId} not found`);
        return null;
      }
    } catch (error) {
      console.error("Error getting doctor:", error);
      return null;
    }
  };

  const parseDateTime = (dateStr: string, timeSlot: string): Date => {
    // Assuming date is in format YYYY-MM-DD and timeSlot is like "HH:MM AM/PM"
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hours24 = hours;
    if (period === 'PM' && hours < 12) hours24 += 12;
    if (period === 'AM' && hours === 12) hours24 = 0;
    
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, hours24, minutes);
  };

  const fetchAppointments = async () => {
    try {
      if (!currentUser) {
        console.log('User not authenticated');
        return;
      }

      // Query appointments for the current user
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('userId', '==', currentUser.uid),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(appointmentsQuery);
      console.log(`Found ${querySnapshot.size} appointments`);
      
      // Transform raw appointment data
      const processedAppointments = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const appointmentData = { id: doc.id, ...doc.data() } as AppointmentData;
          
          // Fetch doctor information
          const doctor = await getDoctorById(appointmentData.doctorId);
          
          // Format symptoms and questions
          let symptomsString = '';
          let questionsString = '';
          
          if (appointmentData.visitPrep) {
            if (appointmentData.visitPrep.symptoms) {
              symptomsString = appointmentData.visitPrep.symptoms.join(', ');
            }
            questionsString = appointmentData.visitPrep.questions || '';
          }

          // Parse date and time to create a Date object
          const dateTime = parseDateTime(appointmentData.date, appointmentData.timeSlot);
          
          return {
            id: appointmentData.id,
            doctorName: doctor?.name || 'Unknown Doctor',
            location: doctor?.location || 'Location not specified',
            speciality: doctor?.speciality,
            date: appointmentData.date,
            timeSlot: appointmentData.timeSlot,
            concerns: appointmentData.concerns,
            symptoms: symptomsString,
            questions: questionsString,
            status: appointmentData.status,
            dateTime: dateTime
          };
        })
      );

      // Filter out past appointments and sort by date
      const now = new Date();
      const futureAppointments = processedAppointments
        .filter(appt => appt.dateTime >= now)
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
      
      setAppointments(futureAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAppointments();
      setLoading(false);
    };

    loadData();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading your appointments...</Text>
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <ScrollView 
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.emptyText}>No upcoming appointments found</Text>
        <Text style={styles.emptySubtext}>Pull down to refresh</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* <Text style={styles.pageTitle}>Your Upcoming Appointments</Text> */}
      
      {appointments.map((appointment) => (
        <View key={appointment.id} style={styles.appointmentCard}>
          <View style={styles.header}>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{appointment.status}</Text>
            </View>
          </View>

          {appointment.speciality && (
            <Text style={styles.doctorSpecialty}>{appointment.speciality}</Text>
          )}

          {appointment.location && (
            <Text style={styles.locationText}>{appointment.location}</Text>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{appointment.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{appointment.timeSlot}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Your Concerns</Text>
            <Text style={styles.sectionContent}>{appointment.concerns}</Text>
          </View>

          {appointment.symptoms && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Symptoms</Text>
              <Text style={styles.sectionContent}>{appointment.symptoms}</Text>
            </View>
          )}
          
          {appointment.questions && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Questions</Text>
              <Text style={styles.sectionContent}>{appointment.questions}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B3F72',
    marginBottom: 16,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: '#FAF8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#E4E4FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6C63FF',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3F72',
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#50C878',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#333',
    width: 90,
  },
  detailValue: {
    color: '#555',
    flex: 1,
    flexWrap: 'wrap',
  },
  detailSection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  sectionContent: {
    color: '#555',
    lineHeight: 20,
  },
});