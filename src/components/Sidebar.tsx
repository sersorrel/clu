import { DragEvent, useState } from "react";

import "./Sidebar.css";
import { BaseCommandData } from "./commands/types";
import { registerCommand } from "../commands";

type Props = {
  className?: string,
};

export function Sidebar({className = ""}: Props): JSX.Element {
  const [commands, setCommands] = useState<string[]>([]);
  const onDragStart = (command: BaseCommandData["commandName"], event: DragEvent) => {
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
  return <div
    className={`sidebar ${className}`}
    onDragOver={event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }}
    onDrop={event => {
      event.preventDefault();
      const files = [];
      // Love too iterate over things by hand in the year 2021
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        files.push(event.dataTransfer.files[i].text());
      }
      Promise.all(files).then(files => {
        const newCommands: string[] = [];
        files.forEach(file => {
          try {
            const command = registerCommand(file);
            if (!commands.includes(command.commandName)) {
              newCommands.push(command.commandName);
            }
          } catch (e) {
            // TODO: proper error feedback
            console.error(e);
          }
        });
        setCommands([...commands, ...newCommands]);
      });
    }}
  >
    {commands.map(command =>
      <div
        className="react-flow__node react-flow__node-default sidebar__node"
        draggable
        key={command}
        onDragStart={event => onDragStart(command, event)}
      >
        {command}
      </div>
    )}
    <div className="sidebar__info">Drag and drop YAML files here to add more commands!</div>
  </div>;
}
