import React from "react";

const ProfileDetails = ({ user }) => (
  <div className="profile-card">
    <div className="profile-row">
      <span className="profile-label">Name:</span>
      <span className="profile-value">{user.name}</span>
    </div>

    <div className="profile-row">
      <span className="profile-label">Email:</span>
      <span className="profile-value">{user.email}</span>
    </div>

    <div className="profile-row">
      <span className="profile-label">Role:</span>
      <span className="profile-value">{user.role}</span>
    </div>

    {user.designation && (
      <div className="profile-row">
        <span className="profile-label">Designation:</span>
        <span className="profile-value">{user.designation}</span>
      </div>
    )}

    {user.mobile && (
      <div className="profile-row">
        <span className="profile-label">Mobile:</span>
        <span className="profile-value">{user.mobile}</span>
      </div>
    )}

    {user.manager_name && (
      <div className="profile-row">
        <span className="profile-label">Manager:</span>
        <span className="profile-value">{user.manager_name}</span>
      </div>
    )}
  </div>
);

export default ProfileDetails;
