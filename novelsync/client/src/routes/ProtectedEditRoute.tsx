import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import NovelsContext from "../contexts/NovelsContext";

interface ProtectedEditRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedEditRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { selectedNovel, fetchNovelById } = novelsContext;

  // if (!id || !user) {
  //   alert("Invalid novel or user ✌️");
  //   return <Navigate to="/home" replace />;
  // }
  useEffect(() => {
    if (id) {
      fetchNovelById(id);
    }
  }, []);

  if (selectedNovel && selectedNovel.authorId !== user?.uid) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
