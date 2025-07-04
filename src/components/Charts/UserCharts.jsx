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
  // const totalCredentials = stats.myCredentials.length; // Removed unused variable
  const active = stats.myCredentials.filter(
    (c) => c.status === "active"
  ).length;
  const revoked = stats.myCredentials.filter(
    (c) => c.status === "revoked"
  ).length;

  const approved = stats.requestCounts.approved || 0;
  const rejected = stats.requestCounts.rejected || 0;
  const pending = stats.requestCounts.pending || 0;

  const StatCard = ({ title, value, color = "#6f42c1" }) => (
    <div className="stat-card" style={{ borderColor: color, color }}>
      <div>{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );

  return (
    <div className="stats-container">
      <div className="stat-cards">
        {/* <StatCard title="Total Credentials" value={totalCredentials} /> */}
        <StatCard title="Active Resources" value={active} color="#28a745" />
        <StatCard title="Revoked Resources" value={revoked} color="#dc3545" />
        {/* <StatCard title="Approved Requests" value={approved} color="#007bff" /> */}
        <StatCard title="Awaiting Approval" value={pending} color="#6c757d" />
        <StatCard title="Denied Requests" value={rejected} color="#ffc107" />
      </div>

      <div className="chart-wrapper">
        <div className="chart-box">
          <Bar
            data={{
              labels: ["Active", "Revoked"],
              datasets: [
                {
                  label: "Resources",
                  data: [active, revoked],
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
                  text: "Resource Summary",
                  font: { size: 18 },
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
              labels: ["Approved", "Rejected", "Pending"],
              datasets: [
                {
                  data: [approved, rejected, pending],
                  backgroundColor: ["#ffdd57", "#77dd77", "#5b9bd5"],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Request Status Distribution",
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
    </div>
  );
};

export default UserCharts;
