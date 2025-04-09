// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// const screenWidth = Dimensions.get('window').width;
// const circleSize = screenWidth * 0.8;
// const circleRadius = circleSize / 2;

// const AppCurrentCycle = () => {
//   const [currentDay, setCurrentDay] = useState(14);
  
//   const cycleData = {
//     cycleLength: 28,
//     periodLength: 5,
//     ovulationDay: 14,
//     nextPeriodIn: 28 - currentDay,
//     periodDays: [1, 2, 3, 4, 5],
//     fertileDays: [10, 11, 12, 13, 14, 15, 16],
//     ovulationDays: [13, 14, 15],
//   };

//   const calculatePosition = (day: number, totalDays: number, radius: number) => {
//     const angle = ((day - 1) / totalDays) * 2 * Math.PI - Math.PI / 2;
//     const x = radius * Math.cos(angle);
//     const y = radius * Math.sin(angle);
//     return { x: x + circleRadius, y: y + circleRadius };
//   };

//   const getPhaseColor = (day: number) => {
//     if (cycleData.periodDays.includes(day)) return '#8B5CF6'; // Purple
//     if (cycleData.ovulationDays.includes(day)) return '#F472B6'; // Pink
//     if (cycleData.fertileDays.includes(day)) return '#A78BFA'; // Light Purple
//     return '#CBD5E1'; // Gray
//   };

//   const generateDayMarkers = () => {
//     const markers = [];
//     const radius = circleRadius - 20;
//     for (let day = 1; day <= cycleData.cycleLength; day++) {
//       const pos = calculatePosition(day, cycleData.cycleLength, radius);
//       const isCurrentDay = day === currentDay;
//       markers.push(
//         <View 
//           key={day}
//           style={[styles.dayMarker, {
//             left: pos.x - 8, top: pos.y - 8,
//             backgroundColor: getPhaseColor(day),
//             borderWidth: isCurrentDay ? 2 : 0,
//           }]}
//         >
//           {isCurrentDay && <Text style={styles.currentDayText}>{day}</Text>}
//         </View>
//       );
//     }
//     return markers;
//   };

//   const getCurrentPhaseName = () => {
//     if (currentDay <= cycleData.periodLength) return 'Period';
//     if (cycleData.ovulationDays.includes(currentDay)) return 'Ovulation';
//     if (cycleData.fertileDays.includes(currentDay)) return 'Fertile Window';
//     return currentDay < cycleData.ovulationDay ? 'Follicular Phase' : 'Luteal Phase';
//   };

//   const handleNextDay = () => {
//     setCurrentDay((prev) => (prev < cycleData.cycleLength ? prev + 1 : 1));
//   };
  
//   const handlePrevDay = () => {
//     setCurrentDay((prev) => (prev > 1 ? prev - 1 : cycleData.cycleLength));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Current Cycle</Text>
//       <Text style={styles.subtitle}>Day {currentDay} of {cycleData.cycleLength}</Text>
//       <View style={styles.cycleContainer}>
//         <View style={styles.circleBackground} />
//         {generateDayMarkers()}
//         <View style={styles.centerText}>
//           <Text style={styles.phaseName}>{getCurrentPhaseName()}</Text>
//           <Text style={styles.periodIn}>Period in {cycleData.nextPeriodIn} days</Text>
//         </View>
//       </View>
//       <View style={styles.navigationButtons}>
//         <TouchableOpacity onPress={handlePrevDay} style={styles.navButton}><Text style={styles.navText}>◀</Text></TouchableOpacity>
//         <TouchableOpacity onPress={handleNextDay} style={styles.navButton}><Text style={styles.navText}>▶</Text></TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F3E8FF', alignItems: 'center', padding: 16 },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#6D28D9' },
//   subtitle: { fontSize: 14, color: '#7C3AED', marginBottom: 16 },
//   cycleContainer: { width: circleSize, height: circleSize, marginVertical: 24, position: 'relative' },
//   circleBackground: { position: 'absolute', width: circleSize, height: circleSize, borderRadius: circleRadius, borderWidth: 2, borderColor: '#E9D5FF' },
//   dayMarker: { position: 'absolute', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderColor: '#FFFFFF' },
//   currentDayText: { fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' },
//   centerText: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
//   phaseName: { fontSize: 18, fontWeight: '600', color: '#6D28D9' },
//   periodIn: { fontSize: 14, color: '#7C3AED', marginTop: 4 },
//   navigationButtons: { flexDirection: 'row', marginTop: 16 },
//   navButton: { backgroundColor: '#D8B4FE', padding: 10, margin: 8, borderRadius: 8 },
//   navText: { fontSize: 18, fontWeight: 'bold', color: '#6D28D9' }
// });

