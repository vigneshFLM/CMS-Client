// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/Notification"; // adjust path as needed

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ open: true, message, type });
  }, []);

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        message={notification.message}
        open={notification.open}
        type={notification.type}
        onClose={closeNotification}
      />
    </NotificationContext.Provider>
  );
};
