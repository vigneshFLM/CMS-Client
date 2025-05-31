import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IconUserFilled,
  IconLayoutDashboard,
  IconLockPassword,
  IconUsers,
  IconLockAccess,
  IconLockCheck,
  IconLockAccessOff
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext"; 
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const user = useAuth(); // 🔥 get the logged-in user's role
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: "/dashboard",
      icon: <IconLayoutDashboard size={18} />,
      label: "Dashboard",
      roles: ["user", "admin", "super-admin"],
    },
    {
      path: "/profile",
      icon: <IconUserFilled size={18} />,
      label: "Profile",
      roles: ["user", "admin", "super-admin"],
    },
    {
      path: "/users",
      icon: <IconUsers size={18} />,
      label: "Users",
      roles: ["super-admin"],
    },
    {
      path: "/credentials",
      icon: <IconLockPassword size={18} />,
      label: "Credentials",
      roles: ["user", "admin", "super-admin"],
    },
    {
      path: "/access-management",
      icon: <IconLockAccess size={18} />,
      label: "Access Management",
      roles: ["super-admin"],
    },
    {
      path: "/approvals-Requests",
      icon: <IconLockCheck size={18} />,
      label: "Approvals/Requests",
      roles: ["admin","super-admin"],
    },
    {
      path: "/my-requests",
      icon: <IconLockAccessOff size={18} />,
      label: "My Requests",
      roles: ["admin","user"],
    },
  ];

  return (
    <div className="sidebar">
      <div className="logo-section">
        <img src="/FLM-logo-1.png" alt="Logo" className="logo" />
      </div>
      <hr />
      <nav className="menu">
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={isActive(item.path) ? "active" : ""}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
      </nav>
    </div>
  );
};

export default Sidebar;