// export default AppCurrentCycle;

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import { useRouter } from 'expo-router';

// type CycleData = {
//   cycleLength: number;
//   periodLength: number;
//   ovulationDay: number;
//   nextPeriodIn: number;
//   periodDays: number[];
//   fertileDays: number[];
//   ovulationDays: number[];
// };

// type Position = {
//   x: number;
//   y: number;
// };

// const screenWidth = Dimensions.get('window').width;
// const circleSize = screenWidth * 0.8;
// const circleRadius = circleSize / 2;

// const AppCurrentCycle = () => {
//   const router = useRouter();
//   const [currentDay, setCurrentDay] = useState<number>(1);

//   // Automatically update the current day based on the date
//   useEffect(() => {
//     const startDate = new Date(); // Replace this with the actual start date of the cycle
//     const today = new Date();
//     const diffInDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
//     const dayInCycle = (diffInDays % 28) + 1; // Assuming a 28-day cycle
//     setCurrentDay(dayInCycle);
//   }, []);

//   const onClick = () => {
//     router.push('/tabs/SymtompTrackerScreen');
//   };

//   const cycleData: CycleData = {
//     cycleLength: 28,
//     periodLength: 5,
//     ovulationDay: 14,
//     nextPeriodIn: 28 - currentDay,
//     periodDays: [1, 2, 3, 4, 5],
//     fertileDays: [10, 11, 12, 13, 14, 15, 16],
//     ovulationDays: [13, 14, 15],
//   };

//   const calculatePosition = (day: number, totalDays: number, radius: number): Position => {
//     const angle = ((day - 1) / totalDays) * 2 * Math.PI - Math.PI / 2;
//     const x = radius * Math.cos(angle);
//     const y = radius * Math.sin(angle);
//     return { x: x + circleRadius, y: y + circleRadius };
//   };

//   const getPhaseColor = (day: number): string => {
//     if (cycleData.periodDays.includes(day)) return '#8B5CF6'; // Purple
//     if (cycleData.ovulationDays.includes(day)) return '#F472B6'; // Pink
//     if (cycleData.fertileDays.includes(day)) return '#A78BFA'; // Light Purple
//     return '#CBD5E1'; // Gray
//   };

//   const generateDayMarkers = () => {
//     const markers = [];
//     const radius = circleRadius - 20;
//     for (let day = 1; day <= cycleData.cycleLength; day++) {
//       const pos = calculatePosition(day, cycleData.cycleLength, radius);
//       const isCurrentDay = day === currentDay;
//       markers.push(
//         <View 
//           key={day}
//           style={[styles.dayMarker, {
//             left: pos.x - 8, top: pos.y - 8,
//             backgroundColor: getPhaseColor(day),
//             borderWidth: isCurrentDay ? 2 : 0,
//           }]}
//           accessibilityLabel={`Day ${day}, ${getCurrentPhaseName()}`}
//         >
//           {isCurrentDay && <Text style={styles.currentDayText}>{day}</Text>}
//         </View>
//       );
//     }
//     return markers;
//   };

