// import React from "react";
// import { View } from "react-native";
// import AppCurrentCycle from "../tabs/AppCurrentCycle"; // Path is correct

// const CycleScreen = () => {
//   return (
//     <View style={{ flex: 1 }}>
//       <AppCurrentCycle />
//     </View>
//   );
// };

// export default CycleScreen;

// import React from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import AppCurrentCycle from '../tabs/AppCurrentCycle';
// import { useAuth } from '../context/AuthContext';

// const CycleScreen = () => {
//   const { user } = useAuth();
//   console.log(user,"users")
//   // if (!user) {
//   //   return (
//   //      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//   //        <ActivityIndicator size="large" color="#6C63FF" />
//   //      </View>
//   //   );
//   // }

//   return (
//     <View style={{ flex: 1 }}>
//       <AppCurrentCycle userId={user?.uid}  />
//     </View>
//   );
// };

// export default CycleScreen;

// import React from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import AppCurrentCycle from '../tabs/AppCurrentCycle';
// import { useAuth } from '../context/AuthContext';

// const CycleScreen = () => {
//   const { user } = useAuth(); // ✅ This line fixes the error

//   if (!user) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <AppCurrentCycle userId={user.uid} /> {/* ✅ Now this works */}
//     </View>
//   );
// };

// export default CycleScreen;


// import React, { useState, useEffect } from 'react';
// import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
// import AppCurrentCycle from '../tabs/AppCurrentCycle';
// import { useAuth } from '../context/AuthContext';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { useRouter } from 'expo-router';

// const CycleScreen = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [hasData, setHasData] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Check if user has period data
//   useEffect(() => {
//     const checkUserData = async () => {
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const db = getFirestore();
//         const userRef = doc(db, "users", user.uid);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           const userData = userSnap.data();
//           // Check if user has period data
//           if (userData.lastPeriodDate1 && userData.periodLength) {
//             setHasData(true);
//           } else {
//             setHasData(false);
//           }
//         } else {
//           setHasData(false);
//         }
//       } catch (error) {
//         console.error("Error checking user data:", error);
//         setHasData(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUserData();
//   }, [user]);

//   // Redirect to UserPeriodScreen if no data
//   useEffect(() => {
//     if (!loading && !hasData && user) {
//       // Navigate to UserPeriodScreen to collect initial data
//       router.replace("/tabs/userperiod");
//     }
//   }, [loading, hasData, user, router]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FF6B6B" />
//         <Text style={styles.loadingText}>Loading your cycle data...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.messageContainer}>
//         <Text style={styles.messageText}>Please login to view your cycle data</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <AppCurrentCycle userId={user.uid} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#121212',
//   },
//   loadingText: {
//     color: '#fff',
//     marginTop: 10,
//     fontSize: 16,
//   },
//   messageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#121212',
//     padding: 20,
//   },
//   messageText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//   }
// });

// export default CycleScreen;
// import React, { useState, useEffect } from 'react';
// import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
// import AppCurrentCycle from './AppCurrentCycle';
// import { useAuth } from '../../context/AuthContext';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { useRouter } from 'expo-router';

// const CycleScreen = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [hasData, setHasData] = useState(false);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     console.log("User:", user);  // Check if user is available
//     if (!user) {
//       setLoading(false);
//       return;
//     }
  
//     const checkUserData = async () => {
//       try {
//         const db = getFirestore();
//         const userRef = doc(db, "users", user.uid);
//         const userSnap = await getDoc(userRef);
  
//         setHasData(userSnap.exists() && 
//                   !!userSnap.data()?.lastPeriodDate1 && 
//                   !!userSnap.data()?.periodLength);
//       } catch (error) {
//         console.error("Error checking user data:", error);
//         setHasData(false);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     checkUserData();
//   }, [user]);
  

//   useEffect(() => {
//     if (!loading && !hasData && user) {
//       router.replace("/tabs/Cycle/userperiod");
//     }
//   }, [loading, hasData, user, router]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FF6B6B" />
//         <Text style={styles.loadingText}>Loading your cycle data...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.messageContainer}>
//         <Text style={styles.messageText}>Please login to view your cycle data</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <AppCurrentCycle userId={user.uid} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 20,
//     color: '#555',
//   },
//   messageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   messageText: {
//     fontSize: 18,
//     color: '#555',
//     textAlign: 'center',
//   },
// });

// export default CycleScreen;
// import React, { useState, useEffect } from 'react';
// import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
// import { useAuth } from '../../context/AuthContext';  // Make sure this is the right import path for your auth context
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { useRouter } from 'expo-router';
// import AppCurrentCycle from './AppCurrentCycle';

// const CycleScreen = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [hasData, setHasData] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("User from useAuth:", user);  // Add this line
//     if (!user) {
//       setLoading(false);
//       return;
//     }

//     const checkUserData = async () => {
//       try {
//         const db = getFirestore();
//         const userRef = doc(db, "users", user.uid);
//         const userSnap = await getDoc(userRef);

//         // Check if user data exists and contains cycle-related fields
//         if (userSnap.exists()) {
//           const userData = userSnap.data();
//           const { lastPeriodDate1, lastPeriodDate2, periodLength } = userData;

//           // If relevant data exists, set the state accordingly
//           if (lastPeriodDate1 && lastPeriodDate2 && periodLength) {
//             setHasData(true);
//           } else {
//             setHasData(false);  // User data exists but lacks cycle-related information
//           }
//         } else {
//           setHasData(false);  // No data for the user in the database
//         }
//       } catch (error) {
//         console.error("Error checking user data:", error);
//         setHasData(false);  // If error occurs, assume no data
//       } finally {
//         setLoading(false);  // Stop loading after the process is complete
//       }
//     };

//     checkUserData();
//   }, [user]);

//   // Handle redirection if the data is not found or if the user is not logged in
//   useEffect(() => {
//     if (!loading && !hasData && user) {
//       router.replace("/tabs/Cycle/userperiod"); // Navigate to user period screen if data is missing
//     }
//   }, [loading, hasData, user, router]);

//   // Show loading indicator while fetching data
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#5D1A9D" />
//         <Text style={styles.loadingText}>Loading cycle info...</Text>
//       </View>
//     );
//   }

//   // Show message if the user isn't logged in
//   if (!user) {
//     return (
//       <View style={styles.messageContainer}>
//         <Text>Please login to view your cycle data</Text>
//       </View>
//     );
//   }

//   // Show the cycle data if available, otherwise inform the user to input their data
//   return (
//     <View style={styles.container}>
//       {hasData ? (
//         <AppCurrentCycle userId={user.uid} />  // Show cycle data if user has data
//       ) : (
//         <View style={styles.messageContainer}>
//           <Text>No period data found. Please enter your data.</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 18,
//     color: '#5D1A9D',
//   },
//   messageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
// });

// export default CycleScreen;
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';import AppCurrentCycle from './AppCurrentCycle';
import { auth } from '../../../FirebaseConfig'; // Adjust path as needed

const CycleScreen = () => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please sign in to view your cycle</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppCurrentCycle userId={userId} />
    </View>
  );
};


export default CycleScreen;