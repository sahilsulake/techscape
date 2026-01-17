// src/firebase/profilesAPI.js
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const PROFILES_COLLECTION = "profiles";

/* ======================================================
   GET ALL PROFILES (used in Find Teammates - OLD FLOW)
====================================================== */
export async function fetchAllCandidates(currentUid = null) {
  const snap = await getDocs(collection(db, PROFILES_COLLECTION));

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => (currentUid ? p.id !== currentUid : true));
}

/* ======================================================
   GET PROFILES BY ROLE (NEW ROLE-BASED FLOW)
====================================================== */
export async function fetchCandidatesByRole(role, currentUid = null) {
  if (!role) return [];

  const q = query(
    collection(db, PROFILES_COLLECTION),
    where("role", "==", role)
  );

  const snap = await getDocs(q);

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => (currentUid ? p.id !== currentUid : true));
}

/* ======================================================
   UPLOAD PROFILE IMAGE (optional, Firebase Storage)
====================================================== */
export async function uploadProfileImage(file, uid) {
  if (!file || !uid) return null;

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}.${ext}`;
  const storageRef = ref(storage, `profiles/${uid}/${filename}`);

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/* ======================================================
   GET PROFILE BY UID (Dashboard / Edit Profile)
====================================================== */
export async function getUserProfile(uid) {
  if (!uid) return null;

  const snap = await getDoc(doc(db, PROFILES_COLLECTION, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/* ======================================================
   GET PROFILE BY USERNAME (Public Profile)
====================================================== */
export async function getProfileByUsername(username) {
  if (!username) return null;

  const q = query(
    collection(db, PROFILES_COLLECTION),
    where("username", "==", username)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

/* ======================================================
   CHECK USERNAME UNIQUENESS
====================================================== */
export async function isUsernameTaken(username, currentUid = null) {
  if (!username) return false;

  const q = query(
    collection(db, PROFILES_COLLECTION),
    where("username", "==", username)
  );

  const snap = await getDocs(q);
  if (snap.empty) return false;

  return snap.docs.some((d) => d.id !== currentUid);
}

/* ======================================================
   CREATE / UPDATE PROFILE
====================================================== */
export async function createOrUpdateProfile(uid, payload) {
  if (!uid) throw new Error("UID is required");

  const ref = doc(db, PROFILES_COLLECTION, uid);
  await setDoc(ref, payload, { merge: true });

  const saved = await getDoc(ref);
  return saved.exists() ? { id: saved.id, ...saved.data() } : null;
}
