import api from "../services/api";

const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getManagers: () => api.get("/users/admins"),
};

export default authApi;
