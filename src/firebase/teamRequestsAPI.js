import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const REQUESTS_COLLECTION = "team_requests";

/**
 * Send a join request to a team
 */
export async function sendJoinRequest({
  teamId,
  userId,
  userName,
  userEmail,
}) {
  const ref = collection(db, REQUESTS_COLLECTION);

  await addDoc(ref, {
    team_id: teamId,
    user_id: userId,
    user_name: userName,
    user_email: userEmail,
    status: "pending", // pending | accepted | rejected
    created_at: serverTimestamp(),
  });

  return true;
}

/**
 * Get all join requests for a team
 */
export async function getTeamJoinRequests(teamId) {
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    where("team_id", "==", teamId)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Update request status (accept / reject)
 */
export async function updateJoinRequestStatus(requestId, status) {
  const ref = doc(db, REQUESTS_COLLECTION, requestId);
  await updateDoc(ref, { status });
}