//   const getCurrentPhaseName = (): string => {
//     if (currentDay <= cycleData.periodLength) return 'Period';
//     if (cycleData.ovulationDays.includes(currentDay)) return 'Ovulation';
//     if (cycleData.fertileDays.includes(currentDay)) return 'Fertile Window';
//     return currentDay < cycleData.ovulationDay ? 'Follicular Phase' : 'Luteal Phase';
//   };

//   const getTodayDescription = (): string => {
//     if (currentDay <= cycleData.periodLength) {
//       return "Your period is expected to last for a few more days.";
//     } else if (cycleData.ovulationDays.includes(currentDay)) {
//       return "You may be ovulating today. This is when an egg is released.";
//     } else if (cycleData.fertileDays.includes(currentDay)) {
//       return "You're in your fertile window. Chances of pregnancy are higher.";
//     } else if (currentDay < cycleData.fertileDays[0]) {
//       return "You're in your follicular phase. Your body is preparing to release an egg.";
//     } else {
//       return "You're in your luteal phase. Your body is preparing for your next period.";
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Current Cycle</Text>
//       <Text style={styles.subtitle}>Day {currentDay} of {cycleData.cycleLength}</Text>
//       <View style={styles.cycleContainer}>
//         <View style={styles.circleBackground} />
//         {generateDayMarkers()}
//         <View style={styles.centerText}>
//           <Text style={styles.phaseName}>{getCurrentPhaseName()}</Text>
//           <Text style={styles.periodIn}>Period in {cycleData.nextPeriodIn} days</Text>
//         </View>
//       </View>
//       {/* Daily Log Button */}
//       <TouchableOpacity 
//         style={styles.dailyLogButton} 
//         onPress={onClick}
//         accessibilityLabel="Go to Daily Log"
//       >
//         <Text style={styles.dailyLogText}>Daily Log</Text>
//       </TouchableOpacity>
//       {/* Today's Summary Section */}
//       <View style={styles.summaryContainer}>
//         <Text style={styles.summaryTitle}>Today</Text>
//         <Text style={styles.summaryText}>{getTodayDescription()}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F3E8FF', alignItems: 'center', padding: 16 },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#6D28D9' },
//   subtitle: { fontSize: 14, color: '#7C3AED', marginBottom: 16 },
//   cycleContainer: { width: circleSize, height: circleSize, marginVertical: 24, position: 'relative' },
//   circleBackground: { position: 'absolute', width: circleSize, height: circleSize, borderRadius: circleRadius, borderWidth: 2, borderColor: '#E9D5FF' },
//   dayMarker: { position: 'absolute', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderColor: '#FFFFFF' },
//   currentDayText: { fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' },
//   centerText: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
//   phaseName: { fontSize: 18, fontWeight: '600', color: '#6D28D9' },
//   periodIn: { fontSize: 14, color: '#7C3AED', marginTop: 4 },
//   dailyLogButton: { marginTop: 20, backgroundColor: '#8B5CF6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
//   dailyLogText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
//   summaryContainer: { marginTop: 20, padding: 16, backgroundColor: '#EDE9FE', borderRadius: 8, width: '100%' },
//   summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#6D28D9', marginBottom: 8 },
//   summaryText: { fontSize: 14, color: '#7C3AED' },
// });

// export default AppCurrentCycle;

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Easing, ActivityIndicator } from 'react-native';
// import { Flame } from 'lucide-react-native';
// import { getCurrentCycle, calculateStreak, Cycle } from '../../api/cycles';

// interface CycleTrackerProps {
//   userId: string;
// }

// const screenWidth = Dimensions.get('window').width;
// const circleSize = screenWidth * 0.8;
// const circleRadius = circleSize / 2;

// const AppCurrentCycle = ({ userId }: CycleTrackerProps) => {
//   const [cycle, setCycle] = useState<Cycle | null>(null);
//   const [currentDay, setCurrentDay] = useState(1);
//   const [streak, setStreak] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const pulseAnim = new Animated.Value(1);

