import { getFirestore, collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { auth } from '../FirebaseConfig';

// Type definitions
export interface CycleData {
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

export interface SymptomLog {
  userId: string;
  date: string;
  symptoms: {
    category: string;
    selected: number | null;
  }[];
  hasPeriod: boolean;
  updatedAt: any;
}

export interface PeriodHistory {
  date: Date;
  length: number;
  cycleLength?: number;
}

export interface SymptomSummary {
  category: string;
  label: string;
  count: number;
}

export interface AnalysisResult {
  avgCycleLength: number;
  avgPeriodLength: number;
  nextPeriods: Date[];
  periodHistory: PeriodHistory[];
  topSymptoms: SymptomSummary[];
  periodVariability: number;
  cycleData: CycleData | null;
  error?: string;
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
};

export const fetchAnalysisData = async (): Promise<AnalysisResult> => {
  try {
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
      return {
        avgCycleLength: 28,
        avgPeriodLength: 5,
        nextPeriods: [],
        periodHistory: [],
        topSymptoms: [],
        periodVariability: 0,
        cycleData: null,
        error: 'No cycle data found'
      };
    }
    
    const cycleDoc = cycleSnapshot.docs[0];
    const userData = cycleDoc.data() as CycleData;
    
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
    
    // 3. Calculate averages
    // Average cycle length
    const calculatedAvgCycleLength = cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
      : userData.cycleLength || 28;
    
    // Average period length
    const periodLengths = periods.map(p => p.length);
    const calculatedAvgPeriodLength = periodLengths.length > 0
      ? Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)
      : userData.periodLength || 5;
    
    // Calculate period variability (standard deviation of cycle lengths)
    let calculatedVariability = 0;
    if (cycleLengths.length > 1) {
      const mean = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
      const squaredDiffs = cycleLengths.map(length => Math.pow(length - mean, 2));
      const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
      calculatedVariability = Math.round(Math.sqrt(variance) * 10) / 10;
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

    // 5. Fetch most common symptoms
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
    
    // Map to symptom categories
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

    return {
      avgCycleLength: calculatedAvgCycleLength,
      avgPeriodLength: calculatedAvgPeriodLength,
      nextPeriods: nextPredictions,
      periodHistory: periods,
      topSymptoms: sortedSymptoms,
      periodVariability: calculatedVariability,
      cycleData: userData
    };

  } catch (error) {
    console.error('Error in fetchAnalysisData:', error);
    return {
      avgCycleLength: 28,
      avgPeriodLength: 5,
      nextPeriods: [],
      periodHistory: [],
      topSymptoms: [],
      periodVariability: 0,
      cycleData: null,
      error: 'Failed to load analysis data'
    };
  }
};