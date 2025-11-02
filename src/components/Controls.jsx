import React from "react";

export default function Controls({
  placing,
  setPlacing,
  algorithm,
  setAlgorithm,
  useWeights,
  setUseWeights,
  visualize,
  resetGrid,
  running,
  speed,
  setSpeed,
}) {
  return (
    <div className="controls">
      <button
        className={placing === "start" ? "active" : ""}
        onClick={() => setPlacing("start")}
        disabled={running}
      >
        Start
      </button>
      <button
        className={placing === "end" ? "active" : ""}
        onClick={() => setPlacing("end")}
        disabled={running}
      >
        End
      </button>
      <button
        className={placing === "wall" ? "active" : ""}
        onClick={() => setPlacing("wall")}
        disabled={running}
      >
        Wall
      </button>
      <button
        className={placing === "weight" ? "active" : ""}
        onClick={() => setPlacing("weight")}
        disabled={running}
      >
        Weight
      </button>

      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        disabled={running}
      >
        <option value="dijkstra">Dijkstra</option>
        <option value="astar">A*</option>
      </select>

      <label>
        Use Weights
        <input
          type="checkbox"
          checked={useWeights}
          onChange={() => setUseWeights((prev) => !prev)}
          disabled={running}
        />
      </label>

      <button onClick={visualize} disabled={running}>
        Visualize
      </button>
      <button onClick={resetGrid} disabled={running}>
        Reset
      </button>

      <label>
        Speed
        <input
          type="range"
          min="5"
          max="200"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={running}
        />
      </label>
    </div>
  );
}
