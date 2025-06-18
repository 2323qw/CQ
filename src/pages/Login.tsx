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
  Server,
  Cloud,
  Bug,
} from "lucide-react";
import { UltraCyberSecurityModel } from "@/components/3d/UltraCyberSecurityModel";
import { BasicCyberSecurityModel } from "@/components/3d/BasicCyberSecurityModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import { DataSourceToggle } from "@/components/DataSourceToggle";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

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
    role: "安全���理员",
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
      // 根据数据源模式决定登录策略
      if (isApiMode) {
        // API模式：首先尝试真实API登录
        console.log("API Mode: Attempting API login for:", formData.username);
        const result = await login({
          username: formData.username,
          password: formData.password,
        });

        if (result.success) {
          // API登录成功，跳转到主页面
          console.log("API login successful");
          navigate("/", { replace: true });
          return;
        }

        // API登录失败但不是测试用户的情况
        console.log("API login failed:", result.error);
        const isTestUser = TEST_USERS.find(
          (u) =>
            u.username === formData.username &&
            u.password === formData.password,
        );

        if (!isTestUser) {
          setError(`API登录失败: ${result.error || "用户名或密码错误"}`);
          setLoading(false);
          return;
        }
      }

      // 检查是否为测试用户（模拟模式或API模式下的fallback）
      const testUser = TEST_USERS.find(
        (u) =>
          u.username === formData.username && u.password === formData.password,
      );

      if (testUser) {
        const modeInfo = isMockMode ? "Mock Mode" : "API Mode fallback";
        console.log(`${modeInfo}: Using test user:`, testUser.username);
        // 测试用户直接登录，不需要API调用
        console.log("Falling back to test user:", testUser.username);

        // 创建模拟的API响应
        const mockUser = {
          id: Math.floor(Math.random() * 1000),
          username: testUser.username,
          is_active: true,
          is_superuser: testUser.role === "超级管理员",
          created_at: new Date().toISOString(),
        };

        // 模拟token
        const mockToken = `test_token_${testUser.username}_${Date.now()}`;
        localStorage.setItem("access_token", mockToken);

        // 存储用户角色信息
        localStorage.setItem("cyberguard_user_role", testUser.role);
        localStorage.setItem("cyberguard_user_color", testUser.color);

        // 直接设置认证状态
        const authManager = (await import("@/services/api")).authManager;
        authManager.setToken(mockToken);

        // 通过AuthContext设置用户状态
        navigate("/", { replace: true });
        return;
      }

      // 既不是有效的API用户，也不是测试用户
      if (isMockMode) {
        setError("模拟模式下请使用下方测试账号登录。");
      } else {
        setError(
          `API登录失败: 用户名或密码错误。您也可以切换到模拟数据模式进行演示。`,
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      // 网络错误时也检查是否为测试用户
      const testUser = TEST_USERS.find(
        (u) =>
          u.username === formData.username && u.password === formData.password,
      );

      if (testUser) {
        console.log("Network error, using test user:", testUser.username);
        // 使用测试用户登录逻辑（同上）
        const mockToken = `test_token_${testUser.username}_${Date.now()}`;
        localStorage.setItem("access_token", mockToken);
        localStorage.setItem("cyberguard_user_role", testUser.role);
        localStorage.setItem("cyberguard_user_color", testUser.color);

        const authManager = (await import("@/services/api")).authManager;
        authManager.setToken(mockToken);

        navigate("/", { replace: true });
        return;
      }

      // 网络错误且不是测试用户
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        setError(
          "无法连接到API服务器。网络连接问题或CORS配置问题。请使用下方测试账号进行演示。",
        );
      } else {
        setError("登录过程中发生错误，请使用测试账号或稍后重试。");
      }
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
        {/* 3D背景渐变 */}
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
            <Suspense
              fallback={
                <div className="flex flex-col items-center space-y-6">
                  <SimpleShield />
                  <div className="text-center">
                    <Loader className="w-8 h-8 text-neon-blue animate-spin mx-auto mb-2" />
                    <p className="text-neon-blue font-mono text-sm">
                      加载态势感知监控系统...
                    </p>
                  </div>
                </div>
              }
            >
              <div className="w-full h-full">
                <Canvas
                  camera={{ position: [8, 6, 8], fov: 60 }}
                  style={{ background: "transparent" }}
                  dpr={[1, 2]}
                  gl={{ antialias: true, alpha: true }}
                >
                  {/* 星空背景 */}
                  <Stars
                    radius={100}
                    depth={50}
                    count={3000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.3}
                  />

                  {/* 相机控制 */}
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

                  {/* 超级丰富网络安全模型 */}
                  <UltraCyberSecurityModel />

                  {/* 雾效 */}
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

        {/* 系统状态指示器 */}
        <div className="absolute bottom-8 left-8 z-10">
          <div className="cyber-card p-4 bg-matrix-surface/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-neon-green font-mono">监控系统在线</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-neon-blue font-mono">态势感知激活</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>监控等级: </span>
              <span className="text-threat-critical font-mono">ENTERPRISE</span>
            </div>
          </div>
        </div>

        {/* 扫描线效果 */}
        <div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent animate-scan-line"
          style={{ animationDuration: "12s" }}
        />
      </div>

      {/* 右侧 - 登录表单区域 */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center relative matrix-bg">
        {/* 移动端背景效果 */}
        <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-neon-green/30 to-transparent animate-matrix-rain"
              style={{
                left: `${Math.random() * 100}%`,
                height: "100px",
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md mx-6 z-10">
          {/* 移动端Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-blue/10 border-2 border-neon-blue/30 mb-4 relative">
              <Shield className="w-8 h-8 text-neon-blue glow-text" />
              <div className="absolute inset-0 animate-pulse-glow">
                <Shield className="w-8 h-8 text-neon-blue opacity-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
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
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-neon-blue/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
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
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-neon-blue/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-neon-blue to-neon-green hover:shadow-lg hover:shadow-neon-blue/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-green/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className="text-white">验证中...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span className="text-white font-semibold">登录系统</span>
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

              {/* 传统演示信息 */}
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

            {/* 表单装饰效果 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent animate-scan-line" />
              <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-neon-green/30 to-transparent" />
            </div>
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
  );
}
