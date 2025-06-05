export const handleCopy = (text, setCopiedField, field) => {
  console.log("Attempting to copy:", text);  // Log text to be copied
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Text copied to clipboard!");
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    },
    (err) => {
      console.error("Error copying text: ", err);  // Handle potential errors
    }
  );
};
