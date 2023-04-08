import { useState } from "react";
import Canvas from "./components/Canvas";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center">
        <Canvas width={900} height={600} />
      </div>
    </div>
  );
}

export default App;
