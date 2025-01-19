import React, { useState, useRef } from "react";
import Tooltip from "./Tooltip";

const ImageCanvas = ({ image }) => {
  const [tooltips, setTooltips] = useState([]);
  const imageRef = useRef(null);

  const handleImageClick = (event) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setTooltips([...tooltips, { id: Date.now(), x, y, text: "Description" }]);
  };

  const handleDeleteTooltip = (id) => {
    setTooltips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTooltip = (id, newText) => {
    setTooltips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleDragTooltip = (id, dx, dy) => {
    setTooltips((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const rect = imageRef.current.getBoundingClientRect();
          const maxX = rect.width - 40;
          const maxY = rect.height - 40;
          const newX = Math.min(Math.max(t.x + dx, 0), maxX);
          const newY = Math.min(Math.max(t.y + dy, 0), maxY);
          return { ...t, x: newX, y: newY };
        }
        return t;
      })
    );
  };

  return (
    <div
      className="relative border-2 border-gray-300 mt-4 w-full max-w-3xl mx-auto cursor-crosshair"
      onClick={handleImageClick}
    >
      <img
        ref={imageRef}
        src={image}
        alt="Uploaded"
        className="max-w-full h-auto"
      />

      {tooltips.map((tooltip) =>
        tooltip ? (
          <Tooltip
            key={tooltip.id}
            tooltip={tooltip}
            onEdit={handleEditTooltip}
            onDelete={handleDeleteTooltip}
            onDrag={handleDragTooltip}
          />
        ) : null
      )}
    </div>
  );
};

export default ImageCanvas;
