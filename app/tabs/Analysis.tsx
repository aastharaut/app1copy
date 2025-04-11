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

// export default AnalysisPage;
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { auth, db } from '../../FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type PeriodEntry = {
  start: string;
  end: string;
};

type SymptomTrend = {
  [symptom: string]: number;
};

const AnalysisScreen = () => {
  const [avgCycleLength, setAvgCycleLength] = useState<number>(0);
  const [avgPeriodLength, setAvgPeriodLength] = useState<number>(0);
  const [cycleHistory, setCycleHistory] = useState<number[]>([]);
  const [cycleDates, setCycleDates] = useState<string[]>([]);
  const [predictedCycles, setPredictedCycles] = useState<string[]>([]);
  const [symptomTrends, setSymptomTrends] = useState<SymptomTrend>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      const userId = auth.currentUser.uid;
      const logsRef = collection(db, 'daily_logs');
      const userLogsQuery = query(logsRef, where('__name__', '>=', userId), where('__name__', '<=', `${userId}~`));
      const snapshot = await getDocs(userLogsQuery);

      const sortedLogs = Array.from(snapshot.docs)
        .map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Extract period data
      const periods: PeriodEntry[] = [];
      const symptomCounts: SymptomTrend = {};

      for (const log of sortedLogs) {
        if (log.symptoms) {
          for (const symptom of log.symptoms) {
            if (symptom.selected) {
              symptomCounts[symptom.category] = (symptomCounts[symptom.category] || 0) + 1;
            }
          }
        }

        if (log.hasPeriod) {
          const dateStr = log.id.split('_')[1];
          periods.push({ start: dateStr, end: dateStr }); // refine this if you track end date
        }
      }

      // Calculate lengths
      const cycleLengths: number[] = [];
      const periodLengths: number[] = [];

      for (let i = 1; i < periods.length; i++) {
        const prev = new Date(periods[i - 1].start);
        const curr = new Date(periods[i].start);
        const diffDays = Math.ceil((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        cycleLengths.push(diffDays);
        cycleDates.push(periods[i].start);
      }

      periods.forEach(p => {
        periodLengths.push(1); // if end date is stored, calculate difference
      });

      const avgCycle = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length || 0;
      const avgPeriod = periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length || 0;

      // Predicted periods
      const predictions: string[] = [];
      if (periods.length > 0) {
        const lastStart = new Date(periods[periods.length - 1].start);
        for (let i = 1; i <= 3; i++) {
          const start = new Date(lastStart);
          start.setDate(start.getDate() + Math.round(avgCycle) * i);
          const end = new Date(start);
          end.setDate(start.getDate() + Math.round(avgPeriod));
          predictions.push(`${start.toDateString().slice(4, 10)} - ${end.toDateString().slice(4, 10)}`);
        }
      }

      setAvgCycleLength(Math.round(avgCycle));
      setAvgPeriodLength(Math.round(avgPeriod));
      setCycleHistory(cycleLengths);
      setCycleDates(periods.map(p => p.start));
      setPredictedCycles(predictions);
      setSymptomTrends(symptomCounts);
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Average Cycle Length</Text>
          <Text style={styles.cardValue}>{avgCycleLength} days</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Average Period Length</Text>
          <Text style={styles.cardValue}>{avgPeriodLength} days</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predicted Periods</Text>
        {predictedCycles.map((p, idx) => (
          <Text key={idx} style={styles.prediction}>{`Cycle #${idx + 1 + cycleHistory.length}: ${p}`}</Text>
        ))}
        <Text style={styles.disclaimer}>* Predictions are based on your cycle history.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cycle History</Text>
        <LineChart
          data={{
            labels: cycleDates.slice(1),
            datasets: [{ data: cycleHistory }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#8e44ad',
            labelColor: () => '#333',
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#8e44ad',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Symptom Trends</Text>
        {Object.entries(symptomTrends).map(([symptom, count]) => (
          <Text key={symptom} style={styles.symptomText}>
            {symptom} <Text style={styles.symptomCount}>{count}x</Text>
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default AnalysisScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#f6f2fc',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8e44ad',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  prediction: {
    backgroundColor: '#fdecef',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    color: '#8e44ad',
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  chart: {
    marginTop: 10,
    borderRadius: 12,
  },
  symptomText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  symptomCount: {
    color: '#8e44ad',
    fontWeight: '600',
  },
});
