import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Activity,
  Globe,
  Shield,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Clock,
  Users,
  Zap,
  Eye,
  Lock,
  Unlock,
  Wifi,
  Server,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface TrafficFlow {
  id: string;
  sourceIp: string;
  destIp: string;
  sourcePort: number;
  destPort: number;
  protocol: string;
  bytes: number;
  packets: number;
  duration: number;
  timestamp: string;
  risk: "low" | "medium" | "high" | "critical";
  classification: string;
}

interface ProtocolStats {
  protocol: string;
  percentage: number;
  bytes: number;
  packets: number;
  connections: number;
}

interface BandwidthData {
  timestamp: string;
  inbound: number;
  outbound: number;
  total: number;
}

export default function TrafficAnalysis() {
  const [selectedTab, setSelectedTab] = useState<
    "realtime" | "flows" | "protocols" | "security"
  >("realtime");
  const [timeRange, setTimeRange] = useState("1h");
  const [protocolFilter, setProtocolFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 模拟流量数据
  const [trafficFlows] = useState<TrafficFlow[]>([
    {
      id: "flow-001",
      sourceIp: "192.168.1.100",
      destIp: "8.8.8.8",
      sourcePort: 52341,
      destPort: 53,
      protocol: "DNS",
      bytes: 1024,
      packets: 8,
      duration: 0.25,
      timestamp: "2024-01-20 14:30:25",
      risk: "low",
      classification: "正常DNS查询",
    },
    {
      id: "flow-002",
      sourceIp: "192.168.1.50",
      destIp: "203.0.113.10",
      sourcePort: 45123,
      destPort: 80,
      protocol: "HTTP",
      bytes: 50432,
      packets: 127,
      duration: 2.5,
      timestamp: "2024-01-20 14:30:22",
      risk: "medium",
      classification: "可疑下载",
    },
    {
      id: "flow-003",
      sourceIp: "10.0.1.15",
      destIp: "185.199.108.133",
      sourcePort: 33891,
      destPort: 443,
      protocol: "HTTPS",
      bytes: 2048576,
      packets: 1567,
      duration: 45.2,
      timestamp: "2024-01-20 14:28:15",
      risk: "low",
      classification: "正常HTTPS通信",
    },
    {
      id: "flow-004",
      sourceIp: "192.168.2.75",
      destIp: "198.51.100.42",
      sourcePort: 49876,
      destPort: 22,
      protocol: "SSH",
      bytes: 8192,
      packets: 45,
      duration: 120.5,
      timestamp: "2024-01-20 14:25:10",
      risk: "high",
      classification: "SSH爆破尝试",
    },
    {
      id: "flow-005",
      sourceIp: "172.16.1.5",
      destIp: "192.168.1.100",
      sourcePort: 3389,
      destPort: 3389,
      protocol: "RDP",
      bytes: 1048576,
      packets: 892,
      duration: 1800,
      timestamp: "2024-01-20 14:00:00",
      risk: "critical",
      classification: "未授权RDP访问",
    },
  ]);

  // 模拟协议统计
  const [protocolStats] = useState<ProtocolStats[]>([
    {
      protocol: "HTTPS",
      percentage: 45.2,
      bytes: 1073741824,
      packets: 892341,
      connections: 1567,
    },
    {
      protocol: "HTTP",
      percentage: 28.7,
      bytes: 671088640,
      packets: 567234,
      connections: 892,
    },
    {
      protocol: "DNS",
      percentage: 12.1,
      bytes: 104857600,
      packets: 125678,
      connections: 2341,
    },
    {
      protocol: "SSH",
      percentage: 8.5,
      bytes: 83886080,
      packets: 89456,
      connections: 234,
    },
    {
      protocol: "FTP",
      percentage: 3.2,
      bytes: 33554432,
      packets: 34567,
      connections: 156,
    },
    {
      protocol: "Others",
      percentage: 2.3,
      bytes: 25165824,
      packets: 23456,
      connections: 89,
    },
  ]);

  // 模拟带宽数据
  const [bandwidthData] = useState<BandwidthData[]>([
    { timestamp: "14:00", inbound: 125.6, outbound: 89.3, total: 214.9 },
    { timestamp: "14:10", inbound: 134.2, outbound: 92.1, total: 226.3 },
    { timestamp: "14:20", inbound: 145.8, outbound: 98.7, total: 244.5 },
    { timestamp: "14:30", inbound: 156.3, outbound: 105.2, total: 261.5 },
    { timestamp: "14:40", inbound: 142.7, outbound: 87.9, total: 230.6 },
    { timestamp: "14:50", inbound: 138.9, outbound: 94.5, total: 233.4 },
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const filteredFlows = trafficFlows.filter((flow) => {
    const matchesSearch =
      flow.sourceIp.includes(searchTerm) ||
      flow.destIp.includes(searchTerm) ||
      flow.protocol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProtocol =
      protocolFilter === "all" ||
      flow.protocol.toLowerCase() === protocolFilter.toLowerCase();
    return matchesSearch && matchesProtocol;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-neon-blue" />
              网络流量分析
            </h1>
            <p className="text-muted-foreground mt-2">
              实时监控网络流量，分析通信模式和安全威胁
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">5分钟</SelectItem>
                <SelectItem value="1h">1小时</SelectItem>
                <SelectItem value="1d">1天</SelectItem>
                <SelectItem value="1w">1周</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              刷新
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总流量</p>
                  <p className="text-2xl font-bold text-cyan-400">2.1 GB</p>
                  <p className="text-xs text-green-400 mt-1">↑ 12.5%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃连接</p>
                  <p className="text-2xl font-bold text-green-400">1,247</p>
                  <p className="text-xs text-green-400 mt-1">↑ 8.3%</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均带宽</p>
                  <p className="text-2xl font-bold text-yellow-400">256 MB/s</p>
                  <p className="text-xs text-red-400 mt-1">↓ 3.2%</p>
                </div>
                <Wifi className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">安全事件</p>
                  <p className="text-2xl font-bold text-red-400">18</p>
                  <p className="text-xs text-red-400 mt-1">↑ 25.0%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-matrix-surface/50">
            <TabsTrigger
              value="realtime"
              className="data-[state=active]:bg-neon-blue/20"
            >
              实时监控
            </TabsTrigger>
            <TabsTrigger
              value="flows"
              className="data-[state=active]:bg-neon-blue/20"
            >
              流量详情
            </TabsTrigger>
            <TabsTrigger
              value="protocols"
              className="data-[state=active]:bg-neon-blue/20"
            >
              协议分析
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-neon-blue/20"
            >
              安全分析
            </TabsTrigger>
          </TabsList>

          {/* 实时监控 */}
          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 带宽趋势图 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-neon-blue" />
                    带宽使用趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-4 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-12 h-12 text-neon-blue mx-auto mb-3" />
                      <p className="text-lg font-medium text-white">
                        实时带宽图表
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        显示入站和出站流量趋势
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 实时流量状态 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    实时流量状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ArrowDown className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium text-green-400">入站流量</p>
                          <p className="text-sm text-muted-foreground">
                            当前入站速率
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          156.3 MB/s
                        </p>
                        <p className="text-xs text-green-400">↑ 8.5%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ArrowUp className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-blue-400">出站流量</p>
                          <p className="text-sm text-muted-foreground">
                            当前出站速率
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-400">
                          105.2 MB/s
                        </p>
                        <p className="text-xs text-red-400">↓ 2.1%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ArrowUpDown className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium text-purple-400">总流量</p>
                          <p className="text-sm text-muted-foreground">
                            综合流量速率
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-400">
                          261.5 MB/s
                        </p>
                        <p className="text-xs text-green-400">↑ 5.7%</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>带宽利用率</span>
                      <span>72%</span>
                    </div>
                    <div className="w-full bg-matrix-surface rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 顶级主机通信 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  顶级通信主机
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-matrix-border">
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          主机地址
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          发送流量
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          接收流量
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          连接数
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          状态
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          ip: "192.168.1.100",
                          sent: "1.2 GB",
                          received: "856 MB",
                          connections: 342,
                          status: "normal",
                        },
                        {
                          ip: "10.0.1.15",
                          sent: "892 MB",
                          received: "2.1 GB",
                          connections: 289,
                          status: "normal",
                        },
                        {
                          ip: "172.16.1.5",
                          sent: "567 MB",
                          received: "234 MB",
                          connections: 156,
                          status: "warning",
                        },
                        {
                          ip: "192.168.2.75",
                          sent: "123 MB",
                          received: "45 MB",
                          connections: 89,
                          status: "critical",
                        },
                      ].map((host, index) => (
                        <tr
                          key={index}
                          className="border-b border-matrix-border/50 hover:bg-matrix-accent/20"
                        >
                          <td className="py-3 px-4 font-mono text-sm">
                            {host.ip}
                          </td>
                          <td className="py-3 px-4">{host.sent}</td>
                          <td className="py-3 px-4">{host.received}</td>
                          <td className="py-3 px-4">{host.connections}</td>
                          <td className="py-3 px-4">
                            <Badge
                              className={getRiskColor(
                                host.status === "normal"
                                  ? "low"
                                  : host.status === "warning"
                                    ? "medium"
                                    : "critical",
                              )}
                            >
                              {host.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 流量详情 */}
          <TabsContent value="flows" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neon-blue" />
                    网络流量详情
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索IP地址或协议..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <Select
                      value={protocolFilter}
                      onValueChange={setProtocolFilter}
                    >
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="协议" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有协议</SelectItem>
                        <SelectItem value="https">HTTPS</SelectItem>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="dns">DNS</SelectItem>
                        <SelectItem value="ssh">SSH</SelectItem>
                        <SelectItem value="rdp">RDP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-matrix-border">
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          时间戳
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          源地址
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          目标地址
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          协议
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          数据量
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          风险等级
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFlows.map((flow) => (
                        <tr
                          key={flow.id}
                          className="border-b border-matrix-border/50 hover:bg-matrix-accent/20"
                        >
                          <td className="py-3 px-4 font-mono text-xs">
                            {flow.timestamp}
                          </td>
                          <td className="py-3 px-4 font-mono text-sm">
                            {flow.sourceIp}:{flow.sourcePort}
                          </td>
                          <td className="py-3 px-4 font-mono text-sm">
                            {flow.destIp}:{flow.destPort}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                              {flow.protocol}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm">
                                {formatBytes(flow.bytes)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {flow.packets} 包
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getRiskColor(flow.risk)}>
                              {flow.risk}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 协议分析 */}
          <TabsContent value="protocols" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 协议分布饼图 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-neon-blue" />
                    协议分布��计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-matrix-bg/50 rounded-lg border border-matrix-border p-4 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-neon-blue mx-auto mb-3" />
                      <p className="text-lg font-medium text-white">
                        协议分布图表
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        显示各协议流量占比
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 协议统计列表 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    协议详细统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {protocolStats.map((stat, index) => (
                      <div
                        key={index}
                        className="p-3 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/40">
                              {stat.protocol}
                            </Badge>
                            <span className="text-sm font-medium">
                              {stat.percentage}%
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatBytes(stat.bytes)}
                          </span>
                        </div>
                        <div className="w-full bg-matrix-bg rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-neon-blue to-green-400 h-2 rounded-full"
                            style={{ width: `${stat.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>{stat.packets.toLocaleString()} 数据包</span>
                          <span>{stat.connections} 连接</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 安全分析 */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 威胁检测 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    安全威胁检测
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="font-medium text-red-400">恶意IP通信</p>
                          <p className="text-sm text-muted-foreground">
                            与已知恶意IP的通信
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                        5
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="font-medium text-orange-400">
                            异常流量模式
                          </p>
                          <p className="text-sm text-muted-foreground">
                            不寻常的流量行为
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                        3
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="font-medium text-yellow-400">
                            非工作时间通信
                          </p>
                          <p className="text-sm text-muted-foreground">
                            异常时段的网络活动
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">
                        12
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium text-purple-400">
                            地理位置异常
                          </p>
                          <p className="text-sm text-muted-foreground">
                            来自异常地区的��问
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                        8
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 流量异常 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    流量异常分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-red-400">DDoS攻击检测</p>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                          高危
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        检测到大量异常请求流量
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-muted-foreground">
                          源IP: 203.0.113.42
                        </span>
                        <span className="text-red-400">10,000+ 请求/秒</span>
                      </div>
                    </div>

                    <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-orange-400">
                          数据泄露风险
                        </p>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                          中危
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        检测到大量数据外传
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-muted-foreground">
                          目标: 外部服务器
                        </span>
                        <span className="text-orange-400">500MB+ 传输</span>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-yellow-400">
                          端口扫描活动
                        </p>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">
                          低危
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        检测到端口扫描行为
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-muted-foreground">
                          扫描端口: 1-65535
                        </span>
                        <span className="text-yellow-400">持续时间: 2分钟</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                    <Shield className="w-4 h-4 mr-2" />
                    启动自动防护
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
