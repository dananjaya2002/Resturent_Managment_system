import React from "react";
import "../components/ErrorMessage.css";

const EmptyState = ({
  icon = "📭",
  title = "No items found",
  description = "",
  actionText = null,
  onAction = null,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionText && onAction && (
        <div className="empty-state-action">
          <button onClick={onAction} className="btn btn-primary">
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
