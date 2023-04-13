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

// function printDistanceArray(distance) {
//   for (var i = 0; i < distance.length; i++) {
//     console.log("distance[" + i + "] = " + distance[i]);
//   }
// }
function printDistanceArray2D(distance) {
	for (var i = 0; i < distance.length; i++) {
		console.log(i, ": ", distance[i]);
	}
}

function shortestPath(graph, distance, source, end){
    var currentNode = source;
    var traversedNodes = [source];
    // var distanceToGo = distance[source][end];
    var smallest = distance[source][end];
    var smallestNode = -1;
    while (currentNode != end){
        for (var col = 0; col < distance.length; col++) {
            for(var i = 0; i < graph.edges.length; i++){
                if(graph.edges[i].start.number == currentNode && graph.edges[i].end.number == col || 
                    graph.edges[i].start.number == col && graph.edges[i].end.number == currentNode){
                    if(smallest - distance[currentNode][col] == distance[col][end]
                        && !traversedNodes.includes(col)
                        && graph.edges[i].weight <= distance[currentNode][col]
                        ){
                        console.log("Curr:", currentNode, "Next:", col, "Weight:", graph.edges[i].weight);
                        smallest = distance[col][end];
                        smallestNode = col;
                    }
                }
            }
        }
        currentNode = smallestNode;
        traversedNodes.push(smallestNode);
    }
    return traversedNodes;
}

export { convertObjectToEdgesList ,printDistanceArray, printDistanceArray2D, shortestPath};
