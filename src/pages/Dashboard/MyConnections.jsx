// src/pages/Dashboard/MyConnections.jsx
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import {
  getPendingRequests,
  updateConnectionStatus
} from "../../firebase/connectionsAPI";
import { getUserProfile } from "../../firebase/profilesAPI";

import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Loader from "../../components/common/Loader";
import { toast } from "sonner";

export default function MyConnections() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [user]);

  async function loadRequests() {
    if (!user) return;

    try {
      const pending = await getPendingRequests(user.id);

      const enriched = await Promise.all(
        pending.map(async (req) => {
          const profile = await getUserProfile(req.from_user);
          return { ...req, profile };
        })
      );

      setRequests(enriched);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    }

    setLoading(false);
  }

  async function handleAccept(reqId) {
    await updateConnectionStatus(reqId, "accepted");
    toast.success("Connection accepted");
    loadRequests();
  }

  async function handleReject(reqId) {
    await updateConnectionStatus(reqId, "rejected");
    toast.info("Request rejected");
    loadRequests();
  }

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Connection Requests</h1>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">No pending requests.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <Card key={req.id} className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">
                {req.profile?.full_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                @{req.profile?.username}
              </p>

              <div className="flex gap-2">
                <Button onClick={() => handleAccept(req.id)}>
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReject(req.id)}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button variant="outline" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
}
