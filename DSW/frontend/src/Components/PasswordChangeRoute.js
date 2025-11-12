import { Navigate } from "react-router-dom";

const PasswordChangeRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo?.precisa_trocar_senha) {
    return children;
  }

  return <Navigate to="/laboratorio" replace />;
};

export default PasswordChangeRoute;
