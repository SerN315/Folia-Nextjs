import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCuc1s-5DA5R0lSDqVYp6HAG1hvwH8Jbc8",
  authDomain: "folia-c597d.firebaseapp.com",
  databaseURL: "https://folia-c597d-default-rtdb.firebaseio.com",
  projectId: "folia-c597d",
  storageBucket: "folia-c597d.appspot.com",
  messagingSenderId: "515814194700",
  appId: "1:515814194700:web:1a5576859573e5f610f829",
};

const app = initializeApp(firebaseConfig);

// Direct imports without dynamic for lightweight modules
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Create `storageRef` inside a function to ensure `storage` is initialized
export const getStorageRef = (path) => ref(storage, path);
