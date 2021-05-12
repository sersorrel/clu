import ReactFlow, { Edge, Node } from "react-flow-renderer";

import { useSelector } from "../hooks";

type Props = {
  className?: string,
}

export function Graph({className = ""}: Props): JSX.Element {
  const commandElements: Node[] = useSelector(state => state.graph.commands).map(command => ({
    data: {label: command.command},
    id: command.id,
    position: command.position,
  }));
  const pipeElements: Edge[] = useSelector(state => state.graph.pipes).map(pipe => ({
    id: pipe.id,
    source: pipe.source,
    sourceHandle: pipe.sourceHandle,
    target: pipe.destination,
    targetHandle: pipe.destinationHandle,
  }));
  return <ReactFlow
    className={className}
    elements={[...commandElements, ...pipeElements]}
  />;
}
