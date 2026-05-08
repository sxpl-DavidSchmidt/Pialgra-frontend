import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import Clock from "./pages/Clock/Clock";
import Imprint from "./pages/Imprint/Imprint";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/clock" replace />} />
          <Route path="/clock" element={<Clock />} />
          <Route path="/imprint" element={<Imprint />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
