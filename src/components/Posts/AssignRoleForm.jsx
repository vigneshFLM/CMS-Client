import React, { useState } from "react";

const AssignRoleForm = ({ users, onCancel, onSubmit, showNotification }) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedUserId && selectedRole) {
      const payload = {
        userId: selectedUserId,
        postRole: selectedRole,
      };

      onSubmit(payload);
      showNotification("Role assigned successfully!");
    } else {
      showNotification("Please select both user and role.");
    }
  };

  return (
    <div className="overlay">
      <div className="add-form-floating">
        <h3 className="form-title">Assign Role to User</h3>

        <select
          className="form-input"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          className="form-input"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">-- Select Role --</option>
          <option value="approver">Approve</option>
          <option value="submitter">Submit</option>
        </select>

        <div className="floating-buttons">
          <button type="button" onClick={handleFormSubmit}>
            Assign
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoleForm;
