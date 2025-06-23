import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Wifi,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Settings,
  Database,
  Monitor,
  Zap,
  Globe,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  Eye,
  EyeOff,
  Cloud,
  Shield,
  Info,
  Search,
  Filter,
  Download,
  Flag,
  Link,
  MapPin,
  Calendar,
  Hash,
  ExternalLink,
  Smartphone,
  Terminal,
  Copy,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
} from "lucide-react";

// Data interfaces (same as before)
interface SystemProcess {
  pid: number;
  name: string;
  status: "running" | "sleeping" | "stopped" | "zombie";
  username: string;
  cpu_percent: number;
  memory_percent: number;
  memory_rss: number;
  memory_vms: number;
  io_read_bytes: number;
  io_write_bytes: number;
  num_threads: number;
  create_time: string;
  id: number;
  timestamp: string;
  risk_level?: "low" | "medium" | "high" | "critical";
}

interface NetworkConnection {
  id: number;
  timestamp: string;
  pid: number;
  process_name: string | null;
  status:
    | "ESTABLISHED"
    | "TIME_WAIT"
    | "LISTEN"
    | "CLOSE_WAIT"
    | "SYN_SENT"
    | "SYN_RECEIVED";
  protocol: "TCP" | "UDP" | null;
  url: string | null;
  connection: string;
  risk_level?: "low" | "medium" | "high" | "critical";
}

interface WindowsService {
  name: string;
  display_name: string;
  status:
    | "running"
    | "stopped"
    | "paused"
    | "start_pending"
    | "stop_pending"
    | "continue_pending"
    | "pause_pending";
  startup_type?: "automatic" | "manual" | "disabled";
  service_type?: string;
  risk_level?: "low" | "medium" | "high" | "critical";
}

