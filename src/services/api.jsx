import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

// Lazy-load the showNotification function when React is mounted
let showNotification;
export const setNotificationFn = (fn) => {
  showNotification = fn;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      if (showNotification) {
        handleApiError(error, showNotification, "Session expired.");
      }
    }

    if (status === 403) {
      localStorage.removeItem("token");
      if (showNotification) {
        handleApiError(error, showNotification, "Session expired.");
      }
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
