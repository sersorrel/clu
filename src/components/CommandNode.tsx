import "./CommandNode.css";
import * as Cut from "./commands/Cut";
import { Props } from "./commands/types";

interface CommandModule {
  Command: (props: Props) => JSX.Element,
}

const specialisations: {[_: string]: CommandModule} = {
  cut: Cut,
};

function DefaultCommand(props: Props): JSX.Element {
  return <></>;
}

export function CommandNode(props: Props): JSX.Element {
  const Elem = specialisations[props.data.command[0]]?.Command ?? DefaultCommand;
  return <>
    <div className="node__commandline">{props.data.command.join(" ")}</div>
    <Elem {...props}/>
  </>;
}
