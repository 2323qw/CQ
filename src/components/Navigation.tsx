import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  Shield,
  AlertTriangle,
  FileText,
  Activity,
  Settings,
  User,
  Bell,
  LogOut,
  Users,
  Server,
  Key,
  Monitor,
  Globe,
  Crown,
  BarChart3,
} from "lucide-react";

const navItems = [
  { name: "仪表板", path: "/", icon: Activity },
  { name: "3D态势大屏", path: "/situation", icon: Globe },
  { name: "系统监控", path: "/system-monitor", icon: Monitor },
  { name: "威胁告警", path: "/alerts", icon: AlertTriangle },
  { name: "安全报告", path: "/reports", icon: FileText },
  { name: "威胁情报", path: "/threat-intelligence", icon: Shield },
  { name: "资产管理", path: "/assets", icon: Server },
  { name: "用户管理", path: "/users", icon: Users },
  { name: "系统日志", path: "/logs", icon: FileText },
  { name: "API密钥", path: "/api-keys", icon: Key },
  { name: "系统设置", path: "/settings", icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [userColor, setUserColor] = useState("");

  useEffect(() => {
    // 获取用户角色和颜色信息
    const role = localStorage.getItem("cyberguard_user_role") || "用户";
    const color =
      localStorage.getItem("cyberguard_user_color") || "text-neon-blue";
    setUserRole(role);
    setUserColor(color);
  }, [user]);

  // 根据角色获取图标
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "超级管理员":
        return Crown;
      case "安全管理员":
        return Shield;
      case "数据分析师":
        return BarChart3;
      case "系统操作员":
        return Settings;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon(userRole);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="cyber-card w-64 h-screen fixed left-0 top-0 z-50 flex flex-col matrix-bg">
      {/* Logo */}
      <div className="p-6 border-b border-matrix-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-neon-blue glow-text" />
            <div className="absolute inset-0 animate-pulse-glow">
              <Shield className="w-8 h-8 text-neon-blue opacity-50" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white glow-text">
              CyberGuard
            </h1>
            <p className="text-xs text-muted-foreground">态势感知监控系统</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden group",
                isActive
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 glow-border"
                  : "text-muted-foreground hover:text-white hover:bg-matrix-accent",
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "glow-text")} />
              <span className="font-medium">{item.name}</span>

              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent animate-scan-line" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Status Indicator */}
      <div className="p-4 border-t border-matrix-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span className="text-neon-green">系统在线</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-threat-medium" />
            <span className="text-threat-medium">3</span>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-matrix-border">
        <div className="flex items-center space-x-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border relative"
            style={{
              backgroundColor: userColor.includes("purple")
                ? "rgba(191, 0, 255, 0.1)"
                : userColor.includes("blue")
                  ? "rgba(0, 245, 255, 0.1)"
                  : userColor.includes("green")
                    ? "rgba(57, 255, 20, 0.1)"
                    : userColor.includes("orange")
                      ? "rgba(255, 102, 0, 0.1)"
                      : "rgba(0, 245, 255, 0.1)",
              borderColor: userColor.includes("purple")
                ? "rgba(191, 0, 255, 0.3)"
                : userColor.includes("blue")
                  ? "rgba(0, 245, 255, 0.3)"
                  : userColor.includes("green")
                    ? "rgba(57, 255, 20, 0.3)"
                    : userColor.includes("orange")
                      ? "rgba(255, 102, 0, 0.3)"
                      : "rgba(0, 245, 255, 0.3)",
            }}
          >
            <RoleIcon className={`w-5 h-5 ${userColor}`} />
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                boxShadow: userColor.includes("purple")
                  ? "0 0 10px rgba(191, 0, 255, 0.3)"
                  : userColor.includes("blue")
                    ? "0 0 10px rgba(0, 245, 255, 0.3)"
                    : userColor.includes("green")
                      ? "0 0 10px rgba(57, 255, 20, 0.3)"
                      : userColor.includes("orange")
                        ? "0 0 10px rgba(255, 102, 0, 0.3)"
                        : "0 0 10px rgba(0, 245, 255, 0.3)",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.username || "访客用户"}
            </p>
            <p className={`text-xs font-medium truncate ${userColor}`}>
              {userRole}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.username || "guest"}@cyberguard.com
            </p>
          </div>
        </div>

        {/* 登出按钮 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-threat-critical hover:bg-threat-critical/10 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>退出登录</span>
        </button>
      </div>
    </nav>
  );
}
