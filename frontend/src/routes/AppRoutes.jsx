import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import CandidateProfile from "../pages/Candidates/CandidateProfile";
import ResumeVault from "../pages/ResumeVault/ResumeVault";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Candidates */}
        <Route
          path="/candidates/:id"
          element={
            <ProtectedRoute>
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

        {/* Resume Vault */}
        <Route
          path="/resume-vault"
          element={
            <ProtectedRoute>
              <ResumeVault />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}