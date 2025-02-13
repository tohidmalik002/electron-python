import { useState } from "react";

function StockForm() {
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    companyFrom: "SJ",
    companyTo: "SJ",
    vchDateFrom: new Date().toISOString().split("T")[0],
    vchDateTo: new Date().toISOString().split("T")[0],
    rmCtg: "C",
    rmSubCtg: "RND",
    showStckRate: true,
    locationType: "S",
    stoneClass: "LABGROWN",
    locationFrom: "SDIA2",
    locationTo: "SDIA2",
    showCustomer: true,
    considerDate: true,
  });

  const runPyScript = async () => {
    try {
      console.log("Sending data:", formData);
      const output = await window.electron.runPython();
      setText(output);
    } catch (error) {
      setText(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <form className="space-y-6">
        <table className="w-full table-auto border-collapse">
          <tbody>
            <tr className="border-b">
            <b>  <td className="font-medium text-left py-2">Company Code:</td></b>
              <td className="text-left py-2"> &nbsp;&nbsp;{formData.companyFrom}</td>
              <td className="text-left py-2">to &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td className="text-left py-2">{formData.companyTo}</td>
            </tr>
            <tr className="border-b">
          <b>    <td className="font-medium text-left py-2">Location Type:</td></b>
              <td className="text-left py-2" colSpan="3"> &nbsp;&nbsp;{formData.locationType}</td>
            </tr>
            <tr className="border-b">
            <b>    <td className="font-medium text-left py-2">Location:</td></b>
              <td className="text-left py-2"> &nbsp;&nbsp;{formData.locationFrom}</td>
              <td className="text-left py-2">to  &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td className="text-left py-2"> &nbsp;&nbsp;{formData.locationTo}</td>
            </tr>
            <tr className="border-b">
         <b>     <td className="font-medium text-left py-2">Rm Ctg:</td></b>
              <td className="text-left py-2" colSpan="3"> &nbsp;&nbsp;{formData.rmCtg}</td>
            </tr>
            <tr className="border-b">
             <b> <td className="font-medium text-left py-2">Vch Date:</td></b>
              <td className="text-left py-2"> &nbsp;&nbsp;{formData.vchDateFrom} &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td className="text-left py-2">to &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td className="text-left py-2">{formData.vchDateTo}</td>
            </tr>
            <tr className="border-b">
            <b>  <td className="font-medium text-left py-2">Inv Date:</td></b>
              <td className="text-left py-2" colSpan="3">
                <input type="checkbox" checked={formData.considerDate} readOnly />
              </td>
            </tr>
            <tr className="border-b">
            <b><td className="font-medium text-left py-2">Order Cust:</td></b>
              <td className="text-left py-2" colSpan="3">
                <input type="checkbox" checked={formData.showCustomer} readOnly />
              </td>
            </tr>
            <tr>
            <b>  <td className="font-medium text-left py-2">Stock Rate:</td></b>
              <td className="text-left py-2" colSpan="3">
                <input type="checkbox" checked={formData.showStckRate} readOnly />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <br></br>
      <div className="mt-6 flex justify-center">
        <br></br><br></br>
        <button
          onClick={runPyScript}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Download Stock Report
        </button>
      </div>

      {text && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default StockForm;
