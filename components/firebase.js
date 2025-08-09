import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);

let auth;
if (typeof window !== 'undefined') {
  // Web: use default persistence
  auth = getAuth(app);
} else {
  // Mobile: use react-native persistence if available
  try {
    const { getReactNativePersistence } = require('firebase/auth/react-native');
    const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (e) {
    // Fallback if react-native-persistence is not available
    auth = getAuth(app);
  }
}

export { auth };
export const db = getFirestore(app);