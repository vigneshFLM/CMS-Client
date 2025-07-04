// ✅ Asset API
import api from "../services/api";

const assetApi = {
  getAll: () => api.get("/assets"), // Fixed from `/asset`
  getById: (id) => api.get(`/assets/${id}`), // Fixed from `/asset`
  create: (data) => api.post("/assets", data), // Fixed from `/asset`
  update: (id, data) => api.put(`/assets/${id}`, data), // Fixed from `/asset`
  delete: (id) => api.delete(`/assets/${id}`), // Fixed from `/asset`
};

export default assetApi;
