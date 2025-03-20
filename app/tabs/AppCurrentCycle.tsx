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


import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router, useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
const circleSize = screenWidth * 0.8;
const circleRadius = circleSize / 2;

const AppCurrentCycle = () => {
  const navigation = useNavigation();
  const router = useRouter()
  const [currentDay, setCurrentDay] = useState(14);

  const onClick = () =>
  {
     router.navigate("./Track")
  }
  
  const cycleData = {
    cycleLength: 28,
    periodLength: 5,
    ovulationDay: 14,
    nextPeriodIn: 28 - currentDay,
    periodDays: [1, 2, 3, 4, 5],
    fertileDays: [10, 11, 12, 13, 14, 15, 16],
    ovulationDays: [13, 14, 15],
  };

  const calculatePosition = (day: number, totalDays: number, radius: number) => {
    const angle = ((day - 1) / totalDays) * 2 * Math.PI - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x: x + circleRadius, y: y + circleRadius };
  };

  const getPhaseColor = (day: number) => {
    if (cycleData.periodDays.includes(day)) return '#8B5CF6'; // Purple
    if (cycleData.ovulationDays.includes(day)) return '#F472B6'; // Pink
    if (cycleData.fertileDays.includes(day)) return '#A78BFA'; // Light Purple
    return '#CBD5E1'; // Gray
  };

  const generateDayMarkers = () => {
    const markers = [];
    const radius = circleRadius - 20;
    for (let day = 1; day <= cycleData.cycleLength; day++) {
      const pos = calculatePosition(day, cycleData.cycleLength, radius);
      const isCurrentDay = day === currentDay;
      markers.push(
        <View 
          key={day}
          style={[styles.dayMarker, {
            left: pos.x - 8, top: pos.y - 8,
            backgroundColor: getPhaseColor(day),
            borderWidth: isCurrentDay ? 2 : 0,
          }]}
        >
          {isCurrentDay && <Text style={styles.currentDayText}>{day}</Text>}
        </View>
      );
    }
    return markers;
  };

  const getCurrentPhaseName = () => {
    if (currentDay <= cycleData.periodLength) return 'Period';
    if (cycleData.ovulationDays.includes(currentDay)) return 'Ovulation';
    if (cycleData.fertileDays.includes(currentDay)) return 'Fertile Window';
    return currentDay < cycleData.ovulationDay ? 'Follicular Phase' : 'Luteal Phase';
  };

  const handleNextDay = () => {
    setCurrentDay((prev) => (prev < cycleData.cycleLength ? prev + 1 : 1));
  };
  
  const handlePrevDay = () => {
    setCurrentDay((prev) => (prev > 1 ? prev - 1 : cycleData.cycleLength));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Current Cycle</Text>
      <Text style={styles.subtitle}>Day {currentDay} of {cycleData.cycleLength}</Text>
      <View style={styles.cycleContainer}>
        <View style={styles.circleBackground} />
        {generateDayMarkers()}
        <View style={styles.centerText}>
          <Text style={styles.phaseName}>{getCurrentPhaseName()}</Text>
          <Text style={styles.periodIn}>Period in {cycleData.nextPeriodIn} days</Text>
        </View>
      </View>
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handlePrevDay} style={styles.navButton}><Text style={styles.navText}>◀</Text></TouchableOpacity>
        <TouchableOpacity onPress={handleNextDay} style={styles.navButton}><Text style={styles.navText}>▶</Text></TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.dailyLogButton} 
        onPress={(onClick)}>
        <Text style={styles.dailyLogText}>Daily Log</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3E8FF', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#6D28D9' },
  subtitle: { fontSize: 14, color: '#7C3AED', marginBottom: 16 },
  cycleContainer: { width: circleSize, height: circleSize, marginVertical: 24, position: 'relative' },
  circleBackground: { position: 'absolute', width: circleSize, height: circleSize, borderRadius: circleRadius, borderWidth: 2, borderColor: '#E9D5FF' },
  dayMarker: { position: 'absolute', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderColor: '#FFFFFF' },
  currentDayText: { fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' },
  centerText: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  phaseName: { fontSize: 18, fontWeight: '600', color: '#6D28D9' },
  periodIn: { fontSize: 14, color: '#7C3AED', marginTop: 4 },
  navigationButtons: { flexDirection: 'row', marginTop: 16 },
  navButton: { backgroundColor: '#D8B4FE', padding: 10, margin: 8, borderRadius: 8 },
  navText: { fontSize: 18, fontWeight: 'bold', color: '#6D28D9' },
  dailyLogButton: { marginTop: 20, backgroundColor: '#8B5CF6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  dailyLogText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});

export default AppCurrentCycle;
