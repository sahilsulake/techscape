// src/components/common/ProtectedRoute.jsx
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  // ❌ no firebase auth
  // ❌ no profile check

  // If user not logged in → go to sign-in
  if (!user) return <Navigate to="/sign-in" />;

  // If logged in → allow dashboard pages
  return <Outlet />;
}
