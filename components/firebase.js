import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCFGUuXA4wLsyYvnO1VJw9kacVsiri4Yw0",
    authDomain: "trading-5f66d.firebaseapp.com",
    databaseURL: "https://trading-5f66d-default-rtdb.firebaseio.com",
    projectId: "trading-5f66d",
    storageBucket: "trading-5f66d.firebasestorage.app",
    messagingSenderId: "697107030000",
    appId: "1:697107030000:web:17b9d7dab384819f474735",
    measurementId: "G-PX2J8RD66D"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // If already initialized, use getAuth
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

export { auth };
export const db = getFirestore(app);