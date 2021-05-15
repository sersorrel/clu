import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import type { BaseCommandData } from "../components/commands/types";

type Command = {
  id: string,
  inputs: number,
  outputs: number,
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
      prepare: (commands: Array<Omit<Command, "id"> & Partial<Command>>) => {
        commands.map(command => {
          command.id ??= uuid();
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
    editCommand(state, action: PayloadAction<Command>) {
      console.assert(Object.prototype.hasOwnProperty.call(state.commands, action.payload.id));
      state.commands[action.payload.id] = action.payload;
    },
    editCommandData(state, action: PayloadAction<{id: Command["id"], data: Command["data"]}>) {
      state.commands[action.payload.id].data = action.payload.data;
    },
    removeCommands(state, action: PayloadAction<Array<Command["id"]>>) {
      const toRemove = new Set(action.payload);
      for (const [pipeId, pipe] of Object.entries(state.pipes)) {
        if (toRemove.has(pipe.source) || toRemove.has(pipe.destination)) {
          delete state.pipes[pipeId];
        }
      }
      for (const command of action.payload) {
        delete state.commands[command];
      }
    },
    removePipes(state, action: PayloadAction<Array<Pipe["id"]>>) {
      for (const pipe of action.payload) {
        delete state.pipes[pipe];
      }
    },
  },
});

export const { addCommands, editCommand, editCommandData, removeCommands, removePipes } = slice.actions;
export const graphReducer = slice.reducer;
