import React from "react";

const UserFilters = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  managerFilter,
  managers,
  setManagerFilter,
  accessFilter,
  setAccessFilter,
  resetFilters,
  userRole,
  showForm,
  setShowForm,
}) => {
  const accessOptions = ["0-5", "5-10", "10-15", "15-20", "20+"];

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="super-admin">Super Admin</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>

      <select
        value={managerFilter}
        onChange={(e) => setManagerFilter(e.target.value)}
      >
        <option value="">All Managers</option>
        {managers.map((manager) => (
          <option key={manager.id} value={manager.name}>
            {manager.name}
          </option>
        ))}
      </select>

      <select
        value={accessFilter}
        onChange={(e) => setAccessFilter(e.target.value)}
      >
        <option value="">All Access Counts</option>
        {accessOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <div className="button-row">
        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
        {userRole === "super-admin" && (
          <button className="add-button" onClick={() => setShowForm(true)}>
            {showForm ? "Close Form" : "Add User"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserFilters;
