import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    companyFrom: "",
    companyTo: "",
    locationType: "",
    parentLoc: "",
    locationFrom: "",
    locationTo: "",
    rmCtg: "",
    sizeFrom: "",
    sizeTo: "",
    stockRateFrom: "",
    stockRateTo: "",
    vchDateFrom: "",
    vchDateTo: "",
    vchOption: "",
    showWtQty: "Wt",
    lastColumnValue: "Qty/Wt",
    showDesc: false,
    showBal: false,
    showCustomPureWt: false,
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const runPyScript = async () => {
    try {
      console.log(formData)
      // Passing the formData dynamically to the Python script
      const output = await window.electron.runPython(formData);
      setText(output);
    } catch (error: any) {
      setText(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Range Form</h1>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Company Cd:</label>
          <input
            type="text"
            name="companyFrom"
            value={formData.companyFrom}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
          <input
            type="text"
            name="companyTo"
            value={formData.companyTo}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Location Typ:</label>
          <input
            type="text"
            name="locationType"
            value={formData.locationType}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Parent Loc:</label>
          <input
            type="text"
            name="parentLoc"
            value={formData.parentLoc}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Location:</label>
          <input
            type="text"
            name="locationFrom"
            value={formData.locationFrom}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
          <input
            type="text"
            name="locationTo"
            value={formData.locationTo}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Rm Ctg:</label>
          <input
            type="text"
            name="rmCtg"
            value={formData.rmCtg}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Size/Ptr:</label>
          <input
            type="number"
            step="0.0001"
            name="sizeFrom"
            value={formData.sizeFrom}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
          <input
            type="number"
            step="0.0001"
            name="sizeTo"
            value={formData.sizeTo}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Stock Rate:</label>
          <input
            type="number"
            step="0.001"
            name="stockRateFrom"
            value={formData.stockRateFrom}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
          <input
            type="number"
            step="0.001"
            name="stockRateTo"
            value={formData.stockRateTo}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Vch Date:</label>
          <input
            type="date"
            name="vchDateFrom"
            value={formData.vchDateFrom}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
          <input
            type="date"
            name="vchDateTo"
            value={formData.vchDateTo}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Vch Option:</label>
          <input
            type="text"
            name="vchOption"
            value={formData.vchOption}
            onChange={handleInputChange}
            className="border p-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Show Wt/Qty:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="showWtQty"
                value="Wt"
                checked={formData.showWtQty === "Wt"}
                onChange={handleInputChange}
               />
              Wt
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="showWtQty"
                value="Qty"
                checked={formData.showWtQty === "Qty"}
                onChange={handleInputChange}
              />
              Qty
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Last Column:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="lastColumnValue"
                value="Qty/Wt"
                checked={formData.lastColumnValue === "Qty/Wt"}
                onChange={handleInputChange}
              />
              Qty/Wt
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="lastColumnValue"
                value="Value"
                checked={formData.lastColumnValue === "Value"}
                onChange={handleInputChange}
              />
              Value
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="lastColumnValue"
                value="Blank"
                checked={formData.lastColumnValue === "Blank"}
                onChange={handleInputChange}
              />
              Blank
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 font-medium">Options:</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="showDesc"
                checked={formData.showDesc}
                onChange={handleInputChange}
              />
              Show Desc
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="showBal"
                checked={formData.showBal}
                onChange={handleInputChange}
              />
              Show Bal
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="showCustomPureWt"
                checked={formData.showCustomPureWt}
                onChange={handleInputChange}
              />
              Show Custom Pure Wt
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={runPyScript}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Python Script
        </button>
        <p className="mt-4">{text}</p>
      </div>
    </div>
  );
}

export default App;
