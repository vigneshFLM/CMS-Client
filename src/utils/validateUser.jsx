// utils/validateUser.js
export const validateUser = (user, showNotification, isEdit = false) => {
  const { name, email, password, role } = user;

  if (!name.trim() || !email.trim() || (!isEdit && !password.trim()) || !role) {
    showNotification("Please fill all required fields.", "warning");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification("Invalid email format.", "warning");
    return false;
  }

  if (!isEdit && password.length < 6) {
    showNotification("Password must be at least 6 characters.", "warning");
    return false;
  }

  return true;
};
