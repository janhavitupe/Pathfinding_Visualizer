export function aStar(grid, start, end, useWeights = true) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Manhattan distance heuristic
  function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }

  const visitedOrder = [];

  // Initialize grid nodes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const node = grid[r][c];
      node.distance = Infinity; // g-score
      node.heuristic = heuristic(node, end);
      node.previousNode = null;
      node.visited = false;
    }
  }

  const startNode = grid[start.row][start.col];
  const endNode = grid[end.row][end.col];

  startNode.distance = 0;

  const openSet = [startNode];

  while (openSet.length > 0) {
    // Sort by f = g + h
    openSet.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic));
    const node = openSet.shift();

    if (node.isWall) continue;
    if (node.visited) continue; // Skip already visited
    node.visited = true;

    visitedOrder.push({ row: node.row, col: node.col });

    if (node === endNode) break;

    const neighbors = getNeighbors(node, grid, rows, cols);

    for (const nb of neighbors) {
      if (nb.isWall || nb.visited) continue;

      const weight = useWeights ? nb.weight || 1 : 1;
      const tentativeG = node.distance + weight;

      if (tentativeG < nb.distance) {
        nb.distance = tentativeG;
        nb.previousNode = node;

        if (!openSet.includes(nb)) {
          openSet.push(nb);
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = endNode;

  while (current) {
    path.unshift({ row: current.row, col: current.col });
    current = current.previousNode;
  }

  // Ensure start and end are in path
  if (!path.find(p => p.row === start.row && p.col === start.col)) {
    path.unshift({ row: start.row, col: start.col });
  }

  if (!path.find(p => p.row === end.row && p.col === end.col)) {
    path.push({ row: end.row, col: end.col });
  }

  return { visitedOrder, path };
}

// Helper: 4-directional neighbors
function getNeighbors(node, grid, rows, cols) {
  const { row, col } = node;
  const neighbors = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}
