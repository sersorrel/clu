import { quote } from "shlex";

import { getRegisteredCommand } from "../commands";
import { useSelector } from "../hooks";
import { State } from "../store";

import "./header.css";

type Props = {
  className?: string,
}

function toCommand(graph: State["graph"]): string | null {
  const { lastCommand } = graph;
  if (lastCommand == null || !Object.prototype.hasOwnProperty.call(graph.commands, lastCommand)) {
    return null;
  }
  // Walk backwards to find the start of the command.
  let node = graph.commands[lastCommand];
  while (node.inputs.length > 0) {
    node = graph.commands[graph.pipes[node.inputs[0]].source];
  }
  // Walk forwards, building up the command as we go.
  const command = [];
  do {
    command.push(getRegisteredCommand(node.data.commandName)?.toCommand(node.data).map(s => quote(s)).join(" "));
    node = graph.commands[graph.pipes[node.outputs[0]]?.destination];
  } while (node);
  // TODO: quoting etc.
  return command.join(" | ");
}

export function Header({className = ""}: Props): JSX.Element {
  const graph = useSelector(state => state.graph);
  const command = toCommand(graph);
  return <div className={`header ${className}`}>
    <span className="header__title">CLU</span>
    {command ? <span className="header__command">{command}</span> : null}
  </div>;
}
