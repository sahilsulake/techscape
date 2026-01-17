import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const WATCHLIST = "watchlist";

export async function addToWatchlist(uid, event) {
  await addDoc(collection(db, WATCHLIST), {
    user_id: uid,
    event,
  });
}

// ⭐ FIXED: Renamed this to match your import
export async function getUserWatchlist(uid) {
  const q = query(collection(db, WATCHLIST), where("user_id", "==", uid));
  const snap = await getDocs(q);

  return snap.docs.map((d) => d.data().event);
}

export async function removeFromWatchlist(uid, eventId) {
  const q = query(
    collection(db, WATCHLIST),
    where("user_id", "==", uid),
    where("event.id", "==", eventId)
  );

  const snap = await getDocs(q);

  for (const d of snap.docs) {
    await deleteDoc(doc(db, WATCHLIST, d.id));
  }
}
