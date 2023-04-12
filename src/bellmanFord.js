// import the function
import {
	convertObjectToEdgesList,
	printDistanceArray,
} from "./bellmanFord_funcs.js";
// import example graph 1 json as a variable
import graph1 from "./sampleGraph1.json" assert { type: "json" };
// import example graph 2 json as a variable
import graph2 from "./sampleGraph2.json" assert { type: "json" };

// funcition to implement Bellman-Ford algorithm
function BellmanFord(graph, source_node_number) {
	const num_vertices = graph.num_vertices;
	const num_edges = graph.num_edges;

	// initialize the distance array
	var distance = [];
	for (var i = 0; i < num_vertices; i++) {
		distance.push(Infinity);
	}
	distance[source_node_number] = 0;

	for (var i = 0; i < num_vertices; i++) {
		for (var j = 0; j < num_edges; j++) {
			var start_node = graph.edges[j].start.number;
			var end_node = graph.edges[j].end.number;
			var weight = graph.edges[j].weight;

			console.log("Node: " + start_node);
			console.log("Node: " + end_node);
			console.log("Curr Weight: " + distance[end_node]);
			console.log(distance[start_node] + weight);

			if (distance[start_node] + weight < distance[end_node]) {
				distance[end_node] = distance[start_node] + weight;
				console.log(
					"distance[" + end_node + "] =  Updated to " + distance[end_node]
				);
			}
			console.log();
		}
	}

	// check for negative-weight cycles
	for (var i = 0; i < num_edges; i++) {
		var start_node = graph.edges[i].start.number;
		var end_node = graph.edges[i].end.number;
		var weight = graph.edges[i].weight;
		if (distance[start_node] + weight < distance[end_node]) {
			console.log("Graph contains a negative-weight cycle");
			return;
		}
	}

	// print the distance array
	printDistanceArray(distance);
}

BellmanFord(graph2, 0);
