import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axiosInstance";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/user/me"); // protected API
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ While checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // 🔒 Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated
  return children;
};

export default ProtectedRoute;
