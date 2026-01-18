import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import Loader from "@/components/common/Loader";
import { Card } from "@/components/ui/card";

export default function TeamCollaboration() {
  const { id: teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      setLoading(true);

      try {
        // 1️⃣ Load team
        const teamRef = doc(db, "teams", teamId);
        const teamSnap = await getDoc(teamRef);

        if (!teamSnap.exists()) {
          setLoading(false);
          return;
        }

        const teamData = teamSnap.data();
        setTeam(teamData);

        // 2️⃣ Get member UIDs
const memberIds = (teamData.members || [])
  .map((m) => (typeof m === "string" ? m : m.id))
  .filter(Boolean);

        if (memberIds.length === 0) {
          setMembers([]);
          setLoading(false);
          return;
        }

        // 🚨 Firestore limit: max 10 IDs per `in`
        const q = query(
          collection(db, "profiles"),
          where(documentId(), "in", memberIds.slice(0, 10))
        );

        const snap = await getDocs(q);

        const profiles = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setMembers(profiles);
      } catch (err) {
        console.error("TeamCollaboration error:", err);
      }

      setLoading(false);
    }

    if (teamId) loadTeam();
  }, [teamId]);

  if (loading) return <Loader />;

  if (!team) {
    return <p className="text-center py-10">Team not found</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">{team.name}</h1>

      <h2 className="text-xl font-semibold mb-4">Team Members</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <Card key={m.id} className="p-6">
            <h3 className="font-bold">{m.full_name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {m.role}
            </p>
            <p className="text-sm mt-2">{m.bio}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
