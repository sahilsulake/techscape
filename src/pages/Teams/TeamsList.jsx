import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { fetchTeams } from "../../firebase/teamsAPI";
import { getPendingRequests } from "../../firebase/connectionsAPI";

import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/Button";
import Loader from "../../components/common/Loader";
import { Badge } from "../../components/ui/badge";

export default function TeamsList() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);

    const teamsData = await fetchTeams();
    setTeams(teamsData);

    if (user) {
      const pending = await getPendingRequests(user.id);
      setPendingCount(pending.length);
    }

    setLoading(false);
  }

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Find a Team</h1>

        <Button onClick={() => navigate("/teams/create")}>
          + Create Team
        </Button>
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Find Teammates */}
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition"
          onClick={() => navigate("/teams/find-teammates")}
        >
          <h3 className="text-xl font-semibold">Find Teammates</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Explore developer profiles and connect
          </p>
        </Card>

        {/* My Teams */}
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition"
          onClick={() => navigate("/teams/my-teams")}
        >
          <h3 className="text-xl font-semibold">My Teams</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Teams you are part of
          </p>
        </Card>

        {/* Connection Requests */}
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition relative"
          onClick={() => navigate("/dashboard/connections")}
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            Connection Requests
            {pendingCount > 0 && (
              <Badge variant="destructive">
                {pendingCount}
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage incoming requests
          </p>
        </Card>

      </div>

      {/* Available Teams */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Teams</h2>

        {teams.length === 0 ? (
          <p className="text-muted-foreground">
            No teams available yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Members: {team.members?.length || 0}
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/teams/${team.id}`)}
                >
                  View Team
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
