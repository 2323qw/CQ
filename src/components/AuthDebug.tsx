import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export function AuthDebug() {
  const { isAuthenticated, user, loading } = useAuth();

  // 只在开发环境显示
  if (import.meta.env.MODE !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-bold">Auth Debug:</div>
      <div>Loading: {loading ? "true" : "false"}</div>
      <div>Authenticated: {isAuthenticated ? "true" : "false"}</div>
      <div>User: {user ? user.username : "null"}</div>
      <div>
        Token: {localStorage.getItem("access_token") ? "exists" : "none"}
      </div>
    </div>
  );
}

export default AuthDebug;
