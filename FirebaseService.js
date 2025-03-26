import { 
    collection, doc, setDoc, addDoc, updateDoc, getDoc, getDocs, 
    query, where, orderBy, Timestamp, deleteDoc 
  } from 'firebase/firestore';
  import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile
  } from 'firebase/auth';
  import { db, auth } from 'firebase';
  
  // ==================== USER MANAGEMENT ====================
  
  // Register a new user
  export const registerUser = async (email, password, username, dateOfBirth) => {
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, { displayName: username });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        date_of_birth: dateOfBirth ? Timestamp.fromDate(new Date(dateOfBirth)) : null,
        created_at: Timestamp.now(),
        last_login: Timestamp.now()
      });
      
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  
  // Login user
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        last_login: Timestamp.now()
      });
      
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  // Logout user
  export const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };
  
  // Get user profile
  export const getUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  };
  
  // ==================== CYCLE MANAGEMENT ====================
  
  // Add a new cycle
  export const addCycle = async (userId, cycleData) => {
    try {
      const cycleRef = doc(collection(db, `users/${userId}/cycles`));
      await setDoc(cycleRef, {
        start_date: Timestamp.fromDate(new Date(cycleData.startDate)),
        end_date: cycleData.endDate ? Timestamp.fromDate(new Date(cycleData.endDate)) : null,
        cycle_length: cycleData.cycleLength || null,
        period_length: cycleData.periodLength || null,
        notes: cycleData.notes || '',
        created_at: Timestamp.now()
      });
      return cycleRef.id;
    } catch (error) {
      console.error('Error adding cycle:', error);
      throw error;
    }
  };
  
  // Update a cycle
  export const updateCycle = async (userId, cycleId, cycleData) => {
    try {
      const cycleRef = doc(db, `users/${userId}/cycles/${cycleId}`);
      const updateData = {};
      
      if (cycleData.startDate) {
        updateData.start_date = Timestamp.fromDate(new Date(cycleData.startDate));
      }
      if (cycleData.endDate) {
        updateData.end_date = Timestamp.fromDate(new Date(cycleData.endDate));
      }
      if (cycleData.cycleLength !== undefined) {
        updateData.cycle_length = cycleData.cycleLength;
      }
      if (cycleData.periodLength !== undefined) {
        updateData.period_length = cycleData.periodLength;
      }
      if (cycleData.notes !== undefined) {
        updateData.notes = cycleData.notes;
      }
      
      await updateDoc(cycleRef, updateData);
      return cycleId;
    } catch (error) {
      console.error('Error updating cycle:', error);
      throw error;
    }
  };s
  
  // Get user's cycles
  export const getUserCycles = async (userId) => {
    try {
      const cyclesRef = collection(db, `users/${userId}/cycles`);
      const q = query(cyclesRef, orderBy('start_date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const cycles = [];
      querySnapshot.forEach((doc) => {
        cycles.push({
          id: doc.id,
          ...doc.data(),
          start_date: doc.data().start_date?.toDate(),
          end_date: doc.data().end_date?.toDate()
        });
      });
      
      return cycles;
    } catch (error) {
      console.error('Error getting cycles:', error);
      throw error;
    }
  };
  
  // ==================== DAILY LOG MANAGEMENT ====================
  
  // Add or update a daily log
  export const addDailyLog = async (userId, date, logData) => {
    try {
      // Format date as YYYY-MM-DD for document ID
      const dateString = new Date(date).toISOString().split('T')[0];
      const logRef = doc(db, `users/${userId}/daily_logs/${dateString}`);
      
      await setDoc(logRef, {
        date: Timestamp.fromDate(new Date(date)),
        cycle_id: logData.cycleId || null,
        period: logData.period || [],
        feelings: logData.feelings || [],
        pain: logData.pain || [],
        cravings: logData.cravings || [],
        energy: logData.energy || [],
        skin: logData.skin || [],
        exercise: logData.exercise || [],
        notes: logData.notes || '',
        updated_at: Timestamp.now()
      }, { merge: true });
      
      return dateString;
    } catch (error) {
      console.error('Error adding daily log:', error);
      throw error;
    }
  };
  
  // Get daily logs for a date range
  export const getDailyLogs = async (userId, startDate, endDate) => {
    try {
      const logsRef = collection(db, `users/${userId}/daily_logs`);
      const start = Timestamp.fromDate(new Date(startDate));
      const end = Timestamp.fromDate(new Date(endDate));
      
      const q = query(logsRef, 
        where('date', '>=', start),
        where('date', '<=', end),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const logs = [];
      querySnapshot.forEach((doc) => {
        logs.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate()
        });
      });
      
      return logs;
    } catch (error) {
      console.error('Error getting daily logs:', error);
      throw error;
    }
  };
      

  