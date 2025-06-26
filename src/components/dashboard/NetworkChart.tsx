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
  Cell,
} from "recharts";
import { Activity, TrendingUp, Wifi } from "lucide-react";

// 生成模拟数据
const generateNetworkData = () => {
  const now = new Date();
  const data = [];

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      inbound: Math.floor(Math.random() * 100) + 20,
      outbound: Math.floor(Math.random() * 80) + 15,
      threats: Math.floor(Math.random() * 20),
      bandwidth: Math.floor(Math.random() * 500) + 100,
    });
  }

  return data;
};

const generateThreatData = () => {
  // 生成动态数据以确保威胁分布有变化
  const baseData = [
    { name: "DDoS攻击", baseValue: 45, color: "#ff4444" },
    { name: "恶意软件", baseValue: 38, color: "#ff8800" },
    { name: "钓鱼攻击", baseValue: 29, color: "#ffdd00" },
    { name: "暴力破解", baseValue: 22, color: "#44ff44" },
    { name: "异常流量", baseValue: 15, color: "#4488ff" },
  ];

  return baseData.map((item) => ({
    ...item,
    value: item.baseValue + Math.floor(Math.random() * 20) - 10, // ±10 变化
  }));
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="cyber-card p-3 border border-neon-blue/30">
        <p className="text-neon-blue font-mono text-sm">{`时间: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
            {entry.dataKey === "bandwidth" ? " Mbps" : " 个"}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function NetworkChart() {
  const networkData = generateNetworkData();
  const threatData = generateThreatData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 网络流量趋势 */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">网络流量趋势</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-blue rounded-full" />
              <span className="text-muted-foreground">入站流量</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-green rounded-full" />
              <span className="text-muted-foreground">出站流量</span>
            </div>
          </div>
        </div>

        <div className="h-64">
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
                dataKey="inbound"
                stroke="#00f5ff"
                strokeWidth={2}
                fill="url(#inboundGradient)"
              />
              <Area
                type="monotone"
                dataKey="outbound"
                stroke="#39ff14"
                strokeWidth={2}
                fill="url(#outboundGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 威胁类型分布 */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-threat-critical" />
            <h3 className="text-lg font-semibold text-white">威胁类型分布</h3>
          </div>
          <span className="text-sm text-muted-foreground">过去24小时</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={threatData} layout="horizontal">
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
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="cyber-card p-3 border border-threat-critical/30">
                        <p className="text-threat-critical font-mono text-sm">
                          {payload[0].payload.name}: {payload[0].value} 次
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {threatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 带宽使用情况 */}
      <div className="chart-container lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-neon-green" />
            <h3 className="text-lg font-semibold text-white">带宽使用情况</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">当前: </span>
            <span className="text-neon-green font-mono">847 Mbps</span>
          </div>
        </div>

        <div className="h-48">
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
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
