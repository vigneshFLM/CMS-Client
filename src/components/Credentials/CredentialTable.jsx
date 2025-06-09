import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import "../../styles/Credentials.css";

const CredentialTable = ({
  credentials,
  onView,
  onEdit,
  onDelete,
  userRole,
}) => (
  <div className="table-wrapper">
    <table className="table credential-table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>Name</th>
          <th>Created By</th>
          <th>Granted At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {credentials.map((c, i) => (
          <tr key={c.credential_id}>
            <td>{i + 1}</td>
            <td>{c.name}</td>
            <td>{c.created_by_name}</td>
            <td>{new Date(c.created_at).toLocaleString()}</td>
            <td className="action-buttons">
              {c.status === "revoked" ? (
                <span className="revoked-label">Revoked</span>
              ) : (
                <>
                  <button
                    className="action-button view-button"
                    onClick={() => onView(c.credential_id)}
                    title="View"
                  >
                    <IconEye size={18} />
                  </button>

                  {(userRole === "super-admin" || userRole === "admin") && (
                    <>
                      <button
                        className="action-button edit-icon"
                        onClick={() => onEdit(c)}
                        title="Edit"
                      >
                        <IconEdit size={18} />
                      </button>

                      <button
                        className="action-button delete-icon"
                        onClick={() => onDelete(c.credential_id)}
                        title="Delete"
                      >
                        <IconTrash size={18} color="#d32f2f" />
                      </button>
                    </>
                  )}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CredentialTable;
