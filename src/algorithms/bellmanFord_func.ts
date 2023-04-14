//@ts-nocheck
// import example graph 1 json as a variable
import graph1 from "./sampleGraph1.json" assert { type: "json" };
// import example graph 2 json as a variable
import graph2 from "./sampleGraph2.json" assert { type: "json" };


// function to convert the graph to a edges list with each edge having format [start_node, end_node, weight]
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

function printDistanceArray2D(distance) {
	for (var i = 0; i < distance.length; i++) {
		console.log(i, ": ", distance[i]);
	}
}

function shortestPath(graph, distance, source, end){
    var currentNode = source;
    var traversedNodes = [source];
    while (currentNode != end){
        if(distance[currentNode][end][1] == -1){
            traversedNodes.push(end);
            currentNode = end;
        }else if(distance[currentNode][end][1] != -1){
            traversedNodes.push(distance[currentNode][end][1]);
            currentNode = (distance[currentNode][end][1]);
        }
    }
    return traversedNodes;
}

export { convertObjectToEdgesList ,printDistanceArray, printDistanceArray2D, shortestPath};
