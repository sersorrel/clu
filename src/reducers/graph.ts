import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import type { BaseCommandData } from "../components/commands/types";

type Command = {
  id: string,
  inputs: string[],
  outputs: string[],
  data: BaseCommandData,
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

const defaultPipes: Record<string, Pipe> = {};
const defaultCommands: Record<string, Command> = {};

const slice = createSlice({
  initialState: {
    commands: defaultCommands,
    pipes: defaultPipes,
  },
  name: "graph",
  reducers: {
    addCommands: {
      prepare: (commands: Array<Omit<Command, "id" | "inputs" | "outputs"> & Partial<Command>>) => {
        commands.map(command => {
          command.id ??= uuid();
          command.inputs ??= [];
          command.outputs ??= [];
        });
        // TypeScript doesn't seem able to narrow the type of a command all the
        // way to `Command` even after we give it an `id`.
        return {payload: commands as Command[]};
      },
      reducer: (state, action: PayloadAction<Array<Command>>) => {
        for (const command of action.payload) {
          state.commands[command.id] = command;
        }
      },
    },
    addPipes: {
      prepare: (pipes: Array<Omit<Pipe, "id"> & Partial<Pipe>>) => {
        pipes.map(pipe => {
          pipe.id ??= uuid();
        });
        return {payload: pipes as Pipe[]};
      },
      reducer: (state, action: PayloadAction<Array<Pipe>>) => {
        for (const pipe of action.payload) {
          state.pipes[pipe.id] = pipe;
          state.commands[pipe.source].outputs.push(pipe.id);
          state.commands[pipe.destination].inputs.push(pipe.id);
        }
      },
    },
    editCommand(state, action: PayloadAction<Command>) {
      console.assert(Object.prototype.hasOwnProperty.call(state.commands, action.payload.id));
      state.commands[action.payload.id] = action.payload;
    },
    editCommandData(state, action: PayloadAction<{id: Command["id"], data: Command["data"]}>) {
      state.commands[action.payload.id].data = action.payload.data;
    },
    editPipe(state, action: PayloadAction<Pipe>) {
      console.assert(Object.prototype.hasOwnProperty.call(state.pipes, action.payload.id));
      const oldPipe = state.pipes[action.payload.id];
      state.commands[oldPipe.source].outputs = state.commands[oldPipe.source].outputs.filter(id => (
        id !== action.payload.id
      ));
      state.commands[oldPipe.destination].inputs = state.commands[oldPipe.destination].inputs.filter(id => (
        id !== action.payload.id
      ));
      state.pipes[action.payload.id] = action.payload;
      state.commands[action.payload.source].outputs.push(action.payload.id);
      state.commands[action.payload.destination].inputs.push(action.payload.id);
    },
    removeCommands(state, action: PayloadAction<Array<Command["id"]>>) {
      for (const command of action.payload) {
        for (const pipeId of state.commands[command].inputs.concat(state.commands[command].outputs)) {
          delete state.pipes[pipeId];
        }
        delete state.commands[command];
      }
    },
    removePipes(state, action: PayloadAction<Array<Pipe["id"]>>) {
      for (const pipeId of action.payload) {
        const pipe = state.pipes[pipeId];
        state.commands[pipe.source].outputs = state.commands[pipe.source].outputs.filter(id => (
          id !== pipeId
        ));
        state.commands[pipe.destination].inputs = state.commands[pipe.destination].inputs.filter(id => (
          id !== pipeId
        ));
        delete state.pipes[pipeId];
      }
    },
  },
});

export const {
  addCommands,
  addPipes,
  editCommand,
  editCommandData,
  editPipe,
  removeCommands,
  removePipes,
} = slice.actions;
export const graphReducer = slice.reducer;
