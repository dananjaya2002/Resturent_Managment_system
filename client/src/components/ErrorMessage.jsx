import React from "react";
import "./ErrorMessage.css";

const ErrorMessage = ({
  message = "Something went wrong",
  type = "error",
  onRetry = null,
  onDismiss = null,
}) => {
  const iconMap = {
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    success: "✅",
  };

  return (
    <div className={`error-message error-${type}`} role="alert">
      <div className="error-icon">{iconMap[type] || iconMap.error}</div>
      <div className="error-content">
        <p className="error-text">{message}</p>
        <div className="error-actions">
          {onRetry && (
            <button onClick={onRetry} className="btn btn-sm error-retry">
              Try Again
            </button>
          )}
          {onDismiss && (
            <button onClick={onDismiss} className="btn btn-sm error-dismiss">
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
