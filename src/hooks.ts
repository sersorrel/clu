import { useDispatch as _useDispatch, useSelector as _useSelector, TypedUseSelectorHook } from "react-redux";

import type { State, Dispatch } from "./store";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDispatch = () => _useDispatch<Dispatch>();
export const useSelector: TypedUseSelectorHook<State> = _useSelector;
