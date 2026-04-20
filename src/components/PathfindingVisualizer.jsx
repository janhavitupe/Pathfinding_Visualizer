import React, { useState, useEffect, useRef } from "react";
import Grid from "./Grid";
import Controls from "./Controls";
import { dijkstra } from "../algorithms/dijkstra";
import { aStar } from "../algorithms/astar";
import "./PathfindingVisualizer.css";

export default function PathfindingVisualizer() {
  const DEFAULT_ROWS = 20;
  const DEFAULT_COLS = 36;

  const [rows] = useState(DEFAULT_ROWS);
  const [cols] = useState(DEFAULT_COLS);
  const [grid, setGrid] = useState([]);
  const [placing, setPlacing] = useState("wall"); // wall, weight, start, end
  const [start, setStart] = useState({ row: 10, col: 6 });
  const [end, setEnd] = useState({ row: 10, col: 29 });
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(20);
  const [algorithm, setAlgorithm] = useState("dijkstra");
  const [useWeights, setUseWeights] = useState(true);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  const timeoutRef = useRef(null);

  // Initialize grid
  useEffect(() => {
    const g = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          row: r,
          col: c,
          isStart: r === start.row && c === start.col,
          isEnd: r === end.row && c === end.col,
          isWall: false,
          weight: 1,
          visited: false,
          distance: Infinity,
          heuristic: 0,
          previousNode: null,
          isPath: false,
        });
      }
      g.push(row);
    }
    setGrid(g);
    return () => clearTimeout(timeoutRef.current);
  }, [rows, cols, start, end]);

  const cloneGrid = (g) => g.map((row) => row.map((n) => ({ ...n })));

  // Toggle wall or weight
  const toggleNode = (row, col) => {
    setGrid((prevGrid) => {
      const newGrid = cloneGrid(prevGrid);
      const node = newGrid[row][col];
      if (node.isStart || node.isEnd) return newGrid;

      if (placing === "wall") {
        node.isWall = !node.isWall;
        if (node.isWall) node.weight = 1;
      } else if (placing === "weight") {
        if (!node.isWall) node.weight = node.weight === 1 ? 10 : 1;
      }
      return newGrid;
    });
  };

  const handleMouseDown = (row, col) => {
    if (running) return;
    setMouseIsPressed(true);
    toggleNode(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    toggleNode(row, col);
  };

  const handleMouseUp = () => setMouseIsPressed(false);

  // Update start/end nodes
  const updateNode = (row, col) => {
    if (running) return;
    setGrid((prevGrid) => {
      const newGrid = cloneGrid(prevGrid);
      const node = newGrid[row][col];

      if (placing === "start") {
        newGrid[start.row][start.col].isStart = false;
        node.isStart = true;
        setStart({ row, col });
      } else if (placing === "end") {
        newGrid[end.row][end.col].isEnd = false;
        node.isEnd = true;
        setEnd({ row, col });
      }

      return newGrid;
    });
  };

  // Clears only visited/path nodes
  const clearPath = () => {
    setGrid((g) =>
      g.map((row) =>
        row.map((n) => ({
          ...n,
          visited: false,
          isPath: false,
          distance: Infinity,
          previousNode: null,
        }))
      )
    );
  };

  // Resets everything
  const resetGrid = () => {
    setGrid((g) =>
      g.map((row) =>
        row.map((n) => ({
          row: n.row,
          col: n.col,
          isStart: n.isStart,
          isEnd: n.isEnd,
          isWall: false,
          weight: 1,
          visited: false,
          distance: Infinity,
          previousNode: null,
          isPath: false,
        }))
      )
    );
  };

  // Visualize algorithm
  const visualize = async () => {
    if (running) return;
    setRunning(true);

    // Deep clone grid for the algorithm to mutate freely
    const algoGrid = grid.map((row) =>
      row.map((n) => ({
        ...n,
        visited: false,
        isPath: false,
        distance: Infinity,
        heuristic: 0,
        previousNode: null,
      }))
    );
    // Fix previousNode references to point within algoGrid
    for (let r = 0; r < algoGrid.length; r++) {
      for (let c = 0; c < algoGrid[0].length; c++) {
        algoGrid[r][c].previousNode = null;
      }
    }

    const algorithmFn = algorithm === "dijkstra" ? dijkstra : aStar;
    const { visitedOrder, path } = algorithmFn(algoGrid, start, end, useWeights);

    // First: reset all visited/path flags in React state cleanly
    await new Promise((resolve) => {
      setGrid((g) =>
        g.map((row) =>
          row.map((n) => ({ ...n, visited: false, isPath: false, distance: Infinity, previousNode: null }))
        )
      );
      setTimeout(resolve, 0);
    });

    // Animate visited nodes one by one
    for (let i = 0; i < visitedOrder.length; i++) {
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(() => {
          const vn = visitedOrder[i];
          setGrid((g) =>
            g.map((row) =>
              row.map((n) =>
                n.row === vn.row && n.col === vn.col && !n.isStart && !n.isEnd
                  ? { ...n, visited: true }
                  : n
              )
            )
          );
          resolve();
        }, speed);
      });
    }

    // Animate shortest path
    for (let i = 0; i < path.length; i++) {
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(() => {
          const pn = path[i];
          setGrid((g) =>
            g.map((row) =>
              row.map((n) =>
                n.row === pn.row && n.col === pn.col
                  ? { ...n, isPath: true }
                  : n
              )
            )
          );
          resolve();
        }, 40);
      });
    }

    setRunning(false);
  };

  return (
    <div className="pathfinding-container">
      <h1>Pathfinding Visualizer</h1>
      <Controls
        placing={placing}
        setPlacing={setPlacing}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        useWeights={useWeights}
        setUseWeights={setUseWeights}
        visualize={visualize}
        resetGrid={resetGrid}
        running={running}
        speed={speed}
        setSpeed={setSpeed}
      />
      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        placing={placing}
        updateNode={updateNode}
      />
    </div>
  );
}
