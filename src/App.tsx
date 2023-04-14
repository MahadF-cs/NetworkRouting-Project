import { useState } from "react";
import UserInput from "./components/UserInput";
import { Graph, Node, Edge } from "./types/types.js";
import "./App.css";
import "./components/YoutubeEmbed.css";
import YouTubeEmbed from "./components/YoutubeEmbed";

function App() {
	const WIDTH = 600;
	const HEIGHT = 400;

	return (
		<div className="App">
			<h1>Dijkstra vs Bellman Ford</h1>
			<UserInput width={WIDTH} height={HEIGHT} />
			<br></br>
			<YouTubeEmbed embedId="R33Xw9wsPOE" />
			<br></br>
			<YouTubeEmbed embedId="LMV3axOknS4" />
			<br></br>
			<YouTubeEmbed embedId="7tMpZBAiCrk" />
			<br></br>
		</div>
	);
}

export default App;
