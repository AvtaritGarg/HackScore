import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const judgeId = useSelector((state) => state.judge.judgeId);

  if (!judgeId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
