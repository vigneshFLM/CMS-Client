const ConfirmationOverlay = ({
  show,
  onConfirm,
  onCancel,
  actionType,
  data,
}) => {
  if (!show) return null;

  const name =
    data?.name ||
    data?.username ||
    data?.resource_name ||
    data?.title || // fallback for post title
    null;

  const displayName = name ? ` "${name}"` : "";

  const getMessage = () => {
    switch (actionType) {
      // Post-related cases
      case "addPost":
        return <>Are you sure you want to add the new post{displayName}?</>;
      case "editPost":
        return <>Do you want to edit the post{displayName}?</>;
      case "deletePost":
        return <>Are you sure you want to delete the post{displayName}?</>;

      // Resource-related cases
      case "deleteResource":
        return <>Are you sure you want to delete the resource{displayName}?</>;
      case "editResource":
        return <>Do you want to edit the resource{displayName}?</>;
      case "addResource":
        if (data?.resourceType === "asset") {
          return <>Are you sure you want to add the new asset{displayName}?</>;
        } else if (data?.resourceType === "cred") {
          return (
            <>Are you sure you want to add the new credential{displayName}?</>
          );
        }
        return <>Are you sure you want to add the new resource{displayName}?</>;

      // User-related cases
      case "deleteUser":
        return <>Are you sure you want to delete the user{displayName}?</>;
      case "editUser":
        return <>Do you want to edit the user{displayName}?</>;
      case "addUser":
        return <>Are you sure you want to add the new user{displayName}?</>;

      // Request-related cases
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
            <strong>{data?.resource_name}</strong> by{" "}
            <strong>{data?.user_name}</strong>?<br />
            Reason: <em>{data?.reason}</em>
          </>
        );

      case "rejectRequest":
        return (
          <>
            Are you sure you want to <strong>reject</strong> the request for{" "}
            <strong>{data?.resource_name}</strong> by{" "}
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
