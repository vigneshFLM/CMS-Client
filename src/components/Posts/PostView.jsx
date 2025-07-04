import React from "react";
import { IconX } from "@tabler/icons-react";

const PostView = ({ post, onClose, user }) => {
  if (!post) return null;
  const isSubmitter = user?.post_role === "submitter";
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const getEmbeddedDriveUrl = (url) => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  };

  const renderFiles = () => {
    if (!post.files || post.files.length === 0) return null;

    return post.files.map((file, idx) => {
      const fullFileUrl = `${baseURL}${file.file_url}`;
      const ext = fullFileUrl.split("?")[0].split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
        return (
          <img
            key={idx}
            src={fullFileUrl}
            alt={file.original_name}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              marginBottom: "1rem",
              objectFit: "contain",
              cursor: "default",
              pointerEvents: "none",
            }}
          />
        );
      } else if (ext === "pdf") {
        return (
          <iframe
            key={idx}
            src={fullFileUrl}
            style={{ width: "100%", height: "400px", marginBottom: "1rem" }}
          />
        );
      } else if (["mp4", "webm"].includes(ext)) {
        return (
          <video
            key={idx}
            controls
            style={{ width: "100%", maxHeight: "300px", marginBottom: "1rem" }}
          >
            <source src={fullFileUrl} type={`video/${ext}`} />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return <p key={idx}>Unsupported file type: {ext}</p>;
      }
    });
  };

  return (
    <div className="overlay">
      <form
        className="add-form-floating credential-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <h3 className="form-title">Post Details</h3>

        {post.title && (
          <div className="form-group">
            <label className="form-label">
              <strong>Title:</strong>
            </label>
            <div className="form-value">{post.title}</div>
          </div>
        )}

        {post.description && (
          <div className="form-group">
            <label className="form-label">
              <strong>Description:</strong>
            </label>
            <div className="form-value">{post.description}</div>
          </div>
        )}

        {post.status && (
          <div className="form-group">
            <label className="form-label">
              <strong>Status:</strong>
            </label>
            <div className="form-value">{post.status}</div>
          </div>
        )}

        {["approved", "rejected", "rework"].includes(post.status) && (
          <div className="form-group">
            <label className="form-label">
              <strong>Comment:</strong>
            </label>
            <div className="form-value">
              {post.comment || post.latest_comment || "No comment available"}
            </div>
          </div>
        )}

        {post.page_name && (
          <div className="form-group">
            <label className="form-label">
              <strong>Page Name:</strong>
            </label>
            <div className="form-value">{post.page_name}</div>
          </div>
        )}

        {!isSubmitter && post.submitted_by_name && (
          <div className="form-group">
            <label className="form-label">
              <strong>Submitted By:</strong>
            </label>
            <div className="form-value">{post.submitted_by_name}</div>
          </div>
        )}

        {post.action_by_name && (
          <div className="form-group">
            <label className="form-label">
              <strong>Approved By:</strong>
            </label>
            <div className="form-value">{post.action_by_name}</div>
          </div>
        )}

        {post.drive_link && (
          <div className="form-group">
            <label className="form-label">
              <strong>Drive Link:</strong>
            </label>
            <div className="form-value">
              <a
                href={post.drive_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", marginBottom: "1rem" }}
              >
                {post.drive_link}
              </a>
              {getEmbeddedDriveUrl(post.drive_link) && (
                <iframe
                  src={getEmbeddedDriveUrl(post.drive_link)}
                  style={{ width: "100%", height: "400px" }}
                  allow="autoplay"
                />
              )}
            </div>
          </div>
        )}

        {post.files && post.files.length > 0 && (
          <div className="form-group">
            <label className="form-label">
              <strong>Files:</strong>
            </label>
            <div className="form-value">{renderFiles()}</div>
          </div>
        )}

        <button
          type="button"
          className="icon-close-button"
          onClick={onClose}
          title="Close"
        >
          <IconX size={20} />
        </button>
      </form>
    </div>
  );
};

export default PostView;
