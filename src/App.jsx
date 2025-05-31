import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./Layouts/MainLayout";
import PublicLayout from "./Layouts/PublicLayout";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import AccessManagement from "./pages/AccessManagement";
// import Credentials from "./components/Credentials/Credentials";
import Credentials from "./pages/Credentials";
import ApprovalsRequests from "./pages/ApprovalsRequests";
import MyRequests from "./pages/MyRequests";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PublicLayout>
                <Login />
              </PublicLayout>
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PublicLayout>
                <SignUp />
              </PublicLayout>
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Dashboard />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Profile />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Users />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/credentials"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Credentials />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/access-management"
          element={
            isAuthenticated ? (
              <MainLayout>
                <AccessManagement />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/approvals-requests"
          element={
            isAuthenticated ? (
              <MainLayout>
                <ApprovalsRequests />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/my-requests"
          element={
            isAuthenticated ? (
              <MainLayout>
                <MyRequests />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
