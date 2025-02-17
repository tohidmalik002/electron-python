import { useState } from "react";
import './DB.css'
function DB() {
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    host: "",
    user: "",
    password: "",
    db_name: "",
    port: "",
  });

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const runPyScript = async () => {
    try {
      const output = await window.electron.saveDBCred({
        credentials: formData,
      });

      console.log(output);
      setText(output);
    } catch (error:any) {
      setText(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <form className="space-y-4">
        <div>
          <label className="block font-medium">Host:</label>
          <input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleChange}
            className="w-auto p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">User:</label>
          <input
            type="text"
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="w-auto p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-auto p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Database Name:</label>
          <input
            type="text"
            name="db_name"
            value={formData.db_name}
            onChange={handleChange}
            className="w-auto p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Port:</label>
          <input
            type="text"
            name="port"
            value={formData.port}
            onChange={handleChange}
            className="w-auto  p-2 border rounded"
          />
        </div>
      </form>
      <br></br>
      <div className="mt-6 flex justify-center">
        <button
          onClick={runPyScript}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Save DB Credentials
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

export default DB;
