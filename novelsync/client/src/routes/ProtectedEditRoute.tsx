import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNovel } from "../hooks/useNovel";
import { useParams } from "react-router-dom";

interface ProtectedEditRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedEditRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  if (!id || !user) {
    alert("Invalid novel or user ✌️");
    return <Navigate to="/home" replace />;
  }
  const { novel } = useNovel(id);

  if (novel && novel.authorId !== user.uid) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