const SystemMonitor: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");
  const [expandedSections, setExpandedSections] = useState({
    threats: true,
    processes: true,
    connections: true,
    services: true,
  });

  // Mock data (same as before but condensed for readability)
  const mockProcesses: SystemProcess[] = [
    {
      pid: 46532,
      name: "msedgewebview2.exe",
      status: "running",
      username: "DIEOUT\\DIEOUT",
      cpu_percent: 0.0,
      memory_percent: 0.06824922610466883,
      memory_rss: 22.2109375,
      memory_vms: 10.03515625,
      io_read_bytes: 3.589977264404297,
      io_write_bytes: 8.122886657714844,
      num_threads: 11,
      create_time: "2025-06-23T13:15:02.641886",
      id: 7147,
      timestamp: "2025-06-23T14:33:28.388209",
      risk_level: "low",
    },
    {
      pid: 1337,
      name: "suspicious_crypto.exe",
      status: "running",
      username: "SYSTEM",
      cpu_percent: 95.8,
      memory_percent: 25.7,
      memory_rss: 1024.0,
      memory_vms: 2048.0,
      io_read_bytes: 1200.5,
      io_write_bytes: 800.3,
      num_threads: 32,
      create_time: "2025-06-23T14:30:15.123456",
      id: 7148,
      timestamp: "2025-06-23T14:43:28.407385",
      risk_level: "critical",
    },
    {
      pid: 2048,
      name: "chrome.exe",
      status: "running",
      username: "DIEOUT\\DIEOUT",
      cpu_percent: 15.7,
      memory_percent: 8.3,
      memory_rss: 340.5,
      memory_vms: 680.2,
      io_read_bytes: 125.3,
      io_write_bytes: 89.1,
      num_threads: 18,
      create_time: "2025-06-23T09:45:20.987654",
      id: 7149,
      timestamp: "2025-06-23T14:43:28.407385",
      risk_level: "low",
    },
    {
      pid: 4096,
      name: "powershell.exe",
      status: "running",
      username: "DIEOUT\\DIEOUT",
      cpu_percent: 45.2,
      memory_percent: 3.8,
      memory_rss: 156.7,
      memory_vms: 312.4,
      io_read_bytes: 89.5,
      io_write_bytes: 156.9,
      num_threads: 8,
      create_time: "2025-06-23T14:20:10.456789",
      id: 7150,
      timestamp: "2025-06-23T14:43:28.407385",
      risk_level: "medium",
    },
  ];

  const mockConnections: NetworkConnection[] = [
    {
      id: 6498,
      timestamp: "2025-06-23T14:43:28.407385",
      pid: 0,
      process_name: null,
      status: "TIME_WAIT",
      protocol: null,
      url: null,
      connection: "192.168.156.100:58434 -> 211.100.0.108:443",
      risk_level: "low",
    },
    {
      id: 6499,
      timestamp: "2025-06-23T14:43:28.407385",
      pid: 1337,
      process_name: "suspicious_crypto.exe",
      status: "ESTABLISHED",
      protocol: "TCP",
      url: "https://suspicious-mining-pool.onion",
      connection: "192.168.156.100:49152 -> 185.220.101.42:8080",
      risk_level: "critical",
    },
    {
      id: 6500,
      timestamp: "2025-06-23T14:43:28.407385",
      pid: 2048,
      process_name: "chrome.exe",
      status: "ESTABLISHED",
      protocol: "TCP",
      url: "https://www.google.com",
      connection: "192.168.156.100:51234 -> 142.250.191.14:443",
      risk_level: "low",
    },
    {
      id: 6501,
      timestamp: "2025-06-23T14:43:28.407385",
      pid: 4096,
      process_name: "powershell.exe",
      status: "ESTABLISHED",
      protocol: "TCP",
      url: null,
      connection: "192.168.156.100:52001 -> 10.0.0.50:22",
      risk_level: "medium",
    },
  ];

  const mockServices: WindowsService[] = [
    {
      name: "ALG",
      display_name: "Application Layer Gateway Service",
      status: "stopped",
      startup_type: "manual",
      service_type: "Win32",
      risk_level: "low",
    },
    {
      name: "Spooler",
      display_name: "Print Spooler",
      status: "running",
      startup_type: "automatic",
      service_type: "Win32",
      risk_level: "medium",
    },
    {
      name: "WinDefend",
      display_name: "Windows Defender Antivirus Service",
      status: "running",
      startup_type: "automatic",
      service_type: "Win32",
      risk_level: "low",
    },
    {
      name: "SuspiciousService",
      display_name: "Suspicious Background Service",
      status: "running",
      startup_type: "automatic",
      service_type: "Win32",
      risk_level: "critical",
    },
  ];

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
      case "ESTABLISHED":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "stopped":
      case "TIME_WAIT":
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
      case "paused":
      case "CLOSE_WAIT":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "LISTEN":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "sleeping":
        return "bg-purple-500/20 text-purple-400 border-purple-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-red-600/20 text-red-400 border-red-600/40";
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("zh-CN");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(handleRefresh, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter data based on search term
  const filteredProcesses = mockProcesses.filter(
    (process) =>
      process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.pid.toString().includes(searchTerm) ||
      process.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredConnections = mockConnections.filter(
    (connection) =>
      connection.connection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (connection.process_name &&
        connection.process_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  const filteredServices = mockServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.display_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate system stats
  const systemStats = {
    cpuUsage: Math.round(
      mockProcesses.reduce((acc, p) => acc + p.cpu_percent, 0),
    ),
    memoryUsage: Math.round(
      mockProcesses.reduce((acc, p) => acc + p.memory_percent, 0),
    ),
    totalProcesses: mockProcesses.length,
    totalConnections: mockConnections.length,
    totalServices: mockServices.length,
    criticalThreats: [
      ...mockProcesses,
      ...mockConnections,
      ...mockServices,
    ].filter((item) => item.risk_level === "critical").length,
  };

  const CompactProcessRow = ({ process }: { process: SystemProcess }) => (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border border-matrix-border hover:bg-matrix-surface/50 transition-colors",
        process.risk_level === "critical" && "border-red-500/30 bg-red-500/5",
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm bg-matrix-surface px-2 py-1 rounded">
            {process.pid}
          </span>
          {process.risk_level === "critical" && (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{process.name}</span>
            <Badge className={getStatusColor(process.status)} size="sm">
              {process.status === "running" ? "运行" : "停止"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {process.username.split("\\").pop()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p
            className={cn(
              "text-sm font-mono",
              process.cpu_percent > 50 ? "text-red-400" : "text-green-400",
            )}
          >
            {process.cpu_percent.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">CPU</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono">
            {process.memory_percent.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">MEM</p>
        </div>
        <Badge className={getRiskColor(process.risk_level || "low")} size="sm">
          {process.risk_level === "critical"
            ? "严重"
            : process.risk_level === "medium"
              ? "中危"
              : "正常"}
        </Badge>
        <Button
          size="sm"
          className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2"
        >
          <Eye className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  const CompactConnectionRow = ({
    connection,
  }: {
    connection: NetworkConnection;
  }) => (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border border-matrix-border hover:bg-matrix-surface/50 transition-colors",
        connection.risk_level === "critical" &&
          "border-red-500/30 bg-red-500/5",
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm bg-matrix-surface px-2 py-1 rounded">
            {connection.id}
          </span>
          {connection.risk_level === "critical" && (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">
              {connection.process_name || "系统"}
            </span>
            <Badge className={getStatusColor(connection.status)} size="sm">
              {connection.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono truncate">
            {connection.connection}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Badge variant="outline" size="sm">
            {connection.protocol || "Unknown"}
          </Badge>
        </div>
        <Badge
          className={getRiskColor(connection.risk_level || "low")}
          size="sm"
        >
          {connection.risk_level === "critical"
            ? "严重"
            : connection.risk_level === "medium"
              ? "中危"
              : "正常"}
        </Badge>
        <Button
          size="sm"
          className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2"
        >
          <Eye className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  const CompactServiceRow = ({ service }: { service: WindowsService }) => (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border border-matrix-border hover:bg-matrix-surface/50 transition-colors",
        service.risk_level === "critical" && "border-red-500/30 bg-red-500/5",
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-2">
          {service.risk_level === "critical" && (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium">{service.name}</span>
            <Badge className={getStatusColor(service.status)} size="sm">
              {service.status === "running"
                ? "运行"
                : service.status === "stopped"
                  ? "停止"
                  : service.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {service.display_name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs">
            {service.startup_type === "automatic"
              ? "自动"
              : service.startup_type === "manual"
                ? "手动"
                : "禁用"}
          </p>
        </div>
        <Badge className={getRiskColor(service.risk_level || "low")} size="sm">
          {service.risk_level === "critical"
            ? "严重"
            : service.risk_level === "medium"
              ? "中危"
              : "正常"}
        </Badge>
        <Button
          size="sm"
          className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2"
        >
          <Eye className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen matrix-bg">
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Optimized Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white glow-text mb-2">
              系统实时监控
            </h1>
            <p className="text-muted-foreground">
              统一监控系统进程、网络连接和系统服务 •{" "}
              <span className="text-green-400">
                最后更新: {formatTimestamp(new Date().toISOString())}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="全局搜索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 cyber-input"
              />
            </div>
            <Button
              size="sm"
              onClick={() =>
                setViewMode(viewMode === "compact" ? "detailed" : "compact")
              }
              className="bg-purple-500/20 text-purple-400 border-purple-500/30"
            >
              {viewMode === "compact" ? (
                <BarChart3 className="w-4 h-4 mr-2" />
              ) : (
                <PieChart className="w-4 h-4 mr-2" />
              )}
              {viewMode === "compact" ? "详细" : "紧凑"}
            </Button>
            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-500/20 text-blue-400 border-blue-500/30"
            >
              <RefreshCw
                className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")}
              />
              刷新
            </Button>
            <Button
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                "border",
                autoRefresh
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-gray-500/20 text-gray-400 border-gray-500/30",
              )}
            >
              {autoRefresh ? (
                <Play className="w-4 h-4 mr-2" />
              ) : (
                <Pause className="w-4 h-4 mr-2" />
              )}
              {autoRefresh ? "自动" : "手动"}
            </Button>
          </div>
        </div>

        {/* Enhanced System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[
            {
              label: "CPU使用率",
              value: systemStats.cpuUsage,
              unit: "%",
              icon: Cpu,
              color: "blue",
              progress: systemStats.cpuUsage,
            },
            {
              label: "内存使用",
              value: systemStats.memoryUsage,
              unit: "%",
              icon: MemoryStick,
              color: "green",
              progress: systemStats.memoryUsage,
            },
            {
              label: "运行进程",
              value: systemStats.totalProcesses,
              unit: "个",
              icon: Activity,
              color: "purple",
            },
            {
              label: "网络连接",
              value: systemStats.totalConnections,
              unit: "个",
              icon: Network,
              color: "orange",
            },
            {
              label: "系统服务",
              value: systemStats.totalServices,
              unit: "个",
              icon: Settings,
              color: "cyan",
            },
            {
              label: "严重威胁",
              value: systemStats.criticalThreats,
              unit: "个",
              icon: AlertTriangle,
              color: "red",
            },
          ].map((stat, index) => (
            <Card key={index} className="cyber-card-enhanced">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon
                    className={cn(
                      "w-5 h-5",
                      stat.color === "blue" && "text-blue-400",
                      stat.color === "green" && "text-green-400",
                      stat.color === "purple" && "text-purple-400",
                      stat.color === "orange" && "text-orange-400",
                      stat.color === "cyan" && "text-cyan-400",
                      stat.color === "red" && "text-red-400",
                    )}
                  />
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={cn(
                        "text-xl font-bold",
                        stat.color === "blue" && "text-blue-400",
                        stat.color === "green" && "text-green-400",
                        stat.color === "purple" && "text-purple-400",
                        stat.color === "orange" && "text-orange-400",
                        stat.color === "cyan" && "text-cyan-400",
                        stat.color === "red" && "text-red-400",
                      )}
                    >
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.unit}
                    </span>
                  </div>
                  {stat.progress !== undefined && (
                    <Progress value={stat.progress} className="h-1" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Critical Threats Alert Panel */}
        {systemStats.criticalThreats > 0 && (
          <Card className="cyber-card-enhanced border-red-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  严重威胁告警
                  <Badge className="bg-red-600/20 text-red-400 border-red-600/40">
                    {systemStats.criticalThreats} 个威胁
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSection("threats")}
                  className="bg-matrix-surface border-matrix-border"
                >
                  {expandedSections.threats ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.threats && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockProcesses
                    .filter((p) => p.risk_level === "critical")
                    .map((process) => (
                      <div
                        key={process.id}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-red-400" />
                            <span className="font-medium text-red-400">
                              高危进程
                            </span>
                          </div>
                          <Badge className="bg-red-600/20 text-red-400 border-red-600/40">
                            PID: {process.pid}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">{process.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span>CPU: {process.cpu_percent.toFixed(1)}%</span>
                          <span>
                            内存: {process.memory_percent.toFixed(1)}%
                          </span>
                          <span>线程: {process.num_threads}</span>
                          <span>
                            用户: {process.username.split("\\").pop()}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-1 flex-1"
                          >
                            <Flag className="w-3 h-3 mr-1" />
                            标记
                          </Button>
                          <Button
                            size="sm"
                            className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-2 py-1 flex-1"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            隔离
                          </Button>
                        </div>
                      </div>
                    ))}
                  {mockConnections
                    .filter((c) => c.risk_level === "critical")
                    .map((connection) => (
                      <div
                        key={connection.id}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-red-400" />
                            <span className="font-medium text-red-400">
                              可疑连接
                            </span>
                          </div>
                          <Badge className="bg-red-600/20 text-red-400 border-red-600/40">
                            ID: {connection.id}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">
                          {connection.process_name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2 font-mono">
                          {connection.connection}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-1 flex-1"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            阻断
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-1 flex-1"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            详情
                          </Button>
                        </div>
                      </div>
                    ))}
                  {mockServices
                    .filter((s) => s.risk_level === "critical")
                    .map((service) => (
                      <div
                        key={service.name}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-red-400" />
                            <span className="font-medium text-red-400">
                              可疑服务
                            </span>
                          </div>
                          <Badge className="bg-red-600/20 text-red-400 border-red-600/40">
                            {service.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">{service.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {service.display_name}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-1 flex-1"
                          >
                            <Pause className="w-3 h-3 mr-1" />
                            停止
                          </Button>
                          <Button
                            size="sm"
                            className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-2 py-1 flex-1"
                          >
                            <Flag className="w-3 h-3 mr-1" />
                            标记
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Main Monitoring Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* System Processes */}
          <Card className="cyber-card-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  系统进程
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                    {filteredProcesses.length} 个
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSection("processes")}
                  className="bg-matrix-surface border-matrix-border"
                >
                  {expandedSections.processes ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.processes && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {filteredProcesses.slice(0, 8).map((process) => (
                    <CompactProcessRow key={process.id} process={process} />
                  ))}
                </div>
                {filteredProcesses.length > 8 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-matrix-surface border-matrix-border"
                    >
                      查看全部 {filteredProcesses.length} 个进程
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Network Connections */}
          <Card className="cyber-card-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-400" />
                  网络连接
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                    {filteredConnections.length} 个
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSection("connections")}
                  className="bg-matrix-surface border-matrix-border"
                >
                  {expandedSections.connections ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.connections && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {filteredConnections.slice(0, 8).map((connection) => (
                    <CompactConnectionRow
                      key={connection.id}
                      connection={connection}
                    />
                  ))}
                </div>
                {filteredConnections.length > 8 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-matrix-surface border-matrix-border"
                    >
                      查看全部 {filteredConnections.length} 个连接
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        {/* System Services */}
        <Card className="cyber-card-enhanced">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-400" />
                系统服务
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                  {filteredServices.length} 个
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSection("services")}
                className="bg-matrix-surface border-matrix-border"
              >
                {expandedSections.services ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.services && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredServices.map((service, index) => (
                  <CompactServiceRow key={index} service={service} />
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SystemMonitor;
