import React, { useEffect, useState, useCallback } from "react";
import userApi from "../api/userApi";
import resourceApi from "../api/resourceApi";
import { useNotification } from "../context/NotificationContext";
import { handleApiError } from "../utils/errorHandler";
import { validateUser } from "../utils/validateUser";
import UserFilters from "../components/Users/UserFilters";
import UserForm from "../components/Users/UserForm";
import UserTable from "../components/Users/UserTable";
import AccessTable from "../components/Users/UserAccessTable";
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [accessOverlayVisible, setAccessOverlayVisible] = useState(false);
  const [selectedUserAccess, setSelectedUserAccess] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [accessLoading, setAccessLoading] = useState(false);

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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      if (user.role === "super-admin") {
        const [usersRes, managersRes] = await Promise.all([
          userApi.fetchAll(),
          userApi.fetchManagers(),
        ]);
        setUsers(usersRes.data);
        setFiltered(usersRes.data);
        setManagers(managersRes.data);
      } else if (user.role === "admin") {
        const [usersRes] = await Promise.all([userApi.fetchByAdmin(user.id)]);
        setUsers(usersRes.data);
        setFiltered(usersRes.data);
      }
    } catch (err) {
      handleApiError(err, showNotification, "Failed to fetch users/managers");
    } finally {
      setLoading(false);
    }
  }, [user.role, user.id]);

  const filterUsers = useCallback(() => {
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
  }, [search, roleFilter, managerFilter, accessFilter, users]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

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
    setSubmitting(true);

    try {
      if (actionType === "addUser") {
        if (!validateUser(newUser, showNotification, false)) {
          setSubmitting(false);
          return;
        }
        await userApi.register(newUser);
        showNotification("User added successfully!", "success");
      } else if (actionType === "editUser") {
        if (!validateUser(newUser, showNotification, true)) {
          setSubmitting(false);
          return;
        }
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setEditId(user.id);
    setNewUser({ ...user, password: "" });
    setShowForm(true);
  };

  const handleAccessView = async (user) => {
  setAccessOverlayVisible(true);
  setSelectedUserName(user.name);
  setAccessLoading(true);

  try {
    const response = await resourceApi.getResourceByUserId(user.id); // ⬅️ Make sure this API exists
    setSelectedUserAccess(response.data);
  } catch (err) {
    handleApiError(err, showNotification, "Failed to fetch access data");
  } finally {
    setAccessLoading(false);
  }
};


  return (
    <div className="users-container">
      <UserFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        userRole={user.role}
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
          submitting={submitting}
        />
      )}

      {loading ? (
        <div className="loading">
          <span className="spinner" />
          <span>Loading users...</span>
        </div>
      ) : currentUsers.length === 0 ? (
        <p className="no-data">No users found.</p>
      ) : (
        <>
          <UserTable
            users={currentUsers}
            userRole={user.role}
            indexOfFirstUser={indexOfFirstUser}
            onAccessView={handleAccessView}
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
        </>
      )}

      <ConfirmationOverlay
        show={showOverlay}
        actionType={overlayData.actionType}
        data={overlayData.data}
        onConfirm={handleOverlayConfirm}
        onCancel={() => setShowOverlay(false)}
      />

      {accessOverlayVisible && (
        <div className="overlay">
          <div className="access-table-form-floating access-overlay">
            <h3 className="overlay-title">Access for {selectedUserName}</h3>

            {accessLoading ? (
              <div className="loading">
                <span className="spinner" />
                <span>Loading Access Data...</span>
              </div>
            ) : selectedUserAccess.length === 0 ? (
              <p className="no-data">No access records found.</p>
            ) : (
              <AccessTable
                entries={selectedUserAccess}
                indexOfFirst={0}
                onRevoke={() => {}} // optional: disable or customize
                revokingId={null}
              />
            )}

            <div className="floating-buttons">
              <button onClick={() => setAccessOverlayVisible(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
