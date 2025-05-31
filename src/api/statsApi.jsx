import api from "../services/api";

const routes = {
  "super-admin": "/stats/SuperAdminStats",
  admin: "/stats/AdminStats",
  user: "/stats/UserStats",
};

const statApi = {
  fetchByRole: (role, token) => {
    const route = routes[role];
    if (!route) throw new Error("Invalid role");
    return api.get(route, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default statApi;
