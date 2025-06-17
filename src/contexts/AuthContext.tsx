import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, type User, type LoginCredentials } from "@/services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 应用启动时检查认证状态
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    setLoading(true);
    try {
      if (!apiService.isAuthenticated()) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }

      // 验证token是否有效
      const response = await apiService.getCurrentUser();
      if (response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        setLoading(false);
        return true;
      } else {
        // Token无效，清除认证状态
        apiService.logout();
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const response = await apiService.login(credentials);

      if (response.data && response.data.access_token) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return {
          success: false,
          error: response.error || "登录失败，请检查用户名和密码",
        };
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      return {
        success: false,
        error: "网络错误，请稍后重试",
      };
    }
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
