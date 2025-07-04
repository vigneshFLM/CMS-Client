import api from "../services/api";

const postApi = {
  // Create a new post (with files)
  create: (formData) => api.post("/posts/createPost", formData),

  // Resubmit a rejected post
  resubmit: (postId) => api.put(`/posts/${postId}/resubmit`),

  // Get all posts (admin only)
  getAll: () => api.get("/posts/all"),

  // Get all pending posts (admin only)
  getPending: () => api.get("/posts/pending"),

  // Get posts submitted by specific user
  getByUser: (userId) => api.get(`/posts/user/${userId}`),

  // Get posts assigned to the logged-in approver
  getAssigned: () => api.get("/posts/assigned"),

  // Get a single post by ID
  getById: (postId) => api.get(`/posts/${postId}`),

  // Get post logs (admin only)
  getLogs: (postId) => api.get(`/posts/${postId}/logs`),

  // Approve or reject post
  updateStatus: (postId, status, comment, userId) =>
  api.put(`/posts/action/${postId}`, {
    status,
    comment,
    action_by: userId,
  }),

  // Update post details
  update: (postId, formData) =>
  api.put(`/posts/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  // Delete post
  delete: (postId) => api.delete(`/posts/${postId}`),

  // Assign post role (super-admin only)
  assignRole: (userId, postRole) =>
    api.post("/posts/assignPostRole", { userId, postRole }),

  // Get all approvers (admin only)
  getApprovers: () => api.get("/posts/approvers"),

  // Get all pages
  getPages: () => api.get("/pages"),
};

export default postApi;
