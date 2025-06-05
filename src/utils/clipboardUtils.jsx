// src/utils/clipboardUtils.js
export const handleCopy = (text, setCopiedField, field, showNotification) => {
  // Check if the browser supports the native clipboard API
  if (navigator.clipboard) {
    // Use the native clipboard API
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 1500);
        showNotification("Text copied to clipboard!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
        showNotification("Failed to copy text. Please try again.", "error");
      });
  } else {
    // Fallback to ClipboardJS if navigator.clipboard is not available
    import("clipboard").then(({ default: ClipboardJS }) => {
      const clipboard = new ClipboardJS(".copy-icon-button", {
        text: () => text,
      });

      clipboard.on("success", function () {
        showNotification("Text copied to clipboard!", "success");
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 1500);
      });

      clipboard.on("error", function () {
        showNotification("Failed to copy text. Please try again.", "error");
      });
    }).catch((err) => {
      console.error("Error loading ClipboardJS:", err);
      showNotification("Failed to load clipboard functionality.", "error");
    });
  }
};
