// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
// import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { LineChart } from 'react-native-chart-kit';


// const AnalysisPage = () => {
//   const [nextPeriodDate, setNextPeriodDate] = useState<string | null>(null);
//   const [nextOvulationDate, setNextOvulationDate] = useState<string | null>(null);
//   const [cycleHistory, setCycleHistory] = useState<any[]>([]);
//   const [mostLoggedSymptoms, setMostLoggedSymptoms] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
  
//   const db = getFirestore();
//   const auth = getAuth();
//   const userId = auth.currentUser?.uid;
  
//   useEffect(() => {
//     if (userId) {
//       fetchCycleData();
//       fetchSymptomHistory();
//     }
//   }, [userId]);
  
//   const fetchCycleData = async () => {
//     const userId = auth.currentUser?.uid; // Get the current user ID
//     if (!userId) {
//       Alert.alert('Error', 'User not logged in');
//       return;
//     }
  
//     // Correct Firestore collection reference
//     const cycleRef = collection(db, 'users', userId, 'cycles'); // Ensure userId is passed correctly
    
//     try {
//       const q = query(cycleRef, orderBy('createdAt', 'desc'));
//       const cycleSnap = await getDocs(q);
//       const cycles = cycleSnap.docs.map(doc => doc.data());
  
//       if (cycles.length > 0) {
//         const lastCycle = cycles[0];
//         const cycleLength = lastCycle.cycleLength;
//         const lastPeriodDate = new Date(lastCycle.lastPeriodDate1.seconds * 1000); // Convert Firestore timestamp to JS Date
//         const ovulationDate = new Date(lastPeriodDate);
//         ovulationDate.setDate(lastPeriodDate.getDate() + cycleLength - 14); // Ovulation occurs 14 days before the next period
//         const nextPeriod = new Date(lastPeriodDate);
//         nextPeriod.setDate(lastPeriodDate.getDate() + cycleLength); // Next period is cycleLength days after the last period
  
//         setNextPeriodDate(nextPeriod.toLocaleDateString());
//         setNextOvulationDate(ovulationDate.toLocaleDateString());
//         setCycleHistory(cycles);
//       } else {
//         Alert.alert('No cycle data found', 'Please log your cycle data first.');
//       }
//     } catch (error) {
//       console.error('Error fetching cycle data:', error);
//       Alert.alert('Error', 'Failed to fetch cycle data');
//     }
  
//     setLoading(false);
//   };
  

//   const fetchSymptomHistory = async () => {
//     try {
//       const userId = auth.currentUser?.uid;
//       if (!userId) {
//         Alert.alert('Error', 'User not logged in');
//         return;
//       }
  
//       const symptomsRef = collection(db, 'users', userId, 'dailylogs');
//       const symptomSnap = await getDocs(symptomsRef);
//       const symptomData = symptomSnap.docs.map(doc => doc.data()) as { symptom: string; date: string }[];
  
//       const symptomCount: { [key: string]: number } = {};
//       symptomData.forEach((entry) => {
//         const symptom = entry.symptom;
//         symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
//       });
  
//       const sortedSymptoms = Object.entries(symptomCount)
//         .sort((a, b) => b[1] - a[1]) // Sort by frequency
//         .slice(0, 5) // Get top 5 most logged symptoms
//         .map(([symptom, count]) => ({ symptom, count }));
  
//       setMostLoggedSymptoms(sortedSymptoms);
//     } catch (error) {
//       console.error('Error fetching symptom history:', error);
//       Alert.alert('Error', 'Failed to fetch symptom history');
//     }
//   };
  
//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <Text>Loading...</Text>
//       ) : (
//         <>
//           <Text style={styles.title}>Analysis</Text>

//           <View style={styles.section}>
//             <Text style={styles.heading}>Next Period</Text>
//             <Text>{nextPeriodDate}</Text>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.heading}>Next Ovulation</Text>
//             <Text>{nextOvulationDate}</Text>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.heading}>Cycle History</Text>
//             <FlatList
//               data={cycleHistory}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.cycleItem}>
//                   <Text>Cycle Length: {item.cycleLength} days</Text>
//                   <Text>Last Period: {new Date(item.lastPeriodDate1.seconds * 1000).toLocaleDateString()}</Text>
//                   <Text>Phase: {item.currentPhase}</Text>
//                 </View>
//               )}
//             />
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.heading}>Most Logged Symptoms</Text>
//             {mostLoggedSymptoms.length === 0 ? (
//               <Text>No symptoms logged yet.</Text>
//             ) : (
//               mostLoggedSymptoms.map((item, index) => (
//                 <Text key={index}>{item.symptom}: {item.count} times</Text>
//               ))
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   section: { marginBottom: 20 },
//   heading: { fontSize: 18, fontWeight: 'bold' },
//   cycleItem: { marginBottom: 10 },
// });

