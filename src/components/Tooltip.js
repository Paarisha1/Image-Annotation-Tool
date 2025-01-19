import React, { useState, useEffect, useRef } from "react";

const Tooltip = ({ tooltip, onEdit, onDelete, onDrag }) => {

  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(tooltip?.text || "Add text");
  const inputRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  if (!tooltip) return null;

  const handleSave = () => {
    if (text.trim() === "") return;
    onEdit(tooltip.id, text);
    setEditing(false);
  };

  
  const handleMouseDown = (e) => {
    e.preventDefault();
    let startX = e.clientX;
    let startY = e.clientY;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      startX = moveEvent.clientX;
      startY = moveEvent.clientY;
      onDrag(tooltip.id, dx, dy);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={tooltipRef}
      className="absolute cursor-pointer"
      style={{ left: tooltip.x, top: tooltip.y }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setVisible(true)} 
      onMouseLeave={() => !editing && setVisible(false)} 
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
   
      <div className="w-4 h-4 bg-black rounded-full cursor-pointer border-2 border-white"></div>

      
      {visible && (
        <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded mt-1 w-max shadow-lg">
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              className="bg-white text-black px-1 rounded w-full"
            />
          ) : (
            <div className="text-center">{text}</div>
          )}

        
          {editing && (
            <div className="flex justify-between mt-2">
              <button
                className="text-yellow-400"
                onClick={() => setEditing(true)}
              >
                ✏️ Edit
              </button>
              <button
                className="text-red-400"
                onClick={() => onDelete(tooltip.id)}
              >
                ❌ Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
