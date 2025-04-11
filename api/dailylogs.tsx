///api/dailyLogs.tsx
import { doc, setDoc, collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

// Define DailyLog interface
export interface DailyLog {
  id?: string;
  userId: string;
  date: Date;
  cycleId?: string;
  period: string[];
  feelings: string[];
  pain: string[];
  cravings: string[];
  energy: string[];
  skin: string[];
  exercise: string[];
  updatedAt: Timestamp;
}

// Add or update a daily log
export const addDailyLog = async (userId: string, date: Date, logData: DailyLog): Promise<string> => {
  try {
    const dateString = new Date(date).toISOString().split('T')[0];
    const logRef = doc(collection(db, `users/${userId}/daily_logs`), dateString);

    await setDoc(logRef, {
      date: Timestamp.fromDate(new Date(date)),
      cycleId: logData.cycleId || null,
      period: logData.period || [],
      feelings: logData.feelings || [],
      pain: logData.pain || [],
      cravings: logData.cravings || [],
      energy: logData.energy || [],
      skin: logData.skin || [],
      exercise: logData.exercise || [],
      updatedAt: Timestamp.now(),
    }, { merge: true });

    return dateString;
  } catch (error) {
    console.error('Error adding daily log:', error);
    throw error;
  }
};

// Get daily logs for a date range
export const getDailyLogs = async (userId: string, startDate: Date, endDate: Date): Promise<DailyLog[]> => {
  try {
    const logsRef = collection(doc(db, "users", userId), "daily_logs");
    const start = Timestamp.fromDate(new Date(startDate));
    const end = Timestamp.fromDate(new Date(endDate));

    const q = query(logsRef, 
      where('date', '>=', start),
      where('date', '<=', end),
      orderBy('date', 'asc')
    );

    const querySnapshot = await getDocs(q);

    const logs: DailyLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      } as DailyLog);
    });

    return logs;
  } catch (error) {
    console.error('Error getting daily logs:', error);
    throw error;
  }
};