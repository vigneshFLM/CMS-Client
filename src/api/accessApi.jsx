import api from "../services/api";

const accessApi = {
  getAllAccess: () => api.get("/user-credentials/allAccess"),
  getAccessAdminUsers:  (adminId) => 
    api.get(`/user-credentials/${adminId}/users/access`),
  revokeAccess: (userId, credentialId) =>
    api.post("/user-credentials/revoke", { userId, credentialId }),
  grantAccess: (userId, credentialId, grantedById) =>
    api.post("/user-credentials/grant", { userId, credentialId, grantedById }),
};

export default accessApi;
