import React from "react";
import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime; 
  } catch (err) {
    console.error("Erro ao verificar expiração do token:", err);
    return true; 
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");


  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
