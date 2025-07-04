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

const SuperAdminCharts = ({ stats }) => {
  const StatCard = ({ title, value, color = "#007bff" }) => (
    <div className="stat-card" style={{ borderColor: color, color }}>
      <div>{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );

  return (
    <>
      <div className="stat-cards">
        <StatCard title="Total Users" value={stats.users} />
        <StatCard title="Total Admins" value={stats.admins} color="#dc3545" />
        <StatCard title="Credentials" value={stats.credentials} color="#ffc107" />
        <StatCard title="Assets" value={stats.assets} color="#28a745" />
        {/* <StatCard
          title="Active Access"
          value={stats.activeAccess}
          color="#28a745"
        />
        <StatCard
          title="Revoked Access"
          value={stats.revokedAccess}
          color="#dc3545"
        /> */}
      </div>

      <div className="chart-wrapper">
        <div className="chart-box">
          <Bar
            data={{
              labels: ["Users", "Admins", "Credentials", "Assets"],
              datasets: [
                {
                  label: "Total",
                  data: [stats.users, stats.admins, stats.credentials, stats.assets],
                  backgroundColor: ["#5b9bd5", "#71c285", "#f6b26b", "#ffc107"],
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
                  text: "User & Credential Summary",
                  position: "top", // default
                  align: "center", // center horizontally
                  padding: {
                    top: 10,
                    bottom: 20,
                  },
                  font: {
                    size: 18,
                    weight: "bold",
                  },
                },
                legend: { display: false }, // for bar chart
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
              labels: ["Active Access", "Revoked Access"],
              datasets: [
                {
                  data: [stats.activeAccess, stats.revokedAccess],
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
                  text: "Access Distribution",
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

export default SuperAdminCharts;
