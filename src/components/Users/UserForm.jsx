import React, { useState } from "react";

const UserForm = ({
  newUser,
  setNewUser,
  roles,
  managers,
  onSubmit,
  onCancel,
  editMode,
  submitting
}) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};

    if (!newUser.name?.trim()) errs.name = "Full Name is required";
    if (!newUser.email?.trim()) errs.email = "Email is required";
    if (!editMode && !newUser.password?.trim())
      errs.password = "Password is required";
    if (!newUser.mobile?.trim()) errs.mobile = "Mobile Number is required";
    if (!newUser.designation?.trim())
      errs.designation = "Designation is required";
    if (!newUser.role?.trim()) errs.role = "Role is required";

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(); // assuming it handles newUser data externally
    }
  };

  return (
    <div className="overlay">
      <div className="add-form-floating">
        <div className="overlay-title">
          <h3>{editMode ? "Edit User" : "Add New User"}</h3>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={newUser.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {!editMode && (
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={newUser.mobile}
              onChange={handleChange}
            />
            {errors.mobile && (
              <span className="error-message">{errors.mobile}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={newUser.designation}
              onChange={handleChange}
            />
            {errors.designation && (
              <span className="error-message">{errors.designation}</span>
            )}
          </div>

          <div className="form-group">
            <select name="role" value={newUser.role} onChange={handleChange}>
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role && (
              <span className="error-message">{errors.role}</span>
            )}
          </div>

          <div className="form-group">
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
          </div>

          <div className="floating-buttons">
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : editMode ? "Update" : "Submit"}
            </button>

            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
