import React from "react";
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react";

const UserTable = ({
  users,
  indexOfFirstUser,
  onAccessView,
  onEdit,
  onDelete,
  userRole,
}) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Designation</th>
          <th>Role</th>
          <th>Manager</th>
          <th>Access Count</th>
          {userRole === "super-admin" && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {users.map((u, i) => (
          <tr key={u.id}>
            <td>{indexOfFirstUser + i + 1}</td>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.mobile || "-"}</td>
            <td>{u.designation || "-"}</td>
            <td>{u.role}</td>
            <td>{u.manager_name || "-"}</td>
            <td>
              <div className="access-count-view">
                {u.access_count}
                {u.access_count > 0 && (
                  <button
                    className="action-button view-icon"
                    onClick={() => onAccessView(u)}
                  >
                    View
                  </button>
                )}
              </div>
            </td>

            {(userRole === "super-admin" ||
              (userRole === "admin" && u.manager_id === userRole.id)) && (
              <td>
                <div className="action-buttons">
                  {" "}
                  <button
                    className="action-button edit-icon"
                    onClick={() => onEdit(u)}
                  >
                    <IconEdit size={16} color="#1976d2" />
                  </button>
                  <button
                    className="action-button delete-icon"
                    onClick={() => onDelete(u.id)}
                  >
                    <IconTrash size={16} color="#d32f2f" />
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;
