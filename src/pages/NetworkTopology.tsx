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
  GitBranch,
  Server,
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings,
  Zap,
  Activity,
  Globe,
  Lock,
  Unlock,
  MapPin,
  Layers,
} from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  type: "server" | "router" | "switch" | "firewall" | "endpoint" | "cloud";
  ip: string;
  status: "online" | "offline" | "warning" | "critical";
  connections: string[];
  location?: string;
  os?: string;
  vulnerabilities: number;
  lastSeen: string;
}

interface NetworkSegment {
  id: string;
  name: string;
  subnet: string;
  nodeCount: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  description: string;
}

export default function NetworkTopology() {
  const [selectedView, setSelectedView] = useState<
    "topology" | "segments" | "analysis"
  >("topology");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 模拟网络节点数据
  const [networkNodes] = useState<NetworkNode[]>([
    {
      id: "fw-001",
      name: "主防火墙",
      type: "firewall",
      ip: "192.168.1.1",
      status: "online",
      connections: ["sw-001", "rt-001"],
      location: "数据中心A",
      vulnerabilities: 0,
      lastSeen: "2024-01-20 14:30:25",
    },
    {
      id: "sw-001",
      name: "核心交换机",
      type: "switch",
      ip: "192.168.1.10",
      status: "online",
      connections: ["fw-001", "sv-001", "sv-002"],
      location: "数据中心A",
      vulnerabilities: 1,
      lastSeen: "2024-01-20 14:30:20",
    },
    {
      id: "sv-001",
      name: "Web服务器",
      type: "server",
      ip: "192.168.1.100",
      status: "warning",
      connections: ["sw-001"],
      location: "数据中心A",
      os: "Ubuntu 20.04",
      vulnerabilities: 3,
      lastSeen: "2024-01-20 14:25:15",
    },
    {
      id: "sv-002",
      name: "数据库服务器",
      type: "server",
      ip: "192.168.1.101",
      status: "online",
      connections: ["sw-001"],
      location: "数据中心A",
      os: "CentOS 8",
      vulnerabilities: 0,
      lastSeen: "2024-01-20 14:30:22",
    },
    {
      id: "ep-001",
      name: "管理员工作站",
      type: "endpoint",
      ip: "192.168.2.50",
      status: "online",
      connections: ["sw-002"],
      location: "办公区",
      os: "Windows 11",
      vulnerabilities: 2,
      lastSeen: "2024-01-20 14:28:45",
    },
    {
      id: "cloud-001",
      name: "AWS云实例",
      type: "cloud",
      ip: "52.201.123.45",
      status: "online",
      connections: ["fw-001"],
      location: "美国东部",
      vulnerabilities: 0,
      lastSeen: "2024-01-20 14:30:30",
    },
  ]);

  // 模拟网络段数据
  const [networkSegments] = useState<NetworkSegment[]>([
    {
      id: "seg-001",
      name: "DMZ区域",
      subnet: "192.168.1.0/24",
      nodeCount: 8,
      riskLevel: "medium",
      description: "面向公网的服务器区域",
    },
    {
      id: "seg-002",
      name: "内网办公区",
      subnet: "192.168.2.0/24",
      nodeCount: 25,
      riskLevel: "low",
      description: "员工办公网络区域",
    },
    {
      id: "seg-003",
      name: "生产服务区",
      subnet: "10.0.1.0/24",
      nodeCount: 12,
      riskLevel: "high",
      description: "核心业务系统区域",
    },
    {
      id: "seg-004",
      name: "管理网络",
      subnet: "172.16.1.0/24",
      nodeCount: 5,
      riskLevel: "critical",
      description: "基础设施管理网络",
    },
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 模拟刷新延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "server":
        return Server;
      case "router":
        return Wifi;
      case "switch":
        return GitBranch;
      case "firewall":
        return Shield;
      case "endpoint":
        return Activity;
      case "cloud":
        return Globe;
      default:
        return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "critical":
        return "text-red-400";
      case "offline":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
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

  const filteredNodes = networkNodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.ip.includes(searchTerm);
    const matchesFilter = filterType === "all" || node.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-neon-blue" />
              网络拓扑可视化
            </h1>
            <p className="text-muted-foreground mt-2">
              实时监控网络架构，识别安全风险和连接关系
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "刷新中" : "刷新拓扑"}
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出图像
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总节点数</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {networkNodes.length}
                  </p>
                </div>
                <Server className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">在线节点</p>
                  <p className="text-2xl font-bold text-green-400">
                    {networkNodes.filter((n) => n.status === "online").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">告警节点</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {networkNodes.filter((n) => n.status === "warning").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">高危漏洞</p>
                  <p className="text-2xl font-bold text-red-400">
                    {networkNodes.reduce(
                      (sum, node) => sum + node.vulnerabilities,
                      0,
                    )}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <Tabs
          value={selectedView}
          onValueChange={(v) => setSelectedView(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-matrix-surface/50">
            <TabsTrigger
              value="topology"
              className="data-[state=active]:bg-neon-blue/20"
            >
              拓扑视图
            </TabsTrigger>
            <TabsTrigger
              value="segments"
              className="data-[state=active]:bg-neon-blue/20"
            >
              网络分段
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="data-[state=active]:bg-neon-blue/20"
            >
              安全分析
            </TabsTrigger>
          </TabsList>

          {/* 拓扑视图 */}
          <TabsContent value="topology" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧节点列表 */}
              <div className="lg:col-span-1 space-y-4">
                {/* 搜索和过滤 */}
                <Card className="cyber-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg">节点管理</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索节点名称或IP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="节点类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="server">服务器</SelectItem>
                        <SelectItem value="router">路由器</SelectItem>
                        <SelectItem value="switch">交换机</SelectItem>
                        <SelectItem value="firewall">防火墙</SelectItem>
                        <SelectItem value="endpoint">终端</SelectItem>
                        <SelectItem value="cloud">云服务</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* 节点列表 */}
                <Card className="cyber-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      网络节点 ({filteredNodes.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-custom">
                      {filteredNodes.map((node) => {
                        const NodeIcon = getNodeIcon(node.type);
                        return (
                          <div
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                              selectedNode?.id === node.id
                                ? "border-neon-blue/50 bg-neon-blue/10"
                                : "border-matrix-border hover:border-neon-blue/30 hover:bg-matrix-accent/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <NodeIcon
                                  className={`w-5 h-5 ${getStatusColor(node.status)}`}
                                />
                                <div>
                                  <p className="font-medium text-sm">
                                    {node.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {node.ip}
                                  </p>
                                </div>
                              </div>
                              {node.vulnerabilities > 0 && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-xs">
                                  {node.vulnerabilities}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 右侧详情面板 */}
              <div className="lg:col-span-2 space-y-4">
                {/* 拓扑图可视化区域 */}
                <Card className="cyber-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="w-5 h-5 text-neon-blue" />
                      网络拓扑图
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-matrix-bg/50 rounded-lg border border-matrix-border p-6 flex items-center justify-center">
                      <div className="text-center">
                        <GitBranch className="w-16 h-16 text-neon-blue mx-auto mb-4" />
                        <p className="text-lg font-medium text-white">
                          网络拓扑可视化
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          交互式网络拓扑图将在这里显示
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          支持拖拽、缩放和节点详情查看
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 节点详情 */}
                {selectedNode && (
                  <Card className="cyber-card-enhanced border-neon-blue/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-neon-blue" />
                        节点详情
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            节点名称
                          </p>
                          <p className="font-medium">{selectedNode.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            IP地址
                          </p>
                          <p className="font-medium font-mono">
                            {selectedNode.ip}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            节点类型
                          </p>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                            {selectedNode.type}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            运行状态
                          </p>
                          <Badge
                            className={getRiskColor(
                              selectedNode.status === "online" ? "low" : "high",
                            )}
                          >
                            {selectedNode.status}
                          </Badge>
                        </div>
                        {selectedNode.location && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              物理位置
                            </p>
                            <p className="font-medium">
                              {selectedNode.location}
                            </p>
                          </div>
                        )}
                        {selectedNode.os && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              操作系统
                            </p>
                            <p className="font-medium">{selectedNode.os}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">
                            安全漏洞
                          </p>
                          <p
                            className={`font-medium ${selectedNode.vulnerabilities > 0 ? "text-red-400" : "text-green-400"}`}
                          >
                            {selectedNode.vulnerabilities} 个
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            最后在线
                          </p>
                          <p className="font-medium text-sm">
                            {selectedNode.lastSeen}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          连接节点
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedNode.connections.map((conn) => (
                            <Badge
                              key={conn}
                              className="bg-neon-blue/20 text-neon-blue border-neon-blue/40"
                            >
                              {conn}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          size="sm"
                          className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </Button>
                        <Button
                          size="sm"
                          className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          配置管理
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 网络分段 */}
          <TabsContent value="segments" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-neon-blue" />
                  网络分段管理
                </CardTitle>
                <CardDescription>
                  管理和监控网络安全分段，评估分段间的风险级别
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {networkSegments.map((segment) => (
                    <Card
                      key={segment.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {segment.name}
                          </CardTitle>
                          <Badge className={getRiskColor(segment.riskLevel)}>
                            {segment.riskLevel}
                          </Badge>
                        </div>
                        <CardDescription>{segment.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              子网范围
                            </p>
                            <p className="font-mono text-sm">
                              {segment.subnet}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              节点数量
                            </p>
                            <p className="font-medium">
                              {segment.nodeCount} 台设备
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            查看节点
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-purple-500/20 text-purple-400 border-purple-500/30"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            安全策略
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 安全分析 */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 风险评估 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    风险评估
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="font-medium text-red-400">高危漏洞</p>
                          <p className="text-sm text-muted-foreground">
                            未修复的严重安全漏洞
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                        6
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="font-medium text-yellow-400">
                            配置风险
                          </p>
                          <p className="text-sm text-muted-foreground">
                            不安全的网络配置
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">
                        3
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Unlock className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-blue-400">访问控制</p>
                          <p className="text-sm text-muted-foreground">
                            权限过度分配
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                        2
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 连接分析 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-green-400" />
                    连接关系分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div>
                        <p className="font-medium text-green-400">正常连接</p>
                        <p className="text-sm text-muted-foreground">
                          符合安全策略的连接
                        </p>
                      </div>
                      <span className="text-lg font-bold text-green-400">
                        24
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-400">异常连接</p>
                        <p className="text-sm text-muted-foreground">
                          可疑的网络连接
                        </p>
                      </div>
                      <span className="text-lg font-bold text-yellow-400">
                        3
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div>
                        <p className="font-medium text-red-400">未授权连接</p>
                        <p className="text-sm text-muted-foreground">
                          违反安全策略的连接
                        </p>
                      </div>
                      <span className="text-lg font-bold text-red-400">1</span>
                    </div>
                  </div>

                  <Button className="w-full bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                    <Zap className="w-4 h-4 mr-2" />
                    自动修复建议
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
