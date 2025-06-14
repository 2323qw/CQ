import { AlertTriangle, Clock, MapPin, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  source: string;
  location: string;
  timestamp: string;
  status: "active" | "investigating" | "resolved";
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "DDoS攻击检测",
    description: "检测到来自多个IP地址的大量异常请求，疑似DDoS攻击",
    source: "192.168.1.100",
    location: "北京市",
    timestamp: "2分钟前",
    status: "active",
  },
  {
    id: "2",
    type: "high",
    title: "恶意软件感染",
    description: "发现主机存在木马程序，已尝试访问敏感文件",
    source: "192.168.1.156",
    location: "上海市",
    timestamp: "8分钟前",
    status: "investigating",
  },
  {
    id: "3",
    type: "medium",
    title: "异常登录尝试",
    description: "检测到来自未知地理位置的多次登录失败",
    source: "203.45.67.89",
    location: "美国",
    timestamp: "15分钟前",
    status: "investigating",
  },
  {
    id: "4",
    type: "low",
    title: "端口扫描",
    description: "检测到对多个端口的扫描行为",
    source: "172.16.0.45",
    location: "深圳市",
    timestamp: "23分钟前",
    status: "resolved",
  },
  {
    id: "5",
    type: "medium",
    title: "数据泄露风险",
    description: "发现敏感数据在非授权网络传输",
    source: "10.0.0.88",
    location: "广州市",
    timestamp: "35分钟前",
    status: "active",
  },
];

function AlertItem({ alert }: { alert: Alert }) {
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

  return (
    <div
      className={cn(
        "cyber-card border-l-4 hover:bg-matrix-accent/50 transition-all duration-200 cursor-pointer",
        getThreatColor(alert.type),
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle
                className={cn(
                  "w-4 h-4",
                  alert.type === "critical" && "text-threat-critical",
                  alert.type === "high" && "text-threat-high",
                  alert.type === "medium" && "text-threat-medium",
                  alert.type === "low" && "text-threat-low",
                )}
              />
              <h4 className="font-semibold text-white truncate">
                {alert.title}
              </h4>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-mono",
                  getStatusColor(alert.status),
                )}
              >
                {getStatusText(alert.status)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {alert.description}
            </p>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>源IP: {alert.source}</span>
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

          <div className="ml-4 flex-shrink-0">
            <div
              className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                alert.status === "active" && "bg-threat-critical",
                alert.status === "investigating" && "bg-threat-medium",
                alert.status === "resolved" && "bg-threat-low",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertsList() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-threat-critical" />
          <h3 className="text-lg font-semibold text-white">实时威胁告警</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            共 {mockAlerts.length} 条告警
          </span>
          <button className="neon-button text-xs px-3 py-1">查看全部</button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {mockAlerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
