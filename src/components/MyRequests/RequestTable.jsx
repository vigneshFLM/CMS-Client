import React from "react";
import {
  IconClockHour4,
  IconLockCheck,
  IconLockX,
  IconEye,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

const RequestTable = ({
  currentRequests,
  indexOfFirst,
  onEdit,
  onView,
  onDelete,
}) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>Resource</th>
          <th>Type</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Reviewer</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentRequests.map((req, i) => (
          <tr key={req.id}>
            <td>{indexOfFirst + i + 1}</td>
            <td>{req.resource_name}</td>
            <td>
              {req.resource_type === "cred"
                ? "Credential"
                : req.resource_type === "asset"
                ? "Asset"
                : "NA"}
            </td>

            <td>{req.reason}</td>
            <td>
              <span className={`status-tag ${req.status}`}>{req.status}</span>
            </td>
            <td>{req.reviewer_name || "-"}</td>
            <td>{new Date(req.created_at).toLocaleString()}</td>
            <td className="action-buttons">
              <button
                className="action-button view-button"
                onClick={() => onView(req.id)}
                title="View"
              >
                <IconEye size={18} />
              </button>

              {req.status === "pending" && (
                <>
                  <button
                    className="action-button edit-icon"
                    onClick={() => onEdit(req.id)}
                    title="Edit"
                  >
                    <IconEdit size={18} />
                  </button>
                  <button
                    className="action-button delete-icon"
                    onClick={() => onDelete(req.id)}
                    title="Delete"
                  >
                    <IconTrash size={18} color="#d32f2f" />
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RequestTable;
