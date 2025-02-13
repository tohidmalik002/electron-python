import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
       
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Stock Form</Link>
          <Link to="/consumption" className="text-white hover:text-gray-300">Consumption</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
