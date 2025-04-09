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
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AppCurrentCycle from './AppCurrentCycle';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const CycleScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkUserData = async () => {
      try {
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        setHasData(userSnap.exists() && 
                  !!userSnap.data()?.lastPeriodDate1 && 
                  !!userSnap.data()?.periodLength);
      } catch (error) {
        console.error("Error checking user data:", error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserData();
  }, [user]);

  useEffect(() => {
    if (!loading && !hasData && user) {
      router.replace("/tabs/Cycle/userperiod");
    }
  }, [loading, hasData, user, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading your cycle data...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Please login to view your cycle data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppCurrentCycle userId={user.uid} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#555',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
});

export default CycleScreen;