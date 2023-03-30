interface Node {
  x: number;
  y: number;
  radius: number;
  color: string;
  number: number;
  distance: number;
}

interface Edge {
  start: Node;
  end: Node;
  weight: number;
  color: string;
}

interface Graph {
  nodes: Array<Node>;
  edges: Array<Edge>;
}

interface CanvasProps {
  width: number;
  height: number;
}

export type { Graph, Node, Edge };
