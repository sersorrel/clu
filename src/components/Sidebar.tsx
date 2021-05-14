import { DragEvent } from "react";

import "./Sidebar.css";
import { CommandData } from "./commands/types";

type Props = {
  className?: string,
};

export function Sidebar({className = ""}: Props): JSX.Element {
  const onDragStart = (command: CommandData["command"], event: DragEvent) => {
    const rect = (event.target as Element).getBoundingClientRect();
    const offset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    event.dataTransfer.setData("application/x-clu-new-command", JSON.stringify({
      command,
      offset,
    }));
    event.dataTransfer.effectAllowed = "move";
  };
  return <div className={`sidebar ${className}`}>
    {["df", "cut", "sort", "uniq", "wc"].map(command =>
      <div
        className="react-flow__node react-flow__node-default sidebar__node"
        draggable
        key={command}
        onDragStart={event => onDragStart([command], event)}
      >
        {command}
      </div>
    )}
  </div>;
}
