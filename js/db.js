import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  query, where, orderBy, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Transactions ─────────────────────────────────────────────────────────────

export async function addTransaction(userId, data) {
  return await addDoc(collection(db, "transactions"), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getTransactions(userId) {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  const txs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getTransactionById(txId) {
  const snap = await getDoc(doc(db, "transactions", txId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateTransaction(txId, data) {
  return await updateDoc(doc(db, "transactions", txId), data);
}

export async function deleteTransaction(txId) {
  return await deleteDoc(doc(db, "transactions", txId));
}

// ── Budget ────────────────────────────────────────────────────────────────────

export async function getBudget(userId) {
  const snap = await getDoc(doc(db, "budgets", userId));
  return snap.exists() ? snap.data() : { monthlyBudget: 0 };
}

export async function setBudget(userId, monthlyBudget) {
  return await setDoc(doc(db, "budgets", userId), { monthlyBudget });
}

// ── User Profile ──────────────────────────────────────────────────────────────

export async function createUserProfile(userId, name, email) {
  return await setDoc(doc(db, "users", userId), {
    name,
    email,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(userId) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
}
