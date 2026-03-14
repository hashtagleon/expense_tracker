import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { createUserProfile, getUserProfile } from "./db.js";

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const profile = await getUserProfile(cred.user.uid);
  if (!profile) {
    await createUserProfile(cred.user.uid, cred.user.displayName || "User", cred.user.email);
  }
  return cred.user;
}

export async function registerUser(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(cred.user.uid, name, email);
  return cred.user;
}

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() {
  await signOut(auth);
  window.location.href = "index.html";
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}
