import { useState } from "react";
import "./App.css";


function App() {
  const [text,setText] = useState("")
const runPyScript =async (report:any) => {
  const output = await window.electron.runPython({"report":report});
  setText(output)
}

  return (
<>
  <h1>Download Reports</h1>
  
  <button onClick={() => runPyScript("stock_ledger")}>Stock Ledger</button>
  <p id="output">{text}</p> 

  <button onClick={() => runPyScript("consumption_report")}>Consumption Report</button>
  <p id="output">{text}</p> 
</>
  );
}

export default App;
