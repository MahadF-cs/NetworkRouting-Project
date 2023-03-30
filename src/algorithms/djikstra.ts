import { Graph, Node, Edge } from "../types/types.js";
import PriorityQueue from "priorityqueue";

function djikstraAlgorithm(currGraph: Graph, start: Node, end: Node) {
  let distances: any = {};
  let previous: any = {};
  let unvisited = new PriorityQueue({
    comparator: function (a: Node, b: Node) {
      return a.distance - b.distance;
    },
  });

  for (let i = 0; i < currGraph.nodes.length; i++) {
    distances[i] = Infinity;
    previous[i] = null;
  }

  distances[start.number] = 0;
  start.distance = 0;
  unvisited.push(start);

  while (unvisited.length > 0) {
    const currNode = unvisited.pop();
    // map all the edges that have the current node as the start node
    let neighbours = currGraph.edges.filter((edge) => {
      // return all edges that have the current node as the start node or the end node
      return (
        edge.start.number === currNode.number ||
        edge.end.number === currNode.number
      );
    });

    for (let i = 0; i < neighbours.length; i++) {
      if (neighbours[i].start.number === currNode.number) {
        var neighbour = neighbours[i].end;
      } else {
        var neighbour = neighbours[i].start;
      }
      let alt = distances[currNode.number] + neighbours[i].weight;
      if (alt < distances[neighbour.number]) {
        distances[neighbour.number] = alt;
        previous[neighbour.number] = currNode;
        neighbour.distance = alt;
        unvisited.push(neighbour);
      }
    }
  }

  let path = [];
  let curr = end;
  while (curr !== null) {
    path.push(curr);
    curr = previous[curr.number];
  }

  // output the shortest path like this 1->2->3->4

  let shortestPath = "";
  for (let i = path.length - 1; i >= 0; i--) {
    shortestPath += path[i].number;
    if (i !== 0) {
      shortestPath += "->";
    }
  }

  console.log("shortest path", shortestPath);

  return distances;
}

export { djikstraAlgorithm };
