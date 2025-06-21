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

// 分组菜单结构
const menuGroups: {
  title: string;
  icon: any;
  items: MenuItem[];
  priority?: number;
}[] = [
  {
    title: "智能概览",
    icon: Eye,
    priority: 1,
    items: [
      {
        name: "智能仪表板",
        path: "/",
        icon: Home,
        description: "实时威胁态势感知",
        shortcut: "Ctrl+1",
      },
      {
        name: "3D态势大屏",
        path: "/situation",
        icon: Globe,
        description: "沉浸式3D网络安全可视化",
        shortcut: "Ctrl+2",
      },
      {
        name: "AI威胁猎捕",
        path: "/threat-hunting",
        icon: Target,
        description: "基于机器学习的主动威胁发现",
        isNew: true,
        shortcut: "Ctrl+3",
      },
      {
        name: "安全指挥中心",
        path: "/command-center",
        icon: Command,
        description: "集中化安全运营中心",
        isPro: true,
        shortcut: "Ctrl+4",
      },
    ],
  },
  {
    title: "威胁检测",
    icon: Shield,
    priority: 2,
    items: [
      {
        name: "实时告警",
        path: "/alerts",
        icon: AlertTriangle,
        badge: "3",
        badgeVariant: "destructive",
        description: "实时安全事件监控",
      },
      {
        name: "高级调查",
        path: "/evidence-collection",
        icon: Search,
        description: "深度威胁分析和取证",
      },
      {
        name: "威胁情报",
        path: "/threat-intelligence",
        icon: Database,
        description: "全球威胁情报聚合",
      },
      {
        name: "恶意软件分析",
        path: "/malware-analysis",
        icon: Bug,
        description: "沙箱恶意软件分析",
        isNew: true,
      },
      {
        name: "行为分析",
        path: "/behavior-analysis",
        icon: Brain,
        description: "AI驱动的异常行为检测",
        isBeta: true,
      },
      {
        name: "网络取证",
        path: "/network-forensics",
        icon: Fingerprint,
        description: "深度网络流量分析",
        isPro: true,
      },
    ],
  },
  {
    title: "监控分析",
    icon: BarChart3,
    priority: 3,
    items: [
      {
        name: "系统监控",
        path: "/system-monitor",
        icon: Monitor,
        description: "基础设施健康监控",
      },
      {
        name: "网络拓扑",
        path: "/network-topology",
        icon: Network,
        description: "智能网络拓扑映射",
        isNew: true,
      },
      {
        name: "性能分析",
        path: "/performance-analysis",
        icon: TrendingUp,
        description: "系统性能深度分析",
      },
      {
        name: "漏洞扫描",
        path: "/vulnerability-scan",
        icon: ScanLine,
        description: "自动化漏洞发现",
        badge: "2",
        badgeVariant: "warning",
      },
      {
        name: "合规检查",
        path: "/compliance-check",
        icon: ShieldCheck,
        description: "安全合规性审计",
        isPro: true,
      },
    ],
  },
  {
    title: "AI安全",
    icon: Brain,
    priority: 4,
    items: [
      {
        name: "智能分析",
        path: "/ai-analysis",
        icon: Zap,
        description: "机器学习威胁分析",
        isNew: true,
      },
      {
        name: "预测防护",
        path: "/predictive-defense",
        icon: Radar,
        description: "AI驱动的威胁预测",
        isPro: true,
      },
      {
        name: "自动响应",
        path: "/auto-response",
        icon: GitBranch,
        description: "智能自动化事件响应",
        isBeta: true,
      },
      {
        name: "模型训练",
        path: "/model-training",
        icon: Brain,
        description: "定制AI安全模型",
        roles: ["超级管理员", "数据分析师"],
      },
    ],
  },
  {
    title: "业务管理",
    icon: Briefcase,
    priority: 5,
    items: [
      {
        name: "资产管理",
        path: "/assets",
        icon: Server,
        description: "IT资产清单和管理",
      },
      {
        name: "用户管理",
        path: "/users",
        icon: Users,
        roles: ["超级管理员", "安全管理员"],
        description: "用户权限和角色管理",
      },
      {
        name: "安全报告",
        path: "/reports",
        icon: FileText,
        description: "安全态势报告生成",
      },
      {
        name: "事件管理",
        path: "/incident-management",
        icon: Calendar,
        description: "安全事件生命周期管理",
        badge: "5",
        badgeVariant: "warning",
      },
      {
        name: "风险评估",
        path: "/risk-assessment",
        icon: Target,
        description: "企业安全风险评估",
        isPro: true,
      },
    ],
  },
  {
    title: "系统配置",
    icon: Cog,
    priority: 6,
    items: [
      {
        name: "系统日志",
        path: "/logs",
        icon: Activity,
        description: "系统运行日志管理",
      },
      {
        name: "API管理",
        path: "/api-keys",
        icon: Key,
        roles: ["超级管理员"],
        description: "API密钥和接口管理",
      },
      {
        name: "系统设置",
        path: "/settings",
        icon: Settings,
        description: "系统配置和参数设置",
      },
      {
        name: "备份恢复",
        path: "/backup",
        icon: Archive,
        description: "系统数据备份恢复",
        roles: ["超级管理员"],
      },
      {
        name: "更新管理",
        path: "/updates",
        icon: Download,
        description: "系统更新和补丁管理",
        badge: "1",
        badgeVariant: "success",
      },
    ],
  },
];

