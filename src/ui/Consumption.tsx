import { useState } from "react";

function Consumption() {
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    companyFrom: "SJ",
    companyTo: "SJ",
    vchDateFrom: new Date().toLocaleDateString("en-GB"),
    vchDateTo: new Date().toLocaleDateString("en-GB"),
    rmCtg: "C",
    rmSubCtg: "RND",
    showStckRate: true,
    stoneClass: "LABGROWN",
    showCustomer: true,
    considerDate: true,
  });

  const runPyScript = async () => {
    try {
      const output = await window.electron.runPython({report:"consumption"});
      setText(output);
    } catch (error: any) {
      setText(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <form className="space-y-6">
        <table className="w-full table-auto border-collapse">
          <tbody>
            <tr className="border-b">
             <b> <td className="font-medium text-left py-2">Company Code:</td></b>
              <td className="text-left py-2">&nbsp;&nbsp;{formData.companyFrom}</td>
              <td className="text-left py-2">to &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td className="text-left py-2">{formData.companyTo}</td>
            </tr>
            <tr className="border-b">
             <b> <td className="font-medium text-left py-2">Stone Class:</td></b>
              <td className="text-left py-2" colSpan={3}>&nbsp;&nbsp;{formData.stoneClass}</td>
            </tr>
            <tr className="border-b">
             <b> <td className="font-medium text-left py-2">Rm Ctg:</td></b>
              <td className="text-left py-2" colSpan={3}>&nbsp;&nbsp;{formData.rmCtg}</td>
            </tr>
            <tr className="border-b">
              <b><td className="font-medium text-left py-2">Vch Date:</td></b>
              <td className="text-left py-2">&nbsp;&nbsp;{formData.vchDateFrom}&nbsp;&nbsp;&nbsp;</td>
              <td className="text-left py-2">to&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td className="text-left py-2">{formData.vchDateTo}</td>
            </tr>
            <tr className="border-b">
              <b><td className="font-medium text-left py-2">Inv Date:</td></b>
              <td className="text-left py-2" colSpan={3}>
                <input type="checkbox" checked={formData.considerDate} readOnly />
              </td>
            </tr>
            <tr className="border-b">
             <b> <td className="font-medium text-left py-2">Order Cust:</td></b>
              <td className="text-left py-2" colSpan={3}>
                <input type="checkbox" checked={formData.showCustomer} readOnly />
              </td>
            </tr>
            <tr>
              <b><td className="font-medium text-left py-2">Stock Rate:</td></b>
              <td className="text-left py-2" colSpan={3}>
                <input type="checkbox" checked={formData.showStckRate} readOnly />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
        <br></br>
      <div className="mt-6">
        <button
          onClick={runPyScript}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
        Generate Consumption (Raw Material) Report
        </button>
        <p className="mt-4">{text}</p>
      </div>
    </div>
  );
}

export default Consumption;
