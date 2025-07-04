// utils/errorHandler.js
export const handleApiError = (err, showNotification, fallbackMsg = "Something went wrong") => {
  const response = err?.response?.data;
  const code = response?.code;
  const message = response?.message || fallbackMsg;

  // Dev debug log
  if (import.meta.env && import.meta.env.MODE === "development") {
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

    // 🧾 Resource errors
    case "RESOURCE_NOT_FOUND":
      showNotification("Resource not found.", "warning");
      break;
    case "RESOURCE_ALREADY_EXISTS":
      showNotification("A resource with this name already exists.", "info");
      break;
    case "RESOURCE_CREATION_FAILED":
    case "RESOURCE_UPDATE_FAILED":
    case "RESOURCE_DELETE_FAILED":
      showNotification("There was a problem with the resource operation.", "error");
      break;

    // 📥 Request errors
    case "DUPLICATE_REQUEST":
      showNotification("You've already requested this resource.", "info");
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
      showNotification("No resources found.", "info");
      break;
    case "NO_USERS":
      showNotification("No users found.", "info");
      break;
    case "NO_RESOURCES":
      showNotification("No resources accessed.", "info");
      break;
    case "STATS_FETCH_FAILED":
      showNotification("Unable to load dashboard stats.", "error");
      break;

    // 🔍 Validation or fallback
    case "VALIDATION_ERROR":
      showNotification(message, "warning");
      break;
    default:
      showNotification(message, "error");
      break;
  }
};
