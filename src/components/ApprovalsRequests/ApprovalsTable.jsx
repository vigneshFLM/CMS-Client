import React from "react";
import {
  IconLockCheck,
  IconLockX
} from "@tabler/icons-react";

const ApprovalsTable = ({ requests, indexOfFirst, handleStatusUpdate }) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>User</th>
          <th>Credential</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Reviewer</th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req, i) => (
          <tr key={req.id}>
            <td>{indexOfFirst + i + 1}</td>
            <td>{req.user_name || `User ${req.user_id}`}</td>
            <td>{req.credential_name || `Credential ${req.credential_id}`}</td>
            <td>{req.reason}</td>
            <td><span className={`status-tag ${req.status}`}>{req.status}</span></td>
            <td>{req.reviewer_name || "-"}</td>
            <td>{new Date(req.created_at).toLocaleString()}</td>
            <td>
              {req.status === "pending" ? (
                <div className="action-buttons">
                  <button
                    className="action-button approve-icon"
                    onClick={() =>
                      handleStatusUpdate(req.id, "approved", req.user_id, req.credential_id)
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
                </div>
              ) : (
                <em title={`Reviewed by ${req.reviewer_name || "N/A"}`}>
                  {req.status === "approved" ? (
                    <IconLockCheck size={16} color="#007bff" />
                  ) : (
                    <IconLockX size={16} color="#d32f2f" />
                  )}
                </em>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ApprovalsTable;
