import { handleCopy } from "../../utils/clipboardUtils";
import { IconEye, IconEyeOff, IconCopy, IconCheck } from "@tabler/icons-react";
import "../../styles/Credentials.css";

const CredentialView = ({
  show,
  data,
  onClose,
  showPassword,
  togglePassword,
  copiedField,
  setCopiedField,
}) => {
  if (!show || !data) return null;

  const name = data.name || "N/A";
  const username = data.username || "N/A";
  const password = data.password || "";

  return (
    <div className="overlay">
      <form className="add-form-floating" onSubmit={(e) => e.preventDefault()}>
        <h3 className="form-title">Credential Details</h3>

        <div className="form-group">
          <label className="form-label">
            <strong>Name:</strong>
          </label>
          <div className="form-value">{name}</div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <strong>Username:</strong>
          </label>
          <div className="input-with-actions">
            <span className="form-value">{username}</span>
            {data.username && (
              <button
                type="button"
                onClick={() => handleCopy(username, setCopiedField, "username")}
                className="icon-button"
                title="Copy Username"
              >
                {copiedField === "username" ? (
                  <IconCheck size={18} color="#1976d2" />
                ) : (
                  <IconCopy size={18} color="#1976d2" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <strong>Password:</strong>
          </label>
          <div className="input-with-actions">
            <span className="form-value">
              {password
                ? showPassword
                  ? password
                  : "*".repeat(password.length)
                : "N/A"}
            </span>
            {password && (
              <>
                <button
                  type="button"
                  onClick={togglePassword}
                  className="icon-button"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? (
                    <IconEyeOff size={18} color="#1976d2" />
                  ) : (
                    <IconEye size={18} color="#1976d2" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(password, setCopiedField, "password")
                  }
                  className="icon-button"
                  title="Copy Password"
                >
                  {copiedField === "password" ? (
                    <IconCheck size={18} color="#1976d2" />
                  ) : (
                    <IconCopy size={18} color="#1976d2" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="floating-buttons">
          <button
            type="button"
            className="close-button"
            onClick={() => {
              if (showPassword) togglePassword();
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default CredentialView;
