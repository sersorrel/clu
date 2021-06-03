import { spawn } from "child_process";

import { useEffect, useState } from "react";

import { graphToCommand } from "../commands";
import { useSelector } from "../hooks";

import "./Output.css";

type Props = {
  className?: string,
};

export function Output({className = ""}: Props): JSX.Element {
  const graph = useSelector(state => state.graph);
  const command = graphToCommand(graph);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  // TODO: consider debouncing this a little
  useEffect(() => {
    if (command == null) {
      return;
    }
    // Run the command
    const handle = spawn("sh", ["-c", command], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    // Update stdout when new output is received
    handle.stdout.on("data", chunk => {
      setStdout(oldCommandOutput => oldCommandOutput + chunk);
    });
    handle.stderr.on("data", chunk => {
      setStderr(oldCommandOutput => oldCommandOutput + chunk);
    });
    // Return a function to clean up the command
    return () => {
      setStdout("");
      setStderr("");
      if (handle.exitCode == null) {
        handle.kill("SIGTERM");
        setTimeout(() => {
          if (handle.exitCode == null) {
            handle.kill("SIGKILL");
          }
        }, 2000);
      }
    };
  }, [command]);
  return <div className={className + " output"}>
    <div className="output__stdout_header">Output</div>
    <pre className="output__stdout">{stdout}</pre>
    <div className="output__stderr_header">Errors</div>
    <pre className="output__stderr">{stderr}</pre>
  </div>;
}
