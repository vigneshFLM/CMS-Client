import { IconX } from "@tabler/icons-react";

const ApprovalRequestView = ({ show, data, onClose }) => {
  if (!show || !data) return null;

  return (
    <div className="overlay">
      <form className="add-form-floating" onSubmit={(e) => e.preventDefault()}>
        <h3 className="form-title">Request Details</h3>

        <div className="form-group">
          <label className="form-label">
            <strong>Resource: </strong>
            <span className="form-value">{data.resource_name || "N/A"}</span>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            <strong>Requested By: </strong>
            <span className="form-value">{data.user_name || "N/A"}</span>
          </label>
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
              <strong>Status: </strong>
              <span className="form-value">{data.status}</span>
            </label>
          </div>
        )}

        {data.reviewer_name && (
          <div className="form-group">
            <label className="form-label">
              <strong>Reviewed By: </strong>
              <span className="form-value">{data.reviewer_name}</span>
            </label>
          </div>
        )}

        {data.created_at && (
          <div className="form-group">
            <label className="form-label">
              <strong>Requested At: </strong>
              <span className="form-value">
                {new Date(data.created_at).toLocaleString()}
              </span>
            </label>
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

export default ApprovalRequestView;
