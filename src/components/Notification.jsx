import React, { useEffect } from 'react';
import "../styles/Notification.css";
import {
  IconCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconX
} from '@tabler/icons-react';

const iconMap = {
  success: <IconCheck size={20} />,
  error: <IconX size={20} />,
  info: <IconInfoCircle size={20} />,
  warning: <IconAlertTriangle size={20} />,
};

export default function Notification({ message, open, duration = 3000, onClose, type = 'info' }) {
  useEffect(() => {
    if (open && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className={`notification ${type}`}>
      <span className="notification-icon">{iconMap[type]}</span>
      <span className="notification-message">{message}</span>
    </div>
  );
}
