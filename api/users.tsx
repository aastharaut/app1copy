// // /api/users.tsx
// import { 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword,
//     signOut,
//     updateProfile,
//     User
//   } from 'firebase/auth';
//   import { doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
//   import { db, auth } from '../FirebaseConfig';
  
//   // Define User interface
//   export interface UserProfile {
//     username: string;
//     email: string;
//     dateOfBirth?: Date;
//     createdAt: Timestamp;
//     lastLogin: Timestamp;
//   }
  
//   // Register a new user
//   export const registerUser = async (
//     email: string,
//     password: string,
//     username: string,
//     dateOfBirth?: Date
//   ): Promise<User> => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
  
//       await updateProfile(user, { displayName: username });
  
//       await setDoc(doc(db, 'users', user.uid), {
//         username,
//         email,
//         dateOfBirth: dateOfBirth ? Timestamp.fromDate(dateOfBirth) : null,
//         createdAt: Timestamp.now(),
//         lastLogin: Timestamp.now(),
//       });
  
//       return user;
//     } catch (error) {
//       console.error('Error registering user:', error);
//       throw error;
//     }
//   };
  
//   // Login user
//   export const loginUser = async (email: string, password: string): Promise<User> => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
  
//       await updateDoc(doc(db, 'users', user.uid), {
//         lastLogin: Timestamp.now(),
//       });
  
//       return user;
//     } catch (error) {
//       console.error('Error logging in:', error);
//       throw error;
//     }
//   };
  
//   // Logout user
//   export const logoutUser = async (): Promise<void> => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error('Error logging out:', error);
//       throw error;
//     }
//   };
  
//   // Get user profile
//   export const getUserProfile = async (userId: string): Promise<UserProfile> => {
//     try {
//       const userDoc = await getDoc(doc(db, 'users', userId));
//       if (userDoc.exists()) {
//         return userDoc.data() as UserProfile;
//       } else {
//         throw new Error('User not found');
//       }
//     } catch (error) {
//       console.error('Error getting user profile:', error);
//       throw error;
//     }
//   };

// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword,
//   signOut,
//   updateProfile,
//   User
// } from 'firebase/auth';
// import { doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
// import { db, auth } from '../FirebaseConfig';

// // Define User interface
// export interface UserProfile {
//   username: string;
//   email: string;
//   age?: number;
//   BMI?: number;
//   createdAt: Timestamp;
// }

// //*Updated Register Function with Firestore Debugging**
// export const registerUser = async (
//   email: string,
//   password: string,
//   username: string,
//   age?: number,
//   BMI?: number,
// ): Promise<User> => {
//   try {
//     console.log("Starting user registration...");

//     // Create the user in Firebase Auth
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     console.log("User created:", user.uid, user.email);

//     // Update the Firebase Auth user profile
//     await updateProfile(user, { displayName: username });
//     console.log("User profile updated successfully!");

//     // Prepare user data for Firestore
//     const userData = {
//       username,
//       email,
//       age: age || null,
//       BMI: BMI || null,
//       createdAt: Timestamp.now()
//     };

//     // Write user data to Firestore and ensure it's completed
//     await setDoc(doc(db, "users", user.uid), userData)
//       .then(() => console.log("User successfully added to Firestore!"))
//       .catch((error) => {
//         console.error("Firestore write failed:", error);
//         throw error;
//       });

//     return user;
//   } catch (error: any) {
//     console.error("Error registering user:", error.message);
//     throw new Error(error.message);
//   }
// };

// //*Login Function**
// export const loginUser = async (email: string, password: string): Promise<User> => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     console.log("User logged in:", user.uid, user.email);

//     // Update last login in Firestore
//     await updateDoc(doc(db, 'users', user.uid), {
//       lastLogin: Timestamp.now(),
//     });

//     return user;
//   } catch (error) {
//     console.error("Error logging in:", error);
//     throw error;
//   }
// };

// //Logout Function**
// export const logoutUser = async (): Promise<void> => {
//   try {
//     await signOut(auth);
//     console.log("User logged out successfully.");
//   } catch (error) {
//     console.error("Error logging out:", error);
//     throw error;
//   }
// };

// //Get User Profile**
// export const getUserProfile = async (userId: string): Promise<UserProfile> => {
//   try {
//     const userDoc = await getDoc(doc(db, 'users', userId));
//     if (userDoc.exists()) {
//       console.log("User profile retrieved:", userDoc.data());
//       return userDoc.data() as UserProfile;
//     } else {
//       throw new Error('User not found in Firestore.');
//     }
//   } catch (error) {
//     console.error("Error getting user profile:", error);
//     throw error;
//   }
// };


import { User } from 'firebase/auth';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../FirebaseConfig';

// Define User interface
export interface UserProfile {
  name: string;
  email: string;
  age?: number;
  BMI?: number;
  createdAt: Timestamp;
  lastPeriodDate1: Timestamp;  // New field
  lastPeriodDate2: Timestamp;  // New field
  averageCycleLength: number;  // New field
  averagePeriodLength: number;  // New field
  nextPeriodDate: Timestamp;  // New field
  ovulationDate: Timestamp;  // New field
  cycleDay: number;  // New field
}

// Logout Function
export const logoutUser = async (): Promise<void> => {
  try {
    await auth.signOut();
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Get User Profile
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    // Using "Users" collection to match your SignUpScreen
    const userDoc = await getDoc(doc(db, 'Users', userId));
    if (userDoc.exists()) {
      console.log("User profile retrieved:", userDoc.data());
      return userDoc.data() as UserProfile;
    } else {
      throw new Error('User not found in Firestore.');
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'Users', userId), {
      ...profileData,
      updatedAt: Timestamp.now()
    });
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Update Last Login
export const updateLastLogin = async (userId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'Users', userId), {
      lastLogin: Timestamp.now(),
    });
    console.log("Last login updated");
  } catch (error) {
    console.error("Error updating last login:", error);
    throw error;
  }
};