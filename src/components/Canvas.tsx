import React, { useState, useRef, useEffect } from "react";

interface Node {
  x: number;
  y: number;
  radius: number;
  color: string;
  number: number;
}

interface Edge {
  start: Node;
  end: Node;
  weight: number;
  color: string;
}

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const [nodes, setnodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  // state for canvas buttons
  const [clear, setClear] = useState<boolean>(false);
  const [addNode, setAddNode] = useState<boolean>(false);
  const [addEdge, setAddEdge] = useState<boolean>(false);
  const [updateWeights, setUpdateWeights] = useState<boolean>(false);
  const [djikstra, setDjikstra] = useState<boolean>(false);
  const [bellmanFord, setBellmanFord] = useState<boolean>(false);
  const [startNode, setStartNode] = useState<number>();
  const [endNode, setEndNode] = useState<number>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    updateCanvas();
  }, [nodes, edges]);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // if not clear draw all nodes and edges
    if (clear) {
      setClear(false);
    } else {
      drawEdges(ctx);
      drawNodes(ctx);
    }
  };

  const drawNodes = (ctx: CanvasRenderingContext2D) => {
    nodes.forEach((node, index) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(index.toString(), node.x, node.y);
    });
  };

  const drawEdges = (ctx: CanvasRenderingContext2D) => {
    edges.forEach((edge) => {
      ctx.beginPath();
      ctx.moveTo(edge.start.x, edge.start.y);
      ctx.lineTo(edge.end.x, edge.end.y);
      ctx.stroke();
      // draw weight of edge in the middle of the edge
      ctx.fillStyle = "black";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // make the background of the weight white and a reactangle and not transparent
      ctx.fillRect(
        (edge.start.x + edge.end.x) / 2 - 10,
        (edge.start.y + edge.end.y) / 2 - 10,
        20,
        20
      );

      ctx.fillStyle = "white";
      ctx.fillText(
        edge.weight.toString(),
        (edge.start.x + edge.end.x) / 2,
        (edge.start.y + edge.end.y) / 2
      );
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // if add node button is clicked add a node
    if (addNode) {
      // update nodes list with mouseclick coordinates
      setnodes([
        ...nodes,
        {
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
          radius: 20,
          color: "#98c1d9",
          number: nodes.length - 1,
        },
      ]);
    }
    // if add edge button is clicked add an edge between two nodes
    if (addEdge) {
      // console log node index
      nodes.forEach((node, index) => {
        if (
          event.nativeEvent.offsetX > node.x - node.radius &&
          event.nativeEvent.offsetX < node.x + node.radius &&
          event.nativeEvent.offsetY > node.y - node.radius &&
          event.nativeEvent.offsetY < node.y + node.radius
        ) {
          // if selected node is empty add node to selected node
          if (selectedNode === null) {
            setSelectedNode(node);
          } else {
            // if selected node is not empty add edge between selected node and current node
            setEdges([
              ...edges,
              {
                start: selectedNode,
                end: node,
                weight: 1,
                color: "black",
              },
            ]);
            setSelectedNode(null);
          }
        }
      });
    }
    // if add weights button is clicked add weights to edges
    if (updateWeights) {
      // find the edge that is clicked and update the weight based on alert input

      edges.forEach((edge) => {
        // if the mouse click is in the middle of the edge with a 10 pixel buffer
        if (
          event.nativeEvent.offsetX > (edge.start.x + edge.end.x) / 2 - 10 &&
          event.nativeEvent.offsetX < (edge.start.x + edge.end.x) / 2 + 10 &&
          event.nativeEvent.offsetY > (edge.start.y + edge.end.y) / 2 - 10 &&
          event.nativeEvent.offsetY < (edge.start.y + edge.end.y) / 2 + 10
        ) {
          // update the selected edge
          setSelectedEdge(edge);
          // prompt user to enter weight
          const weight = prompt("Enter weight");
          // if weight is not null update the weight of the edge
          if (weight !== null) {
            edge.weight = parseInt(weight);
          }
        }
      });
      // update the edges list with the updated edge with the new weight
      setEdges(
        edges.map((edge) => (edge === selectedEdge ? selectedEdge : edge))
      );
      setSelectedEdge(null);
    }
  };

  console.log({ Nodes: nodes, Edges: edges });

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 gap-7 m-10">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setClear(true);
            setAddNode(false);
            setAddEdge(false);
            setnodes([]);
            setEdges([]);
            setSelectedEdge(null);
            setSelectedNode(null);
            setUpdateWeights(false);
            setDjikstra(false);
            setBellmanFord(false);
          }}
        >
          Clear
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setAddNode((prevState) => !prevState);
            setAddEdge(false);
            setUpdateWeights(false);
            setDjikstra(false);
            setBellmanFord(false);
          }}
        >
          {addNode ? "Stop" : "Add Node"}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setAddEdge((prevState) => !prevState);
            setAddNode(false);
            setUpdateWeights(false);
            setDjikstra(false);
            setBellmanFord(false);
          }}
        >
          {addEdge ? "Stop" : "Add Edge"}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setUpdateWeights((prevState) => !prevState);
            setAddNode(false);
            setAddEdge(false);
            setDjikstra(false);
            setBellmanFord(false);
          }}
        >
          {updateWeights ? "Stop" : "Update Weights"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        width={width}
        height={height}
        style={{ border: "1px solid #ccc", display: "block", margin: "auto" }}
      />

      <div className="grid grid-cols-2 gap-7 m-10">
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setDjikstra(true);
            setBellmanFord(false);
            setAddNode(false);
            setAddEdge(false);
          }}
        >
          Djikstra Path
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setBellmanFord(true);
            setDjikstra(false);
            setAddNode(false);
            setAddEdge(false);
          }}
        >
          Bell-man Ford Path
        </button>

        {/* dropdown menu thaat has all the nodes */}
        <select
          className="bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => {
            setStartNode(parseInt(e.target.value));
          }}
          defaultValue={-1}
          // show "START NODE" on the dropdown menu
        >
          <option value={-1}>Not Selected</option>
          {nodes.map((node) => (
            <option value={node.number}>{node.number}</option>
          ))}
        </select>
        <select
          className="bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => {
            setEndNode(parseInt(e.target.value));
          }}
          defaultValue={-1}
        >
          <option value={-1}>Not Selected</option>
          {nodes.map((node) => (
            <option value={node.number}>{node.number}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Canvas;
