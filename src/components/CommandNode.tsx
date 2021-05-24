import "./CommandNode.css";
import { getRegisteredCommand } from "../commands";
import { useSelector } from "../hooks";

import { BaseCommandData, BaseProps } from "./commands/types";

function defaultToCommand(data: BaseCommandData): string[] {
  return [data.commandName, "..."];
}

function DefaultCommand(props: BaseProps): JSX.Element {
  return <></>;
}

export function CommandNode(props: BaseProps): JSX.Element {
  const data = useSelector(state => state.graph.commands[props.id]?.data);
  const handler = data && getRegisteredCommand(data.commandName);
  const toCommand = handler?.toCommand ?? defaultToCommand;
  const Elem = handler?.Command ?? DefaultCommand;
  return <>
    <div className="node__commandline">{data && toCommand(data).join(" ")}</div>
    <Elem {...props}/>
  </>;
}
