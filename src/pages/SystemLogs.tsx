import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvancedFilter } from "@/components/ui/AdvancedFilter";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "critical";
  category: "system" | "security" | "network" | "user" | "application";
  source: string;
  message: string;
  details?: string;
  user?: string;
  ip?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:15",
    level: "critical",
    category: "security",
    source: "FirewallEngine",
    message: "检测到DDoS攻击，已自动启动防护措施",
    details: "来源IP: 192.168.1.100, 攻击类型: SYN Flood, 攻击强度: 10,000 pps",
    ip: "192.168.1.100",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:30:08",
    level: "info",
    category: "user",
    source: "AuthService",
    message: "用户登录成功",
    user: "admin",
    ip: "10.0.0.15",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:28:42",
    level: "warning",
    category: "network",
    source: "TrafficMonitor",
    message: "网络流量异常，超过正常阈值25%",
    details: "当前流量: 875 Mbps, 正常阈值: 700 Mbps",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:25:33",
    level: "error",
    category: "application",
    source: "DatabaseConnector",
    message: "数据库连接超时",
    details: "连接池状态: 活跃连接 45/50, 等待连接 12",
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:22:17",
    level: "info",
    category: "system",
    source: "SystemMonitor",
    message: "系统性能检查完成",
    details: "CPU: 45%, Memory: 67%, Disk: 23%",
  },
  {
    id: "6",
    timestamp: "2024-01-15 14:20:55",
    level: "warning",
    category: "security",
    source: "IntrusionDetection",
    message: "检测到可疑登录尝试",
    details: "连续失败登录5次，用户: unknown_user, IP: 203.45.67.89",
    ip: "203.45.67.89",
  },
  {
    id: "7",
    timestamp: "2024-01-15 14:18:22",
    level: "info",
    category: "network",
    source: "BandwidthMonitor",
    message: "带宽使用率正常",
    details: "入站: 234 Mbps, 出站: 189 Mbps",
  },
  {
    id: "8",
    timestamp: "2024-01-15 14:15:10",
    level: "critical",
    category: "security",
    source: "MalwareDetector",
    message: "检测到恶意软件活动",
    details: "文件: /tmp/suspicious.exe, 威胁类型: Trojan.Generic, 已隔离",
  },
];

