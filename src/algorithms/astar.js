export function aStar(grid, start, end, useWeights = true) {
  const rows = grid.length;
  const cols = grid[0].length;

  const visitedOrder = [];

  // Manhattan distance heuristic
  function heuristic(node) {
    return Math.abs(node.row - end.row) + Math.abs(node.col - end.col);
  }

  // Initialize all nodes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const node = grid[r][c];
      node.distance = Infinity;   // g-score: cost from start
      node.f = Infinity;          // f-score: g + h
      node.previousNode = null;
      node.visited = false;
    }
  }

  const startNode = grid[start.row][start.col];
  const endNode = grid[end.row][end.col];

  startNode.distance = 0;
  startNode.f = heuristic(startNode);

  const openSet = [startNode];

  while (openSet.length > 0) {
    // Pick node with lowest f-score
    openSet.sort((a, b) => a.f - b.f);
    const node = openSet.shift();

    if (node.isWall) continue;
    if (node.visited) continue;
    node.visited = true;

    visitedOrder.push({ row: node.row, col: node.col });

    if (node === endNode) break;

    const neighbors = getNeighbors(node, grid, rows, cols);

    for (const nb of neighbors) {
      if (nb.isWall || nb.visited) continue;

      const weight = useWeights ? (nb.weight || 1) : 1;
      const tentativeG = node.distance + weight;

      if (tentativeG < nb.distance) {
        nb.distance = tentativeG;
        nb.f = tentativeG + heuristic(nb);
        nb.previousNode = node;

        // Always push — duplicate entries handled by visited check above
        openSet.push(nb);
      }
    }
  }

  return { visitedOrder, path: reconstructPath(endNode) };
}

function reconstructPath(endNode) {
  const path = [];
  let current = endNode;

  while (current !== null) {
    path.unshift({ row: current.row, col: current.col });
    current = current.previousNode;
  }

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
