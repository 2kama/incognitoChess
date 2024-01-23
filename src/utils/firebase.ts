import * as firebase from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  DocumentData,
  serverTimestamp,
  orderBy,
  limit,
  updateDoc,
  doc,
  where,
  getDocs,
  or,
  and
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "incognito-chess.firebaseapp.com",
  projectId: "incognito-chess",
  storageBucket: "incognito-chess.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  orderBy,
  limit,
  updateDoc,
  doc,
  where,
  getDocs,
  or,
  and
};
export type { DocumentData };
