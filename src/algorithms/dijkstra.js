export function dijkstra(grid, start, end, useWeights = true) {
  const rows = grid.length;
  const cols = grid[0].length;

  const visitedOrder = [];

  // Initialize all nodes
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

  // Only add non-wall nodes to unvisited
  const unvisited = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].isWall) unvisited.push(grid[r][c]);
    }
  }

  while (unvisited.length > 0) {
    // Sort by distance ascending
    unvisited.sort((a, b) => a.distance - b.distance);
    const node = unvisited.shift();

    // All remaining nodes are unreachable
    if (node.distance === Infinity) break;

    node.visited = true;
    visitedOrder.push({ row: node.row, col: node.col });

    if (node === endNode) break;

    const neighbors = getNeighbors(node, grid, rows, cols);
    for (const neighbor of neighbors) {
      if (neighbor.visited || neighbor.isWall) continue;

      const weight = useWeights ? (neighbor.weight || 1) : 1;
      const newDist = node.distance + weight;

      if (newDist < neighbor.distance) {
        neighbor.distance = newDist;
        neighbor.previousNode = node;
      }
    }
  }

  return { visitedOrder, path: reconstructPath(endNode) };
}

function reconstructPath(endNode) {
  const path = [];
  let current = endNode;

  // If end was never reached, previousNode chain won't lead back to start
  while (current !== null) {
    path.unshift({ row: current.row, col: current.col });
    current = current.previousNode;
  }

  // A valid path must have at least 2 nodes (start + end)
  // If only end node is in path with no chain, no path was found
  if (path.length === 1 && endNode.previousNode === null && endNode.distance === Infinity) {
    return [];
  }

  return path;
}

function getNeighbors(node, grid, rows, cols) {
  const { row, col } = node;
  const neighbors = [];
  if (row > 0)        neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0)        neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}
