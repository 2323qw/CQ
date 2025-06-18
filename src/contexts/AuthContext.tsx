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
  // 动态获取数据源状态而不是通过hook（避免循环依赖）
  const getDataSourceMode = () => {
    const saved = localStorage.getItem("cyberguard_data_source");
    return (saved as "api" | "mock") || "mock";
  };
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

      const token = localStorage.getItem("access_token");

      // 检查是否为测试用户token
      if (token && token.startsWith("test_token_")) {
        console.log("Found test user token, creating mock user");

        // 从localStorage获取用户角色信息
        const userRole =
          localStorage.getItem("cyberguard_user_role") || "测试用户";
        const username = token.split("_")[2] || "test"; // 从token中提取用户名

        // 创建模拟用户对象
        const mockUser: User = {
          id: Math.floor(Math.random() * 1000),
          username: username,
          is_active: true,
          is_superuser: userRole === "超级管理员",
          created_at: new Date().toISOString(),
        };

        setIsAuthenticated(true);
        setUser(mockUser);
        setLoading(false);
        return true;
      }

      // 真实token，验证是否有效
      const response = await apiService.getCurrentUser();
      if (response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        setLoading(false);
        return true;
      } else {
        // Token无效，清除认证状态
        console.log("API token validation failed:", response.error);
        apiService.logout();
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);

      // 如果是测试用户token，即使API调用失败也要保持认证状态
      const token = localStorage.getItem("access_token");
      if (token && token.startsWith("test_token_")) {
        console.log(
          "API check failed but test token found, maintaining auth state",
        );
        const username = token.split("_")[2] || "test";
        const userRole =
          localStorage.getItem("cyberguard_user_role") || "测试用户";

        const mockUser: User = {
          id: Math.floor(Math.random() * 1000),
          username: username,
          is_active: true,
          is_superuser: userRole === "超级管理员",
          created_at: new Date().toISOString(),
        };

        setIsAuthenticated(true);
        setUser(mockUser);
        setLoading(false);
        return true;
      }

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
      const dataSourceMode = getDataSourceMode();

      if (dataSourceMode === "mock") {
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
