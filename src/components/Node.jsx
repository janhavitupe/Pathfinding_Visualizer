import React from "react";
import "./Node.css";

export default function Node({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  placing,
  updateNode,
}) {
  const { row, col, isStart, isEnd, isWall, weight, visited, isPath } = node;

  const handleMouseDown = () => {
    if (placing === "start" || placing === "end") {
      updateNode(row, col);
    } else {
      onMouseDown(row, col);
    }
  };
  const handleMouseEnter = () => onMouseEnter(row, col);
  const handleMouseUp = () => onMouseUp();

  const extraClass = isStart
    ? "node-start"
    : isEnd
    ? "node-end"
    : isWall
    ? "node-wall"
    : isPath
    ? "node-path"
    : visited
    ? "node-visited"
    : weight > 1
    ? "node-weight"
    : "";

  return (
    <div
      className={`node ${extraClass}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
    ></div>
  );
}
