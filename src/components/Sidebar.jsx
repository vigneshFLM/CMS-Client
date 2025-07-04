import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IconUserFilled,
  IconLayoutDashboard,
  IconLockPassword,
  IconUsers,
  IconLockAccess,
  IconLockCheck,
  IconLockAccessOff,
  IconMenu2,
  IconX,
  IconPhotoShare
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
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
      roles: ["super-admin", "admin"],
    },
    {
      path: "/resources",
      icon: <IconLockPassword size={18} />,
      label: "Resources",
      roles: ["user", "admin", "super-admin"],
    },
    {
      path: "/access-management",
      icon: <IconLockAccess size={18} />,
      label: "Access Management",
      roles: ["super-admin", "admin"],
    },
    {
      path: "/approvals-Requests",
      icon: <IconLockCheck size={18} />,
      label: "Approvals/Requests",
      roles: ["admin", "super-admin"],
    },
    {
      path: "/my-requests",
      icon: <IconLockAccessOff size={18} />,
      label: "My Requests",
      roles: ["admin", "user"],
    },
    {
      path: "/posts",
      icon: <IconPhotoShare size={18} />,
      label: "Posts",
      posts: ["approver", "submitter"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.roles && item.roles.includes(user?.role)) {
      return true;
    }
    if (item.posts && item.posts.includes(user?.post_role)) {
      return true;
    }
    return false;
  });

  return (
    <>
      <button
        className={`hamburger-btn ${isOpen ? "open" : "closed"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <IconX size={28} stroke={2} />
        ) : (
          <IconMenu2 size={28} stroke={2} />
        )}
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-section">
          <img src="/FLM-logo-1.png" alt="Logo" className="logo" />
        </div>
        <hr />
        <nav className="menu">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={isActive(item.path) ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
