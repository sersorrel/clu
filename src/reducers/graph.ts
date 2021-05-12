import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const defaultPipes: Pipe[] = [];
const defaultCommands: Command[] = [{
  command: "echo 'hello, world!'",
  id: uuid(),
  inputs: 0,
  outputs: 1,
  position: {x: 0, y: 0},
}];

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
      reducer: (state, action: PayloadAction<Array<Command>>) => ({
        ...state,
        commands: state.commands.concat(action.payload),
      }),
    },
    removeCommands(state, action: PayloadAction<Array<Command["id"]>>) {
      const toRemove = new Set(action.payload);
      return {
        ...state,
        commands: state.commands.filter(command => !toRemove.has(command.id)),
        pipes: state.pipes.filter(pipe => !(toRemove.has(pipe.source) || toRemove.has(pipe.destination))),
      };
    },
    removePipes(state, action: PayloadAction<Array<Pipe["id"]>>) {
      const toRemove = new Set(action.payload);
      return {
        ...state,
        pipes: state.pipes.filter(pipe => !toRemove.has(pipe.id)),
      };
    },
  },
});

export const { addCommands, removeCommands, removePipes } = slice.actions;
export const graphReducer = slice.reducer;
