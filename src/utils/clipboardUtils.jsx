import ClipboardJS from 'clipboard';

export const handleCopy = (text, setCopiedField, field) => {
  const clipboard = new ClipboardJS('.copy-icon-button', {
    text: () => text, // text to copy
  });

  clipboard.on('success', function (e) {
    console.log("Text copied to clipboard!");
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1500);
  });

  clipboard.on('error', function (e) {
    console.error("Clipboard error:", e);
  });
};
