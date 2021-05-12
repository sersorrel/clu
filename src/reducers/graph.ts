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

export const addCommand = createAction("graph/addCommand", (command: Omit<Command, "id"> & Partial<Command>) => {
  command.id ??= uuid();
  // TypeScript doesn't seem able to narrow the type of `command` all the way to
  // `Command` even after we give it an `id`.
  return {payload: command as Command};
});
export const removeCommand = createAction<Command["id"]>("graph/removeCommand");

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
    .addCase(addCommand, (state, action) => {
      state.commands.push(action.payload);
    })
    .addCase(removeCommand, (state, action) => ({
      ...state,
      nodes: state.commands.filter(node => node.id !== action.payload),
    }))
  ;
});
