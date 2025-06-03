import React, { useState, useRef, useEffect } from "react";
import {
  IconBell,
  IconUserCircle,
  IconCaretDownFilled,
} from "@tabler/icons-react";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    showNotification("Logging out!", "success");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2>
          Welcome to Frontlines Edutech <span>{user.name}</span>
        </h2>
      </div>
      <div className="navbar-right">
        {/* <div className="notification-icon">
          <IconBell size={25} />
        </div> */}
        <div
          className="profile-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={dropdownRef}
        >
          <IconUserCircle size={24} />
          <span className="user-name">{user.name}</span>
          <IconCaretDownFilled
            size={18}
            className={`caret-icon ${dropdownOpen ? "rotated" : ""}`}
          />

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
