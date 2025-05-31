import api from "../services/api";

const accessApi = {
  getAllAccess: () => api.get("/user-credentials/allAccess"),
  revokeAccess: (userId, credentialId) =>
    api.post("/user-credentials/revoke", { userId, credentialId }),
  grantAccess: (userId, credentialId) =>
    api.post("/user-credentials/grant", { userId, credentialId }),
};

export default accessApi;
