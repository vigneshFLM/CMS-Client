import React, { useState } from "react";

const PostStatusForm = ({ actionType, onSubmit, onCancel }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) return alert("Please enter a comment.");
    onSubmit(comment);
  };

  const actionLabel = {
    approved: "Approve",
    rejected: "Reject",
    rework: "Request Rework",
  };

  return (
    <div className="overlay">
      <div className="add-form-floating">
        <div className="overlay-title">
          <h3>{actionLabel[actionType]} Post</h3>
        </div>

        <div className="form">
            <textarea
              placeholder={`Enter your reason to ${actionLabel[actionType].toLowerCase()}...`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
        </div>

        <div className="floating-buttons" style={{ marginTop: "20px" }}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostStatusForm;
