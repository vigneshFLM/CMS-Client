const ResourceFilters = ({
  search,
  setSearch,
  creatorFilter,
  setCreatorFilter,
  resetFilters,
  uniqueCreators,
  onAddClick,
  userRole,
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
        <option key={creator} value={creator}>
          {creator}
        </option>
      ))}
    </select>

    <div className="button-row">
      <button className="reset-button" onClick={resetFilters}>
        Reset Filters
      </button>
      {userRole !== "user" && (
        <button className="add-button" onClick={onAddClick}>
          Add Resource
        </button>
      )}
    </div>
  </div>
);

export default ResourceFilters;
