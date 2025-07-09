import { useEffect, useState } from "react";

const AccessFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  resetFilters,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(localSearch);
    }, 300); // Debounce by 300ms

    return () => clearTimeout(timeout);
  }, [localSearch]);

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by user, email, or credential..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="search-input"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="revoked">Revoked</option>
      </select>

      <button className="reset-button" onClick={resetFilters}>
        Reset Filters
      </button>
    </div>
  );
};
