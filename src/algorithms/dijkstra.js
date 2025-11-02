export function dijkstra(grid, start, end, useWeights = true) {
  const rows = grid.length;
  const cols = grid[0].length;

  const visitedOrder = [];

  // Initialize nodes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const node = grid[r][c];
      node.distance = Infinity;
      node.previousNode = null;
      node.visited = false;
    }
  }

  const startNode = grid[start.row][start.col];
  const endNode = grid[end.row][end.col];
  startNode.distance = 0;

  const unvisited = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) unvisited.push(grid[r][c]);
  }

  while (unvisited.length > 0) {
    // Sort nodes by distance (lowest first)
    unvisited.sort((a, b) => a.distance - b.distance);
    const node = unvisited.shift();

    // Skip walls
    if (node.isWall) continue;
    if (node.distance === Infinity) break;

    node.visited = true;
    visitedOrder.push({ row: node.row, col: node.col });

    // End condition
    if (node === endNode) break;

    // Explore neighbors (4-directional)
    const neighbors = getNeighbors(node, grid, rows, cols);
    for (const neighbor of neighbors) {
      if (neighbor.visited || neighbor.isWall) continue;

      const weight = useWeights ? neighbor.weight || 1 : 1;
      const newDist = node.distance + weight;

      if (newDist < neighbor.distance) {
        neighbor.distance = newDist;
        neighbor.previousNode = node;
      }
    }
  }

  // ✅ Reconstruct path
  const path = [];
  let current = endNode;
  while (current) {
    path.unshift({ row: current.row, col: current.col });
    current = current.previousNode;
  }

  // Ensure both start and end are in the path
  if (!path.find(p => p.row === start.row && p.col === start.col)) {
    path.unshift({ row: start.row, col: start.col });
  }

  if (!path.find(p => p.row === end.row && p.col === end.col)) {
    path.push({ row: end.row, col: end.col });
  }

  return { visitedOrder, path };
}

// Helper: Get 4-directional neighbors
function getNeighbors(node, grid, rows, cols) {
  const { row, col } = node;
  const neighbors = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}
