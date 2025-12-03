import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCRBA6t1I4OW3SGQcVuoF-4rt1zzppXGV4",
  authDomain: "maifeed.firebaseapp.com",
  projectId: "maifeed",
  storageBucket: "maifeed.firebasestorage.app",
  messagingSenderId: "161463008576",
  appId: "1:161463008576:web:35adb9eb4416b80dddcea5",
  measurementId: "G-50QZTHTMBY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
