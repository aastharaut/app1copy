// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, Image, TextInput, TouchableOpacity } from "react-native";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../../FirebaseConfig"; // Make sure this is your firebase config path

// interface Doctor {
//   id: string;
//   name: string;
//   specialization: string;
//   location: string;
//   rating: number;
//   photoUrl: string;
//   available: boolean;
// }

// export default function DoctorList() {
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       const querySnapshot = await getDocs(collection(db, "doctors"));
//       const doctorList: Doctor[] = [];
//       querySnapshot.forEach((doc) => {
//         doctorList.push({ id: doc.id, ...doc.data() } as Doctor);
//       });
//       setDoctors(doctorList);
//     };

//     fetchDoctors();
//   }, []);

//   const filteredDoctors = doctors.filter((doctor) =>
//     doctor.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const renderDoctor = ({ item }: { item: Doctor }) => (
//     <View style={{
//       backgroundColor: "#fff",
//       padding: 15,
//       marginVertical: 8,
//       marginHorizontal: 16,
//       borderRadius: 12,
//       flexDirection: "row",
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOpacity: 0.05,
//       shadowRadius: 6,
//     }}>
//       <Image
//         source={{ uri: item.photoUrl }}
//         style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
//       />
//       <View style={{ flex: 1 }}>
//         <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
//         <Text>{item.specialization}, {item.location}</Text>
//         <Text style={{ marginTop: 4, color: "#777" }}>⭐ {item.rating}</Text>
//       </View>
//       <View style={{ alignItems: "center" }}>
//         <View
//           style={{
//             width: 10,
//             height: 10,
//             borderRadius: 5,
//             backgroundColor: item.available ? "green" : "gray",
//             marginBottom: 8,
//           }}
//         />
//         <TouchableOpacity style={{
//           backgroundColor: "#A084E8",
//           paddingVertical: 6,
//           paddingHorizontal: 12,
//           borderRadius: 10,
//         }}>
//           <Text style={{ color: "#fff" }}>Book</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
//       <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 50 }}>
//         Top OBGYN Doctors
//       </Text>
//       <TextInput
//         placeholder="Search Doctor"
//         value={search}
//         onChangeText={setSearch}
//         style={{
//           backgroundColor: "#eee",
//           margin: 16,
//           padding: 10,
//           borderRadius: 12,
//         }}
//       />
//       <FlatList
//         data={filteredDoctors}
//         renderItem={renderDoctor}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// }

// DoctorListScreen.tsx

// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   StyleSheet, 
//   TouchableOpacity, 
//   Image, 
//   ActivityIndicator 
// } from 'react-native';
// import { getDocs, collection, addDoc } from 'firebase/firestore';
// import { db } from '../../../FirebaseConfig'; // adjust to your path
// import { NavigationProp, ParamListBase } from '@react-navigation/native';
// import MedicationReminder from './MedicationTracker'; // Import the Medication Reminder component


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

