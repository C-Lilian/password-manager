import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from  "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Redirige tout vers /dashboard par défaut */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
