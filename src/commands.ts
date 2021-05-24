import * as Cut from "./components/commands/Cut";
import { BaseCommandData, BaseProps } from "./components/commands/types";

interface RegisteredCommand {
  Command: (props: BaseProps) => JSX.Element,
  commandName: string,
  toCommand: (data: BaseCommandData) => string[],
}

const commands: Record<RegisteredCommand["commandName"], RegisteredCommand> = {
  [Cut.commandName]: Cut,
};

export function getRegisteredCommand(command: string): RegisteredCommand | null {
  return commands[command] ?? null;
}
