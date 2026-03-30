import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp"; 

import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost";
import ViewLostItems from "./pages/ViewLostItems";
import ReportFound from "./pages/ReportFound";
import ViewFoundItems from "./pages/ViewFoundItems";
import SubmitClaim from "./pages/SubmitClaim";
import ClaimStatus from "./pages/ClaimStatus";

import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageLostItems from "./pages/ManageLostItems";
import ManageFoundItems from "./pages/ManageFoundItems";
import ManageClaims from "./pages/ManageClaims";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} /> 

      {/* USER DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* LOST ITEMS */}
      <Route
        path="/report-lost"
        element={
          <ProtectedRoute>
            <ReportLost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lost-items"
        element={
          <ProtectedRoute>
            <ViewLostItems />
          </ProtectedRoute>
        }
      />

      {/* FOUND ITEMS */}
      <Route
        path="/report-found"
        element={
          <ProtectedRoute>
            <ReportFound />
          </ProtectedRoute>
        }
      />

      <Route
        path="/found-items"
        element={
          <ProtectedRoute>
            <ViewFoundItems />
          </ProtectedRoute>
        }
      />

      {/* CLAIMS */}
      <Route
        path="/claim"
        element={
          <ProtectedRoute>
            <SubmitClaim />
          </ProtectedRoute>
        }
      />

      <Route
        path="/claim-status"
        element={
          <ProtectedRoute>
            <ClaimStatus />
          </ProtectedRoute>
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN USERS */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      {/* ADMIN LOST ITEMS */}
      <Route
        path="/admin/lost-items"
        element={
          <ProtectedRoute role="admin">
            <ManageLostItems />
          </ProtectedRoute>
        }
      />

      {/* ADMIN FOUND ITEMS */}
      <Route
        path="/admin/found-items"
        element={
          <ProtectedRoute role="admin">
            <ManageFoundItems />
          </ProtectedRoute>
        }
      />

      {/* ADMIN CLAIMS */}
      <Route
        path="/admin/claims"
        element={
          <ProtectedRoute role="admin">
            <ManageClaims />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;