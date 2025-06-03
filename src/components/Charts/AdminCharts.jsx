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
    <div className="stat-card" style={{ borderColor: color, color }}>
      <div>{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );

  return (
    <>
      <div className="stat-cards">
        <StatCard title="Total Users" value={stats.managedUsers} />
        <StatCard
          title="Created Credentials"
          value={stats.createdCredentials}
        />
        <StatCard
          title="Verified"
          value={stats.reviewedRequests.approved}
          color="#28a745"
        />
        <StatCard
          title="Unverified"
          value={stats.reviewedRequests.rejected}
          color="#ffc107"
        />
      </div>

      <div className="chart-wrapper">
        <div className="chart-box">
          <Bar
            data={{
              labels: ["Users", "Granted Access"],
              datasets: [
                {
                  label: "Count",
                  data: [stats.managedUsers, stats.grantedAccess],
                  backgroundColor: ["#5b9bd5", "#f6b26b"],
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "User & Access Overview",
                  font: { size: 18, weight: "bold" },
                  padding: { top: 10, bottom: 20 },
                },
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                },
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
                  data: [
                    stats.reviewedRequests.approved,
                    stats.reviewedRequests.rejected,
                  ],
                  backgroundColor: ["#77dd77", "#ffdd57"],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Verification Status",
                  font: { size: 16 },
                },
                legend: {
                  position: "bottom",
                  labels: {
                    boxWidth: 20,
                    font: { weight: "600" },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AdminCharts;
