// utils/errorHandler.js
export const handleApiError = (err, showNotification, fallbackMsg = "Something went wrong") => {
  const response = err?.response?.data;
  const code = response?.code;
  const message = response?.message || fallbackMsg;

  // Dev debug log
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", code, message);
  }

  switch (code) {
    // 🔐 Auth errors
    case "INVALID_CREDENTIALS":
    case "AUTHENTICATION_FAILED":
      showNotification("Invalid email or password.", "error");
      break;
    case "EMAIL_ALREADY_EXISTS":
      showNotification("Email is already registered.", "info");
      break;

    // 📦 Access errors
    case "ACCESS_ALREADY_GRANTED":
      showNotification("This user already has access.", "info");
      break;
    case "REVOKE_FAILED":
      showNotification("Access was not active. Nothing to revoke.", "warning");
      break;
    case "ACCESS_DENIED":
    case "FORBIDDEN":
    case "UNAUTHORIZED":
      showNotification("You don't have permission to perform this action.", "error");
      break;

    // 🧾 Credential errors
    case "CREDENTIAL_NOT_FOUND":
      showNotification("Credential not found.", "warning");
      break;
    case "CREDENTIAL_ALREADY_EXISTS":
      showNotification("A credential with this name already exists.", "info");
      break;
    case "CREDENTIAL_CREATION_FAILED":
    case "CREDENTIAL_UPDATE_FAILED":
    case "CREDENTIAL_DELETE_FAILED":
      showNotification("There was a problem with the credential operation.", "error");
      break;

    // 📥 Request errors
    case "DUPLICATE_REQUEST":
      showNotification("You’ve already requested this credential.", "info");
      break;
    case "REQUEST_NOT_FOUND":
      showNotification("Request not found.", "warning");
      break;
    case "REQUEST_CREATION_FAILED":
    case "REQUEST_EDIT_FAILED":
    case "REQUEST_DELETE_FAILED":
    case "REQUEST_UPDATE_FAILED":
      showNotification("Failed to process the request.", "error");
      break;

    // 👤 User errors
    case "USER_NOT_FOUND":
      showNotification("User not found.", "warning");
      break;
    case "MANAGER_NOT_FOUND":
      showNotification("Assigned manager not found.", "warning");
      break;
    case "INVALID_ROLE_ASSIGNMENT":
      showNotification("Role assignment between user and manager is invalid.", "warning");
      break;
    case "SUPER_ADMIN_CANNOT_HAVE_MANAGER":
      showNotification("Super Admins can't be assigned a manager.", "info");
      break;
    case "PASSWORD_INCORRECT":
      showNotification("Old password is incorrect.", "warning");
      break;
    case "FALLBACK_SUPERADMIN_MISSING":
      showNotification("Could not find a fallback super-admin.", "error");
      break;
    case "USER_DELETE_FAILED":
      showNotification("User deletion failed.", "error");
      break;

    // 📊 Stats / Misc
    case "NO_MAPPINGS":
      showNotification("No credential mappings found.", "info");
      break;
    case "NO_USERS":
      showNotification("No users found for this credential.", "info");
      break;
    case "NO_CREDENTIALS":
      showNotification("This user has no credentials.", "info");
      break;
    case "STATS_FETCH_FAILED":
      showNotification("Unable to load dashboard stats.", "error");
      break;

    // 🔍 Validation or fallback
    case "VALIDATION_ERROR":
      showNotification(message, "warning");
      break;

    case "INTERNAL_ERROR":
    default:
      showNotification(message || fallbackMsg, "error");
      break;
  }
};
