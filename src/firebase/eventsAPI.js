// src/firebase/eventsAPI.js
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const EVENTS_COLLECTION = "events";

export async function createEvent(event) {
  const ref = collection(db, EVENTS_COLLECTION);

  const payload = {
    ...event,
    created_at: serverTimestamp(),
    is_active: true,
  };

  const docRef = await addDoc(ref, payload);
  return docRef.id;
}

export async function fetchEvents() {
  const ref = collection(db, EVENTS_COLLECTION);
  const q = query(ref, orderBy("created_at", "desc"));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchEventsByOrganizer(uid) {
  const ref = collection(db, EVENTS_COLLECTION);
  const q = query(ref, where("organizer_id", "==", uid));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getEventById(id) {
  const ref = doc(db, EVENTS_COLLECTION, id);
  const snap = await getDoc(ref);

  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
