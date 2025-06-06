import React, { useEffect, useState } from "react";
import api from "../services/api";
import userApi from "../api/userApi";
import { useNotification } from "../context/NotificationContext";
import { handleApiError } from "../utils/errorHandler";
import { validateUser } from "../utils/validateUser";
import UserFilters from "../components/Users/UserFilters";
import UserForm from "../components/Users/UserForm";
import UserTable from "../components/Users/UserTable";
import Pagination from "../components/Pagination";
import ConfirmationOverlay from "../components/ConfirmationOverlay";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [roles] = useState(["user", "admin"]);
  const [managers, setManagers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    manager_id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState({
    actionType: "",
    data: null,
  });

  const usersPerPage = 10;
  const { showNotification } = useNotification();
  const { user } = useAuth();

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filtered.length / usersPerPage);

  // Fetch users based on role (super-admin or admin)
  const fetchUsers = async () => {
    try {
      if (user.role === "super-admin") {
        // Super-admin fetches all users
        const [usersRes, managersRes] = await Promise.all([
          userApi.fetchAll(),
          userApi.fetchManagers(),
        ]);
        setUsers(usersRes.data);
        setFiltered(usersRes.data);
        setManagers(managersRes.data);
      } else if (user.role === "admin") {
        // Admin fetches only users managed by them
        const [usersRes, managersRes] = await Promise.all([
          api.get(`/users/admin/${user.id}/users`),
        ]);
        setUsers(usersRes.data);
        setFiltered(usersRes.data);
      }
    } catch (err) {
      handleApiError(err, showNotification, "Failed to fetch users/managers");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, roleFilter, managerFilter, accessFilter, users]);

  const filterUsers = () => {
    let list = [...users];
    const term = search.toLowerCase().trim();

    if (term) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }

    if (roleFilter) list = list.filter((u) => u.role === roleFilter);
    if (managerFilter)
      list = list.filter((u) => u.manager_name === managerFilter);
    if (accessFilter) {
      list = list.filter((u) => {
        const count = parseInt(u.access_count);
        if (accessFilter === "0-5") return count <= 5;
        if (accessFilter === "5-10") return count > 5 && count <= 10;
        if (accessFilter === "10-15") return count > 10 && count <= 15;
        if (accessFilter === "15-20") return count > 15 && count <= 20;
        if (accessFilter === "20+") return count > 20;
        return true;
      });
    }

    setFiltered(list);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setNewUser({ name: "", email: "", password: "", role: "", manager_id: "" });
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
  };

  const confirmAction = (actionType, data) => {
    setOverlayData({ actionType, data });
    setShowOverlay(true);
  };

  const handleOverlayConfirm = async () => {
    const { actionType, data } = overlayData;
    setShowOverlay(false);

    try {
      if (actionType === "addUser") {
        if (!validateUser(newUser, showNotification, false)) return;
        await userApi.register(newUser);
        showNotification("User added successfully!", "success");
      } else if (actionType === "editUser") {
        if (!validateUser(newUser, showNotification, true)) return;
        await userApi.update(editId, newUser);
        showNotification("User updated successfully!", "success");
      } else if (actionType === "deleteUser") {
        await userApi.delete(data.id);
        showNotification("User deleted successfully!", "success");
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      handleApiError(err, showNotification, "Action failed");
    }
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setEditId(user.id);
    setNewUser({ ...user, password: "" });
    setShowForm(true);
  };

  return (
    <div className="users-container">
      <UserFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        managerFilter={managerFilter}
        managers={managers}
        setManagerFilter={setManagerFilter}
        accessFilter={accessFilter}
        setAccessFilter={setAccessFilter}
        resetFilters={() => {
          setSearch("");
          setRoleFilter("");
          setManagerFilter("");
          setAccessFilter("");
        }}
        showForm={showForm}
        setShowForm={() => {
          setEditMode(false);
          setNewUser({
            name: "",
            email: "",
            password: "",
            role: "",
            manager_id: "",
          });
          setShowForm(true);
        }}
      />

      {showForm && (
        <UserForm
          newUser={newUser}
          setNewUser={setNewUser}
          roles={roles}
          managers={managers}
          onSubmit={() =>
            confirmAction(editMode ? "editUser" : "addUser", newUser)
          }
          onCancel={resetForm}
          editMode={editMode}
        />
      )}

      <UserTable
        users={currentUsers}
        userRole={user.role}
        indexOfFirstUser={indexOfFirstUser}
        onEdit={handleEdit}
        onDelete={(id) => {
          const user = users.find((u) => u.id === id);
          confirmAction("deleteUser", user);
        }}
      />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <ConfirmationOverlay
        show={showOverlay}
        actionType={overlayData.actionType}
        data={overlayData.data}
        onConfirm={handleOverlayConfirm}
        onCancel={() => setShowOverlay(false)}
      />
    </div>
  );
};

export default Users;