//   useEffect(() => {
//     const pulseAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.3,
//           duration: 1000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         })
//       ])
//     );
//     pulseAnimation.start();

//     return () => pulseAnimation.reset();
//   }, []);

//   useEffect(() => {
//     const fetchCycleData = async () => {
//       try {
//         const cycleData = await getCurrentCycle(userId);
//         if (cycleData) {
//           setCycle(cycleData);
//           setStreak(calculateStreak(cycleData.trackedDays ?? []));
    
//           const today = new Date();
//           const startDate = new Date(cycleData.startDate);
//           const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
//           setCurrentDay((diffDays % cycleData.cycleLength) + 1);
//         }
//       } catch (error) {
//         console.error('Error loading cycle data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    

//     fetchCycleData();
//   }, [userId]);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />;
//   }

//   if (!cycle) {
//     return <Text style={styles.noCycleText}>No active cycle found</Text>;
//   }

//   const renderDayMarkers = () => {
//     const ovulationDay = cycle.ovulationDay || Math.floor(cycle.cycleLength / 2);
//     const periodDays = Array.from({ length: cycle.periodLength }, (_, i) => i + 1);
//     const fertileDays = Array.from({ length: 7 }, (_, i) => ovulationDay - 3 + i);
//     const ovulationDays = [ovulationDay - 1, ovulationDay, ovulationDay + 1];

//     return Array.from({ length: cycle.cycleLength }).map((_, day) => {
//       const dayNum = day + 1;
//       const angle = (day / cycle.cycleLength) * 2 * Math.PI - Math.PI / 2;
//       const x = circleRadius * 0.8 * Math.cos(angle) + circleRadius - 10;
//       const y = circleRadius * 0.8 * Math.sin(angle) + circleRadius - 10;

//       const isCurrentDay = dayNum === currentDay;
//       const isPeriod = periodDays.includes(dayNum);
//       const isOvulation = ovulationDays.includes(dayNum);
//       const isFertile = fertileDays.includes(dayNum);

//       return (
//         <Animated.View
//           key={day}
//           style={[
//             styles.dayMarker,
//             {
//               left: x,
//               top: y,
//               backgroundColor: isPeriod ? '#8B5CF6' : 
//                             isOvulation ? '#F472B6' : 
//                             isFertile ? '#A78BFA' : '#CBD5E1',
//               transform: isCurrentDay ? [{ scale: pulseAnim }] : [],
//               zIndex: isCurrentDay ? 1 : 0
//             }
//           ]}
//         >
//           {isCurrentDay && (
//             <View style={styles.currentDayRing}>
//               <Text style={styles.currentDayText}>{dayNum}</Text>
//             </View>
//           )}
//         </Animated.View>
//       );
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Day {currentDay} of {cycle.cycleLength}</Text>
      
//       <View style={styles.circleContainer}>
//         {renderDayMarkers()}
//       </View>

//       <TouchableOpacity style={styles.dailyLogButton}>
//         <Text style={styles.buttonText}>Daily Log</Text>
//         {streak > 0 && (
//           <View style={styles.streakBadge}>
//             <Flame color={streak > 3 ? "orange" : "gray"} size={16} />
//             <Text style={styles.streakText}>{streak}</Text>
//           </View>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F3E8FF'
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center'
//   },
//   noCycleText: {
//     flex: 1,
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: '#6D28D9'
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#6D28D9',
//     marginBottom: 10
//   },
//   circleContainer: {
//     width: circleSize,
//     height: circleSize,
//     marginVertical: 20,
//     position: 'relative'
//   },
//   dayMarker: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   currentDayRing: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255,255,255,0.3)'
//   },
//   currentDayText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 10
//   },
//   dailyLogButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#6D28D9',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   streakBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 8,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10
//   },
//   streakText: {
//     color: 'white',
//     marginLeft: 4,
//     fontWeight: 'bold'
//   }
// });

// export default AppCurrentCycle;



// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Animated,
//   Easing,
//   ActivityIndicator,
//   Alert,
//   ScrollView, // Import ScrollView
// } from 'react-native';
// import { Flame } from 'lucide-react-native';
// import { getCurrentCycle, calculateStreak, Cycle, trackDay, startNewCycle } from '../../api/cycles';

// interface CycleTrackerProps {
//   userId: string;
// }

// const screenWidth = Dimensions.get('window').width;
// const circleSize = screenWidth * 0.8;
// const circleRadius = circleSize / 2;

// const AppCurrentCycle = ({ userId }: CycleTrackerProps) => {
//   const [cycle, setCycle] = useState<Cycle | null>(null);
//   const [currentDay, setCurrentDay] = useState(1);
//   const [streak, setStreak] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   // Use useRef for the animated value
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Setup pulse animation
//   useEffect(() => {
//     const pulseAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.3,
//           duration: 1000,
//           easing: Easing.ease,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.ease,
//           useNativeDriver: true,
//         }),
//       ]),
//     );

//     pulseAnimation.start();

//     return () => {
//       pulseAnimation.stop();
//     };
//   }, [pulseAnim]);

//   // Fetch cycle data
//   const fetchCycleData = async () => {
//     if (!userId) {
//       setError('User ID is required');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       // Get current cycle from local storage (or create default)
//       const cycleData = await getCurrentCycle(userId);

//       if (!cycleData) {
//         setCycle(null);
//         setLoading(false);
//         return;
//       }

//       setCycle(cycleData);

//       // Calculate streak
//       const trackedDaysArray = cycleData.trackedDays || [];
//       setStreak(calculateStreak(trackedDaysArray));

//       // Calculate current day
//       const today = new Date();
//       const startDate = new Date(cycleData.startDate);
//       const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

//       // Make sure day is within cycle length and at least 1
//       const calculatedDay = (diffDays % cycleData.cycleLength) + 1;
//       setCurrentDay(Math.max(1, calculatedDay));
//     } catch (error) {
//       console.error('Error loading cycle data:', error);
//       setError('Failed to load cycle data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load data on component mount
//   useEffect(() => {
//     fetchCycleData();
//   }, [userId]);

//   // Handle daily log button press
//   const handleDailyLog = async () => {
//     if (!cycle) return;

//     try {
//       const updatedCycle = await trackDay(userId, currentDay);
//       if (updatedCycle) {
//         setCycle(updatedCycle);
//         setStreak(calculateStreak(updatedCycle.trackedDays || []));
//         Alert.alert('Success', 'Today has been logged!');
//       }
//     } catch (error) {
//       console.error('Error logging day:', error);
//       Alert.alert('Error', 'Could not log today. Please try again.');
//     }
//   };

//   // Handle new cycle button press
//   const handleStartNewCycle = async () => {
//     try {
//       // You could add a form to get these values from the user
//       const newCycle = await startNewCycle(userId);
//       if (newCycle) {
//         setCycle(newCycle);
//         setCurrentDay(1);
//         setStreak(1); // Starting with day 1 tracked
//         Alert.alert('Success', 'New cycle started!');
//       }
//     } catch (error) {
//       console.error('Error starting new cycle:', error);
//       Alert.alert('Error', 'Could not start new cycle. Please try again.');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centeredContainer}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//         <Text style={styles.loadingText}>Loading your cycle data...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <ScrollView contentContainerStyle={styles.centeredContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.button} onPress={fetchCycleData}>
//           <Text style={styles.buttonText}>Retry</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     );
//   }

//   if (!cycle) {
//     return (
//       <ScrollView contentContainerStyle={styles.centeredContainer}>
//         <Text style={styles.noCycleText}>No active cycle found</Text>
//         <TouchableOpacity style={styles.button} onPress={handleStartNewCycle}>
//           <Text style={styles.buttonText}>Start New Cycle</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     );
//   }

