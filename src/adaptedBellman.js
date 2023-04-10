// import the function
// import { func } from "prop-types";
import {
	convertObjectToEdgesList,
	printDistanceArray2D
} from "./bellmanFord_Helper.js";
// import example graph 1 json as a variable
import graph1 from "./sampleGraph1.json" assert { type: "json" };
// import example graph 2 json as a variable
import graph2 from "./sampleGraph2.json" assert { type: "json" };
// import example graph 3 json as a variable
import graph3 from "./sampleGraph3.json" assert { type: "json" };
// import example graph 4 json as a variable
import graph4 from "./sampleGraph4.json" assert { type: "json" };
// import example graph 5 json as a variable
import graph5 from "./sampleGraph5.json" assert { type: "json" };
// import example graph 6 json as a variable
import graph6 from "./sampleGraph6.json" assert { type: "json" };
// import example graph 7 json as a variable
import graph7 from "./sampleGraph7.json" assert { type: "json" };

// funcition to implement Bellman-Ford algorithm
function BellmanFord(graph, source_node_number, end_node_number) {
	// const num_vertices = graph.num_vertices;
	// const num_edges = graph.num_edges;
	const num_vertices = graph.nodes.length;
	const num_edges = graph.edges.length;
	//prints 2d array

	// initialize the distance array
	var distance = new Array(num_vertices);

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


	printDistanceArray2D(distance);

	distance = updateDistances(distance);
	console.log("--------------------------------");
	printDistanceArray2D(distance);
	// // another visualisation step can be added here for update neighbor steps
	distance = updateDistances(distance);
	console.log("--------------------------------");
	printDistanceArray2D(distance);
	console.log("--------------------------------");

	console.log("yep", source_node_number, end_node_number);
	
	console.log(shortestPath(graph, distance, source_node_number, end_node_number))
}

function updateDistances(distance){
    // console.log(distance)
	//   clone the distance array so it doesn't continually update
	var newDistance = distance.map(function (arr) {
		return arr.slice();
	});

	for (var row = 0; row < distance.length; row++) {
		for (var col = 0; col < distance.length; col++) {
			// row/col has a path to n to tell neighbors about
			if (distance[row][col] != 0 && distance[row][col] != Infinity) {
				// loop neighbors
				for (var i = 0; i < distance.length; i++) {
					// neighbor has path to row/col
					if (distance[i][row] != 0 && distance[i][row] != Infinity) {
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


function shortestPath(graph, distance, source, end){
	var currentNode = source;
	var traversedNodes = [source];
	var edgeExists = false;
	var smallest = distance[source][end];
	var smallestNode = -1;
	while (currentNode != end){
		for (var col = 0; col < distance.length; col++) {
			for(var i = 0; i < graph.edges.length; i++){
				if(graph.edges[i].start.number == currentNode && graph.edges[i].end.number == col || 
                    graph.edges[i].start.number == col && graph.edges[i].end.number == currentNode){
					if(distance[col][end] <= smallest 
                        && !traversedNodes.includes(col)){
                        smallest = distance[col][end];
                        smallestNode = col;
                    }
				}
			}
		}
		currentNode = smallestNode;
		traversedNodes.push(smallestNode);
		edgeExists = false;
	}
	return traversedNodes;
}

BellmanFord(graph7, 0, 3);

//doesn't work if nodes don't start at 0,
//need  to output the shortest path
//is my negative cycle code right
//I implemented it the way the professor mentioned in class, not the way seen on geeks for geeks