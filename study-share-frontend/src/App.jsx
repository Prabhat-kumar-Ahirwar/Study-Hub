import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/common/Navbar";
import RouteGuard from "./components/common/RouteGuard";

// User pages
import Home from "./pages/user/Home";
import StudyMaterials from "./pages/user/StudyMaterials";
import Upload from "./pages/user/Upload";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin pages
import AdminDashboard from "./pages/auth/admin/AdminDashboard";
import PendingApprovals from "./pages/auth/admin/PendingApprovals";
import ManageMaterials from "./pages/auth/admin/ManageMaterials";
import UserInfo from "./pages/auth/admin/UserInfo"; // ✅ New admin page for user details 

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoadingUser(false);
  }, []);

  return (
    <>
      {/* ✅ Always render Toaster at top-level so it works everywhere */}
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          duration: 1500,
        }}
      />

      {/* Prevent rendering routes until user is loaded */}
      {!loadingUser && (
        <>
          <Navbar user={user} setUser={setUser} />

          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home user={user} />} />

            <Route
              path="/login"
              element={
                user ? <Navigate to="/materials" replace /> : <Login setUser={setUser} />
              }
            />

            <Route
              path="/register"
              element={user ? <Navigate to="/materials" replace /> : <Register />}
            />

            {/* ================= USER ================= */}
            <Route
              path="/materials"
              element={
                <RouteGuard user={user}>
                  <StudyMaterials />
                </RouteGuard>
              }
            />

           <Route
              path="/upload"
              element={
                <RouteGuard user={user} allowedRoles={["USER", "ADMIN"]}>
                  <Upload />
                </RouteGuard>
              }
            />
  

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin"
              element={
                <RouteGuard user={user} allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </RouteGuard>
              }
            />
            <Route
              path="/admin/pending"
              element={
                <RouteGuard user={user} allowedRoles={["ADMIN"]}>
                  <PendingApprovals />
                </RouteGuard>
              }
            />
            <Route
              path="/admin/manage"
              element={
                <RouteGuard user={user} allowedRoles={["ADMIN"]}>
                  <ManageMaterials />
                </RouteGuard>
              }
            />

            <Route
  path="/admin/users"   // ✅ Add this route
  element={
    <RouteGuard user={user} allowedRoles={["ADMIN"]}>
      <UserInfo />
    </RouteGuard>
  }
/>

            {/* ================= FALLBACK ================= */}
            <Route
              path="*"
              element={<Navigate to={user ? "/materials" : "/login"} replace />}
            />
          </Routes>
        </>
      )}
    </>
  );
}
