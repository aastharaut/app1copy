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
//   ScrollView,
// } from 'react-native';
// import { Flame } from 'lucide-react-native';
// import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
// interface CycleTrackerProps {
//   userId: string;
// }
// import { useRouter } from 'expo-router';

// // Define the user data structure from Firestore
// interface UserCycleData {
//   lastPeriodDate1: Timestamp | Date;
//   lastPeriodDate2: Timestamp | Date;
//   periodLength: number;
//   cycleLength: number;
//   predictedNextPeriodDate?: Timestamp | Date;
//   predictedOvulationDate?: Timestamp | Date;
//   currentCycleDay?: number;
//   currentPhase?: string;
//   lastUpdated?: Timestamp | Date;
//   trackedDays?: number[];
// }

// const screenWidth = Dimensions.get('window').width;
// const circleSize = screenWidth * 0.8;
// const circleRadius = circleSize / 2;

// const AppCurrentCycle = ({ userId }: CycleTrackerProps) => {
//   const [userData, setUserData] = useState<UserCycleData | null>(null);
//   const [currentDay, setCurrentDay] = useState(1);
//   const [currentPhase, setCurrentPhase] = useState<string>('');
//   const [cycleLength, setCycleLength] = useState(28);
//   const [periodLength, setPeriodLength] = useState(5);
//   const [nextPeriod, setNextPeriod] = useState<Date | null>(null);
//   const [ovulationDate, setOvulationDate] = useState<Date | null>(null);
//   const [streak, setStreak] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [trackedDays, setTrackedDays] = useState<number[]>([]);
//   const [cycleDocId, setCycleDocId] = useState<string | null>(null);
//   const router = useRouter();
  
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

//   // Calculate next period date based on the most recent period and cycle length
//   const calculateNextPeriodDate = (userData: UserCycleData): Date => {
//     // Determine most recent period date
//     let lastPeriod1: Date;
//     let lastPeriod2: Date;
    
//     // Convert Firestore Timestamp to Date if needed
//     if (userData.lastPeriodDate1 instanceof Timestamp) {
//       lastPeriod1 = userData.lastPeriodDate1.toDate();
//     } else {
//       lastPeriod1 = new Date(userData.lastPeriodDate1);
//     }
    
//     if (userData.lastPeriodDate2 instanceof Timestamp) {
//       lastPeriod2 = userData.lastPeriodDate2.toDate();
//     } else {
//       lastPeriod2 = new Date(userData.lastPeriodDate2);
//     }
    
//     const mostRecentDate = lastPeriod1 > lastPeriod2 ? lastPeriod1 : lastPeriod2;
//     const nextPeriod = new Date(mostRecentDate);
//     nextPeriod.setDate(nextPeriod.getDate() + userData.cycleLength);
//     return nextPeriod;
//   };

//   // Calculate ovulation date (typically 14 days before next period)
//   const calculateOvulationDate = (nextPeriodDate: Date): Date => {
//     const ovulation = new Date(nextPeriodDate);
//     ovulation.setDate(ovulation.getDate() - 14); // Standard luteal phase is ~14 days
//     return ovulation;
//   };

//   // Calculate current cycle day and phase
//   const calculateCurrentCycleInfo = (userData: UserCycleData) => {
//     const today = new Date();
//     let mostRecentDate;
    
//     // Convert Firestore Timestamp to Date if needed
//     if (userData.lastPeriodDate1 instanceof Timestamp) {
//       mostRecentDate = userData.lastPeriodDate1.toDate();
//     } else {
//       mostRecentDate = new Date(userData.lastPeriodDate1);
//     }
    
//     // Calculate current cycle day
//     const diffTime = Math.abs(today.getTime() - mostRecentDate.getTime());
//     let cycleDayCalculated = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because day 1 is first day of period
    
//     // Adjust if we're beyond the expected cycle length
//     if (cycleDayCalculated > userData.cycleLength) {
//       cycleDayCalculated = cycleDayCalculated % userData.cycleLength;
//       if (cycleDayCalculated === 0) cycleDayCalculated = userData.cycleLength;
//     }
    
