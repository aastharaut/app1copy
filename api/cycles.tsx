// 

import { doc, getDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

interface Cycle {
  id: string;
  startDate: Date;
  cycleLength: number;
  periodLength: number;
  ovulationDay?: number;
  trackedDays?: Timestamp[]; // For streak calculation
}

export const getCurrentCycle = async (userId: string): Promise<Cycle | null> => {
  const docRef = doc(db, `users/${userId}/cycles/current`);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      startDate: data.startDate.toDate(),
      cycleLength: data.cycleLength || 28,
      periodLength: data.periodLength || 5,
      ovulationDay: data.ovulationDay || Math.floor(data.cycleLength / 2),
      trackedDays: data.trackedDays || []
    };
  }
  return null;
};

// Calculate streak from tracked days
export const calculateStreak = (trackedDays: Timestamp[]): number => {
  if (!trackedDays?.length) return 0;
  
  const today = new Date().toDateString();
  let streak = 0;
  
  // Sort newest first and check consecutive days
  trackedDays
    .map(ts => ts.toDate().toDateString())
    .sort((a,b) => new Date(b) - new Date(a))
    .forEach((day, i) => {
      const prevDay = new Date(new Date(day).setDate(new Date(day).getDate() + 1)).toDateString();
      if (i === 0 && day === today) streak++;
      else if (prevDay === trackedDays[i-1]?.toDate().toDateString()) streak++;
      else return;
    });
  
  return streak;
};