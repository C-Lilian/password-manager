import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, loading } = useAuth();
  
  // Affiche un écran de chargement pendant que l'état d'authentification est vérifié
  // Permet de garder sa session active même après un rafraîchissement de la page.
  if (loading) return <div>Loading...</div>;
  
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};