const logFilters = [
  {
    id: "level",
    label: "日志级别",
    type: "multiselect" as const,
    options: [
      { value: "info", label: "信息" },
      { value: "warning", label: "警告" },
      { value: "error", label: "错误" },
      { value: "critical", label: "严重" },
    ],
  },
  {
    id: "category",
    label: "分类",
    type: "multiselect" as const,
    options: [
      { value: "system", label: "系统" },
      { value: "security", label: "安全" },
      { value: "network", label: "网络" },
      { value: "user", label: "用户" },
      { value: "application", label: "应用" },
    ],
  },
  {
    id: "source",
    label: "来源",
    type: "text" as const,
  },
  {
    id: "timeRange",
    label: "时间范围",
    type: "daterange" as const,
  },
];

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const filteredLogs = logs.filter((log) => {
    // 搜索过滤
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details &&
        log.details.toLowerCase().includes(searchTerm.toLowerCase()));

    // 级别过滤
    if (filters.level && filters.level.length > 0) {
      if (!filters.level.includes(log.level)) return false;
    }

    // 分类过滤
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(log.category)) return false;
    }

    // 来源过滤
    if (filters.source) {
      if (!log.source.toLowerCase().includes(filters.source.toLowerCase()))
        return false;
    }

    return matchesSearch;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="w-4 h-4 text-neon-blue" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-threat-medium" />;
      case "error":
        return <XCircle className="w-4 h-4 text-threat-high" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-threat-critical" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "text-neon-blue bg-neon-blue/10 border-neon-blue/30";
      case "warning":
        return "text-threat-medium bg-threat-medium/10 border-threat-medium/30";
      case "error":
        return "text-threat-high bg-threat-high/10 border-threat-high/30";
      case "critical":
        return "text-threat-critical bg-threat-critical/10 border-threat-critical/30";
      default:
        return "text-muted-foreground bg-muted/10 border-muted/30";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "info":
        return "信息";
      case "warning":
        return "警告";
      case "error":
        return "错误";
      case "critical":
        return "严重";
      default:
        return "未知";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "system":
        return <Monitor className="w-4 h-4" />;
      case "security":
        return <AlertTriangle className="w-4 h-4" />;
      case "network":
        return <Info className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      case "application":
        return <FileText className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "system":
        return "系统";
      case "security":
        return "安全";
      case "network":
        return "网络";
      case "user":
        return "用户";
      case "application":
        return "应用";
      default:
        return "未知";
    }
  };

  const exportLogs = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "时间,级别,分类,来源,消息,详情\n" +
      filteredLogs
        .map(
          (log) =>
            `"${log.timestamp}","${getLevelText(log.level)}","${getCategoryText(log.category)}","${log.source}","${log.message}","${log.details || ""}"`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `system_logs_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.showToast) {
      window.showToast({
        title: "导出成功",
        description: `已导出 ${filteredLogs.length} 条日志记录`,
        type: "success",
      });
    }
  };

  return (
    <div className="p-8 min-h-screen matrix-bg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white glow-text mb-2">
          系统日志
        </h1>
        <p className="text-muted-foreground">
          查看和分析系统运行日志，监控系统状态和安全事件
        </p>
      </div>

      {/* ���计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="cyber-card p-4 border-l-4 border-l-neon-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">总日志数</p>
              <p className="text-xl font-bold text-white">{logs.length}</p>
            </div>
            <FileText className="w-6 h-6 text-neon-blue" />
          </div>
        </div>
        <div className="cyber-card p-4 border-l-4 border-l-threat-critical">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">严重错误</p>
              <p className="text-xl font-bold text-threat-critical">
                {logs.filter((l) => l.level === "critical").length}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-threat-critical" />
          </div>
        </div>
        <div className="cyber-card p-4 border-l-4 border-l-threat-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">警告</p>
              <p className="text-xl font-bold text-threat-medium">
                {logs.filter((l) => l.level === "warning").length}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-threat-medium" />
          </div>
        </div>
        <div className="cyber-card p-4 border-l-4 border-l-neon-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">信息日志</p>
              <p className="text-xl font-bold text-neon-green">
                {logs.filter((l) => l.level === "info").length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-neon-green" />
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="cyber-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="搜索日志消息、来源或详情..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue"
              />
            </div>
            <AdvancedFilter filters={logFilters} onFiltersChange={setFilters} />
            <button
              onClick={exportLogs}
              className="neon-button flex items-center space-x-2 px-4 py-2"
            >
              <Download className="w-4 h-4" />
              <span>导出日志</span>
            </button>
          </div>
        </div>
      </div>

      {/* 日志列表 */}
      <div className="cyber-card">
        <div className="p-6 border-b border-matrix-border">
          <h3 className="text-lg font-semibold text-white">
            日志记录 ({filteredLogs.length})
          </h3>
        </div>

        <div className="divide-y divide-matrix-border/50 max-h-[600px] overflow-y-auto">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-6 hover:bg-matrix-accent/30 transition-colors cursor-pointer"
              onClick={() => setSelectedLog(log)}
            >
              <div className="flex items-start space-x-4">
                {/* 级别图标 */}
                <div className="flex-shrink-0 mt-1">
                  {getLevelIcon(log.level)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* 头部信息 */}
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs border",
                        getLevelColor(log.level),
                      )}
                    >
                      {getLevelText(log.level)}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      {getCategoryIcon(log.category)}
                      <span>{getCategoryText(log.category)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-matrix-surface px-2 py-1 rounded">
                      {log.source}
                    </span>
                  </div>

                  {/* 消息 */}
                  <p className="text-white font-medium mb-2">{log.message}</p>

                  {/* 详情 */}
                  {log.details && (
                    <p className="text-sm text-muted-foreground mb-3 bg-matrix-surface/50 p-2 rounded">
                      {log.details}
                    </p>
                  )}

                  {/* 元数据 */}
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </div>
                    {log.user && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>用户: {log.user}</span>
                      </div>
                    )}
                    {log.ip && (
                      <div className="flex items-center space-x-1">
                        <Monitor className="w-3 h-3" />
                        <span>IP: {log.ip}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 日志详情弹窗 */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedLog(null)}
          />
          <div className="relative w-full max-w-2xl mx-4">
            <div className="cyber-card border-2 border-neon-blue/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">日志详情</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      时间
                    </label>
                    <p className="text-white font-mono">
                      {selectedLog.timestamp}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      级别
                    </label>
                    <p
                      className={cn(
                        "text-sm",
                        getLevelColor(selectedLog.level),
                      )}
                    >
                      {getLevelText(selectedLog.level)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      分类
                    </label>
                    <p className="text-white">
                      {getCategoryText(selectedLog.category)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      来源
                    </label>
                    <p className="text-white font-mono">{selectedLog.source}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">消息</label>
                  <p className="text-white bg-matrix-surface p-3 rounded mt-1">
                    {selectedLog.message}
                  </p>
                </div>

                {selectedLog.details && (
                  <div>
                    <label className="text-sm text-muted-foreground">
                      详细信息
                    </label>
                    <pre className="text-white bg-matrix-surface p-3 rounded mt-1 text-sm overflow-x-auto">
                      {selectedLog.details}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