// // export default AnalysisPage;
// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
// import { auth, db } from '../../FirebaseConfig';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { LineChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// type PeriodEntry = {
//   start: string;
//   end: string;
// };

// type SymptomTrend = {
//   [symptom: string]: number;
// };

// const AnalysisScreen = () => {
//   const [avgCycleLength, setAvgCycleLength] = useState<number>(0);
//   const [avgPeriodLength, setAvgPeriodLength] = useState<number>(0);
//   const [cycleHistory, setCycleHistory] = useState<number[]>([]);
//   const [cycleDates, setCycleDates] = useState<string[]>([]);
//   const [predictedCycles, setPredictedCycles] = useState<string[]>([]);
//   const [symptomTrends, setSymptomTrends] = useState<SymptomTrend>({});

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!auth.currentUser) return;

//       const userId = auth.currentUser.uid;
//       const logsRef = collection(db, 'daily_logs');
//       const userLogsQuery = query(logsRef, where('__name__', '>=', userId), where('__name__', '<=', `${userId}~`));
//       const snapshot = await getDocs(userLogsQuery);

//       const sortedLogs = Array.from(snapshot.docs)
//         .map(doc => ({
//           ...doc.data(),
//           id: doc.id,
//         }))
//         .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//       // Extract period data
//       const periods: PeriodEntry[] = [];
//       const symptomCounts: SymptomTrend = {};

//       for (const log of sortedLogs) {
//         if (log.symptoms) {
//           for (const symptom of log.symptoms) {
//             if (symptom.selected) {
//               symptomCounts[symptom.category] = (symptomCounts[symptom.category] || 0) + 1;
//             }
//           }
//         }

//         if (log.hasPeriod) {
//           const dateStr = log.id.split('_')[1];
//           periods.push({ start: dateStr, end: dateStr }); // refine this if you track end date
//         }
//       }

//       // Calculate lengths
//       const cycleLengths: number[] = [];
//       const periodLengths: number[] = [];

//       for (let i = 1; i < periods.length; i++) {
//         const prev = new Date(periods[i - 1].start);
//         const curr = new Date(periods[i].start);
//         const diffDays = Math.ceil((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
//         cycleLengths.push(diffDays);
//         cycleDates.push(periods[i].start);
//       }

//       periods.forEach(p => {
//         periodLengths.push(1); // if end date is stored, calculate difference
//       });

//       const avgCycle = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length || 0;
//       const avgPeriod = periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length || 0;

//       // Predicted periods
//       const predictions: string[] = [];
//       if (periods.length > 0) {
//         const lastStart = new Date(periods[periods.length - 1].start);
//         for (let i = 1; i <= 3; i++) {
//           const start = new Date(lastStart);
//           start.setDate(start.getDate() + Math.round(avgCycle) * i);
//           const end = new Date(start);
//           end.setDate(start.getDate() + Math.round(avgPeriod));
//           predictions.push(`${start.toDateString().slice(4, 10)} - ${end.toDateString().slice(4, 10)}`);
//         }
//       }

//       setAvgCycleLength(Math.round(avgCycle));
//       setAvgPeriodLength(Math.round(avgPeriod));
//       setCycleHistory(cycleLengths);
//       setCycleDates(periods.map(p => p.start));
//       setPredictedCycles(predictions);
//       setSymptomTrends(symptomCounts);
//     };

