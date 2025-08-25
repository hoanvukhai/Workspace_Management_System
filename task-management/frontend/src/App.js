import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WorkspaceDetailPage from "./pages/WorkspaceDetailPage";
import ProfilePage from "./pages/ProfilePage";
import Modal from "./components/Modal";
import VerifyEmailPage from "./pages/VerifyEmailPage"; // Đã cung cấp dưới đây
import ResetPasswordPage from "./pages/ResetPasswordPage"; // Thêm mới
import LoadingSpinner from "./components/LoadingSpinner";
import AdminUsersPage from "./pages/AdminUsersPage";

function AppContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const inactivityTimeout = 1 * 60 * 60 * 1000; // 15 phút không hoạt động
  let inactivityTimer;

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, inactivityTimeout);
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Theo dõi hoạt động người dùng
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    resetTimer();

    // Kiểm tra token hết hạn
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Chuyển từ giây sang mili giây
      if (Date.now() > expiry) {
        handleLogout();
      }
    }

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000); // Delay để hiển thị loading
  };

  const token = localStorage.getItem("token");
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role || "user" : "user";

  return (
    <div className="flex flex-col min-h-screen">
        <Header onLogout={handleLogout} setLoading={setLoading} />
        <main className="flex-grow">
          {loading && <LoadingSpinner />}
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Home />} />
            <Route
              path="/workspaces/:workspaceId"
              element={
                <PrivateRoute>
                  <WorkspaceDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {token && userRole === "admin" && (
        <Route path="/admin/users" element={<AdminUsersPage />} />
      )}
          </Routes>
        </main>
        <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;