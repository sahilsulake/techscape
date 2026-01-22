import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import {
  getPendingRequests,
  updateConnectionStatus,
} from "@/firebase/connectionsAPI";
import { fetchTeams } from "@/firebase/teamsAPI";

import Loader from "@/components/common/Loader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function MyConnections() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  /* ✅ ALL STATES DEFINED */
  const [teams, setTeams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return; // 🔥 VERY IMPORTANT

    async function loadData() {
      try {
        setLoading(true);

        // 1️⃣ Load pending requests
        const pending = await getPendingRequests(user.id);
        setRequests(Array.isArray(pending) ? pending : []);

        // 2️⃣ Load teams
        const teamsData = await fetchTeams();
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (err) {
        console.error("MyConnections error:", err);
        toast.error("Failed to load connections");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, isLoaded]);

  /* ---------------- ACTION HANDLER ---------------- */
  const handleAction = async (requestId, status) => {
    try {
      await updateConnectionStatus(requestId, status);
      toast.success(`Request ${status}`);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  /* ---------------- UI ---------------- */

  if (!isLoaded || loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      <h1 className="text-3xl font-bold">My Connections</h1>

      {/* -------- REQUESTS -------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Pending Requests
          {requests.length > 0 && (
            <Badge variant="destructive">{requests.length}</Badge>
          )}
        </h2>

        {requests.length === 0 ? (
          <p className="text-muted-foreground">No pending requests</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <Card key={req.id} className="p-4 space-y-3">
                <p className="text-sm">
                  From user: <b>{req.from_user}</b>
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAction(req.id, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(req.id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* -------- TEAMS -------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My Teams</h2>

        {teams.length === 0 ? (
          <p className="text-muted-foreground">
            You are not part of any team yet
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Card key={team.id} className="p-4 space-y-3">
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Members: {team.members?.length || 0}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/teams/${team.id}`)}
                >
                  View Team
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
