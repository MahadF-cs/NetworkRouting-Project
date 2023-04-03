import { Graph, Node, Edge } from "../types/types.js";
import PriorityQueue from "priorityqueue";

function djikstraAlgorithm(currGraph: Graph, start: Node, end: Node) {
  let distances: { [key: number]: number } = {};
  let previous: { [key: number]: Node | null } = {};
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
    let neighbours = currGraph.edges.filter((edge) => {
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

  return distances;
}

export { djikstraAlgorithm };
