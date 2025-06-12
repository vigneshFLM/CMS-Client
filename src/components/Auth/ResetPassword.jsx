import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import AuthLayout from "../Auth/AuthLayout";
import { useNotification } from "../../context/NotificationContext";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification("Passwords do not match.", "error");
      return;
    }

    try {
      await authApi.resetPassword({ token, password });
      showNotification(
        "Password reset successful. Redirecting to login...",
        "success"
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Reset failed.";
      showNotification(errorMsg, "error");
    }
  };

  return (
    <AuthLayout image="/login.png">
      <form onSubmit={handleReset} className="login-form">
        <h2>Reset Password</h2>
        <label>New Password</label>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="button-container">
          <button type="submit" className="login-btn">
            Reset Password
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
