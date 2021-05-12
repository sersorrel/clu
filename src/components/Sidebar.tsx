import "./Sidebar.css";

type Props = {
  className?: string,
};

export function Sidebar({className = ""}: Props): JSX.Element {
  return <div className={`sidebar ${className}`}>
    <div className="react-flow__node react-flow__node-default sidebar__node">a node</div>
  </div>;
}
