import { ReactFlowProvider } from "react-flow-renderer";
import { Provider } from "react-redux";

import { store } from "../store";

import { Graph } from "./Graph";
import { Sidebar } from "./Sidebar";

import "./App.css";

export function App(): JSX.Element {
  return <Provider store={store}>
    <div className="app">
      <ReactFlowProvider>
        <h1 className="app__header">CLU</h1>
        <Sidebar className="app__sidebar"/>
        <Graph className="app__graph"/>
      </ReactFlowProvider>
    </div>
  </Provider>;
}