//   const renderDayMarkers = () => {
//     const ovulationDay = cycle.ovulationDay || Math.floor(cycle.cycleLength / 2);
//     const periodDays = Array.from({ length: cycle.periodLength }, (_, i) => i + 1);
//     const fertileDays = Array.from({ length: 7 }, (_, i) => ovulationDay - 3 + i);
//     const ovulationDays = [ovulationDay - 1, ovulationDay, ovulationDay + 1];

//     return Array.from({ length: cycle.cycleLength }).map((_, day) => {
//       const dayNum = day + 1;
//       const angle = (day / cycle.cycleLength) * 2 * Math.PI - Math.PI / 2;
//       const x = circleRadius * 0.8 * Math.cos(angle) + circleRadius - 10;
//       const y = circleRadius * 0.8 * Math.sin(angle) + circleRadius - 10;

//       const isCurrentDay = dayNum === currentDay;
//       const isPeriod = periodDays.includes(dayNum);
//       const isOvulation = ovulationDays.includes(dayNum);
//       const isFertile = fertileDays.includes(dayNum);
//       const isTracked = cycle.trackedDays?.includes(dayNum) || false;

//       return (
//         <Animated.View
//           key={day}
//           style={[
//             styles.dayMarker,
//             {
//               left: x,
//               top: y,
//               backgroundColor: isPeriod
//                 ? '#8B5CF6'
//                 : isOvulation
//                 ? '#F472B6'
//                 : isFertile
//                 ? '#A78BFA'
//                 : '#CBD5E1',
//               zIndex: isCurrentDay ? 1 : 0,
//               // Add a border for tracked days
//               borderWidth: isTracked ? 2 : 0,
//               borderColor: isTracked ? 'white' : 'transparent',
//             },
//           ]}
//         >
//           {isCurrentDay && (
//             <View style={styles.currentDayRing}>
//               <Text style={styles.currentDayText}>{dayNum}</Text>
//             </View>
//           )}
//         </Animated.View>
//       );
//     });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>
//         Day {currentDay} of {cycle.cycleLength}
//       </Text>

//       <View style={styles.circleContainer}>{renderDayMarkers()}</View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={handleDailyLog}>
//           <Text style={styles.buttonText}>Log Today</Text>
//           {streak > 0 && (
//             <View style={styles.streakBadge}>
//               <Flame color={streak > 3 ? 'orange' : 'gray'} size={16} />
//               <Text style={styles.streakText}>{streak}</Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleStartNewCycle}>
//           <Text style={styles.buttonText}>Start New Cycle</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1, // Ensure the container can grow to accommodate content
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F3E8FF',
//   },
//   centeredContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F3E8FF',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#6D28D9',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#DC2626',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   noCycleText: {
//     fontSize: 16,
//     color: '#6D28D9',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#6D28D9',
//     marginBottom: 10,
//   },
//   circleContainer: {
//     width: circleSize,
//     height: circleSize,
//     marginVertical: 20,
//     position: 'relative',
//     borderRadius: circleRadius,
//     borderWidth: 1,
//     borderColor: 'rgba(109, 40, 217, 0.2)',
//   },
//   dayMarker: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   currentDayRing: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },
//   currentDayText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 10,
//   },
//   buttonContainer: {
//     width: '100%',
//     marginTop: 20,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#6D28D9',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   secondaryButton: {
//     backgroundColor: '#8B5CF6',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   streakBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 8,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//   },
//   streakText: {
//     color: 'white',
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
// });

// export default AppCurrentCycle;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Flame } from 'lucide-react-native';
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

interface CycleTrackerProps {
  userId: string;
}

// Define the user data structure from Firestore
interface UserCycleData {
  lastPeriodDate1: Timestamp | Date;
  lastPeriodDate2: Timestamp | Date;
  periodLength: number;
  cycleLength: number;
  predictedNextPeriodDate: Timestamp | Date;
  predictedOvulationDate: Timestamp | Date;
  currentCycleDay?: number;
  currentPhase?: string;
  lastUpdated?: Timestamp | Date;
  trackedDays?: number[];
}

