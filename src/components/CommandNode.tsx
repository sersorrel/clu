import "./CommandNode.css";

type Props = {
  id: string,
  data: {
    command: string,
  },
  type: string,
  selected: boolean,
  sourcePosition: string,
  targetPosition: string,
}

export function CommandNode({data}: Props): JSX.Element {
  return <div>
    {data.command}
  </div>;
}
