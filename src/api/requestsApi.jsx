import api from "../services/api";

const requestApi = {
  getAll: () => api.get("/requests/all"),

  getMyRequests: () => api.get("/requests/my-requests"),

  create: (data) => api.post("/requests", data),

  updateStatus: (id, status, currentUserId) =>
    api.patch(`/requests/updateReqStatus/${id}`, { status }, { currentUserId }),

  getById: (id) => api.get(`/requests/view/${id}`),

  update: (id, data) => api.put(`/requests/edit/${id}`, data),

  delete: (id) => api.delete(`/requests/delete/${id}`),

  getResourceNames: () => api.get("/resources/names"),

  updateSuperAdminStatus: (id, status) =>
    api.patch(`/users/super-admin-requests/${id}`, { status }),
};

export default requestApi;
