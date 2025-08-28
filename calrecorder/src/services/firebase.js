import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2tDAFBzb0gbXrVUv9948YAzJlX8OWZrI",
  authDomain: "calrecorder-8f3a4.firebaseapp.com",
  projectId: "calrecorder-8f3a4",
  storageBucket: "calrecorder-8f3a4.firebasestorage.app",
  messagingSenderId: "4971021102",
  appId: "1:4971021102:web:7883ff7fdbb06a7d7bf0bf",
  measurementId: "G-3T5GYP7M3X"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);

