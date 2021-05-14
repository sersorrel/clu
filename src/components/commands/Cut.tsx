import { Handle, Position } from "react-flow-renderer";

import { Props } from "./types";

export const Command = function CutCommand({data}: Props): JSX.Element {
  return <>
    <div className="node__control">select <select className="nodrag">
      <option>bytes</option>
      <option>characters</option>
      <option>fields</option>
    </select><input type="text" className="nodrag" placeholder="1-3" size={1}/></div>
    <div className="node__control"><label className="nodrag">invert selection <input type="checkbox"/></label></div>
    <div className="node__control"><label className="nodrag">delimiter: <input type="text" size={2}/></label></div>
    <div className="node__control"><label className="nodrag">ignore undelimited lines <input type="checkbox"/></label></div>
    <Handle
      type="target"
      position={Position.Left}
      isValidConnection={params => false}
    />
    <Handle
      type="source"
      position={Position.Right}
      isValidConnection={params => false}
    />
  </>;
};
