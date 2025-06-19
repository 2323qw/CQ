import { useState } from "react";
import {
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InvestigationTrigger } from "@/components/InvestigationTrigger";

interface Alert {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  source: string;
  location: string;
  timestamp: string;
  status: "active" | "investigating" | "resolved";
  severity: number;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "DDoS攻击检测",
    description:
      "检测到来自多个IP地址的大量异常请求，疑似DDoS攻击，已触发紧急响应流程",
    source: "192.168.1.100",
    location: "北京市",
    timestamp: "2024-01-15 14:32:15",
    status: "active",
    severity: 9.2,
  },
  {
    id: "2",
    type: "high",
    title: "恶意软件感染",
    description: "发现主机存在木马程序，已尝试访问敏感文件，建议立即隔离",
    source: "192.168.1.156",
    location: "上海市",
    timestamp: "2024-01-15 14:24:08",
    status: "investigating",
    severity: 8.1,
  },
  {
    id: "3",
    type: "medium",
    title: "异常登录���试",
    description: "检测到来自未知地理位置的多次登录失败，可能存在暴力破解行为",
    source: "203.45.67.89",
    location: "美国",
    timestamp: "2024-01-15 14:17:42",
    status: "investigating",
    severity: 6.5,
  },
  {
    id: "4",
    type: "low",
    title: "端口扫描",
    description: "检测到对多个端口的扫描行为，暂无进一步恶意活动",
    source: "172.16.0.45",
    location: "深圳市",
    timestamp: "2024-01-15 14:09:21",
    status: "resolved",
    severity: 3.2,
  },
  {
    id: "5",
    type: "medium",
    title: "数据泄露风险",
    description: "发现敏感数据在非授权网络传输，需要检查数据加密策略",
    source: "10.0.0.88",
    location: "广州市",
    timestamp: "2024-01-15 13:57:33",
    status: "active",
    severity: 7.3,
  },
  {
    id: "6",
    type: "high",
    title: "钓鱼邮件攻击",
    description: "检测到针对内部用户的钓鱼邮件攻击，已拦截邮件并通知用户",
    source: "smtp.malicious.com",
    location: "俄罗斯",
    timestamp: "2024-01-15 13:45:17",
    status: "resolved",
    severity: 8.7,
  },
];

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.includes(searchTerm);
    const matchesType = selectedType === "all" || alert.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || alert.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getThreatColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-l-threat-critical bg-threat-critical/5";
      case "high":
        return "border-l-threat-high bg-threat-high/5";
      case "medium":
        return "border-l-threat-medium bg-threat-medium/5";
      case "low":
        return "border-l-threat-low bg-threat-low/5";
      default:
        return "border-l-threat-info bg-threat-info/5";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-threat-critical bg-threat-critical/20";
      case "investigating":
        return "text-threat-medium bg-threat-medium/20";
      case "resolved":
        return "text-threat-low bg-threat-low/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "活跃";
      case "investigating":
        return "调查中";
      case "resolved":
        return "已解决";
      default:
        return "未知";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "critical":
        return "严重";
      case "high":
        return "高危";
      case "medium":
        return "中危";
      case "low":
        return "低危";
      default:
        return "信息";
    }
  };

  return (
    <div className="min-h-screen matrix-bg">
      <div className="p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white glow-text mb-2">
            威胁告警管理
          </h1>
          <p className="text-muted-foreground">查看、管理和响应安全威胁告警</p>
        </div>

        {/* 搜索和过滤 */}
        <div className="cyber-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="搜索告警..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
              />
            </div>

            {/* 威胁级别过滤 */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            >
              <option value="all">所有级别</option>
              <option value="critical">严重</option>
              <option value="high">高危</option>
              <option value="medium">中危</option>
              <option value="low">低危</option>
            </select>

            {/* 状态过滤 */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            >
              <option value="all">所有状态</option>
              <option value="active">活跃</option>
              <option value="investigating">调查中</option>
              <option value="resolved">已解决</option>
            </select>

            {/* 导出按钮 */}
            <button className="neon-button flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="cyber-card p-4 border-l-4 border-l-threat-critical">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">严重告警</p>
                <p className="text-2xl font-bold text-threat-critical">
                  {mockAlerts.filter((a) => a.type === "critical").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-threat-critical" />
            </div>
          </div>
          <div className="cyber-card p-4 border-l-4 border-l-threat-high">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">高危告警</p>
                <p className="text-2xl font-bold text-threat-high">
                  {mockAlerts.filter((a) => a.type === "high").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-threat-high" />
            </div>
          </div>
          <div className="cyber-card p-4 border-l-4 border-l-threat-medium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">中危告警</p>
                <p className="text-2xl font-bold text-threat-medium">
                  {mockAlerts.filter((a) => a.type === "medium").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-threat-medium" />
            </div>
          </div>
          <div className="cyber-card p-4 border-l-4 border-l-threat-low">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">低危告警</p>
                <p className="text-2xl font-bold text-threat-low">
                  {mockAlerts.filter((a) => a.type === "low").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-threat-low" />
            </div>
          </div>
        </div>

        {/* 告警列表 */}
        <div className="cyber-card">
          <div className="p-6 border-b border-matrix-border">
            <h3 className="text-lg font-semibold text-white">
              告警列表 ({filteredAlerts.length})
            </h3>
          </div>

          <div className="divide-y divide-matrix-border">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-6 hover:bg-matrix-accent/50 transition-all duration-200 cursor-pointer border-l-4",
                  getThreatColor(alert.type),
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-mono",
                          alert.type === "critical" &&
                            "bg-threat-critical/20 text-threat-critical",
                          alert.type === "high" &&
                            "bg-threat-high/20 text-threat-high",
                          alert.type === "medium" &&
                            "bg-threat-medium/20 text-threat-medium",
                          alert.type === "low" &&
                            "bg-threat-low/20 text-threat-low",
                        )}
                      >
                        {getTypeText(alert.type)}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-mono",
                          getStatusColor(alert.status),
                        )}
                      >
                        {getStatusText(alert.status)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        风险评分: {alert.severity}/10
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-white mb-2">
                      {alert.title}
                    </h4>

                    <p className="text-sm text-muted-foreground mb-4">
                      {alert.description}
                    </p>

                    <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>源: {alert.source}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex items-center space-x-2">
                    <button className="px-3 py-1 text-xs border border-neon-blue/30 text-neon-blue rounded hover:bg-neon-blue/10 transition-colors">
                      详情
                    </button>
                    <button className="px-3 py-1 text-xs border border-threat-medium/30 text-threat-medium rounded hover:bg-threat-medium/10 transition-colors">
                      处理
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
