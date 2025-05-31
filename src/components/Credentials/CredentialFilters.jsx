const CredentialFilters = ({
  search,
  setSearch,
  creatorFilter,
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
      {uniqueCreators.map((id) => (
        <option key={id} value={id}>
          Creator ID: {id}
        </option>
      ))}
    </select>

    <div className="button-row">
      <button className="reset-button" onClick={resetFilters}>
        Reset Filters
      </button>
      <button className="add-button" onClick={onAddClick}>
        Add Credential
      </button>
    </div>
  </div>
);

export default CredentialFilters;
