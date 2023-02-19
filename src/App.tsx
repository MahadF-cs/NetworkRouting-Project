import { useState } from "react";
import Canvas from "./components/Canvas";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      {/* <header>
        <p className="text-5xl font-bold mt-0 mb-6"> CPS 706 - Project </p>
      </header> */}
      <div className="flex items-center justify-center h-screen">
        <Canvas width={900} height={600} />
      </div>
    </div>
  );
}

export default App;
