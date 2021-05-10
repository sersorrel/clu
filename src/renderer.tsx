import ReactDOM from "react-dom";

import { App } from "./components/App";

import "./index.css";

console.log("👋 This message is being logged by 'renderer.js', included via webpack");

ReactDOM.render(<App/>, document.getElementById("root"));
