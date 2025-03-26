// src/api/users.ts
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
  } from 'firebase/auth';
  import { doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
  import { db, auth } from '../FirebaseConfig';
  
  // Define User interface
  export interface UserProfile {
    username: string;
    email: string;
    dateOfBirth?: Date;
    createdAt: Timestamp;
    lastLogin: Timestamp;
  }
  
  // Register a new user
  export const registerUser = async (
    email: string,
    password: string,
    username: string,
    dateOfBirth?: Date
  ): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, { displayName: username });
  
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        dateOfBirth: dateOfBirth ? Timestamp.fromDate(dateOfBirth) : null,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
      });
  
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  
  // Login user
  export const loginUser = async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: Timestamp.now(),
      });
  
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  // Logout user
  export const logoutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };
  
  // Get user profile
  export const getUserProfile = async (userId: string): Promise<UserProfile> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  };