import React from "react";
import { IconTrash } from "@tabler/icons-react";

const PostFilters = ({
  search,
  setSearch,
  contentTypeFilter,
  setContentTypeFilter,
  statusFilter,
  setStatusFilter,
  creatorFilter,
  creators,
  setCreatorFilter,
  resetFilters,
  onCreatePost,
  onAssignPostRole,
  onFilesDelete,
  userRole,
}) => {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by title or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <select
        value={contentTypeFilter}
        onChange={(e) => setContentTypeFilter(e.target.value)}
      >
        <option value="">All Content Types</option>
        <option value="post">Post</option>
        <option value="reel">Reel</option>
        <option value="meme">Meme</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <select
        value={creatorFilter}
        onChange={(e) => setCreatorFilter(e.target.value)}
      >
        <option value="">All Creators</option>
        {creators.map((creator) => (
          <option key={creator.id} value={creator.name}>
            {creator.name}
          </option>
        ))}
      </select>

      <div className="button-row">
        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>

        {userRole === "approver" ? (
          <>
            <button
              className="add-button"
              onClick={onAssignPostRole} // Trigger the Assign Post Role form
            >
              Assign Post Role
            </button>
            <button
              className="action-button delete-icon"
              title="Delete Files"
              onClick={onFilesDelete}
            >
              <IconTrash size={16} color="#d32f2f" />
            </button>
          </>
        ) : (
          <button
            className="add-button"
            onClick={onCreatePost} // Trigger the Create Post form
          >
            Create Post
          </button>
        )}
      </div>
    </div>
  );
};

export default PostFilters;
