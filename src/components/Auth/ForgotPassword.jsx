import { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../../api/authApi";
import AuthLayout from "../Auth/AuthLayout";
import { useNotification } from "../../context/NotificationContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authApi.forgotPassword(email);
      showNotification(
        "Check your inbox for a password reset link.",
        "success"
      );
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong.";
      showNotification(errorMsg, "error");
    }
  };

  return (
    <AuthLayout image="/login.png">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="button-container">
          <button type="submit" className="login-btn">
            Send Reset Link
          </button>
        </div>

        <div className="auth-links">
          <p>
            Back to <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
