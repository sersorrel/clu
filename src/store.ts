import { configureStore } from "@reduxjs/toolkit";

import { graphReducer } from "./reducers/graph";

export const store = configureStore({
  reducer: {
    graph: graphReducer,
  },
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
