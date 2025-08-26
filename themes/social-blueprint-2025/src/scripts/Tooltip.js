import React from "react";
import PropTypes from "prop-types";

export function Tooltip({ content, position = "top" }) {
  if (!content) {
    console.warn("Tooltip content is empty"); // Debugging log
    return null;
  }

  console.log("Rendering Tooltip with content:", content); // Debugging log

  return (
    <div className={`tooltip tooltip-${position}`}>
      <div className="tooltip-content bg-white shadow-lg rounded p-4">
        {content.image && (
          <img
            src={content.image}
            alt={content.title}
            className="tooltip-image mb-2 rounded"
          />
        )}
        <h3 className="font-bold text-lg mb-1">{content.title}</h3>
        {content.description && (
          <p className="text-sm text-gray-700">{content.description}</p>
        )}
      </div>
    </div>
  );
}

Tooltip.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};
