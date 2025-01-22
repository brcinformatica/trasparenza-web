import React from 'react';
import { Routes, Route } from "react-router-dom";

import 'bootstrap-italia/dist/css/bootstrap-italia.min.css';
import 'typeface-titillium-web';
import 'typeface-roboto-mono';
import 'typeface-lora';

import Errore from "./pages/Errore";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Sezione from "./pages/Sezione";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Errore />} />
      <Route path="/:codCli" element={<Layout />}>
        <Route path="/:codCli/" element={<Home />} />
        <Route path="/:codCli/sezione/:id" element={<Sezione />} />
      </Route>
    </Routes>
  );
}

export default App;
