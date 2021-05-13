import "./CommandNode.css";
import { Props } from "./commands/types";

export function CommandNode({data}: Props): JSX.Element {
  return <div>
    {data.command.join(" ")}
  </div>;
}
