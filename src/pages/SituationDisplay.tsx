import { useState, useEffect } from "react";
import {
  Monitor,
  Activity,
  Shield,
  AlertTriangle,
  Zap,
  Globe,
  Server,
  Eye,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  Wifi,
  Users,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
} from "lucide-react";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

// 顶部状态栏
function TopStatusBar() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const currentTime = new Date().toLocaleString("zh-CN");

  return (
    <div className="bg-matrix-surface/90 backdrop-blur border-b border-matrix-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Monitor className="w-6 h-6 text-neon-blue" />
            <div>
              <h1 className="text-xl font-bold text-white">
                CyberGuard 态势监控中心
              </h1>
              <p className="text-sm text-muted-foreground">
                网络安全态势感知平台
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
              <span className="text-neon-green text-sm font-mono">
                系统在线
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse" />
              <span className="text-neon-blue text-sm font-mono">监控正常</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="text-muted-foreground">
            最后更新: {realTimeData?.lastUpdate || currentTime}
          </div>
          <div className="text-muted-foreground">在线节点: 47/50</div>
          <div className="text-neon-blue font-mono">{currentTime}</div>
        </div>
      </div>
    </div>
  );
}

// 关键指标卡片
function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  trend,
  trendValue,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  color: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-neon-green" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-threat-critical" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="cyber-card p-4 bg-matrix-surface/80 backdrop-blur border border-matrix-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className="text-xs text-muted-foreground">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className={`text-2xl font-bold font-mono ${color}`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

