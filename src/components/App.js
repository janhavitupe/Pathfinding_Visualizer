import React, { useState, useEffect, useRef } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import { dijkstra } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/astar';
import './PathfindingVisualizer.css';

export default function PathfindingVisualizer() {
  const DEFAULT_ROWS = 20;
  const DEFAULT_COLS = 36;

  const [rows] = useState(DEFAULT_ROWS);
  const [cols] = useState(DEFAULT_COLS);
  const [grid, setGrid] = useState([]);
  const [placing, setPlacing] = useState('wall'); // wall, weight, start, end
  const [start, setStart] = useState({ row: 10, col: 6 });
  const [end, setEnd] = useState({ row: 10, col: 29 });
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(20);
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [useWeights, setUseWeights] = useState(true);
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
          isPath: false,
          distance: Infinity,
          heuristic: 0,
          previousNode: null,
        });
      }
      g.push(row);
    }
    setGrid(g);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Clone grid
  const cloneGrid = (g) => g.map((row) => row.map((n) => ({ ...n })));

  // Update node on click
  const updateNode = (r, c) => {
    if (running) return;
    setGrid((g) => {
      const ng = cloneGrid(g);
      const node = ng[r][c];

      if (placing === 'start') {
        const old = ng[start.row][start.col];
        old.isStart = false;
        node.isStart = true;
        node.isWall = false;
        setStart({ row: r, col: c });
      } else if (placing === 'end') {
        const old = ng[end.row][end.col];
        old.isEnd = false;
        node.isEnd = true;
        node.isWall = false;
        setEnd({ row: r, col: c });
      } else if (placing === 'wall') {
        if (!node.isStart && !node.isEnd) node.isWall = !node.isWall;
      } else if (placing === 'weight') {
        if (!node.isStart && !node.isEnd) {
          node.isWall = false;
          node.weight = node.weight === 1 ? 10 : 1;
        }
      }

      return ng;
    });
  };

  // Reset grid (visited + path)
  const resetGrid = () => {
    if (running) return;
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

  // Visualize the algorithm
  const visualize = async () => {
    if (running) return;
    setRunning(true);
    resetGrid();

    const algorithmFn = algorithm === 'dijkstra' ? dijkstra : aStar;
    const { visitedOrder, path } = algorithmFn(grid, start, end, useWeights);

    // Animate visited nodes
    for (let i = 0; i < visitedOrder.length; i++) {
      await new Promise((resolve) =>
        setTimeout(() => {
          setGrid((g) => {
            const ng = cloneGrid(g);
            const { row, col } = visitedOrder[i];
            const n = ng[row][col];
            if (!n.isStart && !n.isEnd) n.visited = true;
            return ng;
          });
          resolve();
        }, speed)
      );
    }

    // Animate shortest path
    for (let i = 0; i < path.length; i++) {
      await new Promise((resolve) =>
        setTimeout(() => {
          setGrid((g) => {
            const ng = cloneGrid(g);
            const { row, col } = path[i];
            const n = ng[row][col];
            if (!n.isStart && !n.isEnd) n.isPath = true;
            return ng;
          });
          resolve();
        }, 30)
      );
    }

    setRunning(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Pathfinding Visualizer</h1>
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
        clearPath={resetGrid}
        resetAll={resetGrid}
      />
      <Grid grid={grid} updateNode={updateNode} />
    </div>
  );
}
