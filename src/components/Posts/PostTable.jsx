import React, { useState } from "react";
import {
  IconLockCheck,
  IconLockX,
  IconRefresh,
  IconEye,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";
import postApi from "../../api/postApi";
import PostStatusForm from "./PostStatusForm";

const PostTable = ({ posts, onDelete, user, refresh, onView, onEdit }) => {
  const isApprover = user.post_role === "approver";
  const isSubmitter = user.post_role === "submitter";

  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusAction, setStatusAction] = useState({ postId: null, type: "" });
  const hasActionBy = posts.some((p) => p.action_by_name);
  const hasActionAt = posts.some((p) => p.action_at);

  const openStatusForm = (postId, type) => {
    setStatusAction({ postId, type });
    setShowStatusForm(true);
  };

  const handleStatusSubmit = async (comment) => {
    try {
      await postApi.updateStatus(
        statusAction.postId,
        statusAction.type,
        comment,
        user.id
      );
      refresh();
      setShowStatusForm(false);
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div className="table-wrapper">
      {showStatusForm && (
        <PostStatusForm
          actionType={statusAction.type}
          onSubmit={handleStatusSubmit}
          onCancel={() => setShowStatusForm(false)}
        />
      )}

      <table className="table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Title</th>
            {!isSubmitter && <th>Submitted By</th>}
            <th>Page</th>
            <th>Content Type</th>
            <th>Status</th>
            {hasActionBy && <th>Action By</th>}
            {hasActionAt && <th>Action At</th>}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post, index) => {
              const isPending = post.status === "pending";
              const isRework = post.status === "rework";

              return (
                <tr key={post.id}>
                  <td>{index + 1}</td>
                  <td>{post.title}</td>
                  {!isSubmitter && <td>{post.submitted_by_name}</td>}
                  <td>{post.page_name}</td>
                  <td>{post.content_type}</td>
                  <td>
                    <span className={`status-tag ${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  {hasActionBy && <td>{post.action_by_name || "-"}</td>}
                  {hasActionAt && (
                    <td>
                      {post.action_at
                        ? new Date(post.action_at).toLocaleString()
                        : "-"}
                    </td>
                  )}
                  <td>
                    <div className="action-buttons">
                      {/* Always show View */}
                      <button
                        className="action-button view-icon"
                        title="View"
                        onClick={() => onView(post)}
                      >
                        <IconEye size={16} color="#0288d1" />
                      </button>

                      {/* Submitter: Edit/Delete if pending */}
                      {isSubmitter && isPending && (
                        <>
                          <button
                            className="action-button edit-icon"
                            title="Edit"
                            onClick={() => onEdit(post)}
                          >
                            <IconEdit size={16} color="#ff9800" />
                          </button>
                          <button
                            className="action-button delete-icon"
                            title="Delete"
                            onClick={() => onDelete(post)}
                          >
                            <IconTrash size={16} color="#d32f2f" />
                          </button>
                        </>
                      )}

                      {isSubmitter && isRework && (
                        <button
                          className="action-button edit-icon"
                          title="Resubmit"
                          onClick={() => onEdit(post)} // assuming onEdit opens the post form
                        >
                          <IconRefresh size={16} color="#0288d1" />
                        </button>
                      )}

                      {isApprover && (isPending || isRework) && (
                        <>
                          <button
                            className="action-button approve-icon"
                            title="Approve"
                            onClick={() => openStatusForm(post.id, "approved")}
                          >
                            <IconLockCheck size={16} />
                          </button>
                          <button
                            className="action-button rework-icon"
                            title="Rework"
                            onClick={() => openStatusForm(post.id, "rework")}
                          >
                            <IconRefresh size={16} color="#f57c00" />
                          </button>
                          <button
                            className="action-button reject-icon"
                            title="Reject"
                            onClick={() => openStatusForm(post.id, "rejected")}
                          >
                            <IconLockX size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PostTable;