// 威胁等级分布饼图
function ThreatLevelChart() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 3000,
    enabled: true,
  });

  const threatData = [
    {
      name: "严重",
      value: 2,
      color: "#ff0033",
    },
    {
      name: "高危",
      value: 5,
      color: "#ff6600",
    },
    {
      name: "中等",
      value: 12,
      color: "#ffaa00",
    },
    {
      name: "低危",
      value: 18,
      color: "#00ff88",
    },
  ];

  return (
    <div className="cyber-card p-4 bg-matrix-surface/80 backdrop-blur border border-matrix-border h-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-threat-high" />
        <span>威胁等级分布</span>
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={threatData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {threatData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// 网络流量趋势图
function NetworkTrafficChart() {
  const [trafficData, setTrafficData] = useState([]);

  useEffect(() => {
    const generateTrafficData = () => {
      const data = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          inbound: Math.floor(Math.random() * 50 + 60),
          outbound: Math.floor(Math.random() * 40 + 70),
          threats: Math.floor(Math.random() * 10 + 2),
        });
      }
      return data;
    };

    setTrafficData(generateTrafficData());
    const interval = setInterval(() => {
      setTrafficData(generateTrafficData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-card p-4 bg-matrix-surface/80 backdrop-blur border border-matrix-border h-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Zap className="w-5 h-5 text-neon-orange" />
        <span>网络流量趋势（24小时）</span>
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={trafficData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="time"
            stroke="#666"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis stroke="#666" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="inbound"
            stackId="1"
            stroke="#00f5ff"
            fill="#00f5ff"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="outbound"
            stackId="2"
            stroke="#ff6b00"
            fill="#ff6b00"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="threats"
            stackId="3"
            stroke="#ff0033"
            fill="#ff0033"
            fillOpacity={0.5}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 系统性能监控
function SystemPerformanceChart() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  const performanceData = [
    {
      name: "CPU",
      value: realTimeData?.cpuUsage || 68,
      color: "#ff6b00",
    },
    {
      name: "内存",
      value: realTimeData?.memoryUsage || 72,
      color: "#00f5ff",
    },
    {
      name: "磁盘",
      value: realTimeData?.diskUsage || 45,
      color: "#00ff88",
    },
  ];

  return (
    <div className="cyber-card p-4 bg-matrix-surface/80 backdrop-blur border border-matrix-border h-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Activity className="w-5 h-5 text-neon-blue" />
        <span>系统性能监控</span>
      </h3>
      <div className="space-y-4">
        {performanceData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="text-sm font-mono text-white">
                {item.value}%
              </span>
            </div>
            <div className="w-full bg-matrix-accent rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.color}50`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <Cpu className="w-6 h-6 text-neon-orange mx-auto mb-1" />
          <div className="text-xs text-muted-foreground">CPU负载</div>
          <div className="text-sm font-mono text-neon-orange">
            {realTimeData?.cpuUsage || 68}%
          </div>
        </div>
        <div className="text-center">
          <MemoryStick className="w-6 h-6 text-neon-blue mx-auto mb-1" />
          <div className="text-xs text-muted-foreground">内存使用</div>
          <div className="text-sm font-mono text-neon-blue">
            {realTimeData?.memoryUsage || 72}%
          </div>
        </div>
        <div className="text-center">
          <HardDrive className="w-6 h-6 text-neon-green mx-auto mb-1" />
          <div className="text-xs text-muted-foreground">磁盘使用</div>
          <div className="text-sm font-mono text-neon-green">
            {realTimeData?.diskUsage || 45}%
          </div>
        </div>
      </div>
    </div>
  );
}

// 防火墙状态面板
function FirewallStatusPanel() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  const firewallRules = [
    { name: "入站规则", count: 156, active: 142 },
    { name: "出站规则", count: 89, active: 89 },
    { name: "内网规则", count: 67, active: 63 },
    { name: "DMZ规则", count: 34, active: 34 },
  ];

  return (
    <div className="cyber-card p-4 bg-matrix-surface/80 backdrop-blur border border-matrix-border h-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Shield className="w-5 h-5 text-neon-green" />
        <span>防火墙状态</span>
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-matrix-accent/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full animate-pulse ${
                realTimeData?.firewallStatus === "正常"
                  ? "bg-neon-green"
                  : "bg-threat-critical"
              }`}
            />
            <span className="text-white">防火墙状态</span>
          </div>
          <span
            className={`font-mono ${
              realTimeData?.firewallStatus === "正常"
                ? "text-neon-green"
                : "text-threat-critical"
            }`}
          >
            {realTimeData?.firewallStatus || "正常"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-matrix-accent/20 rounded-lg">
            <div className="text-2xl font-bold text-neon-blue font-mono">
              {realTimeData?.blockedAttacks?.toLocaleString() || "1,247"}
            </div>
            <div className="text-xs text-muted-foreground">已拦截攻击</div>
          </div>
          <div className="text-center p-3 bg-matrix-accent/20 rounded-lg">
            <div className="text-2xl font-bold text-neon-green font-mono">
              {realTimeData?.passThroughRate || 95}%
            </div>
            <div className="text-xs text-muted-foreground">通过率</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">规则���态</h4>
          {firewallRules.map((rule, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-matrix-accent/10 rounded"
            >
              <span className="text-sm text-muted-foreground">{rule.name}</span>
              <span className="text-sm font-mono text-white">
                {rule.active}/{rule.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 地理位置威胁分布
function GeographicThreatMap() {
  const threatLocations = [
    { name: "北京", threats: 8, color: "#ff0033" },
    { name: "上海", threats: 5, color: "#ff6600" },
    { name: "深圳", threats: 12, color: "#ff0033" },
    { name: "广州", threats: 3, color: "#ffaa00" },
    { name: "杭州", threats: 7, color: "#ff6600" },
    { name: "南京", threats: 4, color: "#ffaa00" },
  ];

  return (
    <div className="cyber-card p-4 bg-matrix-surface/80 backdrop-blur border border-matrix-border h-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Globe className="w-5 h-5 text-neon-blue" />
        <span>地理威胁分布</span>
      </h3>

      <div className="space-y-3">
        {threatLocations.map((location, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-matrix-accent/20 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: location.color }}
              />
              <span className="text-white">{location.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-white">
                {location.threats}
              </span>
              <span className="text-xs text-muted-foreground">个威胁</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-matrix-accent/10 rounded-lg">
        <div className="text-sm text-muted-foreground mb-2">威胁热点地区</div>
        <div className="text-xl font-bold text-threat-critical">深圳市</div>
        <div className="text-sm text-muted-foreground">12个活跃威胁</div>
      </div>
    </div>
  );
}

// 实时日志流
function RealTimeLogStream() {
  const [logs, setLogs] = useState([]);
  const [logCounter, setLogCounter] = useState(0);

  useEffect(() => {
    const generateLog = () => {
      const logTypes = [
        { type: "INFO", message: "用户登录成功", color: "text-neon-blue" },
        { type: "WARN", message: "检测到异常访问", color: "text-neon-orange" },
        { type: "ERROR", message: "防火墙拦截攻击", color: "text-threat-high" },
        { type: "INFO", message: "系统备份完成", color: "text-neon-green" },
        { type: "WARN", message: "CPU使用率过高", color: "text-neon-orange" },
      ];

      const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];

      setLogCounter((prev) => {
        const newCounter = prev + 1;
        const newLog = {
          id: `log-${Date.now()}-${newCounter}`, // 使用时间戳+计数器确保唯一性
          time: new Date().toLocaleTimeString("zh-CN"),
          type: randomLog.type,
          message: randomLog.message,
          color: randomLog.color,
        };

        setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 9)]);
        return newCounter;
      });
    };

    const interval = setInterval(generateLog, 3000);
    // 初始化一些日志
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateLog(), i * 500);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-card p-4 bg-matrix-surface/80 backdrop-blur border border-matrix-border h-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-neon-purple" />
        <span>实时日志流</span>
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={`${log.id}-${index}`} // 双重保险：使用ID和索引
            className="p-2 bg-matrix-accent/10 rounded text-sm font-mono border-l-2 border-matrix-border hover:bg-matrix-accent/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">{log.time}</span>
                <span className={`font-semibold ${log.color}`}>
                  [{log.type}]
                </span>
              </div>
            </div>
            <div className="text-white mt-1">{log.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 主要的态势大屏页面
export default function SituationDisplay() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  return (
    <div className="min-h-screen bg-matrix-bg text-white overflow-hidden">
      {/* 顶部状态栏 */}
      <TopStatusBar />

      {/* 主要内容区域 */}
      <div className="p-4 space-y-4">
        {/* 第一行 - 关键指标 */}
        <div className="grid grid-cols-6 gap-4">
          <MetricCard
            title="活跃连接"
            value={realTimeData?.activeConnections || 1247}
            icon={Users}
            color="text-neon-blue"
            trend="up"
            trendValue="+5.2%"
          />
          <MetricCard
            title="实时威胁"
            value={realTimeData?.realTimeThreats || 3}
            icon={AlertTriangle}
            color="text-threat-high"
            trend="down"
            trendValue="-2.1%"
          />
          <MetricCard
            title="网络流量"
            value={
              (realTimeData?.inboundTraffic || 85) +
              (realTimeData?.outboundTraffic || 92)
            }
            unit="MB/s"
            icon={Network}
            color="text-neon-orange"
            trend="up"
            trendValue="+8.7%"
          />
          <MetricCard
            title="系统负载"
            value={realTimeData?.cpuUsage || 68}
            unit="%"
            icon={Cpu}
            color="text-neon-green"
            trend="stable"
            trendValue="0.0%"
          />
          <MetricCard
            title="拦截攻击"
            value={realTimeData?.blockedAttacks || 1247}
            icon={Shield}
            color="text-neon-purple"
            trend="up"
            trendValue="+12.3%"
          />
          <MetricCard
            title="在线节点"
            value="47/50"
            icon={Server}
            color="text-neon-cyan"
            trend="stable"
            trendValue="94%"
          />
        </div>

        {/* 第二行 - 主要图表 */}
        <div className="grid grid-cols-3 gap-4 h-80">
          <NetworkTrafficChart />
          <ThreatLevelChart />
          <SystemPerformanceChart />
        </div>

        {/* 第三行 - 详细监控 */}
        <div className="grid grid-cols-3 gap-4 h-80">
          <FirewallStatusPanel />
          <GeographicThreatMap />
          <RealTimeLogStream />
        </div>
      </div>
    </div>
  );
}
