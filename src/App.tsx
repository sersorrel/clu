import ReactFlow from "react-flow-renderer";

export const App = (): JSX.Element => <>
  <h1>💖 Hello World!</h1>
  <p>Welcome to your Electron application.</p>
  <ReactFlow style={{height: "300px"}} elements={[
    {
      data: {label: "a node"},
      id: "1",
      position: {x: 0, y: 0},
    },
  ]} />
</>;
