import React, { useState, useRef, useEffect } from "react";
import { Graph, Node, Edge } from "../types/types.js";
import { djikstraAlgorithm } from "../algorithms/djikstra.js";
import Select from "react-select";

interface UserInputProps {
  width: number;
  height: number;
}

const UserInput: React.FC<UserInputProps> = ({ width, height }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
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
  const [startNode, setStartNode] = useState<Number>();
  const [endNode, setEndNode] = useState<Number>();
  const [routingTable, setRoutingTable] = useState<any[]>([]);
  const [shortestPath, setShortestPath] = useState<Number[] | null>([]);
  const [outputGraph, setOutputGraph] = useState<Graph | null>(null);

  const canvasRefUser = useRef<HTMLCanvasElement | null>(null);
  const canvasRefOutput = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (djikstra || bellmanFord) {
      const stateGraph: Graph = {
        nodes: nodes,
        edges: edges,
      };
      if (djikstra) {
        const start = findNodefromNumber(startNode as number);
        const end = findNodefromNumber(endNode as number);
        if (start && end) {
          nodes.forEach((node) => {
            const result = djikstraAlgorithm(stateGraph, node);
            setRoutingTable((prev) => {
              return [...prev, result.distances];
            });
          });
          setShortestPath(djikstraAlgorithm(stateGraph, start, end).path);
          outLineShortestPath(start, end);
          updateOutputCanvas();
        }
      }
    } else {
      updateOutputCanvas();
      updateUserCanvas();
    }
  }, [nodes, edges, djikstra, bellmanFord, outputGraph]);

  const findNodefromNumber = (number: number) => {
    return nodes.find((node) => node.number === number);
  };

  const updateOutputCanvas = () => {
    const canvasUser = canvasRefUser.current;
    const canvasOutput = canvasRefOutput.current;

    if (!canvasUser || !canvasOutput) return;

    const ctxUser = canvasUser.getContext("2d");
    const ctxOutput = canvasOutput.getContext("2d");

    if (!ctxUser || !ctxOutput) return;

    ctxOutput.clearRect(0, 0, width, height);
    ctxOutput.fillStyle = "white";
    ctxOutput.fillRect(0, 0, width, height);

    drawEdges(ctxOutput);
    drawNodes(ctxOutput);

  };

  const outLineShortestPath = (start: Node, end: Node) => {
    setOutputGraph({
      nodes: nodes,
      edges: edges,
    });
    // iterate all the nodes and if they are in the shortest path turn them red
    outputGraph?.nodes.forEach((node) => {
      if (shortestPath?.includes(node.number)) {
        node.color = "red";
      }
    });

    // iterate all the edges and if there exists an edge between two nodes in the shortest path turn it red
    outputGraph?.edges.forEach((edge) => {
      if (
        shortestPath?.includes(edge.start.number) &&
        shortestPath?.includes(edge.end.number)
      ) {
        edge.color = "red";
      }
    });
  }

  console.log({ outputGraph: outputGraph })
  console.log({ Nodes: nodes, Edges: edges})


  const updateUserCanvas = () => {
    const canvas = canvasRefUser.current;
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
      setNodes([
        ...nodes,
        {
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
          radius: 20,
          color: "#98c1d9",
          number: nodes.length,
          distance: Infinity,
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

  return (
    <div className="flex flex-col">
      <div className="flex flex-col m-10">
        <div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-10 rounded mx-5"
            onClick={() => {
              setClear(true);
              setAddNode(false);
              setAddEdge(false);
              setNodes([]);
              setEdges([]);
              setSelectedEdge(null);
              setSelectedNode(null);
              setUpdateWeights(false);
              setDjikstra(false);
              setBellmanFord(false);
              setRoutingTable([]);
              setOutputGraph(null);
            }}
          >
            Clear
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-10 rounded mx-5 "
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-10 rounded mx-5 "
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-10 rounded mx-5 "
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
      </div>
      <div className="flex flex-col justify-center items-center">
        <canvas
          ref={canvasRefUser}
          onClick={handleCanvasClick}
          width={width}
          height={height}
          style={{ border: "1px solid #ccc", display: "block", margin: "auto" }}
        />
      </div>
      <div>
        <div className="flex flex-row justify-center">
          {/* dropdown menu that has all the nodes */}
          <Select
            className="w-1/3 m-5"
            options={nodes.map((node) => ({
              value: node.number,
              label: node.number,
              node: node,
            }))}
            // change style color of options to black instead of white
            styles={{
              option: (provided, state) => ({
                ...provided,
                color: "black",
              }),
            }}
            placeholder="Start Node"
            onChange={(e) => {
              setStartNode(e?.value);
            }}
          />

          <Select
            className="w-1/3 m-5"
            options={nodes.map((node) => ({
              value: node.number,
              label: node.number,
              node: node,
            }))}
            // change style color of options to black instead of white
            styles={{
              option: (provided, state) => ({
                ...provided,
                color: "black",
              }),
            }}
            placeholder="End Node"
            onChange={(e) => {
              setEndNode(e?.value);
            }}
          />
        </div>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-10 rounded mx-5 "
          onClick={() => {
            setDjikstra(true);
            setBellmanFord(false);
            setAddNode(false);
            setAddEdge(false);
          }}
        >
          Djikstra Alogrithm
        </button>

        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-10 rounded mx-5 my-7"
          onClick={() => {
            setBellmanFord(true);
            setDjikstra(false);
            setAddNode(false);
            setAddEdge(false);
          }}
        >
          Bell-man Ford Alogrithm
        </button>
      </div>

      <div className="grid grid-cols-2">
        <div>
          <canvas
            ref={canvasRefOutput}
            width={width}
            height={height}
            style={{
              border: "1px solid #ccc",
              display: "block",
              margin: "auto",
            }}
          />
        </div>
        <div className="flex flex-row justify-center items-center ml-5">
          <div className="flex flex-col justify-center items-center">
            <table className="table-auto">
              <thead>
                <tr>
                  <th>Node</th>
                  {nodes.map((node) => (
                    <th key={node.number}>{node.number}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodes.map((sourceNode) => (
                  <tr key={sourceNode.number}>
                    <td>{sourceNode.number}</td>
                    {nodes.map((destNode) => (
                      <td key={destNode.number}>
                        {routingTable[sourceNode.number]?.[destNode.number]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInput;
