import React, { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDataSource } from "@/contexts/DataSourceContext";
import {
  Shield,
  Eye,
  EyeOff,
  User,
  Lock,
  AlertTriangle,
  Loader,
  Users,
  Crown,
  Settings,
  BarChart3,
  Bug,
} from "lucide-react";
import { UltraCyberSecurityModel } from "@/components/3d/UltraCyberSecurityModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import { DataSourceToggle } from "@/components/DataSourceToggle";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { authenticateTestUser } from "@/utils/testUserAuth";

// 测试用户数据
const TEST_USERS = [
  {
    username: "admin",
    password: "123456",
    role: "超级管理员",
    icon: Crown,
    description: "系统超级管理员，拥有所有权限",
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/10",
    borderColor: "border-neon-purple/30",
  },
  {
    username: "security",
    password: "security123",
    role: "安全管理员",
    icon: Shield,
    description: "网络安全管理员，负责威胁监控",
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10",
    borderColor: "border-neon-blue/30",
  },
  {
    username: "analyst",
    password: "analyst123",
    role: "数据分析师",
    icon: BarChart3,
    description: "数据分析师，负责态势分析报告",
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
    borderColor: "border-neon-green/30",
  },
  {
    username: "operator",
    password: "operator123",
    role: "系统操作员",
    icon: Settings,
    description: "系统操作员，负责日常运维",
    color: "text-neon-orange",
    bgColor: "bg-neon-orange/10",
    borderColor: "border-neon-orange/30",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isApiMode, isMockMode } = useDataSource();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTestUsers, setShowTestUsers] = useState(false);
  const [showApiDebug, setShowApiDebug] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 检查是否为测试用户
      const testUser = TEST_USERS.find(
        (u) =>
          u.username === formData.username && u.password === formData.password,
      );

      if (testUser) {
        console.log("Test user found:", testUser.username);

        // 设置测试用户认证信息
        const token = authenticateTestUser(testUser.username, testUser.role);

        // 设置API服务的token
        const { authManager } = await import("@/services/api");
        authManager.setToken(token);

        console.log("Test user authenticated, navigating to dashboard");

        // 短暂延迟确保状态更新，然后导航
        setTimeout(() => {
          navigate("/", { replace: true });
          window.location.reload(); // 强制刷新以确保认证状态更新
        }, 200);

        return;
      }

      // 不是测试用户，尝试API登录（仅在API模式下）
      if (isApiMode) {
        console.log("API Mode: Attempting API login for:", formData.username);
        const result = await login({
          username: formData.username,
          password: formData.password,
        });

        if (result.success) {
          console.log("API login successful");
          navigate("/", { replace: true });
          return;
        } else {
          setError(`API登录失败: ${result.error || "用户名或密码错误"}`);
        }
      } else {
        // 模拟模式下，只允许测试用户
        setError("模拟模式下请使用下方测试账号登录。");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("登录过程中发生错误，请使用测试账号或稍后重试。");
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleQuickLogin = (user: any) => {
    setFormData({
      username: user.username,
      password: user.password,
    });
    setError("");
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* 左侧 - 3D模型区域 */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-accent"></div>

        {/* 矩阵雨效果 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-neon-green/20 to-transparent animate-matrix-rain"
              style={{
                left: `${Math.random() * 100}%`,
                height: "120px",
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* 3D场景容器 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ThreeErrorBoundary>
            <Suspense fallback={<SimpleShield />}>
              <div className="w-full h-full">
                <Canvas
                  camera={{ position: [8, 6, 8], fov: 60 }}
                  style={{ background: "transparent" }}
                  dpr={[1, 2]}
                  gl={{ antialias: true, alpha: true }}
                >
                  <Stars
                    radius={100}
                    depth={50}
                    count={3000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.3}
                  />
                  <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    maxDistance={15}
                    minDistance={5}
                    maxPolarAngle={Math.PI / 1.8}
                    minPolarAngle={Math.PI / 6}
                  />
                  <UltraCyberSecurityModel />
                  <fog attach="fog" args={["#0d1117", 8, 25]} />
                </Canvas>
              </div>
            </Suspense>
          </ThreeErrorBoundary>
        </div>

        {/* 左侧装饰元素 */}
        <div className="absolute top-8 left-8 z-10">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-white glow-text mb-2">
              CyberGuard
            </h1>
            <p className="text-lg text-neon-blue font-mono">态势感知监控系统</p>
            <p className="text-sm text-muted-foreground mt-2">
              下一代智能网络安全态势感知平台
            </p>
          </div>
        </div>

        {/* 数据源切换器 - 左上角 */}
        <div className="absolute top-8 right-8 z-10">
          <DataSourceToggle variant="compact" size="sm" />
        </div>
      </div>

      {/* 右侧 - 登录表单区域 */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center relative matrix-bg">
        <div className="w-full max-w-md mx-6 z-10">
          {/* 移动端Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-blue/10 border-2 border-neon-blue/30 mb-4 relative">
              <Shield className="w-8 h-8 text-neon-blue glow-text" />
            </div>
            <h1 className="text-2xl font-bold text-white glow-text mb-1">
              CyberGuard
            </h1>
            <p className="text-sm text-muted-foreground">态势感知监控系统</p>
          </div>

          {/* 登录表单容器 */}
          <div className="cyber-card p-8 relative border-2 border-neon-blue/20">
            {/* 表单标题 */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">
                态势监控系统登录
              </h2>
              <p className="text-sm text-muted-foreground">
                请输入您的凭据以访问态势监控控制台
              </p>
              <div
                className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                  isApiMode
                    ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                    : "bg-neon-green/20 text-neon-green border border-neon-green/30"
                }`}
              >
                当前模式: {isApiMode ? "真实API连接" : "模拟数据演示"}
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-threat-critical/20 border-l-4 border-threat-critical rounded-r-lg flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-threat-critical flex-shrink-0" />
                <span className="text-threat-critical text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 用户名输入 */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-blue" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="请输入用户名"
                    className="w-full pl-12 pr-4 py-4 bg-matrix-surface/50 border-2 border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-200 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-blue" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="请输入密码"
                    className="w-full pl-12 pr-14 py-4 bg-matrix-surface/50 border-2 border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-200 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-neon-blue transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-neon-blue to-neon-green hover:shadow-lg hover:shadow-neon-blue/25"
              >
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className="text-white">验证中...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span className="text-white font-semibold">��录系统</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* 数据源切换器 */}
            <div className="mt-8 pt-6 border-t border-matrix-border">
              <DataSourceToggle />
            </div>

            {/* 测试用户信息 */}
            <div className="mt-6 pt-6 border-t border-matrix-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">测试账号</span>
                <button
                  onClick={() => setShowTestUsers(!showTestUsers)}
                  className="flex items-center space-x-2 text-xs text-neon-blue hover:text-neon-green transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>{showTestUsers ? "隐藏" : "显示"}测试用户</span>
                </button>
              </div>

              {showTestUsers && (
                <div className="space-y-3">
                  {TEST_USERS.map((user, index) => (
                    <div
                      key={index}
                      onClick={() => handleQuickLogin(user)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg ${user.bgColor} ${user.borderColor} hover:border-opacity-60`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full ${user.bgColor} border ${user.borderColor} flex items-center justify-center`}
                        >
                          <user.icon className={`w-4 h-4 ${user.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-white">
                              {user.username}
                            </span>
                            <span className={`text-xs ${user.color} font-mono`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-tight">
                            {user.description}
                          </p>
                        </div>
                        <div className="text-xs font-mono text-muted-foreground">
                          点击填充
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showTestUsers && (
                <div className="bg-matrix-accent/30 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground space-y-2">
                    <div className="flex items-center justify-between">
                      <span>演示账号:</span>
                      <code className="text-neon-blue font-mono bg-matrix-surface px-2 py-1 rounded">
                        admin
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>演示密码:</span>
                      <code className="text-neon-blue font-mono bg-matrix-surface px-2 py-1 rounded">
                        123456
                      </code>
                    </div>
                    <div className="text-center mt-3 pt-3 border-t border-matrix-border">
                      <span className="text-neon-green">
                        共有 {TEST_USERS.length} 个测试账号可用
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* API调试区域 */}
            <div className="mt-6 pt-4 border-t border-matrix-border">
              <button
                onClick={() => setShowApiDebug(!showApiDebug)}
                className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-neon-blue transition-colors mx-auto"
              >
                <Bug className="w-4 h-4" />
                <span>{showApiDebug ? "隐藏" : "显示"}API调试工具</span>
              </button>

              {showApiDebug && (
                <div className="mt-4">
                  <Suspense
                    fallback={
                      <div className="text-center p-4">加载调试工具...</div>
                    }
                  >
                    {(() => {
                      const ApiDebugger = React.lazy(
                        () => import("@/components/ApiDebugger"),
                      );
                      return <ApiDebugger />;
                    })()}
                  </Suspense>
                </div>
              )}
            </div>

            {/* 版权信息 */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                © 2024 CyberGuard Security Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
