import React, { useState, useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import "../../styles/UploadedFiles.css";

const UploadedFiles = ({ files = [], onConfirm, onCancel }) => {
  const [selected, setSelected] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    setSelected([]);
  }, [files]);

  const isAllSelected = files.length > 0 && selected.length === files.length;

  const toggleSelection = (fileName) => {
    setSelected((prev) =>
      prev.includes(fileName)
        ? prev.filter((f) => f !== fileName)
        : [...prev, fileName]
    );
  };

  const toggleSelectAll = () => {
    setSelected(isAllSelected ? [] : [...files]);
  };

  const handlePreview = (fileName) => {
    setPreviewFile(fileName);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const renderPreviewThumbnail = (file) => {
    const ext = file.split(".").pop().toLowerCase();
    const fileUrl = `${baseURL}/uploads/${file}`;

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return <img src={fileUrl} alt={file} className="uf-preview-thumb" />;
    }

    if (["mp4", "webm"].includes(ext)) {
      return (
        <video className="uf-preview-thumb" muted>
          <source src={fileUrl} type={`video/${ext}`} />
        </video>
      );
    }

    if (ext === "pdf") {
      return <div className="uf-preview-placeholder">PDF</div>;
    }

    return <div className="uf-preview-placeholder">File</div>;
  };

  return (
    <div className="uf-overlay">
      <form className="uf-form" onSubmit={(e) => e.preventDefault()}>
        <h3 className="uf-title">Delete Uploaded Files</h3>

        <div className="uf-select-all">
          <label>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
            />
            {isAllSelected ? "Deselect All" : "Select All"}
          </label>
        </div>

        <div className="uf-list">
          {files.map((file) => (
            <div key={file} className="uf-item">
              <input
                type="checkbox"
                checked={selected.includes(file)}
                onChange={() => toggleSelection(file)}
              />
              <div
                className="uf-item-preview"
                onClick={() => handlePreview(file)}
                title="Click to preview"
              >
                {renderPreviewThumbnail(file)}
              </div>
              <div className="uf-filename">{file}</div>
            </div>
          ))}
        </div>

        <div className="uf-actions">
          <button
            className="reset-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="add-button"
            onClick={() => onConfirm(selected)}
            disabled={selected.length === 0}
          >
            Delete Selected
          </button>
        </div>

        <button
          type="button"
          className="uf-close-button"
          onClick={onCancel}
          title="Close"
        >
          <IconX size={20} />
        </button>
      </form>

      {previewFile && (
        <div className="uf-preview-modal" onClick={closePreview}>
          <div className="uf-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="uf-preview-close" onClick={closePreview}>
              <IconX size={24} />
            </button>
            {(() => {
              const ext = previewFile.split(".").pop().toLowerCase();
              const fileUrl = `${baseURL}/uploads/${previewFile}`;

              if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
                return <img src={fileUrl} alt="Preview" className="uf-preview-full" />;
              }

              if (["mp4", "webm"].includes(ext)) {
                return (
                  <video controls className="uf-preview-full">
                    <source src={fileUrl} type={`video/${ext}`} />
                  </video>
                );
              }

              if (ext === "pdf") {
                return (
                  <iframe
                    src={fileUrl}
                    className="uf-preview-full"
                    title="PDF Preview"
                  />
                );
              }

              return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  Download File
                </a>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadedFiles;
