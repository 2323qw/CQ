import React, { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Eye,
  EyeOff,
  User,
  Lock,
  AlertTriangle,
  Loader,
  Crown,
} from "lucide-react";
import { UltraCyberSecurityModel } from "@/components/3d/UltraCyberSecurityModel";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { SimpleShield } from "@/components/3d/SimpleShield";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { authenticateTestUser } from "@/utils/testUserAuth";

// 测试用户数据
const TEST_USER = {
  username: "admin",
  password: "123456",
  role: "超级管理员",
  icon: Crown,
  description: "系统超级管理员，拥有所有权限",
  color: "text-neon-purple",
  bgColor: "bg-neon-purple/10",
  borderColor: "border-neon-purple/30",
};

export default function Login() {
  const navigate = useNavigate();
  const { login, refreshAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 检查是否为admin测试用户
      if (
        formData.username === TEST_USER.username &&
        formData.password === TEST_USER.password
      ) {
        console.log("Admin test user found");

        // 设置测试用户认证信息
        const token = authenticateTestUser(TEST_USER.username, TEST_USER.role);

        // 设置API服务的token
        const { authManager } = await import("@/services/api");
        authManager.setToken(token);

        // 手动刷新AuthContext状态
        console.log("Test user authenticated, refreshing auth state");
        await refreshAuth();

        console.log("Auth state refreshed, navigating to dashboard");
        setLoading(false);
        navigate("/", { replace: true });
        return;
      }

      // 尝试API登录
      console.log("Attempting API login for:", formData.username);
      const result = await login({
        username: formData.username,
        password: formData.password,
      });

      if (result.success) {
        console.log("API login successful");
        navigate("/", { replace: true });
        return;
      } else {
        setError(`登录失败: ${result.error || "用户名或密码错误"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("登录过程中发生错误，请稍后重试。");
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
                      <span className="text-white font-semibold">登录系统</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* 测试用户信息 */}
            <div className="mt-6 pt-6 border-t border-matrix-border">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-white">测试账号</span>
              </div>

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
                </div>
              </div>
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
