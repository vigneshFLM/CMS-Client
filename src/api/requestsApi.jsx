import api from "../services/api";

const requestApi = {
  getAll: () => api.get("/requests/all"),
  getMyRequests: () => api.get("/requests/my-requests"),
  create: (data) => api.post("/requests", data),
  updateStatus: (id, status) => api.patch(`/requests/${id}`, { status }),
};

export default requestApi;
