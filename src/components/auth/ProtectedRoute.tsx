import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  // Redirect to onboarding when not authenticated (session expired or not logged in)
  if (!isAuthenticated) {
    return <Navigate to="/onboarding/1" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
