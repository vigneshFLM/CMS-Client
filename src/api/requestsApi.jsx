import api from "../services/api";

const requestApi = {
  getAll: () => api.get("/requests/all"),

  getMyRequests: () => api.get("/requests/my-requests"),

  create: (data) => api.post("/requests", data),

  updateStatus: (id, status) => api.patch(`/requests/updateReqStatus/${id}`, { status }),

  getById: (id) => api.get(`/requests/view/${id}`),

  update: (id, data) => api.put(`/requests/edit/${id}`, data),

  delete: (id) => api.delete(`/requests/delete/${id}`),

  getCredentialNames: () => api.get("/credentials/names"),
};

export default requestApi;
