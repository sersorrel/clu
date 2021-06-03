import { graphToCommand } from "../commands";
import { useSelector } from "../hooks";

import "./header.css";

type Props = {
  className?: string,
}

export function Header({className = ""}: Props): JSX.Element {
  const graph = useSelector(state => state.graph);
  const command = graphToCommand(graph);
  return <div className={`header ${className}`}>
    <span className="header__title">CLU</span>
    {command ? <span className="header__command">{command}</span> : null}
  </div>;
}
