import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  TrendingUp,
  Wifi,
  Globe,
  Zap,
  Users,
  Server,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealTimeData, generateNetworkData } from "@/hooks/useRealTimeData";

interface NetworkAnalysisProps {
  className?: string;
}

// 生成地理位置数据
function generateGeoData() {
  return [
    { country: "中国", attacks: 45, color: "#ff0040" },
    { country: "美国", attacks: 32, color: "#ff6600" },
    { country: "俄罗斯", attacks: 28, color: "#ffcc00" },
    { country: "德国", attacks: 15, color: "#39ff14" },
    { country: "日本", attacks: 12, color: "#00f5ff" },
    { country: "其他", attacks: 23, color: "#bf00ff" },
  ];
}

// 生成协议分析数据
function generateProtocolData() {
  return [
    { protocol: "HTTP/HTTPS", percentage: 45, attacks: 234 },
    { protocol: "SSH", percentage: 25, attacks: 128 },
    { protocol: "FTP", percentage: 15, attacks: 78 },
    { protocol: "SMTP", percentage: 10, attacks: 52 },
    { protocol: "其他", percentage: 5, attacks: 26 },
  ];
}

export function NetworkAnalysis({ className }: NetworkAnalysisProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [selectedChart, setSelectedChart] = useState("traffic");

  const { data: networkData, isUpdating } = useRealTimeData(
    generateNetworkData,
    {
      interval: 10000,
      enabled: true,
    },
  );

  const geoData = generateGeoData();
  const protocolData = generateProtocolData();

  const timeRanges = [
    { value: "1h", label: "1小时" },
    { value: "6h", label: "6小时" },
    { value: "24h", label: "24小时" },
    { value: "7d", label: "7天" },
    { value: "30d", label: "30天" },
  ];

  const chartTypes = [
    { value: "traffic", label: "流量分析", icon: Activity },
    { value: "geo", label: "地理分布", icon: Globe },
    { value: "protocol", label: "协议分析", icon: Server },
    { value: "performance", label: "性能指标", icon: Zap },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="cyber-card p-3 border border-neon-blue/30">
          <p className="text-neon-blue font-mono text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
              {entry.dataKey === "bandwidth"
                ? " Mbps"
                : entry.dataKey === "percentage"
                  ? "%"
                  : " 个"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "traffic":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkData}>
                <defs>
                  <linearGradient
                    id="inboundGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="outboundGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#39ff14" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="threatsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ff0040" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff0040" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stroke="#ff0040"
                  strokeWidth={2}
                  fill="url(#threatsGradient)"
                  name="威胁数量"
                />
                <Area
                  type="monotone"
                  dataKey="inbound"
                  stroke="#00f5ff"
                  strokeWidth={2}
                  fill="url(#inboundGradient)"
                  name="入站流量"
                />
                <Area
                  type="monotone"
                  dataKey="outbound"
                  stroke="#39ff14"
                  strokeWidth={2}
                  fill="url(#outboundGradient)"
                  name="出站流量"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case "geo":
        return (
          <div className="h-80 flex items-center justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={geoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="attacks"
                    label={({ country, attacks }) => `${country}: ${attacks}`}
                  >
                    {geoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "protocol":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis
                  type="number"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="protocol"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="attacks"
                  fill="#00f5ff"
                  radius={[0, 4, 4, 0]}
                  name="攻击次数"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "performance":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="bandwidth"
                  stroke="#39ff14"
                  strokeWidth={3}
                  dot={{ fill: "#39ff14", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#39ff14", strokeWidth: 2 }}
                  name="带宽���用"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("cyber-card p-6", className)}>
      {/* 头部控制 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Activity className="w-6 h-6 text-neon-blue" />
          <span>网络流量分析</span>
          {isUpdating && (
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
          )}
        </h3>

        <div className="flex items-center space-x-4">
          {/* 时间范围选择 */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-1 bg-matrix-surface border border-matrix-border rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 图表类型选择 */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
        {chartTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => setSelectedChart(type.value)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap",
                selectedChart === type.value
                  ? "bg-neon-blue/20 border border-neon-blue text-neon-blue"
                  : "bg-matrix-surface border border-matrix-border text-muted-foreground hover:text-white",
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* 图表区域 */}
      {renderChart()}

      {/* 统计摘要 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-matrix-surface rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-neon-blue" />
            <span className="text-xs text-muted-foreground">并发用户</span>
          </div>
          <p className="text-lg font-semibold text-white mt-1">1,247</p>
        </div>
        <div className="bg-matrix-surface rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-neon-green" />
            <span className="text-xs text-muted-foreground">防护成功率</span>
          </div>
          <p className="text-lg font-semibold text-white mt-1">98.5%</p>
        </div>
        <div className="bg-matrix-surface rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-threat-medium" />
            <span className="text-xs text-muted-foreground">平均延迟</span>
          </div>
          <p className="text-lg font-semibold text-white mt-1">12ms</p>
        </div>
        <div className="bg-matrix-surface rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-neon-purple" />
            <span className="text-xs text-muted-foreground">峰值流量</span>
          </div>
          <p className="text-lg font-semibold text-white mt-1">2.1 Gbps</p>
        </div>
      </div>
    </div>
  );
}
