// src/api/cycles.ts
import { doc, setDoc, updateDoc, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

// Define Cycle interface
export interface Cycle {
  id?: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  cycleLength?: number;
  periodLength?: number;
  notes?: string;
  createdAt: Timestamp;
}

// Add a new cycle
export const addCycle = async (userId: string, cycleData: Cycle): Promise<string> => {
  try {
    const cycleRef = doc(collection(db, `users/${userId}/cycles`));
    await setDoc(cycleRef, {
      startDate: Timestamp.fromDate(new Date(cycleData.startDate)),
      endDate: cycleData.endDate ? Timestamp.fromDate(new Date(cycleData.endDate)) : null,
      cycleLength: cycleData.cycleLength || null,
      periodLength: cycleData.periodLength || null,
      notes: cycleData.notes || '',
      createdAt: Timestamp.now(),
    });
    return cycleRef.id;
  } catch (error) {
    console.error('Error adding cycle:', error);
    throw error;
  }
};

// Update a cycle
export const updateCycle = async (userId: string, cycleId: string, cycleData: Partial<Cycle>): Promise<void> => {
  try {
    const cycleRef = doc(db, `users/${userId}/cycles/${cycleId}`);
    const updateData: Partial<Cycle> = {};

    //if (cycleData.startDate) updateData.startDate = Timestamp.fromDate(new Date(cycleData.startDate));
   // if (cycleData.endDate) updateData.endDate = Timestamp.fromDate(new Date(cycleData.endDate));
    if (cycleData.cycleLength !== undefined) updateData.cycleLength = cycleData.cycleLength;
    if (cycleData.periodLength !== undefined) updateData.periodLength = cycleData.periodLength;
    if (cycleData.notes !== undefined) updateData.notes = cycleData.notes;

    await updateDoc(cycleRef, updateData);
  } catch (error) {
    console.error('Error updating cycle:', error);
    throw error;
  }
};

// Get user's cycles
export const getUserCycles = async (userId: string): Promise<Cycle[]> => {
  try {
    const cyclesRef = collection(db, `users/${userId}/cycles`);
    const q = query(cyclesRef, orderBy('startDate', 'desc'));
    const querySnapshot = await getDocs(q);

    const cycles: Cycle[] = [];
    querySnapshot.forEach((doc) => {
      cycles.push({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate(),
      } as Cycle);
    });

    return cycles;
  } catch (error) {
    console.error('Error getting cycles:', error);
    throw error;
  }
};