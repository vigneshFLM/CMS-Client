import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";
import ProfileDetails from "../components/Profile/ProfileDetails";
import ChangePasswordForm from "../components/Profile/ChangePasswordForm";

const Profile = () => {
  const { token, user } = useAuth();
  const { showNotification } = useNotification();

  const [showChangeForm, setShowChangeForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleCancelChange = () => {
    setOldPassword("");
    setNewPassword("");
    setShowChangeForm(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/users/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => setShowChangeForm(false), 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "❌ Failed to update password.";
      showNotification(errorMsg);
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