// const DoctorListScreen = ({ navigation }: { navigation: NavigationProp<ParamListBase> }) => {
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const initializeDoctorsIfEmpty = async () => {
//     const snapshot = await getDocs(collection(db, 'doctors'));
//     if (snapshot.empty) {
//       const doctorsToAdd = [
//         {
//           name: "Dr. Sarah Johnson",
//           specialty: "Gynecologist",
//           bio: "Dr. Johnson has been practicing for 15 years...",
//           location: "123 Medical Center, City",
//           imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
//           availability: {
//             monday: ["9:00", "10:00", "11:00"],
//             tuesday: ["14:00", "15:00", "16:00"],
//           },
//         },
//         {
//           name: "Dr. Emily Brown",
//           specialty: "OBGYN",
//           bio: "Expert in hormonal therapy and menstrual disorders.",
//           location: "456 Women's Clinic, Town",
//           imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
//           availability: {
//             monday: ["10:00", "11:00", "12:00"],
//             wednesday: ["9:00", "10:00", "11:00"],
//           },
//         },
//         {
//           name: "Dr. Amanda Chen",
//           specialty: "Reproductive Endocrinologist",
//           bio: "Specializes in PCOS and fertility treatments.",
//           location: "789 Wellness Avenue, Metro",
//           imageUrl: "https://randomuser.me/api/portraits/women/29.jpg",
//           availability: {
//             thursday: ["1:00", "2:00", "3:00"],
//             friday: ["10:00", "11:00", "12:00"],
//           },
//         },
//         {
//           name: "Dr. Priya Patel",
//           specialty: "Menstrual Health Specialist",
//           bio: "Focused on adolescent and adult menstrual care.",
//           location: "321 Care Blvd, District",
//           imageUrl: "https://randomuser.me/api/portraits/women/10.jpg",
//           availability: {
//             tuesday: ["9:00", "10:00", "11:00"],
//             friday: ["2:00", "3:00", "4:00"],
//           },
//         },
//         {
//           name: "Dr. Laura Garcia",
//           specialty: "PCOS Specialist",
//           bio: "10+ years experience in managing PCOS symptoms.",
//           location: "654 Hormone St, City",
//           imageUrl: "https://randomuser.me/api/portraits/women/50.jpg",
//           availability: {
//             monday: ["12:00", "1:00", "12:00"],
//             thursday: ["3:00", "4:00"],
//           },
//         },
//       ];

//       for (const doctor of doctorsToAdd) {
//         await addDoc(collection(db, 'doctors'), doctor);
//       }
//     }
//   };

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       await initializeDoctorsIfEmpty();
//       const snapshot = await getDocs(collection(db, 'doctors'));
//       const data = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Doctor[];
//       setDoctors(data);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load doctors.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const renderDoctorItem = ({ item }: { item: Doctor }) => (
//     <TouchableOpacity
//       style={styles.doctorCard}
//       onPress={() => navigation.navigate('DoctorProfile', { doctorId: item.id })}
//     >
//       <Image
//         source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
//         style={styles.doctorImage}
//       />
//       <View style={styles.doctorInfo}>
//         <Text style={styles.doctorName}>{item.name}</Text>
//         <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
//         <Text style={styles.doctorLocation}>{item.location}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.centeredContainer}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centeredContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//     <Text style={styles.screenHeader}>For your help</Text>

//     {/* Doctors Section */}
//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionHeader}>Available Doctors</Text>
//       <FlatList
//         data={doctors}
//         renderItem={renderDoctorItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//     {/* Medication Reminder Section */}
//     <View style={styles.reminderContainer}>
//         <Text style={styles.sectionTitle}>Medication Reminder</Text>
//         <MedicationReminder />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F0FF',
//     padding: 16,
//   },
//   reminderContainer: {
//     flex: 1, // Takes up 1/4 of the screen
//     marginTop: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F8F8',
//   },
//   screenHeader: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#4B3F72',
//     marginBottom: 24,
//   },
//   sectionContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 12,
//   },
  
//   medicationPlaceholder: {
//     height: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderStyle: 'dashed',
//     borderRadius: 10,
//     backgroundColor: '#FAF8FF',
//   },
  
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   doctorCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   doctorImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginRight: 16,
//   },
//   doctorInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   doctorName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   doctorSpecialty: {
//     fontSize: 16,
//     color: '#FF6B6B',
//     marginBottom: 4,
//   },
//   doctorLocation: {
//     fontSize: 14,
//     color: '#888',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
// });

// export default DoctorListScreen;


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
  SafeAreaView
} from 'react-native';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { useRouter } from 'expo-router';
import MedicationReminder from './MedicationTracker';
import AppointmentSummary from './Appointmentdetails';

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
          name: "Dr. Anita Sharma",
          specialty: "Gynecologist",
          bio: "Dr. Sharma has been practicing for 15 years...",
          location: "Thapathali, Kathmandu",
          imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
          availability: {
            monday: ["9:00", "10:00", "11:00"],
            tuesday: ["2:00", "3:00", "4:00"],
            wednesday: ["9:00", "10:00", "11:00"],
            thursday: ["3:00", "4:00"],
            friday: ["10:00", "11:00", "12:00"],

          },
        },
        {
          name: "Dr. Kamala Lama",
          specialty: "OBGYN",
          bio: "Expert in hormonal therapy and menstrual disorders.",
          location: "Naxal, Kathmandu",
          imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
          availability: {
            monday: ["10:00", "11:00", "12:00"],
            tuesday: ["9:00", "10:00", "11:00"],
            wednesday: ["9:00", "10:00", "11:00"],
            thursday: ["3:00", "4:00" , "5:00"],
            friday: ["10:00", "11:00", "12:00"],

          },
        },
        {
          name: "Dr. Aisha Adhikary",
          specialty: "Reproductive Endocrinologist",
          bio: "Specializes in PCOS and fertility treatments.",
          location: "Budhanilkantha, Kathmandu",
          imageUrl: "https://randomuser.me/api/portraits/women/29.jpg",
          availability: {
            tuesday: ["9:00", "10:00", "11:00"],
            wednesday: ["9:00", "10:00", "11:00"],
            thursday: ["1:00", "2:00", "3:00"],
            friday: ["10:00", "11:00", "12:00"],
          },
        },
        {
          name: "Dr. Priya Chaudhary",
          specialty: "Menstrual Health Specialist",
          bio: "Focused on adolescent and adult menstrual care.",
          location: "Patan, Lalitpur",
          imageUrl: "https://randomuser.me/api/portraits/women/10.jpg",
          availability: {
            wednesday: ["9:00", "10:00", "11:00"],
            tuesday: ["9:00", "10:00", "11:00"],
            friday: ["2:00", "3:00", "4:00"],
          },
        },
        {
          name: "Dr. Lara Khan",
          specialty: "PCOS Specialist",
          bio: "10+ years experience in managing PCOS symptoms.",
          location: "Kaushaltar, Bhaktapur",
          imageUrl: "https://randomuser.me/api/portraits/women/50.jpg",
          availability: {
            monday: ["12:00", "1:00", "2:00"],
            tuesday: ["9:00", "10:00", "11:00"],
            wednesday: ["9:00", "10:00", "11:00"],
            thursday: ["3:00", "4:00"],
            friday: ["10:00", "11:00", "12:00"],

          },
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
        doctorImage: doctor.imageUrl
      }
    });
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
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
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
          {/* Appointment Summary Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Your Upcoming Appointments</Text>
            <AppointmentSummary />
            </View>


          {/* Medication Reminder Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Medication Reminder</Text>
            <View style={styles.reminderContent}>
              <MedicationReminder />
            </View>
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
    color: '#4B0082',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B3F72',
    textAlign: 'center', 
  },
  seeAllText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '500',
  },
  reminderContent: {
    marginTop: 8,
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
    color: '#50C878',
    marginBottom: 4,
    fontWeight: '500',
  },
  doctorLocation: {
    fontSize: 13,
    color: '#888',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default DoctorListScreen;