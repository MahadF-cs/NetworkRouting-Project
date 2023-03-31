// import the function
import {
	convertObjectToEdgesList,
	printDistanceArray,
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

// funcition to implement Bellman-Ford algorithm
function BellmanFord(graph, source_node_number) {
	const num_vertices = graph.num_vertices;
	const num_edges = graph.num_edges;

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

	function updateDistances(){

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
	// another visualisation step can be added here for update neighbor steps
	distance = updateDistances();
	console.log("--------------------------------");
	printDistanceArray2D(distance);

	distance = updateDistances();
	console.log("--------------------------------");
	printDistanceArray2D(distance);

}

BellmanFord(graph5, 0);