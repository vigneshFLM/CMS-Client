import api from "../services/api";

const accessApi = {
  getAllAccess: () => api.get("/resourceAccess/allAccess"),
  getAccessAdminUsers:  (adminId) => 
    api.get(`/resourceAccess/${adminId}/users/access`),
  revokeAccess: (userId, resourceId) =>
    api.post("/resourceAccess/revoke", { userId, resourceId }),
  grantAccess: (userId, resourceId, grantedById) =>
    api.post("/resourceAccess/grant", { userId, resourceId, grantedById }),
};

export default accessApi;
