// @ts-nocheck
import {
	convertObjectToEdgesList,
	printDistanceArray,
	printDistanceArray2D
} from "./bellmanFord_func.ts";
import { Graph, Node, Edge } from "../types/types.js";
import { shortestPath } from "./bellmanFord_func";

// funcition to implement Bellman-Ford algorithm
function BellmanFordAlgorithm(graph, source_node_number, target_node_number?) {
	const num_vertices = graph.nodes.length;
	const num_edges = graph.edges.length;

	//prints 2d array

	// initialize the distance array
	let distance = new Array(num_vertices);

	for (var i = 0; i < num_vertices; i++) {
		distance[i] = new Array(num_vertices);
	}

	// initialise the 2d array with 0/infinity values
	for (var i = 0; i < num_vertices; i++) {
		for (var j = 0; j < num_vertices; j++) {
			distance[i][j] = Infinity;
			if (i == j){
				distance[i][j] = 0;
			}
		}
	}

	// fills 2d array with neighboring edge weights
	for (var i = 0; i < num_edges; i++){
		var start = graph.edges[i].start.number;
		var end = graph.edges[i].end.number;

		distance[start][end] = graph.edges[i].weight;
		distance[end][start] = graph.edges[i].weight;
	}

	// printDistanceArray2D(distance);

	function updateDistances(){

		//   clone the distance array so it doesn't continually update
		var newDistance = distance.map(function (arr) {
			return arr.slice();
		});

		for (var row = 0; row < distance.length; row++) {
			for (var col = 0; col < distance.length; col++) {
				// row/col has a path to n to tell neighbors about
				if (row != col && distance[row][col] != Infinity) {
					// loop neighbors
					for (var i = 0; i < distance.length; i++) {
						// neighbor has path to row/col
						if (i != row && distance[i][row] != Infinity) {
							// update neighbor if its path to n is bigger than row/col path to n + row/col's path to neighbor 
							if (distance[i][col] > distance[row][col] + distance[i][row]) {
								newDistance[i][col] = distance[row][col] + distance[i][row];
								// Can add visualisation step here
							}
						}
					}
				}
			}
		}
		return newDistance;
	}
	// another visualisation step can be added here for update neighbor steps
	
	for (var i = 0; i < num_vertices; i++){
		// console.log(i, distance);
		distance = updateDistances();
	}

	if (target_node_number >= 0) {
		return { distance: distance, path: shortestPath(graph, distance, source_node_number, target_node_number) };
	}


	return {distance: distance, path: null}

}

export { BellmanFordAlgorithm };
