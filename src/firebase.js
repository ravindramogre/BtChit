import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKobXYNQ2kTmoyRa-m7VuTYz11H9H2_PI",
  authDomain: "chat-app-7780b.firebaseapp.com",
  projectId: "chat-app-7780b",
  storageBucket: "chat-app-7780b.appspot.com",
  messagingSenderId: "998971469248",
  appId: "1:998971469248:web:978c8f808f1e048ae6ac25"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();