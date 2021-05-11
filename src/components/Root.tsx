import { App } from "./App";

// For hot reloading reasons, it's useful to have a top-level component that
// will never be edited.
export function Root(): JSX.Element {
  return <App/>;
}
