import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCFec7w4AxpjjHfUmMeALCDdVXVgY1rwlE",
  authDomain: "maiharonlinetravels.firebaseapp.com",
  projectId: "maiharonlinetravels",
  storageBucket: "maiharonlinetravels.firebasestorage.app",
  messagingSenderId: "53072332097",
  appId: "1:53072332097:web:229680fbc1949bfe93cdc0",
  measurementId: "G-YM8NS45MCN"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);