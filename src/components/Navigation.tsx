import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";

const navItems = [
  { name: "仪表板", path: "/", icon: Activity },
  { name: "3D态势大屏", path: "/situation", icon: Globe },
  { name: "威胁告警", path: "/alerts", icon: AlertTriangle },
  { name: "安全报告", path: "/reports", icon: FileText },
  { name: "威胁情报", path: "/threat-intelligence", icon: Shield },
  { name: "资产管理", path: "/assets", icon: Server },
  { name: "用��管理", path: "/users", icon: Users },
  { name: "系统日志", path: "/logs", icon: FileText },
  { name: "API密钥", path: "/api-keys", icon: Key },
  { name: "系统设置", path: "/settings", icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center border border-neon-blue/30">
            <User className="w-4 h-4 text-neon-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user || "安全管理员"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              admin@cyberguard.com
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
