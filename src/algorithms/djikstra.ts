// @ts-nocheck
import {Graph, Node, Edge} from "../types/types.js";

function convertObjectToEdgesList(graph) {
	var edgesList = [];
	var edges = graph.edges;
	for (var i = 0; i < edges.length; i++) {
		var curr_edge = edges[i];
		var start_node = curr_edge.start.number;
		var end_node = curr_edge.end.number;
		var weight = curr_edge.weight;

		edgesList.push([start_node, end_node, weight]);
	}
	return edgesList;
}

function printDistanceArray(distance) {
    for (var i = 0; i < distance.length; i++) {
      console.log("distance[" + i + "] = " + distance[i]);
    }
}

function djikstraAlgorithm(curr, start, end){

    // console.log("START", start);
    // console.log("END", end);



    let distances = {}; 
    let previous = {};

    const edges = convertObjectToEdgesList(curr);
    const num_vertices = curr.num_vertices;
	const num_edges = curr.num_edges;

	// initialize the queue
	var queue = [];

	for (var i = 0; i < num_vertices; i++) {
		distances[i] = Infinity;
        previous[i] = null;
	}

	distances[start] = 0;
    queue.push(start);

    while(queue.length > 0){
        var curr_node = queue.shift();
        for (var i = 0; i < num_edges; i++) {
            if (edges[i][0] == curr_node){
                var neighbor = edges[i][1];
                var weight = edges[i][2];
                var alt = distances[curr_node] + weight;
                if (alt < distances[neighbor]){
                    distances[neighbor] = alt;
                    previous[neighbor] = curr_node;
                    queue.push(neighbor);
                }

            }   
        }
    }





    for (var i = 0; i < distance.length; i++) {
        console.log("distance[" + i + "] = " + distance[i]);
    }


    // return curr
}


export { djikstraAlgorithm };