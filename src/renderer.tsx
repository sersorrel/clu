import ReactDOM from "react-dom";

import { Root } from "./components/Root";

import "./index.css";

console.log("👋 This message is being logged by 'renderer.js', included via webpack");

ReactDOM.render(<Root/>, document.getElementById("root"));
