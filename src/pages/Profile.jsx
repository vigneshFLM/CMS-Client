import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import authApi from "../api/authApi";
import { useNotification } from "../context/NotificationContext";
import ProfileDetails from "../components/Profile/ProfileDetails";
import ChangePasswordForm from "../components/Profile/ChangePasswordForm";
import { handleApiError } from "../utils/errorHandler";

const Profile = () => {
  const { token, user } = useAuth();
  const { showNotification } = useNotification();

  const [showChangeForm, setShowChangeForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  const handleCancelChange = () => {
    setOldPassword("");
    setNewPassword("");
    setShowChangeForm(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await authApi.changePassword({ oldPassword, newPassword }, token);
      showNotification(
        "Password updated successfully! Logging out...",
        "success"
      );

      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to update password");
    }
  };

  const handleRequestSuperAdmin = async () => {
    if (!window.confirm("Are you sure you want to request Super Admin access?"))
      return;

    try {
      setIsRequesting(true);
      await authApi.requestSuperAdminAccess(
        "Requesting super-admin access",
        token
      );
      showNotification("Request for Super Admin submitted successfully!", "success");
    } catch (err) {
      handleApiError(
        err,
        showNotification,
        "Failed to request super admin access"
      );
    } finally {
      setIsRequesting(false);
    }
  };

  if (!user)
    return <div className="profile-container">Loading user info...</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <ProfileDetails user={user} />

      {!showChangeForm ? (
        <button
          className="change-password-button"
          onClick={() => setShowChangeForm(true)}
        >
          Change Password
        </button>
      ) : null}

      {user.role === "admin" && !showChangeForm && (
        <button
          className="change-password-button"
          onClick={handleRequestSuperAdmin}
          disabled={isRequesting}
          style={{ marginLeft: "10px" }}
        >
          {isRequesting ? "Requesting..." : "Request Super Admin"}
        </button>
      )}

      {showChangeForm && (
        <ChangePasswordForm
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          handleChangePassword={handleChangePassword}
          handleCancel={handleCancelChange}
        />
      )}
    </div>
  );
};

export default Profile;
