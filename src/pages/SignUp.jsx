import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authAPI from "../api/authApi";
import AuthLayout from "../components/Auth/AuthLayout";
import { useNotification } from "../context/NotificationContext";
import { handleApiError } from "../utils/errorHandler";
import { IconEye, IconEyeOff, IconChevronDown } from "@tabler/icons-react";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    role: "",
    designation: "",
    manager_id: "",
  });

  const [managers, setManagers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await authAPI.getManagers();
        setManagers(res.data);
      } catch (err) {
        handleApiError(err, showNotification, "Failed to fetch managers");
      }
    };
    fetchManagers();
  }, [showNotification]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showNotification("Passwords do not match", "warning");
      return;
    }

    const { confirmPassword: _, ...formData } = form;

    const payload = {
      ...formData,
      manager_id: form.manager_id ? Number(form.manager_id) : null,
    };

    try {
      await authAPI.register(payload);
      showNotification("User registered successfully!", "success");
      window.location.href = "/login";
    } catch (err) {
      handleApiError(err, showNotification, "Sign Up failed");
    }
  };

  return (
    <AuthLayout image="/signup.png">
      <form onSubmit={handleSubmit} className="signUp-form">
        <h2>Create Account</h2>

        <div className="signUpForm-container">
          <div>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />

            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </span>
            </div>

            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </span>
            </div>
          </div>

          <div>
            <label>Designation</label>
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="e.g., Software Developer"
              required
            />
            <label>Role</label>
            <div className="select-wrapper">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                {/* <option value="super-admin">Super Admin</option> */}
              </select>
              <IconChevronDown className="select-icon" size={18} />
            </div>

            <label>Manager</label>
            <div className="select-wrapper">
              <select
                name="manager_id"
                value={form.manager_id}
                onChange={handleChange}
              >
                <option value="">Select Manager</option>
                <option value="None">None</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.designation ? `(${m.designation})` : ""}
                  </option>
                ))}
              </select>
              <IconChevronDown className="select-icon" size={18} />
            </div>

            <label>Mobile</label>
            <input
              name="mobile"
              placeholder="Enter phone number"
              value={form.mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="signUp-btn">
            Sign Up
          </button>
        </div>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
