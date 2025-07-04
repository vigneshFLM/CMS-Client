import { IconX } from "@tabler/icons-react";

const RequestView = ({ show, data, onClose }) => {
  if (!show || !data) return null;

  return (
    <div className="overlay">
      <form className="add-form-floating" onSubmit={(e) => e.preventDefault()}>
        <h3 className="form-title">Request Details</h3>

        <div className="form-group">
          <label className="form-label">
            <strong>Resource:</strong>
          </label>
          <div className="form-value">{data.resource_name || "N/A"}</div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <strong>Requested By:</strong>
          </label>
          <div className="form-value">{data.username || "N/A"}</div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <strong>Reason:</strong>
          </label>
          <div className="form-value multiline">{data.reason || "N/A"}</div>
        </div>

        {data.status && (
          <div className="form-group">
            <label className="form-label">
              <strong>Status:</strong>
            </label>
            <div className="form-value">{data.status}</div>
          </div>
        )}

        {data.created_at && (
          <div className="form-group">
            <label className="form-label">
              <strong>Requested At:</strong>
            </label>
            <div className="form-value">
              {new Date(data.created_at).toLocaleString()}
            </div>
          </div>
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

export default RequestView;
