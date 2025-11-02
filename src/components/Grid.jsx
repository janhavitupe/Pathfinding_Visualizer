import React from "react";
import Node from "./Node";
import "./Grid.css";

export default function Grid({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  placing,
  updateNode,
}) {
  if (!grid || grid.length === 0) return null;

  return (
    <div className="grid" onMouseLeave={onMouseUp}>
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node) => (
            <Node
              key={`${node.row}-${node.col}`}
              node={node}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
              placing={placing}
              updateNode={updateNode}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