//     // Determine the current phase
//     let phase = "";
    
//     if (cycleDayCalculated <= userData.periodLength) {
//       phase = "Menstrual Phase";
//     } else if (cycleDayCalculated <= userData.cycleLength - 14) {
//       phase = "Follicular Phase";
//     } else if (cycleDayCalculated <= userData.cycleLength - 10) {
//       phase = "Ovulatory Phase";
//     } else {
//       phase = "Luteal Phase";
//     }
    
//     return { currentCycleDay: cycleDayCalculated, currentPhase: phase };
//   };

//   // Calculate streak based on tracked days
//   const calculateStreak = (trackedDays: number[]) => {
//     if (!trackedDays || trackedDays.length === 0) return 0;
    
//     const sortedDays = [...trackedDays].sort((a, b) => a - b);
//     let streak = 1;
    
//     for (let i = 1; i < sortedDays.length; i++) {
//       if (sortedDays[i] === sortedDays[i - 1] + 1) {
//         streak++;
//       } else if (sortedDays[i] !== sortedDays[i - 1]) {
//         streak = 1;
//       }
//     }
    
//     return streak;
//   };

//   // Fetch user data from Firestore - UPDATED to handle multiple data locations
//   const fetchUserData = async () => {
//     if (!userId) {
//       setError('User ID is required');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       console.log("Fetching cycle data for user:", userId);

//       const db = getFirestore();
      
//       // SOLUTION: Try multiple data locations
      
//       // First attempt: Look in cycles collection where userId field matches
//       const cyclesRef = collection(db, "cycles");
//       const q = query(cyclesRef, where("userId", "==", userId));
//       const querySnapshot = await getDocs(q);
      
//       console.log("Cycles collection query results:", {
//         empty: querySnapshot.empty,
//         count: querySnapshot.size
//       });
      
//       if (!querySnapshot.empty) {
//         // Use the first document found
//         const cycleDoc = querySnapshot.docs[0];
//         const data = cycleDoc.data() as UserCycleData;
//         setUserData(data);
//         setCycleDocId(cycleDoc.id); // Store document ID for updates
        
//         processUserData(data, cycleDoc.id);
//         return;
//       }
      
//       // Second attempt: Try looking directly in users collection
//       console.log("No data in cycles collection, checking users collection");
//       const userRef = doc(db, "users", userId);
//       const userSnap = await getDoc(userRef);
      
//       if (userSnap.exists() && userSnap.data().lastPeriodDate1) {
//         const userData = userSnap.data() as UserCycleData;
//         setUserData(userData);
        
//         // Also store this data in cycles collection for future access
//         const newCycleRef = await addDoc(collection(db, "cycles"), {
//           ...userData,
//           userId,
//           createdAt: new Date(),
//           lastUpdated: new Date()
//         });
        
//         setCycleDocId(newCycleRef.id);
//         processUserData(userData, newCycleRef.id);
//         return;
//       }
      
//       // No data found
//       console.log("No cycle data found in any location");
//       setUserData(null);
      
//     } catch (error) {
//       console.error('Error loading user data:', error);
//       setError('Failed to load cycle data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Helper function to process user data after fetching
//   const processUserData = async (data: UserCycleData, docId: string) => {
//     // Set cycle properties
//     setCycleLength(data.cycleLength || 28);
//     setPeriodLength(data.periodLength || 5);
//     setTrackedDays(data.trackedDays || []);
    
//     // Calculate streak
//     setStreak(calculateStreak(data.trackedDays || []));
    
//     // Calculate predictions
//     const nextPeriodDate = calculateNextPeriodDate(data);
//     const ovulationDate = calculateOvulationDate(nextPeriodDate);
//     setNextPeriod(nextPeriodDate);
//     setOvulationDate(ovulationDate);
    
//     // Calculate current day and phase
//     const { currentCycleDay, currentPhase } = calculateCurrentCycleInfo(data);
//     setCurrentDay(currentCycleDay);
//     setCurrentPhase(currentPhase);
    
//     const db = getFirestore();
    
