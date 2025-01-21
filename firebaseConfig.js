// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY, 
  authDomain: "tinderapp-71c65.firebaseapp.com",
  projectId: "tinderapp-71c65",
  storageBucket: "tinderapp-71c65.firebasestorage.app",
  messagingSenderId: "985454962301",
  appId: "1:985454962301:web:42770400e0d60bf7a0b314",
  measurementId: "G-Z7PY662HZ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific settings to handle Bloom Filter error
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  ignoreUndefinedProperties: true
});

const storage = getStorage(app);

export { db, storage };