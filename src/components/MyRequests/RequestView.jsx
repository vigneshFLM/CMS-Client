const RequestView = ({ show, data, onClose }) => {
  if (!show || !data) return null;

  return (
    <div className="overlay">
      <form className="add-form-floating" onSubmit={(e) => e.preventDefault()}>
        <h3 className="form-title">Request Details</h3>

        <div className="form-group">
          <label className="form-label"><strong>Credential:</strong></label>
          <div className="form-value">{data.credential_name || "N/A"}</div>
        </div>

        <div className="form-group">
          <label className="form-label"><strong>Requested By:</strong></label>
          <div className="form-value">{data.requested_by || "N/A"}</div>
        </div>

        <div className="form-group">
          <label className="form-label"><strong>Reason:</strong></label>
          <div className="form-value multiline">{data.reason || "N/A"}</div>
        </div>

        {data.status && (
          <div className="form-group">
            <label className="form-label"><strong>Status:</strong></label>
            <div className="form-value">{data.status}</div>
          </div>
        )}

        {data.created_at && (
          <div className="form-group">
            <label className="form-label"><strong>Requested At:</strong></label>
            <div className="form-value">
              {new Date(data.created_at).toLocaleString()}
            </div>
          </div>
        )}

        <div className="floating-buttons">
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestView;
