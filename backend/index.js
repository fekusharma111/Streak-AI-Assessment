const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const GRID_SIZE = 20;
function dfs(grid, start, end) {
    const path = [];
    const visited = new Set();
    function dfsHelper(x, y) {
      if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE || visited.has(`${x},${y}`)) {
        return false;
      }
      visited.add(`${x},${y}`);
      path.push({ row: x, col: y });
      if (x === end.row && y === end.col) {
        return true;
      }
      const directions = [[1, 0],  [-1, 0], [0, 1], [0, -1] ];
  
      for (const [dx, dy] of directions) {
        if (dfsHelper(x + dx, y + dy)) {
          return true;
        }
      }
      path.pop();
      return false;
    }
  
    const pathFound = dfsHelper(start.row, start.col);
    return pathFound ? path : null;
  }
  function bfs(grid, start, end) {
    const queue = [];
    const visited = new Set();
    const parent = {};
  
    queue.push(start);
    visited.add(`${start.row},${start.col}`);
    const directions = [[1, 0],[-1, 0],[0, 1],[0, -1],[1, 1],[1, -1],[-1, 1],[-1, -1]];
  
    while (queue.length > 0) {
      const curent = queue.shift();
  
      if (curent.row === end.row && curent.col === end.col) {
        const path = [];
        let node = `${end.row},${end.col}`;
        while (node) {
          const [r, c] = node.split(',').map(Number);
          path.push({ row: r, col: c });
          node = parent[node];
        }
        return path.reverse();
      }
  
      for (const [dx, dy] of directions) {
        const newrow = curent.row + dx;
        const newCol = curent.col + dy;
        const neighbor = { row: newrow, col: newCol };
  
        if (newrow >= 0 && newrow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE && !visited.has(`${newrow},${newCol}`)) {
          queue.push(neighbor);
          visited.add(`${newrow},${newCol}`);
          parent[`${newrow},${newCol}`] = `${curent.row},${curent.col}`;
        }
      }
    }
  
    return null;
  }
app.post("/find-path", (req, res) => {
  try {
    const { start, end } = req.body;
    const grid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));
    const dfspath = dfs(grid, start, end);
    const bfspath = bfs(grid, start, end);
    if (!dfspath||!bfspath) {
      return res.status(404).json({ error: "No path found between start and end point." });
    }
    res.status(200).json({ dfspath,bfspath });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