const screenWidth = Dimensions.get('window').width;
const circleSize = screenWidth * 0.8;
const circleRadius = circleSize / 2;

const AppCurrentCycle = ({ userId }: CycleTrackerProps) => {
  const [userData, setUserData] = useState<UserCycleData | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackedDays, setTrackedDays] = useState<number[]>([]);
  
  // Use useRef for the animated value
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Setup pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseAnim]);

  // Calculate current cycle day and phase
  const calculateCurrentCycleInfo = (userData: UserCycleData) => {
    const today = new Date();
    let mostRecentDate;
    
    // Convert Firestore Timestamp to Date if needed
    if (userData.lastPeriodDate1 instanceof Timestamp) {
      mostRecentDate = userData.lastPeriodDate1.toDate();
    } else {
      mostRecentDate = new Date(userData.lastPeriodDate1);
    }
    
    // Calculate current cycle day
    const diffTime = Math.abs(today.getTime() - mostRecentDate.getTime());
    let cycleDayCalculated = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because day 1 is first day of period
    
    // Adjust if we're beyond the expected cycle length
    if (cycleDayCalculated > userData.cycleLength) {
      cycleDayCalculated = cycleDayCalculated % userData.cycleLength;
      if (cycleDayCalculated === 0) cycleDayCalculated = userData.cycleLength;
    }
    
    // Determine the current phase
    let phase = "";
    
    if (cycleDayCalculated <= userData.periodLength) {
      phase = "Menstrual Phase";
    } else if (cycleDayCalculated <= userData.cycleLength - 14) {
      phase = "Follicular Phase";
    } else if (cycleDayCalculated <= userData.cycleLength - 10) {
      phase = "Ovulatory Phase";
    } else {
      phase = "Luteal Phase";
    }
    
    return { currentCycleDay: cycleDayCalculated, currentPhase: phase };
  };

  // Calculate streak based on tracked days
  const calculateStreak = (trackedDays: number[]) => {
    if (!trackedDays || trackedDays.length === 0) return 0;
    
    const sortedDays = [...trackedDays].sort((a, b) => a - b);
    let streak = 1;
    
    for (let i = 1; i < sortedDays.length; i++) {
      if (sortedDays[i] === sortedDays[i - 1] + 1) {
        streak++;
      } else if (sortedDays[i] !== sortedDays[i - 1]) {
        streak = 1;
      }
    }
    
    return streak;
  };

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserCycleData;
        setUserData(data);
        
        // Set cycle properties
        setCycleLength(data.cycleLength || 28);
        setPeriodLength(data.periodLength || 5);
        setTrackedDays(data.trackedDays || []);
        
        // Calculate streak
        setStreak(calculateStreak(data.trackedDays || []));
        
        // Calculate or use saved current day and phase
        if (data.currentCycleDay && data.currentPhase) {
          setCurrentDay(data.currentCycleDay);
          setCurrentPhase(data.currentPhase);
        } else {
          const { currentCycleDay, currentPhase } = calculateCurrentCycleInfo(data);
          setCurrentDay(currentCycleDay);
          setCurrentPhase(currentPhase);
          
          // Update the user document with calculated values
          await updateDoc(userRef, {
            currentCycleDay,
            currentPhase,
            lastUpdated: new Date()
          });
        }
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load cycle data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Handle daily log button press
  const handleDailyLog = async () => {
    if (!userData || !userId) return;

    try {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      
      // Add current day to tracked days if not already included
      const updatedTrackedDays = [...(trackedDays || [])];
      if (!updatedTrackedDays.includes(currentDay)) {
        updatedTrackedDays.push(currentDay);
      }
      
      await updateDoc(userRef, {
        trackedDays: updatedTrackedDays,
        lastUpdated: new Date()
      });
      
      setTrackedDays(updatedTrackedDays);
      setStreak(calculateStreak(updatedTrackedDays));
      Alert.alert('Success', 'Today has been logged!');
    } catch (error) {
      console.error('Error logging day:', error);
      Alert.alert('Error', 'Could not log today. Please try again.');
    }
  };

  // Handle new cycle button press - redirect to UserPeriodScreen
  const handleStartNewCycle = () => {
    Alert.alert(
      'Start New Cycle',
      'This will take you to update your period information. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => {
            // Use navigation to navigate to UserPeriodScreen
            // This would require passing navigation as a prop or using a navigation hook
            // For now, just show an alert
            Alert.alert('Navigation', 'This would navigate to the Period Input screen');
            // Ideally: navigation.navigate('UserPeriod');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading your cycle data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView contentContainerStyle={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchUserData}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (!userData) {
    return (
      <ScrollView contentContainerStyle={styles.centeredContainer}>
        <Text style={styles.noCycleText}>No period data found</Text>
        <TouchableOpacity style={styles.button} onPress={handleStartNewCycle}>
          <Text style={styles.buttonText}>Enter Period Information</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const renderDayMarkers = () => {
    // Calculate ovulation day - typically 14 days before next period
    const ovulationDay = cycleLength - 14;
    const periodDays = Array.from({ length: periodLength }, (_, i) => i + 1);
    const fertileDays = Array.from({ length: 7 }, (_, i) => ovulationDay - 3 + i);
    const ovulationDays = [ovulationDay - 1, ovulationDay, ovulationDay + 1];

    return Array.from({ length: cycleLength }).map((_, day) => {
      const dayNum = day + 1;
      const angle = (day / cycleLength) * 2 * Math.PI - Math.PI / 2;
      const x = circleRadius * 0.8 * Math.cos(angle) + circleRadius - 10;
      const y = circleRadius * 0.8 * Math.sin(angle) + circleRadius - 10;

      const isCurrentDay = dayNum === currentDay;
      const isPeriod = periodDays.includes(dayNum);
      const isOvulation = ovulationDays.includes(dayNum);
      const isFertile = fertileDays.includes(dayNum);
      const isTracked = trackedDays?.includes(dayNum) || false;

      return (
        <Animated.View
          key={day}
          style={[
            styles.dayMarker,
            {
              left: x,
              top: y,
              backgroundColor: isPeriod
                ? '#8B5CF6' // Purple for period
                : isOvulation
                ? '#F472B6' // Pink for ovulation
                : isFertile
                ? '#A78BFA' // Light purple for fertile
                : '#CBD5E1', // Gray for other days
              zIndex: isCurrentDay ? 1 : 0,
              // Add a border for tracked days
              borderWidth: isTracked ? 2 : 0,
              borderColor: isTracked ? 'white' : 'transparent',
            },
          ]}
        >
          {isCurrentDay && (
            <View style={styles.currentDayRing}>
              <Text style={styles.currentDayText}>{dayNum}</Text>
            </View>
          )}
        </Animated.View>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Day {currentDay} of {cycleLength}
      </Text>
      
      <Text style={styles.phaseText}>
        {currentPhase}
      </Text>

      <View style={styles.circleContainer}>{renderDayMarkers()}</View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F472B6' }]} />
          <Text style={styles.legendText}>Ovulation</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#A78BFA' }]} />
          <Text style={styles.legendText}>Fertile</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDailyLog}>
          <Text style={styles.buttonText}>Log Today</Text>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Flame color={streak > 3 ? 'orange' : 'gray'} size={16} />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleStartNewCycle}>
          <Text style={styles.buttonText}>Start New Cycle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  centeredContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  phaseText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  circleContainer: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    borderWidth: 1,
    borderColor: '#333',
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  dayMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDayRing: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  currentDayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  streakText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 20,
    textAlign: 'center',
  },
  noCycleText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default AppCurrentCycle;