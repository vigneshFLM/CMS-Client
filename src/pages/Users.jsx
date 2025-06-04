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
  const usersPerPage = 10;
  const { showNotification } = useNotification();

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filtered.length / usersPerPage);

  const fetchUsers = async () => {
    try {
      const [usersRes, managersRes] = await Promise.all([
        api.get("/users"),
        api.get("/users/admins"),
      ]);
      setUsers(usersRes.data);
      setFiltered(usersRes.data);
      setManagers(managersRes.data);
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
    if (search.trim()) {
      const term = search.toLowerCase();
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

  const fetchData = async () => {
    try {
      const [usersRes, managersRes] = await Promise.all([
        fetchUsers(),
        fetchManagers(),
      ]);
      setUsers(usersRes.data);
      setFiltered(usersRes.data);
      setManagers(managersRes.data);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to fetch users/managers");
    }
  };

  const handleAddUser = async () => {
    if (!validateUser(newUser, showNotification, false)) return;

    try {
      await userApi.register(newUser);
      resetForm();
      fetchUsers();
      showNotification("User added successfully!", "success");
    } catch (err) {
      handleApiError(err, showNotification, "Failed to add user");
    }
  };

  const handleUpdateUser = async () => {
    if (!validateUser(newUser, showNotification, true)) return;

    try {
      await userApi.update(editId, newUser);
      resetForm();
      fetchUsers();
      showNotification("User updated successfully!", "success");
    } catch (err) {
      handleApiError(err, showNotification, "Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await userApi.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showNotification("User deleted successfully!", "success");
    } catch (err) {
      handleApiError(err, showNotification, "Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setEditId(user.id);
    setNewUser({ ...user, password: "" });
    setShowForm(true);
  };

  const resetForm = () => {
    setNewUser({ name: "", email: "", password: "", role: "", manager_id: "" });
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
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
        setShowForm={setShowForm}
      />

      {showForm && (
        <UserForm
          newUser={newUser}
          setNewUser={setNewUser}
          roles={roles}
          managers={managers}
          onSubmit={editMode ? handleUpdateUser : handleAddUser}
          onCancel={resetForm}
          editMode={editMode}
        />
      )}

      <UserTable
        users={currentUsers}
        indexOfFirstUser={indexOfFirstUser}
        onEdit={handleEdit}
        onDelete={handleDeleteUser}
      />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Users;
