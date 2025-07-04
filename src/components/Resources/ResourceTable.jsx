import React from "react";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

const ResourceTable = ({
  resources,
  onView,
  onEdit,
  onDelete,
  userRole,
  resourceType,
}) => {
  const showActions =
    userRole === "super-admin" || resources.some((r) => r.access_status !== "revoked");

  const renderHeadings = () => (
    <>
      <th>S.no</th>
      <th>Name</th>
      <th>Type</th>
      {userRole === "super-admin" ? (
        <>
          <th>Created By</th>
          <th>Created At</th>
        </>
      ) : (
        <>
          <th>Granted By</th>
          <th>Granted At</th>
        </>
      )}
      {showActions && <th>Actions</th>}
    </>
  );

  return (
    <div className="table-wrapper">
      <table className="table resource-table">
        <thead>
          <tr>{renderHeadings()}</tr>
        </thead>
        <tbody>
          {resources.length === 0 ? (
            <tr>
              <td colSpan="6">No {resourceType}s found.</td>
            </tr>
          ) : (
            resources.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.type}</td>

                {userRole === "super-admin" ? (
                  <>
                    <td>{r.created_by_name}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </>
                ) : (
                  <>
                    <td>{r.granted_by_name}</td>
                    <td>{new Date(r.granted_at).toLocaleString()}</td>
                  </>
                )}

                {showActions && (
                  <td className="action-buttons">
                    {(userRole === "super-admin" ||
                      r.access_status !== "revoked") && (
                      <button
                        className="action-button view-button"
                        onClick={() => onView(r.id, r.type)}
                        title={`View ${resourceType}`}
                        aria-label={`View ${resourceType} details`}
                      >
                        <IconEye size={18} />
                      </button>
                    )}

                    {userRole === "super-admin" && (
                      <>
                        <button
                          className="action-button edit-icon"
                          onClick={() => onEdit(r)}
                          title={`Edit ${resourceType}`}
                          aria-label={`Edit ${resourceType}`}
                        >
                          <IconEdit size={18} />
                        </button>
                        <button
                          className="action-button delete-icon"
                          onClick={() => onDelete(r.id)}
                          title={`Delete ${resourceType}`}
                          aria-label={`Delete ${resourceType}`}
                        >
                          <IconTrash size={18} color="#d32f2f" />
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;
