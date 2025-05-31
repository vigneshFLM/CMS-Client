// src/utils/clipboardUtils.js
export const handleCopy = (text, setCopiedField, field) => {
  navigator.clipboard.writeText(text);
  setCopiedField(field);
  setTimeout(() => setCopiedField(""), 1500);
};
