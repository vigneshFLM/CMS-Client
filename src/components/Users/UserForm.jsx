import React from "react";

const UserForm = ({
  newUser,
  setNewUser,
  roles,
  managers,
  onSubmit,
  onCancel,
  editMode
}) => {
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  return (
    <div className="overlay">
      <div className="add-form-floating">
        <h3 className="overlay-title">
          {editMode ? "Edit User" : "Add New User"}
        </h3>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={newUser.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
        />
        {!editMode && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
          />
        )}
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={newUser.mobile}
          onChange={handleChange}
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={newUser.designation}
          onChange={handleChange}
        />

        <select name="role" value={newUser.role} onChange={handleChange}>
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          name="manager_id"
          value={newUser.manager_id || ""}
          onChange={handleChange}
        >
          <option value="">Select Manager</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} {m.designation ? `(${m.designation})` : ""}
            </option>
          ))}
        </select>

        <div className="floating-buttons">
          <button onClick={onSubmit}>{editMode ? "Update" : "Submit"}</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
