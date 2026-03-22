import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  query, where, orderBy, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Offline Sync (IndexedDB) ──────────────────────────────────────────────────
const DB_NAME = "fintrack_offline";
const DB_VERSION = 1;

function openIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("pending_txs")) {
        db.createObjectStore("pending_txs", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveTransactionOffline(userId, data) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pending_txs", "readwrite");
    const store = tx.objectStore("pending_txs");
    const req = store.add({ userId, data, timestamp: new Date().getTime() });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getOfflineTransactions() {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pending_txs", "readonly");
    const store = tx.objectStore("pending_txs");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteOfflineTransaction(id) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pending_txs", "readwrite");
    const store = tx.objectStore("pending_txs");
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function syncOfflineTransactions() {
  if (!navigator.onLine) return 0;
  const pending = await getOfflineTransactions();
  if (pending.length === 0) return 0;
  
  let syncCount = 0;
  for (const p of pending) {
    try {
      await addDoc(collection(db, "transactions"), {
        userId: p.userId,
        ...p.data,
        createdAt: serverTimestamp(),
      });
      await deleteOfflineTransaction(p.id);
      syncCount++;
    } catch (e) {
      console.error("Background sync failed for transaction:", e);
    }
  }
  return syncCount;
}

// ── Transactions ─────────────────────────────────────────────────────────────

export async function addTransaction(userId, data) {
  if (!navigator.onLine) {
    await saveTransactionOffline(userId, data);
    const err = new Error("You are currently offline. The transaction was saved locally and will automatically sync when you reconnect.");
    err.isOffline = true;
    throw err;
  }
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

export async function updateUserProfile(userId, data) {
  return await setDoc(doc(db, "users", userId), data, { merge: true });
}

export async function uploadAvatar(userId, base64String) {
  return await setDoc(doc(db, "users", userId), { photoURL: base64String }, { merge: true });
}
