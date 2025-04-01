import { useState, useEffect } from "react";
import "./DB.css";

function DB() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [error, setError] = useState(""); // Error message state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [text, setText] = useState("");

  const [formData, setFormData] = useState({
    host: "",
    user: "",
    password: "",
    db_name: "",
    port: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveDBCred = async () => {
    try {
      const output = await window.electron.saveDBCred({
        credentials: formData,
      });

      console.log(output);
      setText(output);
    } catch (error: any) {
      setText(`Error: ${error.message}`);
    }
  };

  const handleLogin = () => {
    if (enteredPassword === "secure123") { 
      setError("");
      setIsAuthenticated(true);
    } else {
      setError("Incorrect password. Try again."); 
    }
  };

  // Fetch DB credentials after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      const fetchDBCreds = async () => {
        try {
          const creds = await window.electron.getDBCreds();
          console.log(creds)
          if(creds.dbCredentials){
            setFormData(creds.dbCredentials);
          }
        } catch (error: any) {
          setText(`Error fetching credentials: ${error.message}`);
        }
      };

      fetchDBCreds();
    }
  }, [isAuthenticated]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {!isAuthenticated ? (
        // Show Password Prompt First
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Enter Password</h2>
          <input
            type="password"
            value={enteredPassword}
            onChange={(e) => {
              setEnteredPassword(e.target.value);
            }}
            className="p-2 border rounded w-1/2"
          />
          <br />
          {error && <p className="text-red-500 mt-2">{error}</p>} {/* Error message */ }
          <button
            onClick={handleLogin}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Unlock
          </button>
        </div>
      ) : (
        // Show Form After Authentication
        <>
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
                className="w-auto p-2 border rounded"
              />
            </div>
          </form>
          <br />
          <div className="mt-6 flex justify-center">
            <button
              onClick={saveDBCred}
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
        </>
      )}
    </div>
  );
}

export default DB;
