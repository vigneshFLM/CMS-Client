import api from "../services/api";

const userApi = {
  fetchAll: () => api.get("/users"),
  fetchByAdmin: (adminId) => api.get(`/users/admin/${adminId}/users`),
  fetchManagers: () => api.get("/users/admins"),
  register: (data) => api.post("/auth/register", data),
  update: (id, data) => api.patch(`/users/update/${id}`, data),
  delete: (id) => api.delete(`/users/delete/${id}`),
  fetchApprovers: () => api.get("/posts/approvers"),
};

export default userApi;
