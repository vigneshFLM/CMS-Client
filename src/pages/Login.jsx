import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authAPI from "../api/authApi";
import AuthLayout from "../components/Auth/AuthLayout";
import PasswordInput from "../components/Auth/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { handleApiError } from "../utils/errorHandler";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.login({ email, password });
      login(res.data.token);
      showNotification("Login successful!", "success");
      navigate("/dashboard");
    } catch (err) {
      handleApiError(err, showNotification, "Login failed");
      showNotification("Login failed! Incorrect Username or Password", "error");
    }
  };

  return (
    <AuthLayout image="/login.png">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome!</h2>
        <label>Email</label>
        <input
          type="email"
          placeholder="name@frontlinesedutech.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          toggle={() => setShowPassword(!showPassword)}
        />

        <div className="button-container">
          <button type="submit" className="login-btn">
            Login
          </button>
        </div>

        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
