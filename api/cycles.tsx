// // src/api/cycles.ts
// import { doc, setDoc, updateDoc, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
// import { db } from '../FirebaseConfig';

// // Define Cycle interface
// export interface Cycle {
//   id?: string;
//   userId: string;
//   startDate: Date;
//   endDate?: Date;
//   cycleLength?: number;
//   periodLength?: number;
//   notes?: string;
//   createdAt: Timestamp;
// }

// // Add a new cycle
// export const addCycle = async (userId: string, cycleData: Cycle): Promise<string> => {
//   try {
//     const cycleRef = doc(collection(db, `users/${userId}/cycles`));
//     await setDoc(cycleRef, {
//       startDate: Timestamp.fromDate(new Date(cycleData.startDate)),
//       endDate: cycleData.endDate ? Timestamp.fromDate(new Date(cycleData.endDate)) : null,
//       cycleLength: cycleData.cycleLength || null,
//       periodLength: cycleData.periodLength || null,
//       notes: cycleData.notes || '',
//       createdAt: Timestamp.now(),
//     });
//     return cycleRef.id;
//   } catch (error) {
//     console.error('Error adding cycle:', error);
//     throw error;
//   }
// };

// // Update a cycle
// export const updateCycle = async (userId: string, cycleId: string, cycleData: Partial<Cycle>): Promise<void> => {
//   try {
//     const cycleRef = doc(db, `users/${userId}/cycles/${cycleId}`);
//     const updateData: Partial<Cycle> = {};

//     //if (cycleData.startDate) updateData.startDate = Timestamp.fromDate(new Date(cycleData.startDate));
//    // if (cycleData.endDate) updateData.endDate = Timestamp.fromDate(new Date(cycleData.endDate));
//     if (cycleData.cycleLength !== undefined) updateData.cycleLength = cycleData.cycleLength;
//     if (cycleData.periodLength !== undefined) updateData.periodLength = cycleData.periodLength;
//     if (cycleData.notes !== undefined) updateData.notes = cycleData.notes;

//     await updateDoc(cycleRef, updateData);
//   } catch (error) {
//     console.error('Error updating cycle:', error);
//     throw error;
//   }
// };

// // Get user's cycles
// export const getUserCycles = async (userId: string): Promise<Cycle[]> => {
//   try {
//     const cyclesRef = collection(db, `users/${userId}/cycles`);
//     const q = query(cyclesRef, orderBy('startDate', 'desc'));
//     const querySnapshot = await getDocs(q);

//     const cycles: Cycle[] = [];
//     querySnapshot.forEach((doc) => {
//       cycles.push({
//         id: doc.id,
//         ...doc.data(),
//         startDate: doc.data().startDate?.toDate(),
//         endDate: doc.data().endDate?.toDate(),
//       } as Cycle);
//     });

//     return cycles;
//   } catch (error) {
//     console.error('Error getting cycles:', error);
//     throw error;
//   }
// };

import { doc, getDoc, collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

export interface Cycle {
  id: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  cycleLength: number;
  periodLength: number;
  ovulationDay?: number;
  trackedDays: Timestamp[];
  createdAt: Date;
}

//fetch the latest cycle for a user
export const getCurrentCycle = async (userId: string): Promise<Cycle | null> => {
  try {
    const cyclesRef = collection(db, `users/${userId}/cycles`);
    const q = query(cyclesRef, orderBy('startDate', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId,
        startDate: data.startDate.toDate(),
        endDate: data.endDate?.toDate(),
        cycleLength: data.cycleLength || 28,
        periodLength: data.periodLength || 5,
        ovulationDay: data.ovulationDay || Math.floor((data.cycleLength || 28) / 2),
        trackedDays: data.trackedDays || [],
        createdAt: data.createdAt.toDate()
      };
    }
    return null;
  } catch (error) {
    console.error('🔥 Error fetching cycle:', error);
    throw error;
  }
};

//streak Calculation Function
export const calculateStreak = (trackedDays: Timestamp[]): number => {
  if (!trackedDays || trackedDays.length === 0) return 0;

  // Convert Firestore timestamps to JS Date objects and sort in descending order (latest first)
  const sortedDates = trackedDays
    .map(ts => ts.toDate())
    .sort((a, b) => b.getTime() - a.getTime());

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get the last logged date
  const lastLoggedDate = new Date(sortedDates[0]);
  const lastLoggedDayDiff = Math.floor((today.getTime() - lastLoggedDate.getTime()) / (1000 * 60 * 60 * 24));

  if (lastLoggedDayDiff > 1) {
    return 0; // Streak resets if last log was over a day ago
  }

  let streak = 1;

  // Check consecutive days
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = new Date(sortedDates[i - 1]);

    const diffTime = prevDate.getTime() - currentDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break; // Streak is broken
    }
  }

  return streak;
};



// import { doc, getDoc, collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
// import { db } from '../FirebaseConfig';

// export interface Cycle {
//   id: string;
//   userId: string;
//   startDate: Date;
//   endDate?: Date;
//   cycleLength: number;
//   periodLength: number;
//   ovulationDay?: number;
//   trackedDays: Timestamp[];
//   createdAt: Date;
// }

// // ✅ Fetch the latest cycle for a user
// export const getCurrentCycle = async (userId: string): Promise<Cycle | null> => {
//   try {
//     const cyclesRef = collection(db, `users/${userId}/cycles`);
//     const q = query(cyclesRef, orderBy('startDate', 'desc'), limit(1));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const docSnap = querySnapshot.docs[0];
//       const data = docSnap.data();
//       return {
//         id: docSnap.id,
//         userId,
//         startDate: data.startDate.toDate(),
//         endDate: data.endDate?.toDate(),
//         cycleLength: data.cycleLength || 28,
//         periodLength: data.periodLength || 5,
//         ovulationDay: data.ovulationDay || Math.floor((data.cycleLength || 28) / 2),
//         trackedDays: data.trackedDays || [],
//         createdAt: data.createdAt.toDate()
//       };
//     }
//     return null;
//   } catch (error) {
//     console.error('🔥 Error fetching cycle:', error);
//     throw error;
//   }
// };

// //streak calculation logic
// export const calculateStreak = (trackedDays: Timestamp[] = []): number => {
//   if (trackedDays.length === 0) return 0;

//   const now = new Date();
//   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   let streak = 0;

//   // Sort dates in descending order
//   const sortedDates = trackedDays
//     .map(ts => ts.toDate())
//     .sort((a, b) => b.getTime() - a.getTime());

//   // Check if the most recent log was today or yesterday
//   const lastLoggedDate = new Date(sortedDates[0]);
//   const lastLoggedDayDiff = Math.floor((today.getTime() - lastLoggedDate.getTime()) / (1000 * 60 * 60 * 24));

//   if (lastLoggedDayDiff > 1) {
//     return 0; // No recent log, reset streak
//   }

//   streak = 1;

//   // Check consecutive days
//   for (let i = 1; i < sortedDates.length; i++) {
//     const currentDate = new Date(sortedDates[i]);
//     const prevDate = new Date(sortedDates[i - 1]);

//     const diffTime = prevDate.getTime() - currentDate.getTime();
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) {
//       streak++;
//     } else {
//       break; // Streak is broken
//     }
//   }

//   return streak;
// };
