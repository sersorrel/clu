import { Handle, Position } from "react-flow-renderer";
import { quote } from "shlex";
import YAML from "yaml";

import * as Cut from "./components/commands/Cut";
import { BaseCommandData, BaseProps } from "./components/commands/types";
import { useDispatch, useSelector } from "./hooks";
import { editCommandData } from "./reducers/graph";
import { State } from "./store";

interface RegisteredCommand {
  Command: (props: BaseProps) => JSX.Element,
  commandName: string,
  toCommand: (data: BaseCommandData) => string[],
}

// TODO: this should probably live in React state somewhere, really
const commands: Record<RegisteredCommand["commandName"], RegisteredCommand> = {
  [Cut.commandName]: Cut,
};

export function graphToCommand(graph: State["graph"]): string | null {
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
  return command.join(" | ");
}

export function registerCommand(input: string): RegisteredCommand {
  const model = YAML.parse(input);
  // TODO: write a proper metamodel/schema
  if (!(model.clu_version >= 0.1)) {
    throw Error(`Invalid model: unacceptable version: ${model.clu_version}`);
  }
  // TODO: this isn't great, but we really can't handle changes to models
  if (commands[model.command_name] != null) {
    return commands[model.command_name];
  }
  return commands[model.command_name] = {
    Command: ({id}: BaseProps) => {
      const dispatch = useDispatch();
      const data = useSelector(state => state.graph.commands[id].data);
      return <>
        {(model.arguments as any[]).map((argument, i) => <div key={i} className="node__control">
          {{
            // Required, string
            argument: () => <>
              <label className="nodrag">{argument.description} <input
                type="text"
                value={data[i] as string ?? ""}
                onChange={event => {
                  dispatch(editCommandData({data: {...data, [i]: event.target.value || null}, id}));
                }}
              /></label>
            </>,
            // Not required, boolean, not present if false
            flag: () => <>
              <label className="nodrag">{argument.description} <input
                type="checkbox"
                checked={data[i] as boolean ?? false}
                onChange={event => {
                  dispatch(editCommandData({data: {...data, [i]: event.target.checked}, id}));
                }}
              /></label>
            </>,
            // Not required, string argument, not present if argument empty
            parameter: () => <>
              <label className="nodrag">{argument.description} <input
                type="text"
                value={data[i] as string ?? ""}
                onChange={event => {
                  dispatch(editCommandData({data: {...data, [i]: event.target.value || null}, id}));
                }}
              /></label>
            </>,
            // Required, exactly one must be selected
            parameter_group: () => <>
              <label className="nodrag">{argument.description} <select
                value={data[i] as number ?? 0}
                onChange={event => {
                  dispatch(editCommandData({data: {...data, [i]: event.target.value}, id}));
                }}
              >
                {(argument.parameters as any[]).map((parameter, j) => <option key={j} value={j}>
                  {parameter.description}
                </option>)}
              </select></label>
            </>,
          }[argument.type as "parameter" | "flag" | "parameter_group" | "argument"]()}
        </div>)}
        {model.uses_stdin ? <Handle
          type="target"
          position={Position.Left}
        /> : null}
        {model.uses_stdout ? <Handle
          type="source"
          position={Position.Right}
        /> : null}
      </>;
    },
    commandName: model.command_name,
    toCommand: (data): string[] => [model.command_name].concat((model.arguments as any[]).flatMap((argument, i) => {
      // TODO: make parameter_group take a parameter, and add flag_group
      switch (argument.type) {
      case "argument":
        return [data[i] ?? ""];
      case "flag":
        return data[i] ? [argument.short ?? argument.long] : [];
      case "parameter":
        return data[i] != null ? [argument.short ?? argument.long, data[i]] : [];
      case "parameter_group":
        const parameter = argument.parameters[data[i] as number ?? 0];
        return parameter.short ?? parameter.long;
      }
    })),
  };
}

export function getRegisteredCommand(command: string): RegisteredCommand | null {
  return commands[command] ?? null;
}
