// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "./NotificationContext";
import { handleApiError } from "../utils/errorHandler";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const { showNotification } = useNotification();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setUser(jwtDecode(jwtToken));
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          logout();
          showNotification("Session expired. Please log in again.", "warning");
        } else {
          setToken(storedToken);
          setUser(decoded);
        }
      } catch (err) {
        logout();
        handleApiError(
          err,
          showNotification,
          "Invalid session. Please log in again."
        );
      }
    }
  }, [showNotification]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!user,
        role: user?.role,
        post_role: user?.post_role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
