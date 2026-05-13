import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import Clock from "./pages/Clock/Clock";
import Imprint from "./pages/Imprint/Imprint";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
        <main style={{ padding: "2em", backgroundColor: "var(--color-accent)" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/clock" replace />} />
            <Route path="/imprint" element={<Imprint />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            

            <Route path="/clock" element={<Clock />} />
          </Routes>
        </main>

        <Footer />
    </BrowserRouter>
  );
}
