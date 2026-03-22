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

// ── Biometric WebAuthn App Lock ──────────────────────────────────────────────
function generateRandomBuffer(length) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
}
function bufferToBase64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function base64urlToBuffer(base64url) {
  const padding = '='.repeat((4 - base64url.length % 4) % 4);
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

export async function enableBiometrics(user) {
  if (!window.PublicKeyCredential) throw new Error("Biometrics not supported on this browser.");
  const challenge = generateRandomBuffer(32);
  const userId = new TextEncoder().encode(user.uid);
  const createOpts = {
    publicKey: {
      challenge,
      rp: { name: "FinTrack Premium" },
      user: { id: userId, name: user.email, displayName: "FinTrack User" },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
      timeout: 60000
    }
  };
  const credential = await navigator.credentials.create(createOpts);
  localStorage.setItem("fintrack_biometric_id", bufferToBase64url(credential.rawId));
  return true;
}

export async function verifyBiometrics() {
  const credentialIdStr = localStorage.getItem("fintrack_biometric_id");
  if (!credentialIdStr) return true; // Not enabled
  if (sessionStorage.getItem("fintrack_unlocked") === "true") return true;

  const credentialId = base64urlToBuffer(credentialIdStr);
  const challenge = generateRandomBuffer(32);
  const getOpts = {
    publicKey: {
      challenge,
      allowCredentials: [{ type: "public-key", id: credentialId }],
      userVerification: "required",
      timeout: 60000
    }
  };
  await navigator.credentials.get(getOpts);
  sessionStorage.setItem("fintrack_unlocked", "true");
  return true;
}

export function disableBiometrics() {
  localStorage.removeItem("fintrack_biometric_id");
}
