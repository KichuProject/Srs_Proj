import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";

// Lazy load components for performance optimization
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Trainers = lazy(() => import("./pages/Trainers"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Reports = lazy(() => import("./pages/Reports"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useApp();

  return (
    <>
      <main>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-screen gap-3">
              <span className="spinner" />
              <p className="text-slate-600 text-sm">Loading application...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <div className="container mx-auto px-4 py-8">
                      <Dashboard />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainers"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <div className="container mx-auto px-4 py-8">
                      <Trainers />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <div className="container mx-auto px-4 py-8">
                      <Sessions />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <div className="container mx-auto px-4 py-8">
                      <Attendance />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <div className="container mx-auto px-4 py-8">
                      <Reports />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />}
            />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter basename="/Srs_Proj">
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
