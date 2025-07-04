import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import statsAPI from "../api/statsApi";
import ChartRenderer from "../components/Dashboard/ChartRenderer";
import { useNotification } from "../context/NotificationContext";
import { handleApiError } from "../utils/errorHandler";

const Dashboard = () => {
  const { token, user } = useAuth();
  const { showNotification } = useNotification();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const role = user?.role?.toLowerCase();
      if (!role) return;

      try {
        const res = await statsAPI.fetchByRole(role, token);
        setStats(res.data);
      } catch (err) {
        handleApiError(err, showNotification, "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, token, showNotification]);

  return (
    <div style={{ padding: "2rem" }}>
      {loading ? (
        <div className="loading">
          <span className="spinner" />
          <span>Loading Dashboard Stats...</span>
        </div>
      ) : (
        <ChartRenderer role={user.role} stats={stats} />
      )}
    </div>
  );
};

export default Dashboard;
