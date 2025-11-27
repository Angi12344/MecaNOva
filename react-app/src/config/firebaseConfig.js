import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0j3jhRa5CoRaGoBnAB6SMMxOsY2jBNNE",
  authDomain: "novabooks-35f3b.firebaseapp.com",
  databaseURL: "https://novabooks-35f3b-default-rtdb.firebaseio.com",
  projectId: "novabooks-35f3b",
  storageBucket: "novabooks-35f3b.firebasestorage.app",
  messagingSenderId: "851238271872",
  appId: "1:851238271872:web:2f1f9186653d4192551f65",
  measurementId: "G-T17LH4XCJC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔥 EXPORTACIONES IMPORTANTES
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);