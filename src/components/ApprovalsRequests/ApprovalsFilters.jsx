import React from "react";

const ApprovalsFilters = ({ search, setSearch, statusFilter, setStatusFilter }) => (
  <div className="filters">
    <input
      type="text"
      placeholder="Search by reason, name, or credential..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
    />
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>
);

export default ApprovalsFilters;
