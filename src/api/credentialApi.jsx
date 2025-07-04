// ✅ Credential API
import api from "../services/api";

const credentialApi = {
  getAll: () => api.get("/credentials"),
  getById: (id) => api.get(`/credentials/${id}`),
  create: (data) => api.post("/credentials", data),
  update: (id, data) => api.put(`/credentials/${id}`, data), // Fixed from `/credentials/update/${id}`
  delete: (id) => api.delete(`/credentials/${id}`), // Fixed from `/credentials/delete/${id}`
  getNames: () => api.get("/credentials/names"),
};

export default credentialApi;
