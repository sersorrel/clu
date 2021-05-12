import { createAction, createReducer } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

type Command = {
  id: string,
  inputs: number,
  outputs: number,
  command: string,
  position: {
    x: number,
    y: number,
  }
};
type Pipe = {
  id: string,
  source: string,
  destination: string,
  sourceHandle: string,
  destinationHandle: string,
};

export const addCommands = createAction("graph/addCommands", (commands: Array<Omit<Command, "id"> & Partial<Command>>) => {
  commands.map(command => {
    command.id ??= uuid();
  });
  // TypeScript doesn't seem able to narrow the type of a command all the way to
  // `Command` even after we give it an `id`.
  return {payload: commands as Command[]};
});
export const removeCommands = createAction<Array<Command["id"]>>("graph/removeCommands");
export const removePipes = createAction<Array<Pipe["id"]>>("graph/removePipes");

const defaultPipes: Pipe[] = [];
const defaultCommands: Command[] = [{
  command: "echo 'hello, world!'",
  id: uuid(),
  inputs: 0,
  outputs: 1,
  position: {x: 0, y: 0},
}];

export const graphReducer = createReducer({
  commands: defaultCommands,
  pipes: defaultPipes,
}, builder => {
  builder
    .addCase(addCommands, (state, action) => ({
      ...state,
      commands: state.commands.concat(action.payload),
    }))
    .addCase(removeCommands, (state, action) => {
      const toRemove = new Set(action.payload);
      return {
        ...state,
        commands: state.commands.filter(command => !toRemove.has(command.id)),
        pipes: state.pipes.filter(pipe => !(toRemove.has(pipe.source) || toRemove.has(pipe.destination))),
      };
    })
    .addCase(removePipes, (state, action) => {
      const toRemove = new Set(action.payload);
      return {
        ...state,
        pipes: state.pipes.filter(pipe => !toRemove.has(pipe.id)),
      };
    })
  ;
});
