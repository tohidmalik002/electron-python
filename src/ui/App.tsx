import React from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ShippingBill from "./ShippingBill";
import DB from './DB';
import './App.css'
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<ShippingBill />} />
          <Route path="/db" element={<DB />} />
          <Route path="/shipping_bill" element={<ShippingBill />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
