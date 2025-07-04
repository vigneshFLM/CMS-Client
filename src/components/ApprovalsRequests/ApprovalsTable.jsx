import React from "react";
import { IconLockCheck, IconLockX, IconEye } from "@tabler/icons-react";

const ApprovalsTable = ({
  requests,
  indexOfFirst,
  handleStatusUpdate,
  handleViewRequest,
}) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>User</th>
          <th>Resource</th>
          <th>Type</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Reviewed By</th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req, i) => (
          <tr key={req.id}>
            <td>{indexOfFirst + i + 1}</td>
            <td>{req.user_name || `User ${req.user_id}`}</td>
            <td>{req.resource_name || `Credential ${req.credential_id}`}</td>
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
            <td>
              <div className="action-buttons">
                <button
                  className="action-button view-button"
                  onClick={() => handleViewRequest(req)}
                  title="View"
                >
                  <IconEye size={18} />
                </button>

                {req.status === "pending" ? (
                  <>
                    <button
                      className="action-button approve-icon"
                      onClick={() =>
                        handleStatusUpdate(
                          req.id,
                          "approved",
                          req.user_id,
                          req.resource_id
                        )
                      }
                      title="Approve"
                    >
                      <IconLockCheck size={16} />
                    </button>
                    <button
                      className="action-button reject-icon"
                      onClick={() => handleStatusUpdate(req.id, "rejected")}
                      title="Reject"
                    >
                      <IconLockX size={16} />
                    </button>
                  </>
                ) : (
                  <em title={`Reviewed by ${req.reviewer_name || "N/A"}`}>
                    {req.status === "approved" ? (
                      <IconLockCheck size={16} color="#007bff" />
                    ) : (
                      <IconLockX size={16} color="#d32f2f" />
                    )}
                  </em>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ApprovalsTable;
