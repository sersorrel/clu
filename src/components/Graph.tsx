import { useRef } from "react";
import ReactFlow, { Edge, Node, useZoomPanHelper } from "react-flow-renderer";

import { useDispatch, useSelector } from "../hooks";
import { addCommands, removeCommands, removePipes } from "../reducers/graph";

type Props = {
  className?: string,
}

export function Graph({className = ""}: Props): JSX.Element {
  const dispatch = useDispatch();
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

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const zoomPanHelper = useZoomPanHelper();

  return <div className={className} ref={reactFlowWrapper}>
    <ReactFlow
      className={className}
      elements={[...commandElements, ...pipeElements]}
      onDragOver={event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={event => {
        event.preventDefault();
        const {command, offset} = JSON.parse(event.dataTransfer.getData("application/x-clu-new-command"));
        const bounds = reactFlowWrapper.current!.getBoundingClientRect();
        const position = zoomPanHelper.project({
          x: event.clientX - bounds.left - offset.x,
          y: event.clientY - bounds.top - offset.y,
        });
        dispatch(addCommands([{
          command,
          inputs: 0,
          outputs: 1,
          position,
        }]));
      }}
      onElementsRemove={elements => {
        dispatch(removePipes(elements.map(element => element.id)));
        dispatch(removeCommands(elements.map(element => element.id)));
      }}
    />
  </div>;
}
