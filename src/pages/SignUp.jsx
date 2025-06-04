import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authAPI from "../api/authApi";
import AuthLayout from "../components/Auth/AuthLayout";
import PasswordInput from "../components/Auth/PasswordInput";
import { useNotification } from "../context/NotificationContext";
import { handleApiError } from "../utils/errorHandler";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "user",
    designation: "",
    manager_id: "",
  });

  const [managers, setManagers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
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
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      manager_id: form.manager_id ? Number(form.manager_id) : null,
    };

    try {
      await authAPI.register(payload);
      showNotification("User registered successfully!", "success");
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
              required
            />

            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <PasswordInput
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              showPassword={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            <label>Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
            />
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
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>

            <label>Manager</label>
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
