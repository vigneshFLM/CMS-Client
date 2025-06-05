const ConfirmationOverlay = ({ show, onConfirm, onCancel, actionType, data }) => {
  if (!show) return null;

  const getMessage = () => {
    // Credential-related actions
    if (actionType === "deleteCred") {
      return (
        <>
          Are you sure you want to delete the credential? <br />
          <strong>"{data.name}"</strong>
        </>
      );
    }
    if (actionType === "editCred") {
      return (
        <>
          Do you want to edit the credential? <br />
          <strong>"{data.name}"</strong>
        </>
      );
    }
    if (actionType === "addCred") {
      return (
        <>
          Are you sure you want to add the new credential? <br />
          <strong>"{data.name}"</strong>
        </>
      );
    }

    // User-related actions
    if (actionType === "deleteUser") {
      return (
        <>
          Are you sure you want to delete the user? <br />
          <strong>"{data.username}"</strong>
        </>
      );
    }
    if (actionType === "editUser") {
      return (
        <>
          Do you want to edit the user? <br />
          <strong>"{data.username}"</strong>
        </>
      );
    }
    if (actionType === "addUser") {
      return (
        <>
          Are you sure you want to add the new user? <br />
          <strong>"{data.username}"</strong>
        </>
      );
    }

    return "Are you sure you want to proceed with this action?";
  };

  return (
    <div className="overlay">
      <form className="add-form-floating" onSubmit={(e) => e.preventDefault()}>
        <h3 className="form-title">Confirmation</h3>
        <div className="form-group">
          <div className="form-value">{getMessage()}</div>
        </div>

        <div className="floating-buttons">
          <button type="button" className="confirm-button" onClick={onConfirm}>
            Yes, {actionType === "deleteCred" || actionType === "deleteUser" 
              ? "Delete" 
              : actionType === "addCred" || actionType === "addUser" 
              ? "Add" 
              : "Proceed"}
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmationOverlay;
