const AccessFilters = ({ search, setSearch, statusFilter, setStatusFilter, resetFilters }) => (
  <div className="filters">
    <input
      type="text"
      placeholder="Search by user, email, or credential..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
    />

    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
      <option value="">All Statuses</option>
      <option value="active">Active</option>
      <option value="revoked">Revoked</option>
    </select>

    <button className="reset-button" onClick={resetFilters}>
      Reset Filters
    </button>
  </div>
);

export default AccessFilters;
