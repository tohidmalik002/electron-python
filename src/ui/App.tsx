import React from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import StockForm from "./StockForm";
import Consumption from "./Consumption";
import DB from './DB';
import './App.css'
import ConsumptionReport from "./ConsumptionReport";
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<StockForm />} />
          <Route path="/consumption" element={<Consumption />} />
          <Route path="/db" element={<DB />} />
          <Route path="/consumption_report" element={<ConsumptionReport />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
