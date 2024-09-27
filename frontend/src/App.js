import React, { useState } from "react";
import "./App.css";

const App = () => {
  const GRID_SIZE = 20;
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [pathDfs, setpathDfs] = useState([]);
  const [pathBFS, setPathBFS] = useState([]);

  const handlecellClick = (rowIndex, colIndex) => {
    if (!start) {
      setStart({ row: rowIndex, col: colIndex });
    } else if (!end) {
      setEnd({ row: rowIndex, col: colIndex });
      sendCoordinatesToBackend({ row: start.row, col: start.col }, { row: rowIndex, col: colIndex });
    }
  };

  const sendCoordinatesToBackend = async (start, end) => {
    try {
      const response = await fetch('http://localhost:5000/find-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end }),
      });
      const data = await response.json();
      if(!data.dfspath||!data.bfspath){
        return
      }
      setpathDfs(data.dfspath);
      setPathBFS(data.bfspath);
    } catch (error) {
      console.error('Error fetching the DFS path:', error);
    }
  };

  const getCellClassDFS = (rowIndex, colIndex) => {
    if (start && start.row === rowIndex && start.col === colIndex) {
      return "cell start";
    }
    if (end && end.row === rowIndex && end.col === colIndex) {
      return "cell end";
    }
    if (pathDfs.some((coord) => coord.row === rowIndex && coord.col === colIndex)) {
      return "cell path";
    }
    return "cell";
  };
  const getCellClassBFS = (rowIndex, colIndex) => {
    if (start && start.row === rowIndex && start.col === colIndex) {
      return "cell start";
    }
    if (end && end.row === rowIndex && end.col === colIndex) {
      return "cell end";
    }
    if (pathBFS.some((coord) => coord.row === rowIndex && coord.col === colIndex)) {
      return "cell path";
    }
    return "cell";
  };

  const handleReset = () => {
    setStart(null);
    setEnd(null);
    setpathDfs([]);
    setPathBFS([]);
  };

  const renderGrid = (gridType) => {
    return (
      <div className="grid">
        {Array.from({ length: GRID_SIZE }, (_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: GRID_SIZE }, (_, colIndex) => (
              <div
                key={colIndex}
                className={gridType === "dfs" ? getCellClassDFS(rowIndex, colIndex) : getCellClassBFS(rowIndex, colIndex)}
                onClick={() => handlecellClick(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Grid Pathfinding</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>DFS Grid</h2>
          {renderGrid("dfs")}
        </div>
        <div>
          <h2>BFS Grid</h2>
          {renderGrid("bfs")}
        </div>
      </div>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default App;