//     // Update the document with calculated values
//     try {
//       // Try to update the document - either in cycles collection or users collection
//       if (docId) {
//         const cycleRef = doc(db, "cycles", docId);
//         await updateDoc(cycleRef, {
//           predictedNextPeriodDate: nextPeriodDate,
//           predictedOvulationDate: ovulationDate,
//           currentCycleDay,
//           currentPhase,
//           lastUpdated: new Date()
//         });
//       }
//     } catch (error) {
//       console.error("Error updating calculated values:", error);
//       // Non-blocking error - don't show to user
//     }
//   };

//   // Load data on component mount
//   useEffect(() => {
//     fetchUserData();
//   }, [userId]);

//   // Handle daily log button press
//   const handleDailyLog = async () => {
//     if (!userData || !userId || !cycleDocId) {
//       Alert.alert('Error', 'Unable to log data. Please refresh the page.');
//       return;
//     }

//     try {
//       const db = getFirestore();
//       const cycleRef = doc(db, "cycles", cycleDocId);
      
//       // Add current day to tracked days if not already included
//       const updatedTrackedDays = [...(trackedDays || [])];
//       if (!updatedTrackedDays.includes(currentDay)) {
//         updatedTrackedDays.push(currentDay);
//       }
      
//       await updateDoc(cycleRef, {
//         trackedDays: updatedTrackedDays,
//         lastUpdated: new Date()
//       });
      
//       setTrackedDays(updatedTrackedDays);
//       setStreak(calculateStreak(updatedTrackedDays));
//       Alert.alert('Success', 'Today has been logged!');
//     } catch (error) {
//       console.error('Error logging day:', error);
//       Alert.alert('Error', 'Could not log today. Please try again.');
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
//         <TouchableOpacity style={styles.button} onPress={fetchUserData}>
//           <Text style={styles.buttonText}>Retry</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     );
//   }

//   if (!userData) {
//     return (
//       <ScrollView contentContainerStyle={styles.centeredContainer}>
//         <Text style={styles.noCycleText}>No period data found</Text>
//         <Text style={styles.errorText}>Please add your period information to get started</Text>
//       </ScrollView>
//     );
//   }

//   const renderDayMarkers = () => {
//     // Calculate ovulation day - typically 14 days before next period
//     const ovulationDay = cycleLength - 14;
//     const periodDays = Array.from({ length: periodLength }, (_, i) => i + 1);
//     const fertileDays = Array.from({ length: 7 }, (_, i) => ovulationDay - 3 + i);
//     const ovulationDays = [ovulationDay - 1, ovulationDay, ovulationDay + 1];

//     return Array.from({ length: cycleLength }).map((_, day) => {
//       const dayNum = day + 1;
//       const angle = (day / cycleLength) * 2 * Math.PI - Math.PI / 2;
//       const x = circleRadius * 0.8 * Math.cos(angle) + circleRadius - 10;
//       const y = circleRadius * 0.8 * Math.sin(angle) + circleRadius - 10;

//       const isCurrentDay = dayNum === currentDay;
//       const isPeriod = periodDays.includes(dayNum);
//       const isOvulation = ovulationDays.includes(dayNum);
//       const isFertile = fertileDays.includes(dayNum);
//       const isTracked = trackedDays?.includes(dayNum) || false;

//       return (
//         <Animated.View
//           key={day}
//           style={[
//             styles.dayMarker,
//             {
//               left: x,
//               top: y,
//               backgroundColor: isPeriod
//                 ? '#8B5CF6' // Purple for period
//                 : isOvulation
//                 ? '#F472B6' // Pink for ovulation
//                 : isFertile
//                 ? '#A78BFA' // Light purple for fertile
//                 : '#CBD5E1', // Gray for other days
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

//   // Format dates for display
//   const formatDate = (date: Date | null) => {
//     if (!date) return "N/A";
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>
//         Day {currentDay} of {cycleLength}
//       </Text>
      
//       <Text style={styles.phaseText}>
//         {currentPhase}
//       </Text>

