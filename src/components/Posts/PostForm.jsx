import React, { useState, useEffect, useRef } from "react";
import postApi from "../../api/postApi";
import userApi from "../../api/userApi";

const PostForm = ({
  onSubmit,
  onCancel,
  editMode,
  postData = {},
  submitting,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageId, setPageId] = useState("");
  const [assignedApproverId, setAssignedApproverId] = useState("");
  const [contentType, setContentType] = useState("");
  const [files, setFiles] = useState([]);
  const [driveLink, setDriveLink] = useState("");
  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPages, setLoadingPages] = useState(true);
  const [deletedFileIds, setDeletedFileIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileSizeError, setFileSizeError] = useState("");


  const fileInputRef = useRef(null); // ref for clearing file input

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.fetchApprovers();
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch {
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editMode && postData) {
      setTitle(postData.title || "");
      setDescription(postData.description || "");
      setPageId(postData.page_id || "");
      setAssignedApproverId(postData.assigned_approver_id || "");
      setContentType(postData.content_type || "");
      setDriveLink(postData.drive_link || "");
      setFiles([]); // reset file input
    }
  }, [editMode, postData]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await postApi.getPages();
        setPages(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setPages([]);
      } finally {
        setLoadingPages(false);
      }
    };
    fetchPages();
  }, []);

  const handleFilesChange = (e) => {
    setFileSizeError(""); // Clear any previous error

    const MAX_TOTAL_SIZE = 100 * 1024 * 1024; 
    const newFiles = Array.from(e.target.files);

    const currentTotalSize = files.reduce((acc, file) => acc + file.size, 0);
    const newTotalSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    const combinedSize = currentTotalSize + newTotalSize;

    if (combinedSize > MAX_TOTAL_SIZE) {
      setFileSizeError("Total file size cannot exceed 100MB.");
      return; // Do not add new files
    }

    const filtered = newFiles.filter(
      (file) =>
        !files.some(
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
        )
    );

    setFiles((prev) => [...prev, ...filtered]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!pageId) newErrors.pageId = "Page selection is required.";
    if (!assignedApproverId)
      newErrors.assignedApproverId = "Approver is required.";
    if (!contentType) newErrors.contentType = "Content type is required.";

    if (driveLink && !/^https:\/\/drive\.google\.com/.test(driveLink)) {
      newErrors.driveLink = "Only Google Drive links are allowed.";
    }

    if (
      !driveLink &&
      files.length === 0 &&
      (!editMode || postData.files?.length === deletedFileIds.length)
    ) {
      newErrors.fileOrDriveLink =
        "At least one file or a valid Google Drive link is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPageId("");
    setAssignedApproverId("");
    setContentType("");
    setFiles([]);
    setDriveLink("");
    if (fileInputRef.current) fileInputRef.current.value = null;
    setFileSizeError("");
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = {
      title,
      description,
      pageId,
      assignedApproverId,
      contentType,
      files,
      driveLink,
      deletedFileIds,
    };

    if (editMode && postData?.id) {
      payload.id = postData.id;
    }

    onSubmit(payload);
    resetForm();
  };

  return (
    <div className="overlay">
      <div className="add-form-floating">
        <div className="overlay-title">
          <h3>{editMode ? "Edit Post" : "Create New Post"}</h3>
        </div>

        <div className="form">
          <label>
            Title
            <input
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </label>

          <label>
            Page
            <select
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              required
              disabled={loadingPages}
            >
              <option value="">Select Page</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
            {errors.pageId && <p className="error-text">{errors.pageId}</p>}
          </label>

          <label>
            Description
            <input
              type="text"
              placeholder="Enter post description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {errors.description && (
              <p className="error-text">{errors.description}</p>
            )}
          </label>
          <label>
            Approver
            <select
              value={assignedApproverId}
              onChange={(e) => setAssignedApproverId(e.target.value)}
              required
              disabled={loadingUsers}
            >
              <option value="">Select Approver</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.assignedApproverId && (
              <p className="error-text">{errors.assignedApproverId}</p>
            )}
          </label>

          <label>
            Content Type
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="post">Post</option>
              <option value="reel">Reel</option>
              <option value="meme">Meme</option>
            </select>
            {errors.contentType && (
              <p className="error-text">{errors.contentType}</p>
            )}
          </label>

          <label>
            Google Drive Link (optional)
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
            />
          </label>

          <label>
            Upload Files ( Max 100MB )
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFilesChange}
            />
            <p style={{ fontSize: "12px", color: "#555" }}>
              Total size:{" "}
              {(
                files.reduce((acc, file) => acc + file.size, 0) /
                (1024 * 1024)
              ).toFixed(2)}{" "}
              MB
            </p>
            {errors.fileOrDriveLink && (
              <p className="error-text">{errors.fileOrDriveLink}</p>
            )}
            {fileSizeError && <p className="error-text">{fileSizeError}</p>}
          </label>

          <br></br>
          {files.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <p>
                <strong>Attached Files:</strong>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                {files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      padding: "10px",
                      width: "120px",
                      textAlign: "center",
                    }}
                  >
                    {(() => {
                      const previewUrl = URL.createObjectURL(file);
                      const type = file.type;

                      if (type.startsWith("image/")) {
                        return (
                          <img
                            src={previewUrl}
                            alt={file.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "4px",
                              marginBottom: "5px",
                            }}
                            onLoad={(e) => URL.revokeObjectURL(previewUrl)}
                          />
                        );
                      } else if (type === "application/pdf") {
                        return (
                          <iframe
                            src={previewUrl}
                            title={file.name}
                            style={{
                              width: "100%",
                              height: "150px",
                              border: "none",
                              marginBottom: "5px",
                            }}
                          />
                        );
                      } else if (type.startsWith("video/")) {
                        return (
                          <video
                            controls
                            style={{
                              width: "100%",
                              height: "100px",
                              borderRadius: "4px",
                              marginBottom: "5px",
                            }}
                          >
                            <source src={previewUrl} type={type} />
                            Your browser does not support the video tag.
                          </video>
                        );
                      } else {
                        return (
                          <div
                            style={{ fontSize: "12px", marginBottom: "5px" }}
                          >
                            {file.name}
                          </div>
                        );
                      }
                    })()}

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        fontSize: "12px",
                        color: "red",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {editMode && postData?.files?.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <p>
                <strong>Previously Uploaded Files:</strong>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                {postData.files
                  .filter((file) => !deletedFileIds.includes(file.id))
                  .map((file) => {
                    const baseUrl =
                      import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") ||
                      "http://localhost:5000";
                    const fullFileUrl = `${baseUrl}${file.file_url}`;
                    const mime = file.mime_type || "";

                    return (
                      <div
                        key={file.id}
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "6px",
                          padding: "10px",
                          width: "120px",
                          textAlign: "center",
                        }}
                      >
                        {mime.startsWith("image/") ? (
                          <img
                            src={fullFileUrl}
                            alt={file.original_name}
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "4px",
                              marginBottom: "5px",
                            }}
                          />
                        ) : mime === "application/pdf" ? (
                          <iframe
                            src={fullFileUrl}
                            title={file.original_name}
                            style={{
                              width: "100%",
                              height: "150px",
                              border: "none",
                              marginBottom: "5px",
                            }}
                          />
                        ) : mime.startsWith("video/") ? (
                          <video
                            controls
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "4px",
                              marginBottom: "5px",
                            }}
                          >
                            <source src={fullFileUrl} type={mime} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div
                            style={{ fontSize: "12px", marginBottom: "5px" }}
                          >
                            {file.original_name}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setDeletedFileIds((prev) => [...prev, file.id])
                          }
                          style={{
                            fontSize: "12px",
                            color: "red",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <div className="floating-buttons" style={{ marginTop: "20px" }}>
          <button onClick={handleSubmit}>
            {editMode ? "Update Post" : "Submit"}
          </button>
          <button onClick={onCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