//     fetchData();
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.cardRow}>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Average Cycle Length</Text>
//           <Text style={styles.cardValue}>{avgCycleLength} days</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Average Period Length</Text>
//           <Text style={styles.cardValue}>{avgPeriodLength} days</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Predicted Periods</Text>
//         {predictedCycles.map((p, idx) => (
//           <Text key={idx} style={styles.prediction}>{`Cycle #${idx + 1 + cycleHistory.length}: ${p}`}</Text>
//         ))}
//         <Text style={styles.disclaimer}>* Predictions are based on your cycle history.</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Cycle History</Text>
//         <LineChart
//           data={{
//             labels: cycleDates.slice(1),
//             datasets: [{ data: cycleHistory }],
//           }}
//           width={screenWidth - 40}
//           height={220}
//           chartConfig={{
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             color: () => '#8e44ad',
//             labelColor: () => '#333',
//             propsForDots: {
//               r: '4',
//               strokeWidth: '2',
//               stroke: '#8e44ad',
//             },
//           }}
//           bezier
//           style={styles.chart}
//         />
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Symptom Trends</Text>
//         {Object.entries(symptomTrends).map(([symptom, count]) => (
//           <Text key={symptom} style={styles.symptomText}>
//             {symptom} <Text style={styles.symptomCount}>{count}x</Text>
//           </Text>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default AnalysisScreen;

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingBottom: 80,
//   },
//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: '#f6f2fc',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   cardTitle: {
//     fontSize: 14,
//     color: '#555',
//   },
//   cardValue: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#8e44ad',
//   },
//   section: {
//     marginBottom: 28,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   prediction: {
//     backgroundColor: '#fdecef',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 6,
//     color: '#8e44ad',
//     fontWeight: '600',
//   },
//   disclaimer: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 4,
//   },
//   chart: {
//     marginTop: 10,
//     borderRadius: 12,
//   },
//   symptomText: {
//     fontSize: 15,
//     color: '#444',
//     marginBottom: 4,
//   },
//   symptomCount: {
//     color: '#8e44ad',
//     fontWeight: '600',
//   },
// });
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { getFirestore, collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { auth } from '../../FirebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Type definitions
interface CycleData {
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
  createdAt?: any;
  lastUpdated?: any;
}

interface SymptomLog {
  userId: string;
  date: string;
  symptoms: {
    category: string;
    selected: number | null;
  }[];
  hasPeriod: boolean;
  updatedAt: any;
}

interface PeriodHistory {
  date: Date;
  length: number;
  cycleLength?: number;
}

interface SymptomSummary {
  category: string;
  label: string;
  count: number;
}

const screenWidth = Dimensions.get('window').width;

const AnalysisScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis data
  const [avgCycleLength, setAvgCycleLength] = useState<number>(28);
  const [avgPeriodLength, setAvgPeriodLength] = useState<number>(5);
  const [nextPeriods, setNextPeriods] = useState<Date[]>([]);
  const [periodHistory, setPeriodHistory] = useState<PeriodHistory[]>([]);
  const [topSymptoms, setTopSymptoms] = useState<SymptomSummary[]>([]);
  const [periodVariability, setPeriodVariability] = useState<number>(0);
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  


  useEffect(() => {
    if (auth.currentUser) {
      fetchAnalysisData();
    } else {
      setError('You must be logged in to view analysis');
      setLoading(false);
    }
  }, []);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const db = getFirestore();
      
      // 1. Fetch current cycle data
      const cyclesRef = collection(db, "cycles");
      const cycleQuery = query(cyclesRef, where("userId", "==", userId));
      const cycleSnapshot = await getDocs(cycleQuery);
      
      if (cycleSnapshot.empty) {
        setError('No cycle data found');
        setLoading(false);
        return;
      }
      
      const cycleDoc = cycleSnapshot.docs[0];
      const userData = cycleDoc.data() as CycleData;
      setCycleData(userData);
      
      // 2. Fetch period history from daily logs
      const logsRef = collection(db, "daily_logs");
      const logsQuery = query(
        logsRef,
        where("userId", "==", userId),
        where("hasPeriod", "==", true),
        orderBy("date", "desc")
      );
      const logsSnapshot = await getDocs(logsQuery);
      
      // Process period history
      const periods: PeriodHistory[] = [];
      let lastPeriodStartDate: Date | null = null;
      let currentPeriodLength = 0;
      let previousPeriodDate: Date | null = null;
      let cycleLengths: number[] = [];
      
      // Convert logs to period history
      logsSnapshot.docs.forEach(doc => {
        const log = doc.data() as SymptomLog;
        const logDate = new Date(log.date);
        
        // If this is a continuation of the same period (within 2 days)
        if (lastPeriodStartDate && 
            (logDate.getTime() - lastPeriodStartDate.getTime()) / (1000 * 60 * 60 * 24) <= 2) {
          currentPeriodLength++;
        } else {
          // This is a new period
          if (lastPeriodStartDate) {
            // Save the previous period
            periods.push({
              date: lastPeriodStartDate,
              length: currentPeriodLength
            });
            
            // Calculate cycle length if we have two consecutive periods
            if (previousPeriodDate) {
              const cycleLength = Math.round(
                (previousPeriodDate.getTime() - lastPeriodStartDate.getTime()) / 
                (1000 * 60 * 60 * 24)
              );
              
              if (cycleLength > 0 && cycleLength < 100) { // Sanity check
                cycleLengths.push(cycleLength);
                // Update the last period with cycle length
                periods[periods.length - 1].cycleLength = cycleLength;
              }
            }
            
            previousPeriodDate = lastPeriodStartDate;
          }
          
          // Start new period
          lastPeriodStartDate = logDate;
          currentPeriodLength = 1;
        }
      });
      
      // Add the last period if exists
      if (lastPeriodStartDate && currentPeriodLength > 0) {
        periods.push({
          date: lastPeriodStartDate,
          length: currentPeriodLength
        });
      }
      
      setPeriodHistory(periods);
      
      // 3. Calculate averages
      // Average cycle length
      const calculatedAvgCycleLength = cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
        : userData.cycleLength || 28;
      
      setAvgCycleLength(calculatedAvgCycleLength);
      
      // Average period length
      const periodLengths = periods.map(p => p.length);
      const calculatedAvgPeriodLength = periodLengths.length > 0
        ? Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)
        : userData.periodLength || 5;
      
      setAvgPeriodLength(calculatedAvgPeriodLength);
      
      // Calculate period variability (standard deviation of cycle lengths)
      if (cycleLengths.length > 1) {
        const mean = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
        const squaredDiffs = cycleLengths.map(length => Math.pow(length - mean, 2));
        const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
        setPeriodVariability(Math.round(Math.sqrt(variance) * 10) / 10);
      }
      
      // 4. Predict next periods
      const lastPeriodDate = userData.lastPeriodDate1 instanceof Date 
        ? userData.lastPeriodDate1 
        : userData.lastPeriodDate1.toDate();
      
      const nextPredictions: Date[] = [];
      let nextDate = new Date(lastPeriodDate);
      
      for (let i = 0; i < 3; i++) {
        nextDate = new Date(nextDate);
        nextDate.setDate(nextDate.getDate() + calculatedAvgCycleLength);
        nextPredictions.push(new Date(nextDate));
      }

      console.log(calculatedAvgCycleLength)
      
      setNextPeriods(nextPredictions);
  
      // 6. Fetch most common symptoms
      const allLogsQuery = query(
        logsRef,
        where("userId", "==", userId),
        orderBy("date", "desc"),
        limit(90) // Last 90 days of logs
      );
      
      const allLogsSnapshot = await getDocs(allLogsQuery);
      const symptomCounts: Record<string, Record<number, number>> = {};
      
      allLogsSnapshot.docs.forEach(doc => {
        const log = doc.data() as SymptomLog;
        
        log.symptoms.forEach(symptom => {
          if (symptom.selected !== null) {
            if (!symptomCounts[symptom.category]) {
              symptomCounts[symptom.category] = {};
            }
            
            if (!symptomCounts[symptom.category][symptom.selected]) {
              symptomCounts[symptom.category][symptom.selected] = 0;
            }
            
            symptomCounts[symptom.category][symptom.selected]++;
          }
        });
      });
      
      // Map to symptom categories from the other file
      const symptomLabels: Record<string, Record<number, string>> = {
        "Period": { 0: "Light", 1: "Medium", 2: "Heavy", 3: "Spotting" },
        "Feelings": { 0: "Happy", 1: "Anxious", 2: "Mood Swings", 3: "Sad" },
        "Pain": { 0: "Back", 1: "Lower Belly", 2: "Breast", 3: "Joints" },
        "Energy": { 0: "Zen", 1: "No Energy", 2: "Good", 3: "High" },
        "Cravings": { 0: "Salty", 1: "Carbs", 2: "Spicy", 3: "Sweet" },
        "Skin": { 0: "Great", 1: "Acne", 2: "Oily", 3: "Dry" },
        "Exercise": { 0: "Weights", 1: "Cardio", 2: "Mat-exercises", 3: "Gymnastics" }
      };
      
      // Create a flat list of all symptoms with counts
      const symptomList: SymptomSummary[] = [];
      
      Object.entries(symptomCounts).forEach(([category, options]) => {
        Object.entries(options).forEach(([optionIndex, count]) => {
          const index = parseInt(optionIndex);
          symptomList.push({
            category,
            label: symptomLabels[category]?.[index] || `Option ${index}`,
            count
          });
        });
      });
      
      // Sort by frequency and take top 5
      const sortedSymptoms = symptomList.sort((a, b) => b.count - a.count).slice(0, 5);
      setTopSymptoms(sortedSymptoms);
      
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      setError('Failed to load analysis data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={styles.loadingText}>Analyzing your cycle data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchAnalysisData}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cycle Analysis</Text>
        <TouchableOpacity onPress={fetchAnalysisData} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#4B0082" />
        </TouchableOpacity>
      </View>
      
      {/* Cycle Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Current Cycle Metrics</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{avgCycleLength}</Text>
            <Text style={styles.metricLabel}>Avg Cycle Length</Text>
            <Text style={styles.metricUnit}>days</Text>
          </View>
          
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{avgPeriodLength}</Text>
            <Text style={styles.metricLabel}>Avg Period Length</Text>
            <Text style={styles.metricUnit}>days</Text>
          </View>
          
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{periodVariability || "N/A"}</Text>
            <Text style={styles.metricLabel}>Cycle Variability</Text>
            <Text style={styles.metricUnit}>days</Text>
          </View>
        </View>
      </View>

      {/* Next Period Predictions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Periods</Text>
        {nextPeriods.map((date, index) => (
          <View key={index} style={styles.predictionCard}>
            <View style={styles.predictionIconContainer}>
              <Ionicons name="calendar" size={24} color="#4B0082" />
            </View>
            <View style={styles.predictionTextContainer}>
              <Text style={styles.predictionPrimary}>
                {index === 0 ? 'Next Period' : `Period ${index + 1}`}
              </Text>
              <Text style={styles.predictionDate}>{formatDate(date)}</Text>
            </View>
            <View style={styles.predictionDaysContainer}>
              <Text style={styles.predictionDays}>
              {index === 0 
                ? Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + ' days'
                : Math.round((date.getTime() - nextPeriods[index-1].getTime()) / (1000 * 60 * 60 * 24)) + ' days'}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      {/* Period History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Period History</Text>
        {periodHistory.length > 0 ? (
          periodHistory.slice(0, 5).map((period, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyIconContainer}>
                <Ionicons name="water" size={20} color="#4B0082" />
              </View>
              <View style={styles.historyTextContainer}>
                <Text style={styles.historyDate}>
                  {period.date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
                <Text style={styles.historyDetails}>
                  Duration: {period.length} days
                  {period.cycleLength ? ` • Cycle: ${period.cycleLength} days` : ''}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No period history found with us</Text>
        )}
      </View>
      
      {/* Most Common Symptoms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Logged Symptoms</Text>
        {topSymptoms.length > 0 ? (
          topSymptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <View style={styles.symptomRank}>
                <Text style={styles.symptomRankText}>{index + 1}</Text>
              </View>
              <View style={styles.symptomTextContainer}>
                <Text style={styles.symptomCategory}>{symptom.category}</Text>
                <Text style={styles.symptomLabel}>{symptom.label}</Text>
              </View>
              <View style={styles.symptomCountContainer}>
                <Text style={styles.symptomCount}>{symptom.count} times</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No symptoms logged yet</Text>
        )}
      </View>
      
      {/* Insights */}
      <View style={[styles.section, styles.insightSection]}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <Text style={styles.insightText}>
          Your cycles are {periodVariability > 7 ? 'moderately variable' : 'relatively regular'}.
          {avgCycleLength < 25 ? ' Your cycles tend to be shorter than average.' : 
           avgCycleLength > 32 ? ' Your cycles tend to be longer than average.' : 
           ' Your cycle length is within the typical range.'}
        </Text>
        <Text style={styles.insightText}>
          Your periods typically last for {avgPeriodLength} days, which is 
          {avgPeriodLength < 4 ? ' shorter than' : 
           avgPeriodLength > 7 ? ' longer than' : ' about'} average.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0FF',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  refreshButton: {
    padding: 8,
    position: 'absolute',
    right: 16,
    //top: '50%',
    transform: [{ translateY: 0 }],

  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightSection: {
    backgroundColor: '#f0f0ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9ff',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  metricUnit: {
    fontSize: 12,
    color: '#999',
  },
  predictionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  predictionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  predictionTextContainer: {
    flex: 1,
  },
  predictionPrimary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  predictionDate: {
    fontSize: 14,
    color: '#666',
  },
  predictionDaysContainer: {
    backgroundColor: '#4B0082',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  predictionDays: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  historyDetails: {
    fontSize: 12,
    color: '#666',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  symptomRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4B0082',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symptomRankText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  symptomTextContainer: {
    flex: 1,
  },
  symptomCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  symptomLabel: {
    fontSize: 12,
    color: '#666',
  },
  symptomCountContainer: {
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  symptomCount: {
    fontSize: 12,
    color: '#4B0082',
  },
  insightText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#e53935',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default AnalysisScreen;