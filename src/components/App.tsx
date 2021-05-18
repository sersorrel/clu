import { ReactFlowProvider } from "react-flow-renderer";
import { Provider } from "react-redux";

import { store } from "../store";

import { Graph } from "./Graph";
import { Sidebar } from "./Sidebar";

import "./App.css";
import { Header } from "./Header";

export function App(): JSX.Element {
  return <Provider store={store}>
    <div className="app">
      <ReactFlowProvider>
        <Header className="app__header"/>
        <Sidebar className="app__sidebar"/>
        <Graph className="app__graph"/>
      </ReactFlowProvider>
    </div>
  </Provider>;
}
