export const handleCopy = (text, setCopiedField, field) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Text copied to clipboard!");
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 1500);
      },
      (err) => {
        console.error("Error copying text: ", err);
      }
    );
  } else {
    console.error("Clipboard API is not available");
  }
};
