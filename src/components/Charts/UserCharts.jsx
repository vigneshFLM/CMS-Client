// src/components/dashboard/charts/UserCharts.js
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

const UserCharts = ({ stats }) => {
  const StatCard = ({ title, value, color = "#6f42c1" }) => (
    <div className="stat-card" style={{ borderColor: color, color: color }}>
      <div>{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );

  return (
    <>
      <div className="stat-cards">
        <StatCard title="Your Credentials" value={stats.total} />
        <StatCard title="Verified" value={stats.verified} color="#28a745" />
        <StatCard title="Unverified" value={stats.unverified} color="#ffc107" />
      </div>

      <div className="chart-wrapper">
        <div className="chart-box">
          <Bar
            data={{
              labels: ["Verified", "Unverified"],
              datasets: [
                {
                  label: "Status",
                  data: [stats.verified, stats.unverified],
                  backgroundColor: ["#28a745", "#ffc107"],
                },
              ],
            }}
            options={{
              plugins: {
                title: { display: true, text: "📄 Verification Overview" },
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
                title: { display: true, text: "✅ Credential Status" },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default UserCharts;
