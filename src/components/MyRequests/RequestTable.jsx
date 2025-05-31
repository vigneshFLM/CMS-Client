import React from "react";
import {
  IconClockHour4,
  IconLockCheck,
  IconLockX,
} from "@tabler/icons-react";

const renderStatusIcon = (status) => {
  if (status === "approved") return <IconLockCheck size={16} color="#388e3c" />;
  if (status === "rejected") return <IconLockX size={16} color="#d32f2f" />;
  return <IconClockHour4 size={16} color="#f9a825" />;
};

const RequestTable = ({ currentRequests, indexOfFirst }) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>Credential</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Reviewer</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {currentRequests.map((req, i) => (
          <tr key={req.id}>
            <td>{indexOfFirst + i + 1}</td>
            <td>{req.credential_name}</td>
            <td>{req.reason}</td>
            <td>
              <span className={`status-tag ${req.status}`}>
                {req.status}
              </span>
            </td>
            <td>{req.reviewer_name || "-"}</td>
            <td>{new Date(req.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RequestTable;
