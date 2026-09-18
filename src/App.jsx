import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";

import Navbar from "./components/Navbar/Navbar";

import Clock from "./pages/Clock/Clock";
import Imprint from "./pages/Imprint/Imprint";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import Statistics from "./pages/Statistics/Statistics";

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
          <Route path="/clock" element={<ProtectedRoute><Clock /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
          <Route path="*" element={<section><h1>Page not found</h1><Link to="/clock">Return to your clock</Link></section>} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
