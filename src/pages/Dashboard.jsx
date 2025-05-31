import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import statsAPI from "../api/statsApi";
import ChartRenderer from "../components/Dashboard/ChartRenderer";

const Dashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const role = user?.role?.toLowerCase();
      if (!role) return;

      try {
        const res = await statsAPI.fetchByRole(role, token);
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    };

    fetchStats();
  }, [user, token]);

  if (!stats) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <ChartRenderer role={user.role} stats={stats} />
    </div>
  );
};

export default Dashboard;
