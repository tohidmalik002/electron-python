import React, { useState } from "react";

function ShippingBill() {
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    companyCd: "",
    invTc: "",
    invYy: "",
    invChr: "",
    invNo: "",
    expNo: ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const output:any =  await window.electron.runPython({report:"shipping_bill", formData})
      setText(output);
    } catch (error: any) {
      setText(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg shipping-bill">
      <form className="space-y-4">
        {/* Company Cd row */}
        <div className="flex items-center space-x-2">
          <label className="font-bold w-1/3">Company Cd</label>
          <div className="flex items-center space-x-1 w-2/3 inp-grp">
          <input
            type="text"
            name="companyCd"
            value={formData.companyCd}
            onChange={handleChange}
            className="w-2/3 p-2 border rounded"
          />
          </div>
        </div>

        {/* Inv Tc/Yy/Chr/No row */}
        <div className="flex items-center space-x-2">
          <label className="font-bold w-1/3">Inv Tc/Yy/Chr/No</label>
          <div className="flex items-center space-x-1 w-2/3 inp-grp">
            <input
              type="text"
              name="invTc"
              value={formData.invTc}
              onChange={handleChange}
              className="w-1/4 p-2 border rounded"
            />
            <span>/</span>
            <input
              type="text"
              name="invYy"
              value={formData.invYy}
              onChange={handleChange}
              className="w-1/4 p-2 border rounded"
            />
            <span>/</span>
            <input
              type="text"
              name="invChr"
              value={formData.invChr}
              onChange={handleChange}
              className="w-1/4 p-2 border rounded"
            />
            <span>/</span>
            <input
              type="text"
              name="invNo"
              value={formData.invNo}
              onChange={handleChange}
              className="w-1/4 p-2 border rounded"
            />
          </div>
        </div>

        {/* Exp No row */}
        <div className="flex items-center space-x-2">
          <label className="font-bold w-1/3">Exp No</label>
          <div className="flex items-center space-x-1 w-2/3 inp-grp">
          <input
            type="text"
            name="expNo"
            value={formData.expNo}
            onChange={handleChange}
            className="w-2/3 p-2 border rounded"
          />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
        Generate Json
        </button>
        <p className="mt-4">{text}</p>
      </form>
    </div>
  );
}

export default ShippingBill;
