import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<h1 className="p-10 text-2xl">Login page (coming soon)</h1>} />
        <Route path="/register" element={<h1 className="p-10 text-2xl">Register page (coming soon)</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;