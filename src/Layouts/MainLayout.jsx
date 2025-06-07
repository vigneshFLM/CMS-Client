import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Layout.css"; // Add this to handle layout styling

const MainLayout = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar />
      <main
        className={`main-content ${isMobile ? "mobile" : "desktop"}`}
      >
        {children}
      </main>
    </>
  );
};

export default MainLayout;
