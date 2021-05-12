import ReactFlow from "react-flow-renderer";
import { Provider } from "react-redux";

import { store } from "../store";

import { Sidebar } from "./Sidebar";

import "./App.css";

export function App(): JSX.Element {
  return <Provider store={store}>
    <div className="app">
      <h1 className="app__header">CLU</h1>
      <Sidebar className="app__sidebar"/>
      <ReactFlow className="app__graph" elements={[
        {
          data: {label: "a node"},
          id: "1",
          position: {x: 0, y: 0},
        },
      ]}/>
    </div>
  </Provider>;
}
