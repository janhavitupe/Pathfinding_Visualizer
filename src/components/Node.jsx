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

  const handleMouseDown = () => onMouseDown(row, col);
  const handleMouseEnter = () => onMouseEnter(row, col);
  const handleMouseUp = () => onMouseUp();

  const extraClass = isStart
    ? "node-start"
    : isEnd
    ? "node-end"
    : isWall
    ? "node-wall"
    : weight > 1
    ? "node-weight"
    : isPath
    ? "node-path"
    : visited
    ? "node-visited"
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
