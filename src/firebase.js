import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "relator-clone-react-f9a6f.firebaseapp.com",
  projectId: "relator-clone-react-f9a6f",
  storageBucket: "relator-clone-react-f9a6f.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

initializeApp(firebaseConfig);
export const db = getFirestore();