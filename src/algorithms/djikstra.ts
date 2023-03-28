// @ts-nocheck
import { Graph, Node, Edge } from "../types/types.js";

function convertObjectToEdgesList(graph) {
  let edgesList = [];
  let edges = graph.Edges;
  for (let i = 0; i < edges.length; i++) {
    let curr_edge = edges[i];
    let start_node = curr_edge.start.number;
    let end_node = curr_edge.end.number;
    let weight = curr_edge.weight;

    edgesList.push([start_node, end_node, weight]);
  }
  return edgesList;
}

function printDistanceArray(distance) {
  for (let i = 0; i < distance.length; i++) {
    console.log("distance[" + i + "] = " + distance[i]);
  }
}

function djikstraAlgorithm(curr, start, end) {
  // console.log("START", start);
  // console.log("END", end);
  //   console.log("curr", curr);

  let distances = {};
  let previous = {};

  const edges = convertObjectToEdgesList(curr);
  const num_vertices = curr.num_vertices;
  const num_edges = curr.num_edges;

  // initialize the queue
  let queue = [];

  for (let i = 0; i < num_vertices; i++) {
    distances[i] = Infinity;
    previous[i] = null;
  }

  distances[start] = 0;
  queue.push(start);

  while (queue.length > 0) {
    let curr_node = queue.shift();
    for (let i = 0; i < num_edges; i++) {
      if (edges[i][0] == curr_node) {
        let neighbor = edges[i][1];
        let weight = edges[i][2];
        let alt = distances[curr_node] + weight;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = curr_node;
          queue.push(neighbor);
        }
      }
    }
  }

  for (let i = 0; i < distances.length; i++) {
    console.log("distances[" + i + "] = " + distances[i]);
  }

  return curr;
}

export { djikstraAlgorithm };
