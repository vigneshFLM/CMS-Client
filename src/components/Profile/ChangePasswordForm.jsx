import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import "../../styles/Profile.css"; // Assuming this includes .overlay and .add-form-floating styles

const ChangePasswordForm = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  handleChangePassword,
  handleCancel,
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="overlay">
      <form className="add-form-floating" onSubmit={handleChangePassword}>
        <h3 className="form-title">Change Password</h3>

        <div className="password-input-container">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="form-input password-input"
          />
          <button
            type="button"
            className="toggle-eye-button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            title={showOldPassword ? "Hide Password" : "Show Password"}
          >
            {showOldPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        </div>

        <div className="password-input-container">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="form-input password-input"
          />
          <button
            type="button"
            className="toggle-eye-button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            title={showNewPassword ? "Hide Password" : "Show Password"}
          >
            {showNewPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        </div>

        <div className="floating-buttons">
          <button type="submit">Update</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