// 快速操作
const quickActions: QuickAction[] = [
  {
    name: "快速扫描",
    icon: ScanLine,
    color: "text-blue-400",
    onClick: () => console.log("Quick scan"),
    shortcut: "Ctrl+Q",
  },
  {
    name: "紧急响应",
    icon: AlertTriangle,
    color: "text-red-400",
    onClick: () => console.log("Emergency response"),
    shortcut: "Ctrl+E",
  },
  {
    name: "创建报告",
    icon: FileText,
    color: "text-green-400",
    onClick: () => console.log("Create report"),
    shortcut: "Ctrl+R",
  },
  {
    name: "AI分析",
    icon: Brain,
    color: "text-purple-400",
    onClick: () => console.log("AI analysis"),
    shortcut: "Ctrl+A",
  },
];

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
    "威胁检测",
  ]);
  const [lastActiveTime, setLastActiveTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
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
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [favoriteItems, setFavoriteItems] = useState<string[]>([
    "/",
    "/alerts",
  ]);
  const [recentItems, setRecentItems] = useState<string[]>([]);

  useEffect(() => {
    // 获取用户角色和颜色信息
    const role = localStorage.getItem("cyberguard_user_role") || "用户";
    const color =
      localStorage.getItem("cyberguard_user_color") || "text-neon-blue";
    setUserRole(role);
    setUserColor(color);

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

  // 切换收藏
  const toggleFavorite = (path: string) => {
    setFavoriteItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  // ��录最近访问
  const recordRecentAccess = (path: string) => {
    setRecentItems((prev) => {
      const filtered = prev.filter((p) => p !== path);
      return [path, ...filtered].slice(0, 5);
    });
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

  // 过滤菜单项
  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          hasPermission(item) &&
          (searchQuery === "" ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())),
      ),
    }))
    .filter((group) => group.items.length > 0);

  // 快捷键处理
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            navigate("/");
            break;
          case "2":
            e.preventDefault();
            navigate("/situation");
            break;
          case "q":
            e.preventDefault();
            // 执行快速扫描
            break;
          case "e":
            e.preventDefault();
            // 紧急响应
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [navigate]);

  // 更新最后活跃时间和系统状态
  useEffect(() => {
    const interval = setInterval(() => {
      setLastActiveTime(new Date());
      // 模拟系统状态更新
      setSystemStatus((prev) => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(
          20,
          Math.min(95, prev.memory + (Math.random() - 0.5) * 5),
        ),
        network: Math.max(
          50,
          Math.min(100, prev.network + (Math.random() - 0.5) * 3),
        ),
      }));
    }, 30000);

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
          isCompactMode ? "w-16" : "w-80",
          // 移动端变换效果
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* 顶部 Logo 区域 */}
        <div className="p-6 border-b border-matrix-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center glow-border">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {!isCompactMode && (
                <div>
                  <h1 className="text-lg font-bold text-white neon-text">
                    CyberGuard
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    网络安全监控系统
                  </p>
                </div>
              )}
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

        {/* 简化状态栏 */}
        <div className="p-4 border-b border-matrix-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"} animate-pulse`}
              />
              {!isCompactMode && (
                <span className="text-xs text-muted-foreground">
                  {isOnline ? (isApiMode ? "API模式" : "模拟模式") : "离线模式"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-xs bg-amber-400/20 text-amber-400 px-1 rounded">
                {systemStatus.threats}
              </span>
            </div>
          </div>
        </div>

        {/* 快速操作区 */}
        {!isCompactMode && (
          <div className="p-4 border-b border-matrix-border/50">
            <h4 className="text-xs font-medium text-muted-foreground mb-3">
              快速操作
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 h-auto border border-matrix-border/30 hover:border-matrix-border transition-colors",
                    action.color,
                  )}
                  title={action.shortcut}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="text-xs">{action.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 收藏和最近访问 */}
        {!isCompactMode && favoriteItems.length > 0 && (
          <div className="p-4 border-b border-matrix-border/50">
            <h4 className="text-xs font-medium text-muted-foreground mb-3">
              收藏
            </h4>
            <div className="space-y-1">
              {favoriteItems.slice(0, 3).map((path) => {
                const item = menuGroups
                  .flatMap((g) => g.items)
                  .find((i) => i.path === path);
                if (!item) return null;
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={handleMobileNavClick}
                    className="flex items-center gap-2 px-2 py-1 rounded text-sm text-muted-foreground hover:text-white hover:bg-matrix-accent/50 transition-colors"
                  >
                    <ItemIcon className="w-4 h-4" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 主导航菜单 */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {filteredGroups
              .sort((a, b) => (a.priority || 99) - (b.priority || 99))
              .map((group) => {
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
                        isCompactMode && "justify-center",
                      )}
                      title={isCompactMode ? group.title : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <GroupIcon
                          className={cn(
                            "w-4 h-4",
                            hasActiveItem && "text-neon-blue",
                          )}
                        />
                        {!isCompactMode && <span>{group.title}</span>}
                      </div>
                      {!isCompactMode &&
                        (isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        ))}
                    </button>

                    {/* 子菜单项 */}
                    {(isExpanded || isCompactMode) && (
                      <div
                        className={cn(
                          "space-y-1",
                          !isCompactMode &&
                            "ml-4 border-l border-matrix-border/50 pl-4",
                        )}
                      >
                        {group.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isActive = item.path && isActivePath(item.path);
                          const isFavorite =
                            item.path && favoriteItems.includes(item.path);

                          return (
                            <div key={item.name} className="relative group">
                              <Link
                                to={item.path || "#"}
                                onClick={() => {
                                  handleMobileNavClick();
                                  if (item.path) recordRecentAccess(item.path);
                                }}
                                className={cn(
                                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 nav-item",
                                  isActive
                                    ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 neon-text nav-item-active"
                                    : "text-muted-foreground hover:text-white hover:bg-matrix-accent/50",
                                  isCompactMode && "justify-center",
                                )}
                                title={
                                  isCompactMode
                                    ? `${item.name} - ${item.description}`
                                    : undefined
                                }
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
                                  {!isCompactMode && (
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span>{item.name}</span>
                                        {item.isNew && (
                                          <Badge className="bg-green-500/20 text-green-400 border-green-500/40 text-xs">
                                            NEW
                                          </Badge>
                                        )}
                                        {item.isPro && (
                                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40 text-xs">
                                            PRO
                                          </Badge>
                                        )}
                                        {item.isBeta && (
                                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40 text-xs">
                                            BETA
                                          </Badge>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {!isCompactMode && (
                                  <div className="flex items-center gap-2">
                                    {item.badge && (
                                      <Badge
                                        className={cn(
                                          "text-xs",
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
                                    {item.shortcut && (
                                      <span className="text-xs text-muted-foreground">
                                        {item.shortcut}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </Link>

                              {/* 收藏按钮 */}
                              {!isCompactMode && item.path && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleFavorite(item.path!);
                                  }}
                                  className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                                >
                                  <Star
                                    className={cn(
                                      "w-3 h-3",
                                      isFavorite
                                        ? "text-yellow-400 fill-current"
                                        : "text-muted-foreground",
                                    )}
                                  />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </nav>
        </div>

        {/* 底部系统信息和用户区域 */}
        <div className="p-4 border-t border-matrix-border">
          <div className="space-y-3">
            {/* 系统状态 */}
            {!isCompactMode && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">
                  系统状态
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">CPU</span>
                    <span
                      className={cn(
                        "font-mono",
                        systemStatus.cpu > 80
                          ? "text-red-400"
                          : systemStatus.cpu > 60
                            ? "text-orange-400"
                            : "text-green-400",
                      )}
                    >
                      {systemStatus.cpu.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">内存</span>
                    <span
                      className={cn(
                        "font-mono",
                        systemStatus.memory > 85
                          ? "text-red-400"
                          : systemStatus.memory > 70
                            ? "text-orange-400"
                            : "text-green-400",
                      )}
                    >
                      {systemStatus.memory.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">网络</span>
                    <span className="text-green-400 font-mono">
                      {systemStatus.network.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">威胁</span>
                    <span className="text-red-400 font-mono">
                      {systemStatus.threats}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 用户信息 */}
            <div
              className={cn(
                "flex items-center p-3 bg-matrix-accent/30 rounded-lg",
                isCompactMode ? "justify-center" : "space-x-3",
              )}
            >
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
              {!isCompactMode && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.username || "访客用户"}
                  </p>
                  <p className={cn("text-xs truncate", userColor)}>
                    {userRole}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    在线{" "}
                    {Math.floor(
                      (Date.now() - lastActiveTime.getTime()) / 60000,
                    )}
                    m
                  </p>
                </div>
              )}
            </div>

            {/* 登出和帮助 */}
            <div
              className={cn(
                "flex gap-2",
                isCompactMode ? "flex-col" : "flex-row",
              )}
            >
              {!isCompactMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  帮助
                </Button>
              )}

              <Button
                onClick={handleLogout}
                size="sm"
                className={cn(
                  "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 neon-button",
                  isCompactMode ? "w-full justify-center" : "flex-1",
                )}
              >
                <LogOut className="w-4 h-4" />
                {!isCompactMode && <span className="ml-2">退出</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
