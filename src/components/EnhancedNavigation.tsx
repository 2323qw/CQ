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
  ChevronLeft,
  Database,
  TrendingUp,
  Zap,
  Eye,
  Home,
  Briefcase,
  Cog,
  X,
  Star,
  Clock,
  Bookmark,
  Command,
  Palette,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Calendar,
  Target,
  Layers,
  Map,
  Terminal,
  FileSearch,
  Brain,
  Radar,
  Lock,
  Cpu,
  HardDrive,
  Network,
  Bug,
  Fingerprint,
  ShieldCheck,
  ScanLine,
  GitBranch,
  Archive,
  Download,
  Plus,
  Filter,
  ArrowUpRight,
  History,
  Lightbulb,
  Coffee,
  ThumbsUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// 菜单项类型定义
interface MenuItem {
  name: string;
  path?: string;
  icon: any;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "warning" | "success";
  children?: MenuItem[];
  roles?: string[];
  isNew?: boolean;
  isPro?: boolean;
  isBeta?: boolean;
  description?: string;
  shortcut?: string;
  onClick?: () => void;
}

// 快速操作项
interface QuickAction {
  name: string;
  icon: any;
  color: string;
  onClick: () => void;
  shortcut?: string;
}

// 系统状态
interface SystemStatus {
  cpu: number;
  memory: number;
  network: number;
  disk: number;
  threats: number;
  incidents: number;
}

// 优化的分组菜单结构 - 保留创新功能但改进组织
const menuGroups: {
  title: string;
  icon: any;
  items: MenuItem[];
  priority: number;
  color: string;
  description?: string;
}[] = [
  {
    title: "智能概览",
    icon: Home,
    priority: 1,
    color: "text-cyan-400",
    description: "核心监控与态势感知",
    items: [
      {
        name: "仪表板",
        path: "/",
        icon: BarChart3,
        description: "实时安全态势总览",
      },
      {
        name: "3D态势大屏",
        path: "/situation",
        icon: Globe,
        description: "沉浸式威胁可视化",
        isNew: true,
      },
      {
        name: "智能指挥中心",
        path: "/command-center",
        icon: Target,
        description: "统一安全运营平台",
        isPro: true,
      },
      {
        name: "系统监控",
        path: "/system-monitor",
        icon: Monitor,
        description: "基础设施状态监控",
      },
    ],
  },
  {
    title: "威胁检测",
    icon: Shield,
    priority: 2,
    color: "text-red-400",
    description: "威胁发现与响应",
    items: [
      {
        name: "威胁告警",
        path: "/alerts",
        icon: AlertTriangle,
        badge: "3",
        badgeVariant: "destructive",
        description: "实时威胁预警",
        shortcut: "Ctrl+T",
      },
      {
        name: "AI威胁狩猎",
        path: "/threat-hunting",
        icon: Radar,
        description: "主动威胁发现",
        isBeta: true,
      },
      {
        name: "证据收集",
        path: "/evidence-collection",
        icon: Search,
        description: "数字取证分析",
      },
      {
        name: "威胁情报",
        path: "/threat-intelligence",
        icon: Database,
        description: "威胁信息汇聚",
      },
    ],
  },
  {
    title: "监控分析",
    icon: Activity,
    priority: 3,
    color: "text-green-400",
    description: "深度分析与洞察",
    items: [
      {
        name: "网络拓扑",
        path: "/topology",
        icon: GitBranch,
        description: "网络架构可视化",
        isNew: true,
      },
      {
        name: "流量分析",
        path: "/traffic-analysis",
        icon: TrendingUp,
        description: "网络流量深度分析",
      },
      {
        name: "行为分析",
        path: "/behavior-analysis",
        icon: Brain,
        description: "用户行为建模",
        isBeta: true,
      },
      {
        name: "日志审计",
        path: "/logs",
        icon: FileSearch,
        description: "安全事件追踪",
      },
      {
        name: "合规检查",
        path: "/compliance",
        icon: ShieldCheck,
        description: "法规遵循评估",
      },
    ],
  },
  {
    title: "AI安全",
    icon: Brain,
    priority: 4,
    color: "text-purple-400",
    description: "人工智能驱动的安全能力",
    items: [
      {
        name: "智能分析",
        path: "/ai-analysis",
        icon: Lightbulb,
        description: "机器学习威胁检测",
        isNew: true,
      },
      {
        name: "自动响应",
        path: "/auto-response",
        icon: Zap,
        description: "智能安全编排",
        isBeta: true,
      },
      {
        name: "预测建模",
        path: "/predictive",
        icon: TrendingUp,
        description: "风险预测分析",
        isPro: true,
      },
      {
        name: "知识图谱",
        path: "/knowledge-graph",
        icon: Layers,
        description: "安全知识关联",
        isBeta: true,
      },
    ],
  },
  {
    title: "业务管理",
    icon: Briefcase,
    priority: 5,
    color: "text-blue-400",
    description: "企业资产与人员管理",
    items: [
      {
        name: "资产管理",
        path: "/assets",
        icon: Server,
        description: "IT资产全生命周期管理",
      },
      {
        name: "用户管理",
        path: "/users",
        icon: Users,
        roles: ["超级管理员", "安全管理员"],
        description: "身份与访问控制",
      },
      {
        name: "安全报告",
        path: "/reports",
        icon: FileText,
        description: "定制化安全报表",
      },
      {
        name: "风险评估",
        path: "/risk-assessment",
        icon: AlertTriangle,
        description: "业务风险量化分析",
      },
    ],
  },
  {
    title: "系统配置",
    icon: Settings,
    priority: 6,
    color: "text-amber-400",
    description: "系统设置与维护",
    items: [
      {
        name: "API密钥",
        path: "/api-keys",
        icon: Key,
        roles: ["超级管理员"],
        description: "接口访问控制",
      },
      {
        name: "系统设置",
        path: "/settings",
        icon: Cog,
        description: "全局配置管理",
      },
      {
        name: "功能展示",
        path: "/features",
        icon: Star,
        description: "平台能力概览",
        isNew: true,
      },
      {
        name: "帮助中心",
        path: "/help",
        icon: HelpCircle,
        description: "使用指南与支持",
      },
    ],
  },
];

