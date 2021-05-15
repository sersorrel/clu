import "./CommandNode.css";
import { useSelector } from "../hooks";

import * as Cut from "./commands/Cut";
import { BaseCommandData, BaseProps } from "./commands/types";

interface CommandModule {
  Command: (props: BaseProps) => JSX.Element,
  toCommand: (data: BaseCommandData) => string[],
}

const specialisations: Record<string, CommandModule> = {
  cut: Cut,
};

function defaultToCommand(data: BaseCommandData): string[] {
  return data.command;
}

function DefaultCommand(props: BaseProps): JSX.Element {
  return <></>;
}

export function CommandNode(props: BaseProps): JSX.Element {
  const data = useSelector(state => state.graph.commands[props.id].data);
  const handler = specialisations[data.command[0]];
  const toCommand = handler?.toCommand ?? defaultToCommand;
  const Elem = handler?.Command ?? DefaultCommand;
  return <>
    <div className="node__commandline">{toCommand(data).join(" ")}</div>
    <Elem {...props}/>
  </>;
}
