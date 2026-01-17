// src/firebase/connectionsAPI.js
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const CONNECTIONS_COLLECTION = "connections";

/* ======================================================
   SEND CONNECTION REQUEST
====================================================== */
export async function sendConnectionRequest(fromUser, toUser) {
  if (!fromUser || !toUser || fromUser === toUser) {
    throw new Error("Invalid connection request");
  }

  // prevent duplicate or reverse duplicate request
  const q = query(
    collection(db, CONNECTIONS_COLLECTION),
    where("from_user", "in", [fromUser, toUser]),
    where("to_user", "in", [fromUser, toUser])
  );

  const snap = await getDocs(q);
  if (!snap.empty) {
    return { alreadyExists: true };
  }

  const docRef = await addDoc(collection(db, CONNECTIONS_COLLECTION), {
    from_user: fromUser,
    to_user: toUser,
    status: "pending",
    created_at: serverTimestamp(),
  });

  return { success: true, id: docRef.id };
}

/* ======================================================
   GET CONNECTION STATUS (NEW)
====================================================== */
export async function getConnectionStatus(userA, userB) {
  const q = query(
    collection(db, CONNECTIONS_COLLECTION),
    where("from_user", "in", [userA, userB]),
    where("to_user", "in", [userA, userB])
  );

  const snap = await getDocs(q);

  if (snap.empty) return "none";

  const data = snap.docs[0].data();
  return data.status; // pending | accepted | rejected
}

/* ======================================================
   GET PENDING REQUESTS FOR USER
====================================================== */
export async function getPendingRequests(userId) {
  const q = query(
    collection(db, CONNECTIONS_COLLECTION),
    where("to_user", "==", userId),
    where("status", "==", "pending")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ======================================================
   ACCEPT / REJECT CONNECTION REQUEST
====================================================== */
export async function updateConnectionStatus(requestId, status) {
  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const ref = doc(db, CONNECTIONS_COLLECTION, requestId);
  await updateDoc(ref, { status });

  return true;
}

/* ======================================================
   GET ALL MY CONNECTIONS (ACCEPTED)
====================================================== */
export async function getMyConnections(userId) {
  const q = query(
    collection(db, CONNECTIONS_COLLECTION),
    where("status", "==", "accepted")
  );

  const snap = await getDocs(q);

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(
      (c) => c.from_user === userId || c.to_user === userId
    );
}
/* ======================================================
   GET ACCEPTED CONNECTIONS FOR USER
====================================================== */
export async function getAcceptedConnections(userId) {
  const q = query(
    collection(db, CONNECTIONS_COLLECTION),
    where("status", "==", "accepted")
  );

  const snap = await getDocs(q);

  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(
      c => c.from_user === userId || c.to_user === userId
    )
    .map(c => (c.from_user === userId ? c.to_user : c.from_user));
}
