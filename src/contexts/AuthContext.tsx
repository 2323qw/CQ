import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, type User, type LoginCredentials } from "@/services/api";
import { useDataSource } from "@/contexts/DataSourceContext";

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
  const { isMockMode, isApiMode } = useDataSource();
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
      if (isMockMode) {
        // 模拟模式：不尝试API调用，直接返回失败让上层处理测试用户逻辑
        console.log("Mock mode: Skipping API login attempt");
        setLoading(false);
        return {
          success: false,
          error: "模拟模式：请使用测试账号",
        };
      }

      // API模式：检查是否已有token（测试用户情况）
      const existingToken = localStorage.getItem("access_token");
      if (existingToken && existingToken.startsWith("test_token_")) {
        // 测试用户已经设置了token，创建模拟用户对象
        const mockUser: User = {
          id: Math.floor(Math.random() * 1000),
          username: credentials.username,
          is_active: true,
          is_superuser: credentials.username === "admin",
          created_at: new Date().toISOString(),
        };

        setIsAuthenticated(true);
        setUser(mockUser);
        setLoading(false);
        return { success: true };
      }

      // 尝试真实API登录
      console.log("API mode: Attempting real API login");
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
          error: response.error || "API登录失败，请检查用户名和密码",
        };
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);

      // 更详细的错误处理
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          return {
            success: false,
            error: "无法连接到API服务器，请检查网络连接",
          };
        } else {
          return {
            success: false,
            error: `网络错误: ${error.message}`,
          };
        }
      }

      return {
        success: false,
        error: "登录过程中发生未知错误",
      };
    }
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout, checkAuth }}
    >
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
