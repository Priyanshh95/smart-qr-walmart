import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCM2wFluxyeXUJ9fi1W6S2WVIRikh62lvE",
  authDomain: "smart-qr-21abf.firebaseapp.com",
  projectId: "smart-qr-21abf",
  storageBucket: "smart-qr-21abf.firebasestorage.app",
  messagingSenderId: "749282136173",
  appId: "1:749282136173:web:7a61397968246e65ce2f64",
  measurementId: "G-4VBRG8H7QF"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth }; 