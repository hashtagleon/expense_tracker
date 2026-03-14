// ============================================================
//  STEP REQUIRED: Paste your Firebase project config below.
//  Go to: Firebase Console → Your Project → Project Settings
//  → General → Your apps → Config (SDK snippet)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3Rr0Pv0MV4YJQGA1YRGiVB3P2ymID0FY",
  authDomain: "expense-tracker-dbb2c.firebaseapp.com",
  projectId: "expense-tracker-dbb2c",
  storageBucket: "expense-tracker-dbb2c.firebasestorage.app",
  messagingSenderId: "208842850892",
  appId: "1:208842850892:web:0d7ff4b211a949e78e2ae9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
