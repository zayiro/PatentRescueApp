import { initializeApp } from "firebase/app";
import { initializeFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_lU178RLyNfo3nR_ox7APWBxNfcxx79A",
  authDomain: "truedoctor-f1bbb.firebaseapp.com",
  databaseURL: "https://truedoctor-f1bbb-default-rtdb.firebaseio.com",
  projectId: "truedoctor-f1bbb",
  storageBucket: "truedoctor-f1bbb.firebasestorage.app",
  messagingSenderId: "418226025912",
  appId: "1:418226025912:web:727d730f75cfcd5d138b4d",
  measurementId: "G-JB0V9MTL7T"
};

let app;

try {
  app = initializeApp(firebaseConfig);  
  
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {}

export const auth = getAuth(app);
export const db = initializeFirestore(app, {useFetchStreams: false});
