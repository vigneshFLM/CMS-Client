import api from "../services/api";

const credentialApi = {
  fetchByUserId: (userId) => api.get(`/user-credentials/user/${userId}`),
  viewById: (id) => api.get(`/user-credentials/view/${id}`),
  add: (data) => api.post("/credentials", data),
  update: (id, data) => api.put(`/credentials/update/${id}`, data),
  delete: (id) => api.delete(`/credentials/delete/${id}`),
  getNames: () => api.get("/credentials/names"),
};

export default credentialApi;
