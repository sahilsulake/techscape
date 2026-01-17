import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const TEAMS = "teams";

export async function createTeam(payload) {
  const ref = collection(db, TEAMS);
  const docRef = await addDoc(ref, {
    ...payload,
    created_at: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchTeams() {
  const q = query(collection(db, TEAMS));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTeamById(teamId) {
  const ref = doc(db, TEAMS, teamId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addMemberToTeam(teamId, memberUid) {
  if (typeof memberUid !== "string") return;

  const ref = doc(db, TEAMS, teamId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const team = snap.data();

  if (!Array.isArray(team.members)) return;
  if (team.members.includes(memberUid)) return;

   await updateDoc(ref, {
    members: [...(team.members || []), userId],
  });
}

