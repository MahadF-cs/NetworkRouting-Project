import { useState } from "react";
import UserInput from "./components/UserInput";
import { Graph, Node, Edge } from "./types/types.js";
import "./App.css";


function App() {

  const WIDTH = 600;
  const HEIGHT = 400;

  return (
    <div className="App">
      <h1>Dijkstra vs Bellman Ford</h1>
        <UserInput width={WIDTH} height={HEIGHT} />

    </div>
  );
}

export default App;
