import React from "react";

const RequestForm = ({
  credentialOptions,
  requestForm,
  setRequestForm,
  submitting,
  onSubmit,
  onCancel
}) => (
  <div className="overlay">
    <div className="add-form-floating">
      <h3 className="overlay-title">Request Credential Access</h3>
      <select
        value={requestForm.credential_id}
        onChange={(e) => setRequestForm({ ...requestForm, credential_id: e.target.value })}
      >
        <option value="">Select Credential</option>
        {credentialOptions.map((cred) => (
          <option key={cred.credential_id} value={cred.credential_id}>
            {cred.name}
          </option>
        ))}
      </select>
      <textarea
        rows={4}
        placeholder="Reason for request"
        value={requestForm.reason}
        onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
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
