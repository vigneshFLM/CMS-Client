import React from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";

const UserTable = ({ users, indexOfFirstUser, onEdit, onDelete }) => (
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
          <th>Actions</th>
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
            <td>{u.access_count}</td>
            <td>
              {u.role !== "super-admin" && (
                <div className="action-buttons">
                  <button className="action-button edit-icon" onClick={() => onEdit(u)}>
                    <IconEdit size={16} color="#1976d2" />
                  </button>
                  <button className="action-button delete-icon" onClick={() => onDelete(u.id)}>
                    <IconTrash size={16} color="#d32f2f" />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;
