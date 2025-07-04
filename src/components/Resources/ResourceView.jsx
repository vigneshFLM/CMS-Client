import { handleCopy } from "../../utils/clipboardUtils";
import {
  IconEye,
  IconEyeOff,
  IconCopy,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import "../../styles/Resources.css";
import { useNotification } from "../../context/NotificationContext";

const ResourceView = ({
  show,
  data,
  onClose,
  showPassword,
  togglePassword,
  copiedField,
  setCopiedField,
}) => {
  const { showNotification } = useNotification();

  if (!show || !data || !data.resource) return null;

  const { resource, assetOrCredential } = data;
  
  const { name, type, created_by_name, created_at } = resource;

  const password = data?.assetOrCredential?.password || "";
  const username = data?.assetOrCredential?.username || "N/A";

  return (
    <div className="overlay">
      <form
        className="add-form-floating resource-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <h3 className="form-title">Resource Details</h3>

        <div className="form-group">
          <label className="form-label"><strong>Name :</strong> {name}</label>
        </div>

        <div className="form-group">
          <label className="form-label"><strong>Created By :</strong> {created_by_name || "N/A"}</label>
        </div>

        <div className="form-group">
          <label className="form-label"><strong>Created At :</strong> {new Date(created_at).toLocaleString()}</label>
        </div>

        {type === "cred" && (
          <>
            <div className="form-group">
              <label className="form-label"><strong>Username:</strong></label>
              <div className="input-with-actions">
                <span className="form-value">{username}</span>
                <div className="icon-button-group">
                  {assetOrCredential?.username && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(username, setCopiedField, "username", showNotification)
                      }
                      className="icon-button copy-icon-button"
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
            </div>

            <div className="form-group">
              <label className="form-label"><strong>Password:</strong></label>
              <div className="input-with-actions">
                <span className="form-value">
                  {password ? (showPassword ? password : "*".repeat(password.length)) : "N/A"}
                </span>
                {password && (
                  <div className="icon-button-group">
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
                        handleCopy(password, setCopiedField, "password", showNotification)
                      }
                      className="icon-button copy-icon-button"
                      title="Copy Password"
                    >
                      {copiedField === "password" ? (
                        <IconCheck size={18} color="#1976d2" />
                      ) : (
                        <IconCopy size={18} color="#1976d2" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          className="icon-close-button"
          onClick={onClose}
          title="Close"
        >
          <IconX size={20} />
        </button>
      </form>
    </div>
  );
};

export default ResourceView;
