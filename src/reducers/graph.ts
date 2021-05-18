import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import type { BaseCommandData } from "../components/commands/types";
import type { State } from "../store";

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

function createPipe(state: State["graph"], pipe: Pipe) {
  // Disallow trivial loops.
  if (pipe.source === pipe.destination) {
    return;
  }
  // Disallow loops.
  const createsCycle = (): boolean => {
    const toVisit: Set<string> = new Set([pipe.destination]);
    do {
      const [thisNode] = toVisit; // Destructuring: it's, uh, "cool"
      toVisit.delete(thisNode);
      if (thisNode === pipe.source) {
        return true;
      }
      state.commands[thisNode].outputs.forEach(output => toVisit.add(state.pipes[output].destination));
    } while (toVisit.size > 0);
    return false;
  };
  if (createsCycle()) {
    return;
  }
  // Handle splits (a connection already exists from this source).
  if (state.commands[pipe.source].outputs.length > 0) {
    // .slice() is used here to avoid problems with simultaneous
    // iteration and mutation.
    for (const pipeId of state.commands[pipe.source].outputs.slice()) {
      deletePipe(state, state.pipes[pipeId]);
    }
    console.assert(state.commands[pipe.source].outputs.length === 0);
  }
  // Handle merges (a connection already exists to this destination).
  if (state.commands[pipe.destination].inputs.length > 0) {
    for (const pipeId of state.commands[pipe.destination].inputs.slice()) {
      deletePipe(state, state.pipes[pipeId]);
    }
    console.assert(state.commands[pipe.destination].inputs.length === 0);
  }
  // Finally, connect up the pipe.
  state.pipes[pipe.id] = pipe;
  state.commands[pipe.source].outputs.push(pipe.id);
  state.commands[pipe.destination].inputs.push(pipe.id);
}

function deletePipe(state: State["graph"], pipe: Pipe) {
  console.assert(state.pipes[pipe.id] != null);
  state.commands[pipe.source].outputs = state.commands[pipe.source].outputs.filter(id => id !== pipe.id);
  state.commands[pipe.destination].inputs = state.commands[pipe.destination].inputs.filter(id => id !== pipe.id);
  delete state.pipes[pipe.id];
}

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
          createPipe(state, pipe);
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
      deletePipe(state, oldPipe);
      createPipe(state, action.payload);
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
        deletePipe(state, pipe);
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
