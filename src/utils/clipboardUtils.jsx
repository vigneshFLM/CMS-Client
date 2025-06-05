import ClipboardJS from "clipboard";
import { useNotification } from "../hooks/useNotification";

export const handleCopy = (text, setCopiedField, field) => {
  const clipboard = new ClipboardJS(".copy-icon-button", {
    text: () => text,
  });

  const { showNotification } = useNotification();

  clipboard.on("success", function (e) {
    showNotification("Text copied to clipboard!", "success");

    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1500);
  });

  clipboard.on("error", function (e) {
    showNotification("Failed to copy text. Please try again.", "error");
  });
};
