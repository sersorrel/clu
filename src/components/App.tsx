import { ReactFlowProvider } from "react-flow-renderer";
import { Provider } from "react-redux";

import { store } from "../store";

import { Graph } from "./Graph";
import { Header } from "./Header";
import { Output } from "./Output";
import { Sidebar } from "./Sidebar";

import "./App.css";

export function App(): JSX.Element {
  return <Provider store={store}>
    <div className="app">
      <ReactFlowProvider>
        <Header className="app__header"/>
        <Sidebar className="app__sidebar"/>
        <Graph className="app__graph"/>
        <Output className="app__output"/>
      </ReactFlowProvider>
    </div>
  </Provider>;
}
