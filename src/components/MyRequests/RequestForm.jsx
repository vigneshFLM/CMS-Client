import React from "react";

const RequestForm = ({
  resourceOptions,
  requestForm,
  setRequestForm,
  submitting,
  onSubmit,
  onCancel,
}) => {
  const allowedType = requestForm.type;
  const filteredResources = resourceOptions.filter(
    (res) => res.type === allowedType
  );

  return (
    <div className="overlay">
      <div className="add-form-floating">
        <h3 className="overlay-title">Request Resource Access</h3>

        <p className="selected-request-type">
          <strong>Request Type:</strong> {requestForm.type}
        </p>

        <select
          value={requestForm.resource_id}
          onChange={(e) => {
            const selectedId =
              e.target.value === "" ? "" : Number(e.target.value);
            setRequestForm({
              ...requestForm,
              resource_id: selectedId,
            });
          }}
          disabled={!requestForm.type}
        >
          <option value="">Select Resource</option>
          {filteredResources.map((res) => (
            <option key={res.id} value={res.id}>
              {res.name}
            </option>
          ))}
        </select>

        <textarea
          rows={4}
          placeholder="Reason for request"
          value={requestForm.reason}
          onChange={(e) =>
            setRequestForm({
              ...requestForm,
              reason: e.target.value,
            })
          }
        />

        <div className="floating-buttons">
          <button disabled={submitting} onClick={onSubmit}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
