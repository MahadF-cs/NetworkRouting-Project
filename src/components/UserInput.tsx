import React, { useState, useRef, useEffect } from "react";
import { Graph, Node, Edge } from "../types/types.js";
import { BellmanFordAlgorithm } from "../algorithms/bellmanford.js";
import { djikstraAlgorithm } from "../algorithms/djikstra";

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

  const [doneOnce, setDone] = useState<boolean>(false);

  const setPathBellman = () => {
    const stateGraph: Graph = {
      nodes: nodes,
      edges: edges,
    };
    const start = findNodefromNumber(startNode as number);
    const end = findNodefromNumber(endNode as number);
    setShortestPath(
      BellmanFordAlgorithm(stateGraph, start?.number, end?.number).path
    );
  }

  const setPathDjikstra = () => {
    const stateGraph: Graph = {
      nodes: nodes,
      edges: edges,
    };
    const start = findNodefromNumber(startNode as number);
    const end = findNodefromNumber(endNode as number);
    setShortestPath(
      djikstraAlgorithm(stateGraph, start!, end).path
    );
  }

  useEffect(() => {
    if (djikstra || bellmanFord) {
      updateOutputCanvas();
      const stateGraph: Graph = {
        nodes: nodes,
        edges: edges,
      };
      if (djikstra) {
        const start = findNodefromNumber(startNode as number);
        const end = findNodefromNumber(endNode as number);
        if (start && end) {
          let routing2darray: any[] = [];
          nodes.forEach((node) => {
            const result = djikstraAlgorithm(stateGraph, node);
            routing2darray.push(result.distances);
          });
          setRoutingTable(routing2darray);
          // setShortestPath(djikstraAlgorithm(stateGraph, start, end).path);
          outLineShortestPath(start, end);
          updateOutputCanvas();
        }
      }
      if (bellmanFord) {
        const start = findNodefromNumber(startNode as number);
        const end = findNodefromNumber(endNode as number);

        if (start && end) {
          // the bellan ford algorithm returns the 2d array of distances
          setRoutingTable(
            BellmanFordAlgorithm(stateGraph, start.number, end.number).distance
          );
          // setShortestPath(
          //   BellmanFordAlgorithm(stateGraph, start.number, end.number).path
          // );
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
    if(doneOnce) return;
  
    setOutputGraph({
      nodes: nodes,
      edges: edges,
    });

    // Get the shortest path and its length
    const path = shortestPath ?? [];
    const pathLength = path.length;

    // Initialize the delay time to 800ms
    let delay = 800;

    // Iterate all the nodes and edges
    // outputGraph?.nodes.forEach((node) => {
      path.forEach((num) =>{
      var node = findNodefromNumber(num as number)!;
      // If the node is the start node, turn it green with a delay
      if (node === start) {
        setTimeout(() => {
          node.color = "green";
          setOutputGraph({
            nodes: outputGraph?.nodes!,
            edges: outputGraph?.edges!,
          });
        }, delay);
        delay += 2000 / pathLength;
      }
      // If the node is the end node, turn it red with a delay
      else if (node === end) {
        setTimeout(() => {
          node.color = "red";
          setOutputGraph({
            nodes: outputGraph?.nodes!,
            edges: outputGraph?.edges!,
          });
        }, delay);
        delay += 2000 / pathLength;
      }
      // If the node is in the shortest path but not the start or end node, turn it orange with a delay
      else if (path.includes(node.number)) {
        setTimeout(() => {
          node.color = "orange";
          setOutputGraph({
            nodes: outputGraph?.nodes!,
            edges: outputGraph?.edges!,
          });
        }, delay);
        delay += 2000 / pathLength;
      }
    });

    outputGraph?.edges.forEach((edge) => {
      // If there exists an edge between two nodes in the shortest path, turn it red with a delay
      if (path.includes(edge.start.number) && path.includes(edge.end.number)) {
        setTimeout(() => {
          edge.color = "red";
          setOutputGraph({
            nodes: outputGraph?.nodes,
            edges: outputGraph?.edges,
          });
        }, delay);
        delay += 2000 / pathLength;
      }
      setDone(true);
    });
  };

  // console.log({ outputGraph: outputGraph })
  // console.log({ Nodes: nodes, Edges: edges })

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
      drawNodes(ctx, true);
    }
  };

  const drawNodes = (ctx: CanvasRenderingContext2D, color = false) => {
    nodes.forEach((node, index) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.stroke();
      if(color == true) node.color = "#98c1d9";
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
          const weight = parseInt(prompt("Enter weight")!);
          // if weight is not null update the weight of the edge
          if (weight !== null && weight >= 0) {
            edge.weight = weight;
          }else{
            alert("Weights must be non-negative integers")
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

  // console.log(routingTable);
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
              setDone(false);
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
              setDone(false);
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
              setDone(false);
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
              setDone(false);
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
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "green",
                borderColor: "green",
                "&:hover": {
                  borderColor: "green",
                },
                color: "white", // Add this line to change the text color
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "white", // Add this line to change the text color
              }),
              option: (provided, state) => ({
                ...provided,
                color: "black",
                backgroundColor: state.isFocused ? "#b7e4b7" : "white",
                "&:hover": {
                  backgroundColor: "#b7e4b7",
                },
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
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "red",
                borderColor: "red",
                "&:hover": {
                  borderColor: "red",
                },
                color: "white", // Add this line to change the text color
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "white", // Add this line to change the text color
              }),
              option: (provided, state) => ({
                ...provided,
                color: "black",
                backgroundColor: state.isFocused ? "#f9d6d6" : "white",
                "&:hover": {
                  backgroundColor: "#f9d6d6",
                },
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
            setPathDjikstra();
          }}
        >
          Djikstra Algorithm
        </button>

        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-10 rounded mx-5 my-7"
          onClick={() => {
            setBellmanFord(true);
            setDjikstra(false);
            setAddNode(false);
            setAddEdge(false);
            setPathBellman();
          }}
        >
          Bell-man Ford Algorithm
        </button>
      </div>

      {djikstra || bellmanFord ? (
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
              <p>Shortest path: {shortestPath && shortestPath.join(" -> ")}</p>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default UserInput;
