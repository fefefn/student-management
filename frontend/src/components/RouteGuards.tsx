import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingState } from "./ui/LoadingState";

/** Wraps pages that require a logged-in user. */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingState fullScreen label="Checking your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/** Wraps login/register so logged-in users skip straight to the dashboard. */
export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingState fullScreen label="Loading…" />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
