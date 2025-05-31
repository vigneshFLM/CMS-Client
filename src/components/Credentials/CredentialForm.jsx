import "../../styles/Credentials.css";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const CredentialForm = ({
  show,
  onClose,
  onSubmit,
  credentialData,
  setCredentialData,
  editMode,
  showPassword,
  togglePassword,
}) => {
  if (!show) return null;

  return (
    <div className="overlay">
      <div className="add-form-floating">
        <h3 className="form-title">{editMode ? "Edit Credential" : "Add New Credential"}</h3>

        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Credential Name"
          value={credentialData.name}
          onChange={(e) => setCredentialData({ ...credentialData, name: e.target.value })}
        />

        <input
          className="form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={credentialData.username}
          onChange={(e) => setCredentialData({ ...credentialData, username: e.target.value })}
        />

        <div className="password-input-container">
          <input
            className="form-input password-input"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={credentialData.password}
            onChange={(e) => setCredentialData({ ...credentialData, password: e.target.value })}
          />
          <button
            type="button"
            className="toggle-eye-button"
            onClick={togglePassword}
            title={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? (
              <IconEyeOff size={18} color="#1976d2" />
            ) : (
              <IconEye size={18} color="#1976d2" />
            )}
          </button>
        </div>

        <div className="floating-buttons">
          <button onClick={onSubmit}> {editMode ? "Update" : "Submit"} </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CredentialForm;
