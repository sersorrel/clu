import { useRef } from "react";
import ReactFlow, { Edge, isEdge, isNode, Node, useZoomPanHelper } from "react-flow-renderer";

import { useDispatch, useSelector } from "../hooks";
import {
  addCommands,
  addPipes,
  clickCommand,
  editCommandPosition,
  editPipe,
  removeCommands,
  removePipes,
} from "../reducers/graph";

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
      onConnect={({source, target, sourceHandle, targetHandle}) => {
        dispatch(addPipes([{
          source: source!,
          destination: target!, // eslint-disable-line sort-keys
          sourceHandle: sourceHandle!,
          destinationHandle: targetHandle!, // eslint-disable-line sort-keys
        }]));
      }}
      onDragOver={event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={event => {
        event.preventDefault();
        const json = event.dataTransfer.getData("application/x-clu-new-command");
        if (!json) {
          return;
        }
        const {command, offset} = JSON.parse(json);
        const bounds = reactFlowWrapper.current!.getBoundingClientRect();
        const position = zoomPanHelper.project({
          x: event.clientX - bounds.left - offset.x,
          y: event.clientY - bounds.top - offset.y,
        });
        dispatch(addCommands([{
          data: {
            commandName: command,
          },
          position,
        }]));
      }}
      onEdgeUpdate={({id}, {source, target, sourceHandle, targetHandle}) => {
        dispatch(editPipe({
          id,
          source: source!,
          destination: target!, // eslint-disable-line sort-keys
          sourceHandle: sourceHandle!,
          destinationHandle: targetHandle!, // eslint-disable-line sort-keys
        }));
      }}
      onElementClick={(event, element) => {
        if (isNode(element)) {
          dispatch(clickCommand(element.id));
        }
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
      onNodeDragStop={(event, node) => {
        dispatch(editCommandPosition({id: node.id, ...node.position}));
      }}
    />
  </div>;
}
