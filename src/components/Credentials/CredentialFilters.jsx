const CredentialFilters = ({
  search,
  setSearch,
  creatorFilter,
  userRole,
  setCreatorFilter,
  resetFilters,
  uniqueCreators,
  onAddClick,
}) => (
  <div className="filters">
    <input
      className="filter-input"
      type="text"
      placeholder="Search by name or username..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      className="filter-select"
      value={creatorFilter}
      onChange={(e) => setCreatorFilter(e.target.value)}
    >
      <option value="">All Creators</option>
      {uniqueCreators.map((creator) => (
        <option key={creator.id} value={creator.id}>
          {creator.name}
        </option>
      ))}
    </select>

    <div className="button-row">
      <button className="reset-button" onClick={resetFilters}>
        Reset Filters
      </button>
      {(userRole === "admin" || userRole === "super-admin") && (
        <button className="add-button" onClick={onAddClick}>
          Add Credential
        </button>
      )}
    </div>
  </div>
);

export default CredentialFilters;
