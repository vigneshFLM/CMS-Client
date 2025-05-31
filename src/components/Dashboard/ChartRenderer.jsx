import React from "react";
import SuperAdminCharts from "../Charts/SuperAdminCharts";
import AdminCharts from "../Charts/AdminCharts";
import UserCharts from "../Charts/UserCharts";

const ChartRenderer = ({ role, stats }) => {
  const roleComponents = {
    "super-admin": <SuperAdminCharts stats={stats} />,
    admin: <AdminCharts stats={stats} />,
    user: <UserCharts stats={stats} />,
  };

  return roleComponents[role?.toLowerCase()] || <p>Unsupported role</p>;
};

export default ChartRenderer;
