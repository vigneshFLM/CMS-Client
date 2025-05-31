// src/components/Auth/PasswordInput.jsx
import React from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const PasswordInput = ({ value, onChange, showPassword, toggle }) => (
  <div className="password-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      value={value}
      onChange={onChange}
      required
    />
    <span className="toggle-icon" onClick={toggle}>
      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
    </span>
  </div>
);

export default PasswordInput;
