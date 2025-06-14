import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, User, Lock, AlertTriangle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
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

    // 模拟登录验证
    setTimeout(() => {
      if (formData.username === "admin" && formData.password === "123456") {
        // 保存登录状态
        localStorage.setItem("cyberguard_auth", "true");
        localStorage.setItem("cyberguard_user", formData.username);
        navigate("/");
      } else {
        setError("用户名或密码错误");
      }
      setLoading(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <div className="min-h-screen matrix-bg flex items-center justify-center relative overflow-hidden">
      {/* 背景动画效果 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 矩阵雨效果 */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-neon-green/20 to-transparent animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: "150px",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* 扫描线 */}
        <div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent animate-scan-line"
          style={{ animationDuration: "10s" }}
        />
      </div>

      {/* 登录容器 */}
      <div className="w-full max-w-md mx-4">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-blue/10 border-2 border-neon-blue/30 mb-4 relative">
            <Shield className="w-10 h-10 text-neon-blue glow-text" />
            <div className="absolute inset-0 animate-pulse-glow">
              <Shield className="w-10 h-10 text-neon-blue opacity-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white glow-text mb-2">
            CyberGuard
          </h1>
          <p className="text-sm text-muted-foreground">
            网络安全监控系统 - 管理员登录
          </p>
        </div>

        {/* 登录表单 */}
        <div className="cyber-card p-8 relative">
          {/* 表单标题 */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">系统登录</h2>
            <p className="text-sm text-muted-foreground">
              请输入您的凭据以访问控制台
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-threat-critical/20 border border-threat-critical/30 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-threat-critical" />
              <span className="text-threat-critical text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名输入 */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="请输入用户名"
                  className="w-full pl-10 pr-4 py-3 bg-matrix-surface border border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-12 py-3 bg-matrix-surface border border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-neon-blue transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                loading
                  ? "bg-matrix-surface border border-matrix-border text-muted-foreground cursor-not-allowed"
                  : "neon-button bg-neon-blue/10 border-2 border-neon-blue text-neon-blue hover:bg-neon-blue/20"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
                  <span>验证中...</span>
                </div>
              ) : (
                "登录系统"
              )}
            </button>
          </form>

          {/* 提示信息 */}
          <div className="mt-6 pt-6 border-t border-matrix-border">
            <div className="bg-matrix-accent/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>演示账号:</span>
                  <span className="text-neon-blue font-mono">admin</span>
                </div>
                <div className="flex justify-between">
                  <span>演示密码:</span>
                  <span className="text-neon-blue font-mono">123456</span>
                </div>
              </div>
            </div>
          </div>

          {/* 扫描线效果 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent animate-scan-line" />
          </div>
        </div>

        {/* 系统状态 */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span>系统在线 | 安全连接</span>
          </div>
        </div>
      </div>
    </div>
  );
}
