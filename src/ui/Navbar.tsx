import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-end  items-center">
        <div className="space-x-4">
          <Link to="/shipping_bill" className="text-white hover:text-gray-300">Shipping Bill</Link>
          <Link to="/db" className="text-white hover:text-gray-300">Database Credentials</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