//       <View style={styles.cycleInfoCards}>
//         <View style={styles.infoCard}>
//           <Text style={styles.infoLabel}>Next Period</Text>
//           <Text style={styles.infoValue}>{formatDate(nextPeriod)}</Text>
//         </View>
        
//         <View style={styles.infoCard}>
//           <Text style={styles.infoLabel}>Ovulation</Text>
//           <Text style={styles.infoValue}>{formatDate(ovulationDate)}</Text>
//         </View>
//       </View>

//       <View style={styles.circleContainer}>{renderDayMarkers()}</View>

//       <View style={styles.legendContainer}>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
//           <Text style={styles.legendText}>Period</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendDot, { backgroundColor: '#F472B6' }]} />
//           <Text style={styles.legendText}>Ovulation</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendDot, { backgroundColor: '#A78BFA' }]} />
//           <Text style={styles.legendText}>Fertile</Text>
//         </View>
//       </View>

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
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#121212',
//   },
//   centeredContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#121212',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   phaseText: {
//     fontSize: 18,
//     color: '#FF6B6B',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   cycleInfoCards: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   infoCard: {
//     flex: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 10,
//     padding: 12,
//     margin: 5,
//     alignItems: 'center',
//   },
//   infoLabel: {
//     color: '#ccc',
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   infoValue: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   circleContainer: {
//     width: circleSize,
//     height: circleSize,
//     borderRadius: circleSize / 2,
//     borderWidth: 1,
//     borderColor: '#333',
//     alignSelf: 'center',
//     position: 'relative',
//     marginBottom: 20,
//   },
//   dayMarker: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   currentDayRing: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     borderWidth: 2,
//     borderColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   currentDayText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     gap: 10,
//   },
//   button: {
//     backgroundColor: '#FF6B6B',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   streakBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 10,
//   },
//   streakText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     marginLeft: 4,
//   },
//   loadingText: {
//     color: '#fff',
//     marginTop: 10,
//   },
//   errorText: {
//     color: '#FF6B6B',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   noCycleText: {
//     color: '#fff',
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 20,
//     flexWrap: 'wrap',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 10,
//     marginVertical: 5,
//   },
//   legendDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 5,
//   },
//   legendText: {
//     color: '#fff',
//     fontSize: 12,
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
  SafeAreaView,
} from 'react-native';
import { Flame, Settings } from 'lucide-react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
interface CycleTrackerProps {
  userId: string;
}
import { useRouter } from 'expo-router';

