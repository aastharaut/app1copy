// React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// const screenWidth = Dimensions.get('window').width;
// const circleSize = screenWidth * 0.8;
// const circleRadius = circleSize / 2;

// const AppCurrentCycle = () => {
//   // Sample data - in a real app this would come from user input and calculations
//   const [cycleData] = useState({
//     currentDay: 14,
//     cycleLength: 28,
//     periodLength: 5,
//     ovulationDay: 14,
//     nextPeriodIn: 14,
//     periodDays: [1, 2, 3, 4, 5],
//     fertileDays: [10, 11, 12, 13, 14, 15, 16],
//     ovulationDays: [13, 14, 15],
//     symptoms: {
//       cramps: [2, 3],
//       headache: [1, 26],
//       mood: [12, 25, 26],
//       sleep: [4, 5]
//     }
//   });

//   // Calculate position on the circle for a given day
//   const calculatePosition = (day: number, totalDays: number, radius: number) => {
//     // Convert day to angle (starting from top, going clockwise)
//     const angle = ((day - 1) / totalDays) * 2 * Math.PI - (Math.PI / 2);
//     const x = radius * Math.cos(angle);
//     const y = radius * Math.sin(angle);
//     return { x: x + circleRadius, y: y + circleRadius };
//   };

//   // Get phase color based on day
//   const getPhaseColor = (day: number) => {
//     if (cycleData.periodDays.includes(day)) {
//       return '#FC8181'; // Period phase (red-400)
//     } else if (cycleData.ovulationDays.includes(day)) {
//       return '#68D391'; // Ovulation (green-400)
//     } else if (cycleData.fertileDays.includes(day)) {
//       return '#9AE6B4'; // Fertile window (green-200)
//     } else if (day > cycleData.periodLength && day < cycleData.fertileDays[0]) {
//       return '#90CDF4'; // Follicular phase (blue-200)
//     } else {
//       return '#D6BCFA'; // Luteal phase (purple-200)
//     }
//   };

//   // Generate day markers
//   const generateDayMarkers = () => {
//     const markers = [];
//     const radius = circleRadius - 20; // Slightly smaller to fit inside the circle
    
//     for (let day = 1; day <= cycleData.cycleLength; day++) {
//       const pos = calculatePosition(day, cycleData.cycleLength, radius);
//       const isCurrentDay = day === cycleData.currentDay;
//       const color = getPhaseColor(day);
//       const markerSize = isCurrentDay ? 24 : 16;
      
//       markers.push(
//         <View 
//           key={day}
//           style={[
//             styles.dayMarker,
//             {
//               left: pos.x - markerSize/2,
//               top: pos.y - markerSize/2,
//               width: markerSize,
//               height: markerSize,
//               backgroundColor: color,
//               borderWidth: isCurrentDay ? 2 : 0,
//             }
//           ]}
//         >
//           {isCurrentDay && (
//             <Text style={styles.currentDayText}>{day}</Text>
//           )}
//         </View>
//       );
//     }
    
//     return markers;
//   };

//   // Get current phase name
//   const getCurrentPhaseName = () => {
//     if (cycleData.currentDay <= cycleData.periodLength) {
//       return 'Period';
//     } else if (cycleData.ovulationDays.includes(cycleData.currentDay)) {
//       return 'Ovulation';
//     } else if (cycleData.fertileDays.includes(cycleData.currentDay)) {
//       return 'Fertile Window';
//     } else if (cycleData.currentDay < cycleData.ovulationDay) {
//       return 'Follicular Phase';
//     } else {
//       return 'Luteal Phase';
//     }
//   };

//   // Get today's description
//   const getTodayDescription = () => {
//     if (cycleData.currentDay <= cycleData.periodLength) {
//       return "Your period is expected to last for a few more days.";
//     } else if (cycleData.ovulationDays.includes(cycleData.currentDay)) {
//       return "You may be ovulating today. This is when an egg is released.";
//     } else if (cycleData.fertileDays.includes(cycleData.currentDay)) {
//       return "You're in your fertile window. Chances of pregnancy are higher.";
//     } else if (cycleData.currentDay < cycleData.fertileDays[0]) {
//       return "You're in your follicular phase. Your body is preparing to release an egg.";
//     } else {
//       return "You're in your luteal phase. Your body is preparing for your next period.";
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Your Current Cycle</Text>
//         <Text style={styles.subtitle}>Day {cycleData.currentDay} of {cycleData.cycleLength}</Text>
//       </View>
      
//       {/* Cycle circle visualization */}
//       <View style={styles.cycleContainer}>
//         {/* Circle background */}
//         <View style={styles.circleBackground} />
        
//         {/* Day markers */}
//         {generateDayMarkers()}
        
//         {/* Center text */}
//         <View style={styles.centerText}>
//           <Text style={styles.phaseName}>{getCurrentPhaseName()}</Text>
//           {cycleData.currentDay > cycleData.periodLength && cycleData.nextPeriodIn > 0 && (
//             <Text style={styles.periodIn}>Period in {cycleData.nextPeriodIn} days</Text>
//           )}
//         </View>
//       </View>
      
//    
      
//       {/* Today's summary */}
//       <View style={styles.summaryContainer}>
//         <Text style={styles.summaryTitle}>Today</Text>
//         <Text style={styles.summaryText}>{getTodayDescription()}</Text>
//       </View>
//     </View>
//   );
// };
import React from 'react';
import { View, Text } from 'react-native';

const ComponentName = () => {
  return (
    <View>
      <Text>ComponentName</Text>
    </View>
  );
};

export default ComponentName;