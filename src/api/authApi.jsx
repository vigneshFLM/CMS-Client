import api from "../services/api";

const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getManagers: () => api.get("/users/admins"),
  changePassword: (data, token) =>
    api.post("/users/change-password", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  requestSuperAdminAccess: (reason, token) =>
    api.post(
      "/users/super-admin-request",
      { reason },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
};

export default authApi;
