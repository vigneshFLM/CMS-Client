import React from "react";

const RequestFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onNewRequest,
  resetFilters,
}) => (
  <div className="filters">
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="Search by credential, reason..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
    </div>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
    <button className="reset-button" onClick={resetFilters}>
      Reset Filters
    </button>

    <button className="add-button" onClick={onNewRequest}>
      New Request
    </button>
  </div>
);

export default RequestFilters;