interface UserCycleData {
  userId: string;
  lastPeriodDate1: Timestamp | Date;
  lastPeriodDate2: Timestamp | Date;
  periodLength: number;
  cycleLength: number;
  currentCycleDay?: number;
  currentPhase?: string;
  predictedNextPeriodDate?: Timestamp | Date;
  predictedOvulationDate?: Timestamp | Date;
  trackedDays?: number[];
  streak?: number;
  isProfileComplete?: boolean;
  createdAt?: Timestamp | Date;
  lastUpdated?: Timestamp | Date;
}
interface PhaseInfo {
  description: string;
  phase: 'menstruation' | 'ovulation' | 'fertile' | 'follicular' | 'luteal';
  icon: string;
  tips: string;
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
  const [nextPeriod, setNextPeriod] = useState<Date | null>(null);
  const [ovulationDate, setOvulationDate] = useState<Date | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackedDays, setTrackedDays] = useState<number[]>([]);
  const [cycleDocId, setCycleDocId] = useState<string | null>(null);
  const router = useRouter();
  
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
    
  // Calculate next period date based on the most recent period and cycle length
  const calculateNextPeriodDate = (userData: UserCycleData): Date => {
    // Determine most recent period date
    let lastPeriod1: Date;
    let lastPeriod2: Date;
    
    // Convert Firestore Timestamp to Date if needed
    if (userData.lastPeriodDate1 instanceof Timestamp) {
      lastPeriod1 = userData.lastPeriodDate1.toDate();
    } else {
      lastPeriod1 = new Date(userData.lastPeriodDate1);
    }
    
    if (userData.lastPeriodDate2 instanceof Timestamp) {
      lastPeriod2 = userData.lastPeriodDate2.toDate();
    } else {
      lastPeriod2 = new Date(userData.lastPeriodDate2);
    }
    
    const mostRecentDate = lastPeriod1 > lastPeriod2 ? lastPeriod1 : lastPeriod2;
    const nextPeriod = new Date(mostRecentDate);
    nextPeriod.setDate(nextPeriod.getDate() + userData.cycleLength);
    return nextPeriod;
  };

  // Calculate ovulation date (typically 14 days before next period)
  const calculateOvulationDate = (nextPeriodDate: Date): Date => {
    const ovulation = new Date(nextPeriodDate);
    ovulation.setDate(ovulation.getDate() - 14); // Standard luteal phase is ~14 days
    return ovulation;
  };

  const calculateCurrentCycleInfo = (userData: UserCycleData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
  
    // Convert Firestore Timestamp to Date if needed
    const lastPeriodDate = userData.lastPeriodDate1 instanceof Timestamp 
      ? userData.lastPeriodDate1.toDate() 
      : new Date(userData.lastPeriodDate1);
    lastPeriodDate.setHours(0, 0, 0, 0); // Normalize to midnight
  
    // If period was logged today, trust the manual `currentCycleDay: 1`
    if (lastPeriodDate.getTime() === today.getTime()) {
      return {
        currentCycleDay: 1,
        currentPhase: "Menstrual Phase",
      };
    }
  
    // Otherwise, calculate as usual
    const diffTime = Math.abs(today.getTime() - lastPeriodDate.getTime());
    let cycleDayCalculated = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
    // Adjust if beyond cycle length
    if (cycleDayCalculated > userData.cycleLength) {
      cycleDayCalculated = cycleDayCalculated % userData.cycleLength;
      if (cycleDayCalculated === 0) cycleDayCalculated = userData.cycleLength;
    }
  
    // Determine phase
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

  // Fetch user data from Firestore - UPDATED to handle multiple data locations
  const fetchUserData = async () => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching cycle data for user:", userId);

      const db = getFirestore();
      
      
      // First attempt: Look in cycles collection where userId field matches
      const cyclesRef = collection(db, "cycles");
      const q = query(cyclesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      console.log("Cycles collection query results:", {
        empty: querySnapshot.empty,
        count: querySnapshot.size
      });
      
      if (!querySnapshot.empty) {
        // Use the first document found
        const cycleDoc = querySnapshot.docs[0];
        const data = cycleDoc.data() as UserCycleData;
        setUserData(data);
        setCycleDocId(cycleDoc.id); // Store document ID for updates
        
        processUserData(data, cycleDoc.id);
        return;
      }
      
      // Second attempt: Try looking directly in users collection
      console.log("No data in cycles collection, checking users collection");
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists() && userSnap.data().lastPeriodDate1) {
        const userData = userSnap.data() as UserCycleData;
        setUserData(userData);
        
        // Also store this data in cycles collection for future access
        const newCycleRef = await addDoc(collection(db, "cycles"), {
          ...userData,
          userId,
          createdAt: new Date(),
          lastUpdated: new Date()
        });
        
        setCycleDocId(newCycleRef.id);
        processUserData(userData, newCycleRef.id);
        return;
      }
      
      // No data found
      console.log("No cycle data found in any location");
      setUserData(null);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load cycle data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to process user data after fetching
  const processUserData = async (data: UserCycleData, docId: string) => {
    // Set cycle properties
    setCycleLength(data.cycleLength || 28);
    setPeriodLength(data.periodLength || 5);
    setTrackedDays(data.trackedDays || []);
    
    // Get streak from data or calculate it
    setStreak(data.streak || calculateStreak(data.trackedDays || []));
    
    // Calculate predictions
    const nextPeriodDate = calculateNextPeriodDate(data);
    const ovulationDate = calculateOvulationDate(nextPeriodDate);
    setNextPeriod(nextPeriodDate);
    setOvulationDate(ovulationDate);
    
    // Calculate current day and phase
    const { currentCycleDay, currentPhase } = calculateCurrentCycleInfo(data);
    setCurrentDay(currentCycleDay);
    setCurrentPhase(currentPhase);
    
    const db = getFirestore();
    
    // Update the document with calculated values
    try {
      if (docId) {
        const cycleRef = doc(db, "cycles", docId);
        await updateDoc(cycleRef, {
          predictedNextPeriodDate: nextPeriodDate,
          predictedOvulationDate: ovulationDate,
          currentCycleDay,
          currentPhase,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error("Error updating calculated values:", error);
      // Non-blocking error - don't show to user
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Handle navigation to symptom tracker
  const navigateToSymptomTracker = () => {
    router.push("/tabs/Cycle/SymtompTrackerScreen");
  };

  const logPeriod = async () => {
    if (!userId || !cycleDocId) {
      Alert.alert('Error', 'User data not loaded');
      return;
    }
  
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to midnight UTC
  
      const db = getFirestore();
      const cycleRef = doc(db, "cycles", cycleDocId);
      const currentData = (await getDoc(cycleRef)).data() as UserCycleData;
  
      await updateDoc(cycleRef, {
        lastPeriodDate2: currentData.lastPeriodDate1 || Timestamp.fromDate(today),
        lastPeriodDate1: Timestamp.fromDate(today),
        currentCycleDay: 1, // Force Day 1
        currentPhase: "Menstrual Phase",
        lastUpdated: Timestamp.now(),
        trackedDays: [...new Set([...(currentData.trackedDays || []), 1])],
      });
 
      setCurrentDay(1);
      setCurrentPhase("Menstrual Phase");
      await fetchUserData(); // Sync with Firestore
  
      Alert.alert('Success', 'New period logged! Cycle reset to day 1.');
    } catch (error) {
      console.error('Error logging period:', error);
      Alert.alert('Error', 'Failed to log period');
    }
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
        <Text style={styles.errorText}>Please add your period information to get started</Text>
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
                ? '#FF6B6B' // Purple for period
                : isOvulation
                ? '#4A90E2' // Pink for ovulation
                : isFertile
                ? '#7ED321' // Light purple for fertile
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

  // Format dates for display
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  
  const phaseInfo: PhaseInfo = ((): PhaseInfo => {  // Explicit return type
    const ovulationDay = cycleLength - 14;
    const ovulationDays = [ovulationDay - 1, ovulationDay, ovulationDay + 1];
    const fertileDays = Array.from({ length: 7 }, (_, i) => ovulationDay - 3 + i);
  
    if (currentDay <= periodLength) {
      return {
        description: "You are in your menstrual phase.This is when your uterine lining sheds.",
        phase: 'menstruation' as const,  // Use 'as const' to lock the type
        icon: '🩸',
        tips: "Rest and hydrate."
      };
    } else if (ovulationDays.includes(currentDay)) {
      return {
        description: "You're likely ovulating today. This is when an egg is released from your ovary.",
        phase: 'ovulation' as const,
        icon: '🥚',
        tips: "This is your most fertile time if trying to conceive."
      };
    } else if (fertileDays.includes(currentDay)) {
      return {
        description: "You're in your fertile window. Chances of pregnancy are higher during these days.",
        phase: 'fertile' as const,
        icon: '📈',
        tips: "Have regular intercourse if trying to conceive."
      };
    } else if (currentDay < fertileDays[0]) {
      return {
        description: "You're in your follicular phase. Your body is preparing an egg for release.",
        phase: 'follicular' as const,
        icon: '🌱',
        tips: "Energy levels are typically higher now."
      };
    } else {
      return {
        description: "You're in your luteal phase. Your body is preparing for a potential period.",
        phase: 'luteal' as const,
        icon: '🌙',
        tips: "Watch for PMS symptoms in the coming days."
      };
    }
  })();
  
  
  return (
      <SafeAreaView style={styles.safeArea}>
        {/* New Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Current Cycle</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push("/authentication/settings")} // Or your settings route
          >
            <Settings size={24} color="#333" />
          </TouchableOpacity>
        </View>
  
        <ScrollView contentContainerStyle={styles.container}>
          {/* Removed the title and phase text from here */}
          
          {/* Streak display - moved below header */}
          {streak > 0 && (
            <View style={styles.streakContainer}>
              <Flame color={streak > 3 ? 'orange' : 'gray'} size={24} />
              <Text style={styles.streakHeading}>
                {streak} day{streak !== 1 ? 's' : ''} streak
              </Text>
            </View>
          )}
  
          <View style={styles.circleContainer}>
            {/* Cycle day and phase inside the circle */}
            <View style={styles.cycleInfoCenter}>
              <Text style={styles.cycleDayText}>Day {currentDay} of {cycleLength} </Text>
              <Text style={styles.cyclePhaseText}>{currentPhase}</Text> 
            </View>
            {renderDayMarkers()}
          </View>
  
          {/* Rest of your existing UI remains the same */}
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

          {/* Phase Description */}
<View style={styles.phaseDescriptionContainer}>
  <View style={styles.phaseHeader}>
    <Text style={styles.phaseIcon}>{phaseInfo.icon}</Text>
    <Text style={styles.phaseDescriptionTitle}>Today's Phase</Text>
  </View>
  <Text style={[
    styles.phaseDescriptionText,
    styles[`${phaseInfo.phase}Phase` as keyof typeof styles]
  ]}>
    {phaseInfo.description}
  </Text>
  <Text style={styles.phaseTips}>{phaseInfo.tips}</Text>
</View>
        
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#FF3B30' }]} 
            onPress={logPeriod}>
            <Text style={styles.buttonText}>Log Period Start</Text>
          </TouchableOpacity>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={navigateToSymptomTracker}>
              <Text style={styles.buttonText}>Log Your Symptoms</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      //borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1, // this will help center the text in the row
    },
    settingsButton: {
      padding: 8,
      position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }], // vertical alignment adjustment
    },
    cycleInfoCenter: {
      position: 'absolute',
      zIndex: 2,
      alignItems: 'center',
    },
    cycleDayText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
    },
    cyclePhaseText: {
      fontSize: 16,
      color: '#4B0082',
      textAlign: 'center',
      maxWidth: circleSize * 0.6,
    },
    // ... keep all your existing styles below ...
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#ffffff',
    },
    centeredContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#FFFBEB',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 5,
    },
    phaseText: {
      fontSize: 18,
      color: '#FF6B6B',
      textAlign: 'center',
      marginBottom: 10,
    },
    cycleInfoCards: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    infoCard: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 10,
      padding: 12,
      margin: 5,
      alignItems: 'center',
    },
    infoLabel: {
      color: '#666',
      fontSize: 14,
      marginBottom: 4,
    },
    infoValue: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 10,
      marginBottom: 15,
    },
    streakHeading: {
      color: '#333',
      fontWeight: 'bold',
      fontSize: 16,
      marginLeft: 8,
    },
    circleContainer: {
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      alignSelf: 'center',
      position: 'relative',
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
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
      borderColor: '#333',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    currentDayText: {
      color: '#333',
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
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    loadingText: {
      color: '#333',
      marginTop: 10,
    },
    errorText: {
      color: '#FF6B6B',
      textAlign: 'center',
      marginBottom: 20,
    },
    noCycleText: {
      color: '#333',
      fontSize: 18,
      marginBottom: 10,
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      marginVertical: 5,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 5,
    },
    legendText: {
      color: '#333',
      fontSize: 12,
    },
      // ... your existing styles ...

  phaseDescriptionContainer: {
    backgroundColor: '#F3F0FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    marginBottom: 15,
  },
  phaseDescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  phaseDescriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  phaseTips: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  phaseIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menstruationPhase: {
    color: '#FF6B6B',
  },
  ovulationPhase: {
    color: '#4A90E2',
  },
  fertilePhase: {
    color: '#7ED321',
  },
  follicularPhase: {
    color: '#9B59B6',
  },
  lutealPhase: {
    color: '#F39C12',
  },
  });

export default AppCurrentCycle;