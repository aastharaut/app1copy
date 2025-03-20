// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth , getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Timestamp } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRI4-1kYFoqiUjEYT4AOnUSG9amMS4nLE",
  authDomain: "hormoniq-8420b.firebaseapp.com",
  projectId: "hormoniq-8420b",
  storageBucket: "hormoniq-8420b.firebasestorage.app",
  messagingSenderId: "333974410288",
  appId: "1:333974410288:web:a13bc2ac347ef7a68fc9f5",
  measurementId: "G-61VFHJTV5S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// Initialize Firestore
export const db = getFirestore(app);
export { Timestamp };
export const auth = initializeAuth(app, {
    persistence:getReactNativePersistence(ReactNativeAsyncStorage)
});