import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading indicator
  }

  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
