// src/components/dashboard/charts/AdminCharts.js
import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "../../styles/Charts.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminCharts = ({ stats }) => {
  const StatCard = ({ title, value, color = "#17a2b8" }) => (
    <div className="stat-card" style={{ borderColor: color, color: color }}>
      <div>{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );

  return (
    <>
      <div className="stat-cards">
        <StatCard title="Total Users" value={stats.users} />
        <StatCard title="Total Credentials" value={stats.credentials} />
        <StatCard title="Verified" value={stats.verified} color="#28a745" />
        <StatCard title="Unverified" value={stats.unverified} color="#ffc107" />
      </div>

      <div className="chart-wrapper">
        <div className="chart-box">
          <Bar
            data={{
              labels: ["Users", "Credentials"],
              datasets: [
                {
                  label: "Count",
                  data: [stats.users, stats.credentials],
                  backgroundColor: "#36b9cc",
                },
              ],
            }}
            options={{
              plugins: {
                title: { display: true, text: "👥 Users & Credentials" },
                legend: { display: false },
              },
            }}
          />
        </div>
        <div className="chart-box">
          <Doughnut
            data={{
              labels: ["Verified", "Unverified"],
              datasets: [
                {
                  data: [stats.verified, stats.unverified],
                  backgroundColor: ["#28a745", "#ffc107"],
                },
              ],
            }}
            options={{
              plugins: {
                title: { display: true, text: "✅ Verification Status" },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AdminCharts;
