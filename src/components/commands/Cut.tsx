import { Handle, Position } from "react-flow-renderer";

import { useDispatch, useSelector } from "../../hooks";
import { editCommandData } from "../../reducers/graph";

import { BaseCommandData, BaseProps } from "./types";

interface CommandData extends BaseCommandData {
  complement: boolean,
  delimiter: string | null,
  onlyDelimited: boolean,
  outputDelimiter: string | null,
  selectBy: "bytes" | "characters" | "fields",
  selectList: string,
  zeroTerminated: boolean,
}

export const commandName = "cut";

export function toTotal(data: Partial<CommandData> & BaseCommandData): CommandData {
  // This construction means we can put whatever we want in BaseCommandData,
  // but we still get errors from TypeScript if we forget to set a default for
  // something in CommandData.
  return {
    ...data,
    complement: data.complement ?? false,
    delimiter: data.delimiter ?? null,
    onlyDelimited: data.onlyDelimited ?? false,
    outputDelimiter: data.outputDelimiter ?? null,
    selectBy: data.selectBy ?? "fields",
    selectList: data.selectList ?? "",
    zeroTerminated: data.zeroTerminated ?? false,
  };
}

export function toCommand(_data: BaseCommandData): string[] {
  const data: CommandData = toTotal(_data);
  return [
    "cut",
    ...data.selectList && data.selectBy === "bytes" ? ["-b", data.selectList] : [],
    ...data.selectList && data.selectBy === "characters" ? ["-c", data.selectList] : [],
    ...data.selectList && data.selectBy === "fields" ? ["-f", data.selectList] : [],
    ...data.complement ? ["--complement"] : [],
    ...data.delimiter != null ? ["-d", data.delimiter] : [],
    ...data.onlyDelimited ? ["-s"] : [],
    ...data.outputDelimiter != null ? ["--output-delimiter", data.outputDelimiter] : [],
    ...data.zeroTerminated ? ["-z"] : [],
  ];
}

export const Command = function CutCommand({id}: BaseProps): JSX.Element {
  const dispatch = useDispatch();
  const data = toTotal(useSelector(state => state.graph.commands[id].data as CommandData));
  return <>
    <div className="node__control">select <select
      className="nodrag"
      value={data.selectBy}
      onChange={event => {
        dispatch(editCommandData({data: {...data, selectBy: event.target.value}, id}));
      }}
    >
      <option value="bytes">bytes</option>
      <option value="characters">characters</option>
      <option value="fields">fields</option>
    </select><input
      type="text"
      className="nodrag"
      placeholder="1-3"
      size={1}
      value={data.selectList}
      onChange={event => {
        dispatch(editCommandData({data: {...data, selectList: event.target.value || null}, id}));
      }}
    /></div>
    <div className="node__control"><label className="nodrag">invert selection <input
      type="checkbox"
      checked={data.complement}
      onChange={event => {
        dispatch(editCommandData({data: {...data, complement: event.target.checked}, id}));
      }}
    /></label></div>
    <div className="node__control"><label className="nodrag">delimiter: <input
      type="text"
      size={1}
      placeholder="\t"
      value={data.delimiter ?? ""}
      onChange={event => {
        dispatch(editCommandData({data: {...data, delimiter: event.target.value || null}, id}));
      }}
    /></label></div>
    <div className="node__control"><label className="nodrag">ignore undelimited lines <input
      type="checkbox"
      checked={data.onlyDelimited}
      onChange={event => {
        dispatch(editCommandData({data: {...data, onlyDelimited: event.target.checked}, id}));
      }}
    /></label></div>
    <div className="node__control"><label className="nodrag">output delimiter: <input
      type="text"
      size={3}
      value={data.outputDelimiter ?? ""}
      onChange={event => {
        dispatch(editCommandData({data: {...data, outputDelimiter: event.target.value || null}, id}));
      }}
    /></label></div>
    <div className="node__control"><label className="nodrag">input lines are zero-terminated <input
      type="checkbox"
      checked={data.zeroTerminated}
      onChange={event => {
        dispatch(editCommandData({data: {...data, zeroTerminated: event.target.checked}, id}));
      }}
    /></label></div>
    <Handle
      type="target"
      position={Position.Left}
    />
    <Handle
      type="source"
      position={Position.Right}
    />
  </>;
};
