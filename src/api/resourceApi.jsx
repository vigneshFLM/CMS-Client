// ✅ Resource API
import api from "../services/api";

// Resource CRUD
const resourceApi = {
  getAllResources: () => api.get("/resources"), // Get all resources
  getResourceById: (id, type) => api.get(`/resources/${id}?type=${type}`),
  getResourceByUserId: (userId) => api.get(`/resources/user/${userId}`),
  createResource: (data) => api.post("/resources", data), // Create a new resource
  updateResource: (id, data) => api.put(`/resources/${id}`, data), // Update a resource
  deleteResource: (id) => api.delete(`/resources/${id}`), // Delete a resource
};

export default resourceApi;
