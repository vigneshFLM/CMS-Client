import React, { useState, useEffect } from "react";

const ResourceForm = ({
  show,
  data,
  onClose,
  onSubmit,
  initialData = {},
  editMode = false,
  resourceType,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    username: "",
    password: "",
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};

    if (!form.name?.trim()) {
      errs.name = `${resourceType} name is required`;
    }

    if (resourceType === "cred") {
      if (!form.username?.trim()) {
        errs.username = "Username is required for credentials";
      }
      if (!form.password?.trim()) {
        errs.password = "Password is required for credentials";
      }
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSubmit) {
      const formDataWithType = { ...form, resourceType };
      onSubmit(formDataWithType);
    }
  };

  useEffect(() => {
    setForm({
      name: "",
      description: "",
      username: editMode && resourceType === "cred" ? data.assetOrCredential.username || "" : "",
      password: editMode && resourceType === "cred" ? data.assetOrCredential.password || "" : "",
      ...initialData,
    });
  }, [initialData, data, editMode, resourceType]);

  if (!show) return null;

  return (
    <div className="overlay">
      <div className="add-form-floating resource-form">
        <h3 className="form-title">
          {editMode ? `Edit ${resourceType}` : `Add New ${resourceType}`}
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Name*</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              placeholder={`Enter ${resourceType} name`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Description for asset */}
          {resourceType === "asset" && (
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter asset description"
              />
            </div>
          )}

          {/* Username and Password for credentials */}
          {resourceType === "cred" && (
            <>
              <div className="form-group">
                <label className="form-label">Username*</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter username"
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password*</label>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="floating-buttons">
            <button type="submit">{editMode ? "Update" : "Submit"}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
