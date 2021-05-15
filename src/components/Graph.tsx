import { useRef } from "react";
import ReactFlow, { Edge, isEdge, isNode, Node, useZoomPanHelper } from "react-flow-renderer";

import { useDispatch, useSelector } from "../hooks";
import { addCommands, removeCommands, removePipes } from "../reducers/graph";

import { CommandNode } from "./CommandNode";

type Props = {
  className?: string,
}

export function Graph({className = ""}: Props): JSX.Element {
  const dispatch = useDispatch();
  const commandElements: Node[] = Object.values(useSelector(state => state.graph.commands)).map(command => ({
    id: command.id,
    position: command.position,
    type: "command",
  }));
  const pipeElements: Edge[] = Object.values(useSelector(state => state.graph.pipes)).map(pipe => ({
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
      nodeTypes={{
        command: CommandNode,
      }}
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
          data: {
            command,
          },
          inputs: 0,
          outputs: 1,
          position,
        }]));
      }}
      onElementsRemove={elements => {
        const pipes = elements.filter(element => isEdge(element));
        const commands = elements.filter(element => isNode(element));
        if (pipes.length > 0) {
          dispatch(removePipes(pipes.map(pipe => pipe.id)));
        }
        if (commands.length > 0) {
          dispatch(removeCommands(commands.map(command => command.id)));
        }
      }}
    />
  </div>;
}
