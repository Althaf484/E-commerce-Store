import React from "react"
import { Routes, Route } from "react-router-dom";
import {Toaster} from "react-hot-toast"

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">

      <div className="relative z-50 pt-20">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}
export default App;
