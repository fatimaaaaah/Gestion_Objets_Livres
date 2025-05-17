import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/authentification/inscription";
import Login from "./components/authentification/connexion";
import Acceuil from "./components/authentification/acceuil";
import Home from "./components/acceuil/home";

const App = () => {
  return (
            <Router>
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/acceuil" element={<Acceuil />} />
                <Route path="/" element={<Acceuil />} />
                <Route path="/home" element={<Home />} />       
              </Routes>
            </Router>
  );
};

export default App;