// 分类的快速操作
const quickActionGroups = {
  security: [
    {
      name: "快速扫描",
      icon: ScanLine,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      borderColor: "border-cyan-500/30",
      onClick: () => console.log("Quick scan"),
      shortcut: "Ctrl+Q",
      description: "一键安全扫描",
    },
    {
      name: "紧急响应",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/30",
      onClick: () => console.log("Emergency response"),
      shortcut: "Ctrl+E",
      description: "应急事件处理",
    },
  ],
  analysis: [
    {
      name: "AI分析",
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
      onClick: () => console.log("AI analysis"),
      shortcut: "Ctrl+A",
      description: "智能威胁分析",
    },
    {
      name: "创建报告",
      icon: FileText,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      onClick: () => console.log("Create report"),
      shortcut: "Ctrl+R",
      description: "生成安全报告",
    },
  ],
};

interface EnhancedNavigationProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function EnhancedNavigation({
  isMobileOpen = false,
  onMobileClose,
}: EnhancedNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isApiMode } = useDataSource();
  const [userRole, setUserRole] = useState("");
  const [userColor, setUserColor] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "智能概览",
    "系统配置",
  ]);
  const [selectedMainGroup, setSelectedMainGroup] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(new Date());
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 23,
    memory: 67,
    network: 89,
    disk: 45,
    threats: 3,
    incidents: 5,
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // 获取用户角色和颜色信息
    const role = localStorage.getItem("cyberguard_user_role") || "用户";
    const color =
      localStorage.getItem("cyberguard_user_color") || "text-neon-blue";
    setUserRole(role);
    setUserColor(color);

    // 加载收藏和最近访问
    const savedFavorites = localStorage.getItem("cyberguard_favorites");
    const savedRecent = localStorage.getItem("cyberguard_recent");
    if (savedFavorites) {
      setFavoriteItems(JSON.parse(savedFavorites));
    }
    if (savedRecent) {
      setRecentItems(JSON.parse(savedRecent));
    }

    // 监听网络状态
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
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
    // 智能概览和系统配置保持原有的展开/收起模式
    if (groupTitle === "智能概览" || groupTitle === "系统配置") {
      setExpandedGroups((prev) =>
        prev.includes(groupTitle)
          ? prev.filter((title) => title !== groupTitle)
          : [...prev, groupTitle],
      );
      setSelectedMainGroup(null); // 清除选中的主分组
    } else {
      // 其他分组切换到子选项显示模式
      if (selectedMainGroup === groupTitle) {
        setSelectedMainGroup(null); // 点击相同分组则关闭
      } else {
        setSelectedMainGroup(groupTitle); // 选择新的主分组
        setExpandedGroups([]); // 清除传统展开状态
      }
    }
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

  // 搜索过滤功能
  const getFilteredGroups = () => {
    if (!searchQuery.trim()) return filteredGroups;

    return filteredGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
      .filter((group) => group.items.length > 0);
  };

  // 切换收藏状态
  const toggleFavorite = (itemPath: string) => {
    setFavoriteItems((prev) => {
      const newFavorites = prev.includes(itemPath)
        ? prev.filter((path) => path !== itemPath)
        : [...prev, itemPath];
      localStorage.setItem(
        "cyberguard_favorites",
        JSON.stringify(newFavorites),
      );
      return newFavorites;
    });
  };

  // 添加到最近访问
  const addToRecent = (itemPath: string) => {
    setRecentItems((prev) => {
      const newRecent = [
        itemPath,
        ...prev.filter((path) => path !== itemPath),
      ].slice(0, 5);
      localStorage.setItem("cyberguard_recent", JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMobileNavClick = (itemPath?: string) => {
    if (itemPath) {
      addToRecent(itemPath);
    }
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // 过滤菜单项
  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(item)),
    }))
    .filter((group) => group.items.length > 0);

  // 获取最终显示的分组（考虑搜索）
  const displayGroups = getFilteredGroups();

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
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-gradient-to-b from-matrix-bg via-matrix-surface to-matrix-bg border-r border-matrix-border z-40 cyber-card-enhanced transition-all duration-300",
          // 响应式宽度：紧凑模式更窄，正常模式适中
          isCompactMode ? "w-16" : "w-72",
          // 移动端变换效果
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* 顶部 Logo 和搜索区域 */}
        <div className="p-4 border-b border-matrix-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center glow-border">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white neon-text">
                  CyberGuard
                </h1>
                <p className="text-xs text-muted-foreground">
                  智能网络安全平台
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* 紧凑模式切换 */}
              <button
                onClick={() => {
                  const newCompactMode = !isCompactMode;
                  setIsCompactMode(newCompactMode);
                  // 发送事件通知App.tsx布局变化
                  window.dispatchEvent(
                    new CustomEvent("navigationCompactModeChange", {
                      detail: { isCompact: newCompactMode },
                    }),
                  );
                }}
                className="hidden md:block p-2 text-muted-foreground hover:text-neon-blue transition-all duration-200 rounded-lg hover:bg-matrix-accent/30"
                title={isCompactMode ? "展开导航" : "收起导航"}
              >
                {isCompactMode ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

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

          {/* 智能搜索框 */}
          {!isCompactMode && (
            <div className="relative">
              <div
                className={cn(
                  "relative flex items-center transition-all duration-300 group",
                  isSearchFocused && "transform scale-105",
                )}
              >
                <Search
                  className={cn(
                    "absolute left-3 w-4 h-4 z-10 transition-all duration-300",
                    isSearchFocused
                      ? "text-neon-blue animate-pulse"
                      : "text-muted-foreground group-hover:text-neon-blue",
                  )}
                />
                <Input
                  type="text"
                  placeholder="搜索功能、页面..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn(
                    "pl-10 pr-4 py-2 w-full bg-matrix-surface/50 border-matrix-border text-sm relative overflow-hidden",
                    "focus:border-neon-blue/50 focus:bg-matrix-surface/80 transition-all duration-300",
                    "hover:bg-matrix-surface/70 hover:border-neon-blue/30",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-neon-blue/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-1000 focus:before:translate-x-[100%]",
                    isSearchFocused &&
                      "border-neon-blue/50 bg-matrix-surface/80 glow-border-subtle shadow-lg shadow-neon-blue/20",
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 w-4 h-4 text-muted-foreground hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 搜索建议 */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-matrix-surface border border-matrix-border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                  {displayGroups.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      未找到匹配项
                    </div>
                  ) : (
                    displayGroups.map((group) => (
                      <div key={group.title} className="p-2">
                        <div className="text-xs text-muted-foreground mb-1 px-2">
                          {group.title}
                        </div>
                        {group.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path || "#"}
                            onClick={() => {
                              setSearchQuery("");
                              handleMobileNavClick(item.path);
                            }}
                            className="flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-matrix-accent/50 transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-muted-foreground" />
                            <span>{item.name}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                {item.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 增强状态栏 */}
        <div className="p-4 border-b border-matrix-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"} animate-pulse`}
              />
              <span className="text-xs text-muted-foreground">
                {isOnline ? (isApiMode ? "API模式" : "模拟模式") : "离线模式"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="text-xs bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/30">
                  {systemStatus.threats}
                </span>
              </div>
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="p-1 rounded text-muted-foreground hover:text-neon-blue transition-colors"
                title="快速操作"
              >
                <Command className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 快速操作面板 */}
          {showQuickActions && !isCompactMode && (
            <div className="space-y-3 bg-matrix-surface/30 rounded-lg p-3 border border-matrix-border/30">
              <div className="text-xs text-muted-foreground font-medium">
                快速操作
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(quickActionGroups).map(([category, actions]) =>
                  actions.map((action) => (
                    <button
                      key={action.name}
                      onClick={action.onClick}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 relative overflow-hidden group",
                        "hover:scale-110 active:scale-95 hover:rotate-3 active:rotate-0",
                        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]",
                        action.bgColor,
                        action.borderColor,
                        "border hover:glow-border-subtle hover:shadow-lg",
                      )}
                      title={`${action.description} (${action.shortcut})`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "scale(1.15) rotate(5deg)";
                        e.currentTarget.style.boxShadow = `0 8px 25px ${action.color.replace("text-", "rgba(")}33, 0.3)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "";
                        e.currentTarget.style.boxShadow = "";
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform =
                          "scale(0.9) rotate(0deg)";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform =
                          "scale(1.15) rotate(5deg)";
                      }}
                    >
                      <action.icon className={cn("w-4 h-4", action.color)} />
                      <span className="text-xs text-center">{action.name}</span>
                    </button>
                  )),
                )}
              </div>
            </div>
          )}
        </div>

        {/* 主导航菜单 */}
        <div className="flex-1 nav-scroll-area scrollbar-custom">
          <nav className={cn("p-3 space-y-2", isCompactMode && "p-2")}>
            {/* 如果选择了主分组，显示该分组的子选项 */}
            {selectedMainGroup &&
            selectedMainGroup !== "智能概览" &&
            selectedMainGroup !== "系统配置" &&
            !isCompactMode ? (
              <div className="space-y-3">
                {/* 返回按钮和标题 */}
                <div className="flex items-center gap-3 p-3 bg-matrix-surface/50 rounded-xl border border-matrix-border/30">
                  <button
                    onClick={() => setSelectedMainGroup(null)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-matrix-accent/50 transition-all duration-300 relative overflow-hidden group"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.1) rotate(-5deg)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0, 245, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "scale(0.9)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.1) rotate(-5deg)";
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:animate-pulse" />
                  </button>
                  {(() => {
                    const selectedGroup = displayGroups.find(
                      (g) => g.title === selectedMainGroup,
                    );
                    if (!selectedGroup) return null;
                    const GroupIcon = selectedGroup.icon;
                    return (
                      <>
                        <div
                          className={cn(
                            "p-2 rounded-lg bg-current/20",
                            selectedGroup.color,
                          )}
                        >
                          <GroupIcon className="w-5 h-5 text-current" />
                        </div>
                        <div>
                          <h3
                            className={cn(
                              "font-semibold text-lg",
                              selectedGroup.color,
                            )}
                          >
                            {selectedGroup.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedGroup.description}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* 子选项列表 */}
                <div className="space-y-2">
                  {(() => {
                    const selectedGroup = displayGroups.find(
                      (g) => g.title === selectedMainGroup,
                    );
                    if (!selectedGroup) return null;

                    return selectedGroup.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = item.path && isActivePath(item.path);
                      const isFavorite = favoriteItems.includes(
                        item.path || "",
                      );
                      const isRecent = recentItems.includes(item.path || "");

                      return (
                        <div key={item.name} className="relative">
                          <Link
                            to={item.path || "#"}
                            onClick={() => {
                              handleMobileNavClick(item.path);
                              setSelectedMainGroup(null); // 导航后关闭子选项视图
                            }}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                              "hover:scale-[1.02] active:scale-[0.98]",
                              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-600 hover:before:translate-x-[100%]",
                              isActive
                                ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/10 text-neon-blue border border-neon-blue/30 shadow-lg glow-border-subtle"
                                : "text-muted-foreground hover:text-white hover:bg-gradient-to-r hover:from-matrix-accent/40 hover:to-matrix-accent/60 hover:shadow-xl hover:shadow-neon-blue/20 hover:border hover:border-neon-blue/30 hover:translate-x-3",
                            )}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.transform =
                                  "translateX(12px) scale(1.02)";
                                e.currentTarget.style.boxShadow =
                                  "0 8px 25px rgba(0, 245, 255, 0.25), 0 0 20px rgba(0, 245, 255, 0.15)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.transform = "";
                                e.currentTarget.style.boxShadow = "";
                              }
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.transform =
                                "translateX(6px) scale(0.98)";
                            }}
                            onMouseUp={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.transform =
                                  "translateX(12px) scale(1.02)";
                              }
                            }}
                          >
                            <div
                              className={cn(
                                "p-2 rounded-lg transition-all duration-200",
                                isActive
                                  ? "bg-neon-blue/20"
                                  : "bg-matrix-surface/30 group-hover:bg-matrix-surface/50",
                              )}
                            >
                              <ItemIcon
                                className={cn(
                                  "w-5 h-5 transition-colors",
                                  isActive
                                    ? "text-neon-blue"
                                    : "text-muted-foreground group-hover:text-neon-blue",
                                )}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-medium">{item.name}</span>
                                {/* 状态标签 */}
                                {item.isNew && (
                                  <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/40 px-2 py-0.5">
                                    新
                                  </Badge>
                                )}
                                {item.isBeta && (
                                  <Badge className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/40 px-2 py-0.5">
                                    β
                                  </Badge>
                                )}
                                {item.isPro && (
                                  <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/40 px-2 py-0.5">
                                    Pro
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-muted-foreground/80 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* 收藏按钮 */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (item.path) toggleFavorite(item.path);
                                }}
                                className={cn(
                                  "p-1.5 rounded-lg transition-all duration-200",
                                  isFavorite
                                    ? "text-yellow-400 bg-yellow-400/20"
                                    : "text-muted-foreground/50 hover:text-yellow-400 hover:bg-yellow-400/10",
                                )}
                              >
                                <Star className="w-4 h-4" />
                              </button>

                              {/* 最近访问指示器 */}
                              {isRecent && (
                                <div className="w-2.5 h-2.5 bg-neon-blue rounded-full animate-pulse" />
                              )}

                              {/* 徽章 */}
                              {item.badge && (
                                <Badge
                                  className={cn(
                                    "text-xs px-2 py-1",
                                    item.badgeVariant === "destructive"
                                      ? "bg-red-500/20 text-red-400 border-red-500/40"
                                      : item.badgeVariant === "warning"
                                        ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                        : item.badgeVariant === "success"
                                          ? "bg-green-500/20 text-green-400 border-green-500/40"
                                          : "bg-blue-500/20 text-blue-400 border-blue-500/40",
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : (
              /* 默认主分组视图 */
              displayGroups
                .sort((a, b) => (a.priority || 99) - (b.priority || 99))
                .map((group) => {
                  const isExpanded = expandedGroups.includes(group.title);
                  const hasActiveItem = isGroupActive(group.items);
                  const GroupIcon = group.icon;
                  const isSpecialGroup =
                    group.title === "智能概览" || group.title === "系统配置";
                  const isSelectedGroup = selectedMainGroup === group.title;

                  return (
                    <div key={group.title} className="space-y-2">
                      {/* 分组标题 - 优化样式 */}
                      <button
                        onClick={() => toggleGroup(group.title)}
                        className={cn(
                          "w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-300 nav-group-header group relative overflow-hidden",
                          "hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98] active:translate-x-0",
                          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
                          hasActiveItem || isSelectedGroup
                            ? `bg-gradient-to-r from-matrix-surface/80 to-matrix-accent/60 ${group.color} border border-current/20 shadow-lg nav-group-active glow-border-subtle`
                            : "text-muted-foreground hover:text-white hover:bg-gradient-to-r hover:from-matrix-accent/40 hover:to-matrix-accent/60 hover:shadow-xl hover:shadow-neon-blue/20",
                          isCompactMode
                            ? "justify-center p-2"
                            : "justify-between px-4 py-3",
                        )}
                        title={isCompactMode ? group.title : group.description}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateX(4px) scale(1.02)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 25px rgba(0, 245, 255, 0.3), 0 0 20px rgba(0, 245, 255, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "";
                          e.currentTarget.style.boxShadow = "";
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform =
                            "translateX(2px) scale(0.98)";
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform =
                            "translateX(4px) scale(1.02)";
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "rounded-lg transition-all duration-300 group-hover:rotate-12 group-active:rotate-6",
                              isCompactMode ? "p-1" : "p-1.5",
                              hasActiveItem || isSelectedGroup
                                ? "bg-current/20 shadow-lg shadow-current/30"
                                : "bg-matrix-surface/50 group-hover:bg-current/10 group-hover:shadow-md",
                            )}
                          >
                            <GroupIcon
                              className={cn(
                                "transition-all duration-300 group-hover:scale-110",
                                isCompactMode ? "w-4 h-4" : "w-4 h-4",
                                hasActiveItem || isSelectedGroup
                                  ? "text-current drop-shadow-lg"
                                  : "text-muted-foreground group-hover:text-current",
                              )}
                              style={{
                                filter:
                                  hasActiveItem || isSelectedGroup
                                    ? "drop-shadow(0 0 8px currentColor)"
                                    : "",
                              }}
                            />
                          </div>
                          {!isCompactMode && (
                            <div className="text-left flex-1">
                              <div className="font-semibold">{group.title}</div>
                              {group.description && (
                                <div className="text-xs text-muted-foreground/80 font-normal">
                                  {group.description}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {!isCompactMode && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-current/10 text-current px-2 py-1 rounded-full">
                              {group.items.length}
                            </span>
                            {isSpecialGroup ? (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                              ) : (
                                <ChevronRight className="w-4 h-4 transition-transform duration-300" />
                              )
                            ) : (
                              <ChevronRight className="w-4 h-4 transition-transform duration-300" />
                            )}
                          </div>
                        )}
                      </button>

                      {/* 智能概览和系统配置保持原有的子菜单展开方式 */}
                      {isSpecialGroup && (isExpanded || isCompactMode) && (
                        <div
                          className={cn(
                            "space-y-1 transition-all duration-300 overflow-hidden",
                            isCompactMode
                              ? "space-y-1"
                              : "ml-2 pl-3 border-l-2 border-matrix-border/30",
                          )}
                        >
                          {group.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isActive =
                              item.path && isActivePath(item.path);
                            const isFavorite = favoriteItems.includes(
                              item.path || "",
                            );
                            const isRecent = recentItems.includes(
                              item.path || "",
                            );

                            return (
                              <div key={item.name} className="relative group">
                                <Link
                                  to={item.path || "#"}
                                  onClick={() =>
                                    handleMobileNavClick(item.path)
                                  }
                                  className={cn(
                                    "flex items-center rounded-lg text-sm transition-all duration-300 nav-item-enhanced group relative overflow-hidden",
                                    "hover:scale-[1.01] active:scale-[0.99]",
                                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]",
                                    isCompactMode
                                      ? "gap-0 p-2 justify-center"
                                      : "gap-3 px-3 py-2",
                                    isActive
                                      ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/10 text-neon-blue border border-neon-blue/30 shadow-lg nav-item-active glow-border-subtle"
                                      : "text-muted-foreground hover:text-white hover:bg-gradient-to-r hover:from-matrix-accent/50 hover:to-matrix-accent/70 hover:shadow-lg hover:shadow-neon-blue/10 hover:border hover:border-neon-blue/20",
                                    !isCompactMode && "hover:translate-x-2",
                                  )}
                                  title={
                                    isCompactMode ? item.name : item.description
                                  }
                                  onMouseEnter={(e) => {
                                    if (!isActive) {
                                      e.currentTarget.style.transform =
                                        isCompactMode
                                          ? "scale(1.05)"
                                          : "translateX(8px) scale(1.01)";
                                      e.currentTarget.style.boxShadow =
                                        "0 4px 15px rgba(0, 245, 255, 0.15)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isActive) {
                                      e.currentTarget.style.transform = "";
                                      e.currentTarget.style.boxShadow = "";
                                    }
                                  }}
                                  onMouseDown={(e) => {
                                    e.currentTarget.style.transform =
                                      isCompactMode
                                        ? "scale(0.95)"
                                        : "translateX(4px) scale(0.99)";
                                  }}
                                  onMouseUp={(e) => {
                                    if (!isActive) {
                                      e.currentTarget.style.transform =
                                        isCompactMode
                                          ? "scale(1.05)"
                                          : "translateX(8px) scale(1.01)";
                                    }
                                  }}
                                >
                                  <div
                                    className={cn(
                                      "flex items-center flex-1",
                                      isCompactMode
                                        ? "justify-center"
                                        : "gap-3",
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "rounded-lg transition-all duration-200",
                                        isCompactMode ? "p-1" : "p-1.5",
                                        isActive
                                          ? "bg-neon-blue/20"
                                          : "bg-matrix-surface/30 group-hover:bg-matrix-surface/50",
                                      )}
                                    >
                                      <ItemIcon
                                        className={cn(
                                          "w-4 h-4 transition-colors",
                                          isActive
                                            ? "text-neon-blue"
                                            : "text-muted-foreground group-hover:text-neon-blue",
                                        )}
                                      />
                                    </div>
                                    {!isCompactMode && (
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-medium text-sm">
                                            {item.name}
                                          </span>
                                          {/* 状态标签 */}
                                          {item.isNew && (
                                            <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/40 px-1.5 py-0">
                                              新
                                            </Badge>
                                          )}
                                          {item.isBeta && (
                                            <Badge className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/40 px-1.5 py-0">
                                              β
                                            </Badge>
                                          )}
                                          {item.isPro && (
                                            <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/40 px-1.5 py-0">
                                              Pro
                                            </Badge>
                                          )}
                                        </div>
                                        {item.description && (
                                          <div className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
                                            {item.description}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* 右侧指示器 */}
                                  {!isCompactMode && (
                                    <div className="flex items-center gap-2">
                                      {/* 收藏按钮 */}
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (item.path)
                                            toggleFavorite(item.path);
                                        }}
                                        className={cn(
                                          "p-1 rounded transition-all duration-300 favorite-star relative group",
                                          "hover:scale-125 active:scale-90",
                                          isFavorite
                                            ? "text-yellow-400 active animate-pulse"
                                            : "text-muted-foreground/50 hover:text-yellow-400",
                                        )}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.transform =
                                            "scale(1.3) rotate(15deg)";
                                          if (isFavorite) {
                                            e.currentTarget.style.filter =
                                              "drop-shadow(0 0 8px #fbbf24)";
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.transform = "";
                                          e.currentTarget.style.filter = "";
                                        }}
                                        onMouseDown={(e) => {
                                          e.currentTarget.style.transform =
                                            "scale(0.8) rotate(0deg)";
                                        }}
                                        onMouseUp={(e) => {
                                          e.currentTarget.style.transform =
                                            "scale(1.3) rotate(15deg)";
                                        }}
                                      >
                                        <Star
                                          className={cn(
                                            "w-3 h-3 transition-all duration-300",
                                            isFavorite
                                              ? "fill-current"
                                              : "group-hover:fill-current",
                                          )}
                                        />
                                        {isFavorite && (
                                          <div className="absolute inset-0 animate-ping">
                                            <Star className="w-3 h-3 text-yellow-400/50" />
                                          </div>
                                        )}
                                      </button>

                                      {/* 最近访问指示器 */}
                                      {isRecent && (
                                        <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                                      )}

                                      {/* 徽章 */}
                                      {item.badge && (
                                        <Badge
                                          className={cn(
                                            "text-xs px-2 py-0.5",
                                            item.badgeVariant === "destructive"
                                              ? "bg-red-500/20 text-red-400 border-red-500/40"
                                              : item.badgeVariant === "warning"
                                                ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                                                : item.badgeVariant ===
                                                    "success"
                                                  ? "bg-green-500/20 text-green-400 border-green-500/40"
                                                  : "bg-blue-500/20 text-blue-400 border-blue-500/40",
                                          )}
                                        >
                                          {item.badge}
                                        </Badge>
                                      )}

                                      {/* 快捷键提示 */}
                                      {item.shortcut && (
                                        <span className="text-xs text-muted-foreground/50 font-mono bg-matrix-surface/30 px-1.5 py-0.5 rounded">
                                          {item.shortcut}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </nav>
        </div>

        {/* 底部用户信息和控制区域 */}
        <div className="p-4 border-t border-matrix-border space-y-4">
          {/* 用户信息卡片 */}
          <div
            className={cn(
              "user-profile rounded-xl p-4 transition-all duration-300",
              isCompactMode ? "flex justify-center" : "space-y-3",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="user-avatar w-10 h-10 flex-shrink-0">
                {(() => {
                  const RoleIcon = getRoleIcon(userRole);
                  return <RoleIcon className="w-5 h-5 text-white" />;
                })()}
              </div>
              {!isCompactMode && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.username || "访客用户"}
                    </p>
                    {isOnline && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className={cn("text-xs truncate font-medium", userColor)}>
                    {userRole}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    上次活跃:{" "}
                    {Math.floor(
                      (Date.now() - lastActiveTime.getTime()) / 60000,
                    )}
                    分钟前
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 系统状态网格 */}
          {!isCompactMode && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="system-metric">
                <div className="flex flex-col items-center">
                  <div className="metric-value normal">99.9%</div>
                  <div className="text-muted-foreground">正常运行</div>
                </div>
              </div>
              <div className="system-metric">
                <div className="flex flex-col items-center">
                  <div className="metric-value normal">{systemStatus.cpu}%</div>
                  <div className="text-muted-foreground">CPU</div>
                </div>
              </div>
              <div className="system-metric">
                <div className="flex flex-col items-center">
                  <div className="metric-value warning">
                    {systemStatus.threats}
                  </div>
                  <div className="text-muted-foreground">威胁</div>
                </div>
              </div>
            </div>
          )}

          {/* 控制按钮组 */}
          <div className="space-y-2">
            {/* 紧凑模式切换 */}
            {!isCompactMode && (
              <div className="flex items-center justify-between p-2 bg-matrix-surface/30 rounded-lg">
                <span className="text-xs text-muted-foreground">紧凑模式</span>
                <Switch
                  checked={isCompactMode}
                  onCheckedChange={setIsCompactMode}
                  className="scale-75"
                />
              </div>
            )}

            {/* 登出按钮 */}
            <Button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl",
                "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400",
                "border border-red-500/30 hover:border-red-400/50",
                "hover:bg-gradient-to-r hover:from-red-500/30 hover:to-red-600/30",
                "transition-all duration-300 neon-button hover:shadow-lg hover:shadow-red-500/20",
              )}
            >
              <LogOut className="w-4 h-4" />
              {!isCompactMode && <span className="font-medium">安全退出</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
