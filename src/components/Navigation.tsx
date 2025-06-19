import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useDataSource } from "@/contexts/DataSourceContext";
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
  Search,
  ChevronDown,
  ChevronRight,
  Database,
  TrendingUp,
  Zap,
  Eye,
  Home,
  Briefcase,
  Cog,
  X,
} from "lucide-react";

// 菜单项类型定义
interface MenuItem {
  name: string;
  path?: string;
  icon: any;
  badge?: string;
  children?: MenuItem[];
  roles?: string[];
}

// 分组菜单结构
const menuGroups: {
  title: string;
  icon: any;
  items: MenuItem[];
}[] = [
  {
    title: "核心监控",
    icon: Eye,
    items: [
      { name: "仪表板", path: "/", icon: Home },
      { name: "3D态势大屏", path: "/situation", icon: Globe },
      { name: "系统监控", path: "/system-monitor", icon: Monitor },
    ],
  },
  {
    title: "威胁管理",
    icon: Shield,
    items: [
      { name: "威胁告警", path: "/alerts", icon: AlertTriangle, badge: "3" },
      { name: "证据收集", path: "/evidence-collection", icon: Search },
      { name: "威胁情报", path: "/threat-intelligence", icon: Database },
    ],
  },
  {
    title: "业务管理",
    icon: Briefcase,
    items: [
      { name: "资产管理", path: "/assets", icon: Server },
      {
        name: "用户管理",
        path: "/users",
        icon: Users,
        roles: ["超级管���员", "安全管理员"],
      },
      { name: "安全报告", path: "/reports", icon: FileText },
    ],
  },
  {
    title: "系统配置",
    icon: Cog,
    items: [
      { name: "系统日志", path: "/logs", icon: Activity },
      { name: "API密钥", path: "/api-keys", icon: Key, roles: ["超级管理员"] },
      { name: "系统设置", path: "/settings", icon: Settings },
    ],
  },
];

interface NavigationProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Navigation({ isMobileOpen = false, onMobileClose }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isApiMode } = useDataSource();
  const [userRole, setUserRole] = useState("");
  const [userColor, setUserColor] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "核心监控",
    "威胁管理",
  ]);
  const [lastActiveTime, setLastActiveTime] = useState(new Date());

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

  // 切换分组展开状态
  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle)
        ? prev.filter((title) => title !== groupTitle)
        : [...prev, groupTitle],
    );
  };

  // 检查用户是否有权限访问菜单项
  const hasPermission = (item: MenuItem) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(userRole);
  };

  // 检查路径是否匹配当前页面
  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // 检查分组是否包含当前活跃路径
  const isGroupActive = (items: MenuItem[]) => {
    return items.some((item) => item.path && isActivePath(item.path));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMobileNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // 更新最后活跃时间
  useEffect(() => {
    const interval = setInterval(() => {
      setLastActiveTime(new Date());
    }, 60000); // 每分钟更新一次

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 移动端遮罩层 */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* 导航侧边栏 */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-matrix-bg via-matrix-surface to-matrix-bg border-r border-matrix-border z-40 cyber-card-enhanced transition-transform duration-300",
        // 移动端变换效果
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>{
      {/* 顶部 Logo 区域 */}
      <div className="p-6 border-b border-matrix-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center glow-border">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white neon-text">
                CyberGuard
              </h1>
              <p className="text-xs text-muted-foreground">网络安全监控系统</p>
            </div>
          </div>
          {/* 移动端关闭按钮 */}
          <button
            onClick={onMobileClose}
            className="md:hidden p-2 text-muted-foreground hover:text-white transition-colors"
            aria-label="关闭导航菜单"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 快捷状态栏 */}
      <div className="p-4 border-b border-matrix-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isApiMode ? "bg-green-400" : "bg-amber-400"} animate-pulse`}
            ></div>
            <span className="text-xs text-muted-foreground">
              {isApiMode ? "API模式" : "模拟模式"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-xs bg-amber-400/20 text-amber-400 px-1 rounded">
              3
            </span>
          </div>
        </div>
      </div>

      {/* 主导航菜单 */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {menuGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.title);
            const hasActiveItem = isGroupActive(group.items);
            const GroupIcon = group.icon;

            return (
              <div key={group.title} className="space-y-1">
                {/* 分组标题 */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    hasActiveItem
                      ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                      : "text-muted-foreground hover:text-white hover:bg-matrix-accent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <GroupIcon
                      className={cn(
                        "w-4 h-4",
                        hasActiveItem && "text-neon-blue",
                      )}
                    />
                    <span>{group.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* 子菜单项 */}
                {isExpanded && (
                  <div className="ml-4 space-y-1 border-l border-matrix-border/50 pl-4">
                    {group.items.filter(hasPermission).map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = item.path && isActivePath(item.path);

                      return (
                        <Link
                          key={item.name}
                          to={item.path || "#"}
                          onClick={handleMobileNavClick}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group nav-item",
                            isActive
                              ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 neon-text nav-item-active"
                              : "text-muted-foreground hover:text-white hover:bg-matrix-accent/50",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <ItemIcon
                              className={cn(
                                "w-4 h-4 transition-colors",
                                isActive
                                  ? "text-neon-blue"
                                  : "group-hover:text-neon-blue",
                              )}
                            />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full border border-red-500/30">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* 底部用户信息 */}
      <div className="p-4 border-t border-matrix-border">
        <div className="space-y-3">
          {/* 用户信息 */}
          <div className="flex items-center space-x-3 p-3 bg-matrix-accent/30 rounded-lg">
            <div className="flex-shrink-0">
              {(() => {
                const RoleIcon = getRoleIcon(userRole);
                return (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                    <RoleIcon className="w-4 h-4 text-white" />
                  </div>
                );
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.username || "访客用户"}
              </p>
              <p className={cn("text-xs truncate", userColor)}>{userRole}</p>
            </div>
          </div>

          {/* 系统状态 */}
          <div className="system-stats-grid text-xs">
            <div className="system-stat-item rounded p-2 text-center">
              <div className="text-green-400 font-mono">99.9%</div>
              <div className="text-muted-foreground">正常运行</div>
            </div>
            <div className="system-stat-item rounded p-2 text-center">
              <div className="text-neon-blue font-mono">
                {Math.floor((Date.now() - lastActiveTime.getTime()) / 1000)}s
              </div>
              <div className="text-muted-foreground">活跃时间</div>
            </div>
            <div className="system-stat-item rounded p-2 text-center">
              <div className="text-amber-400 font-mono nav-badge">3</div>
              <div className="text-muted-foreground">待处理</div>
            </div>
          </div>

          {/* 登出按钮 */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-200 neon-button"
          >
            <LogOut className="w-4 h-4" />
            <span>安全退出</span>
          </button>
        </div>
      </div>
      </div>
    </>
  );
}