import React from "react";

const RequestForm = ({
  resourceOptions,
  requestForm,
  setRequestForm,
  submitting,
  onSubmit,
  onCancel,
}) => (
  <div className="overlay">
    <div className="add-form-floating">
      <h3 className="overlay-title">Request Resource Access</h3>

      <select
        value={requestForm.resource_id}
        onChange={(e) => {
          const selectedId = e.target.value === "" ? "" : Number(e.target.value);
          const selected = resourceOptions.find((r) => r.id === selectedId);

          setRequestForm({
            ...requestForm,
            resource_id: selectedId,
            type: selected?.type || "",
          });
        }}
      >
        <option value="">Select Resource</option>

        <optgroup label="Credentials">
          {resourceOptions
            .filter((res) => res.type === "cred")
            .map((res) => (
              <option key={res.id} value={res.id}>
                {res.name}
              </option>
            ))}
        </optgroup>

        <optgroup label="Assets">
          {resourceOptions
            .filter((res) => res.type === "asset")
            .map((res) => (
              <option key={res.id} value={res.id}>
                {res.name}
              </option>
            ))}
        </optgroup>
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

export default RequestForm;
