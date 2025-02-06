import { useState } from "react";
import "./App.css";


function App() {
  const [text,setText] = useState("")
const runPyScript =async () => {
  const output = await window.electron.runPython();
  setText(output)
}

  return (
   <>
    <h1>Run Python from Electron</h1>
    <button id="runPython" onClick={runPyScript}>Run Python Script</button>
    <p id="output">{text}</p> 
   </>
  );
}

export default App;
