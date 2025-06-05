const ConfirmationOverlay = ({
  show,
  onConfirm,
  onCancel,
  actionType,
  data,
}) => {
  if (!show) return null;

  const name = data?.name || data?.username || data?.credential_name || null;

  const displayName = name ? ` "${name}"` : "";

  const getMessage = () => {
    switch (actionType) {
      case "deleteCred":
        return (
          <>Are you sure you want to delete the credential{displayName}?</>
        );
      case "editCred":
        return <>Do you want to edit the credential{displayName}?</>;
      case "addCred":
        return (
          <>Are you sure you want to add the new credential{displayName}?</>
        );

      case "deleteUser":
        return <>Are you sure you want to delete the user{displayName}?</>;
      case "editUser":
        return <>Do you want to edit the user{displayName}?</>;
      case "addUser":
        return <>Are you sure you want to add the new user{displayName}?</>;

      case "deleteRequest":
        return (
          <>
            Are you sure you want to delete the request for
            {displayName}?<br />
            Reason: <em>{data?.reason}</em>
          </>
        );
      case "editRequest":
        return (
          <>
            Do you want to edit the request for
            {displayName}?<br />
            Reason: <em>{data?.reason}</em>
          </>
        );
      case "addRequest":
        return (
          <>
            Are you sure you want to add the new request for
            {displayName}?<br />
            Reason: <em>{data?.reason}</em>
          </>
        );
      case "revokeAccess":
        return <>Are you sure you want to revoke access ?</>;

      case "approveRequest":
        return (
          <>
            Are you sure you want to <strong>approve</strong> the request for{" "}
            <strong>{data?.credential_name}</strong> by{" "}
            <strong>{data?.user_name}</strong>?<br />
            Reason: <em>{data?.reason}</em>
          </>
        );
      case "rejectRequest":
        return (
          <>
            Are you sure you want to <strong>reject</strong> the request for{" "}
            <strong>{data?.credential_name}</strong> by{" "}
            <strong>{data?.user_name}</strong>?<br />
            Reason: <em>{data?.reason}</em>
          </>
        );
      default:
        return "Are you sure you want to proceed with this action?";
    }
  };

  const getActionLabel = () => {
    if (actionType?.startsWith("delete")) return "Delete";
    if (actionType?.startsWith("add")) return "Add";
    if (actionType?.startsWith("edit")) return "Edit";
    return "Proceed";
  };

  return (
    <div className="overlay">
      <form className="add-form-floating" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <div className="form-value">{getMessage()}</div>
        </div>
        <div className="floating-buttons">
          <button type="button" className="confirm-button" onClick={onConfirm}>
            Yes, {getActionLabel()}
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
