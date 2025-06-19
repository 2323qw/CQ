import React, { useState } from "react";
import {
  Network,
  Target,
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle,
  Eye,
  Layers,
  Zap,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkTopology } from "./NetworkTopology";
import { generateTopologyDemoData } from "@/utils/topologyDemoData";
import { cn } from "@/lib/utils";

interface TopologyAnalysisProps {
  investigation: any;
  centerIP: string;
  className?: string;
}

export const TopologyAnalysis: React.FC<TopologyAnalysisProps> = ({
  investigation,
  centerIP,
  className,
}) => {
  const [activeView, setActiveView] = useState<
    "topology" | "analysis" | "paths"
  >("topology");

  // 如果没有调查数据，使用演示数据
  const displayData = investigation || generateTopologyDemoData(centerIP);

  // 分析网络路径
  const analyzeNetworkPaths = () => {
    const paths = [];

    if (displayData?.networkAnalysis?.connections) {
      displayData.networkAnalysis.connections
        .slice(0, 5)
        .forEach((conn: any, index: number) => {
          paths.push({
            id: index,
            source: centerIP,
            destination: conn.destIP,
            protocol: conn.protocol,
            port: conn.destPort,
            status: conn.status,
            risk: conn.status === "active" ? "medium" : "low",
            hops: Math.floor(Math.random() * 8) + 3,
            latency: `${Math.floor(Math.random() * 100) + 10}ms`,
          });
        });
    }

    return paths;
  };

  // 计算网络统计
  const getNetworkStats = () => {
    const connections = displayData?.networkAnalysis?.connections || [];
    const openPorts = displayData?.networkAnalysis?.openPorts || [];

    return {
      totalConnections: connections.length,
      activeConnections: connections.filter((c: any) => c.status === "active")
        .length,
      openPorts: openPorts.length,
      secureConnections: connections.filter((c: any) => c.protocol === "HTTPS")
        .length,
      suspiciousConnections: connections.filter(
        (c: any) => c.status === "timeout" || c.port < 1024,
      ).length,
    };
  };

  const networkPaths = analyzeNetworkPaths();
  const networkStats = getNetworkStats();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-red-400 bg-red-400/20 border-red-400/40";
      case "high":
        return "text-orange-400 bg-orange-400/20 border-orange-400/40";
      case "medium":
        return "text-amber-400 bg-amber-400/20 border-amber-400/40";
      case "low":
        return "text-green-400 bg-green-400/20 border-green-400/40";
      default:
        return "text-blue-400 bg-blue-400/20 border-blue-400/40";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 紧凑的网络统计面板 */}
      <div className="cyber-card p-4">
        <div className="grid grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-tech-accent">
              {networkStats.totalConnections}
            </div>
            <div className="text-xs text-muted-foreground">连接</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-400">
              {networkStats.activeConnections}
            </div>
            <div className="text-xs text-muted-foreground">活跃</div>
          </div>
          <div>
            <div className="text-xl font-bold text-quantum-400">
              {networkStats.openPorts}
            </div>
            <div className="text-xs text-muted-foreground">端口</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">
              {networkStats.secureConnections}
            </div>
            <div className="text-xs text-muted-foreground">安全</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">
              {networkStats.suspiciousConnections}
            </div>
            <div className="text-xs text-muted-foreground">可疑</div>
          </div>
        </div>
      </div>

      {/* 拓扑视图选择 */}
      <Tabs
        value={activeView}
        onValueChange={(value: any) => setActiveView(value)}
      >
        <TabsList className="bg-matrix-surface border border-matrix-border">
          <TabsTrigger value="topology" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            网络拓扑
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            流量分析
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            路径追踪
          </TabsTrigger>
        </TabsList>

        {/* 网络拓扑图 - 横向布局 */}
        <TabsContent value="topology" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 拓扑图主区域 */}
            <div className="lg:col-span-2 cyber-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-quantum-500" />
                  网络拓扑图
                </h3>
                <Badge className="bg-quantum-500/20 text-quantum-400 border-quantum-500/40">
                  {centerIP}
                </Badge>
              </div>
              <NetworkTopology
                investigation={displayData}
                centerIP={centerIP}
                className="h-80"
              />
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-muted-foreground">高风险</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-muted-foreground">中风险</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-muted-foreground">低风险</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-quantum-500 rounded-full ring-1 ring-quantum-500/50"></div>
                  <span className="text-muted-foreground">目标</span>
                </div>
              </div>
            </div>

            {/* 侧边信息面板 */}
            <div className="space-y-3">
              {/* 连接详情 */}
              <div className="cyber-card p-3">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                  <Network className="w-4 h-4 text-tech-accent" />
                  活跃连接
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {displayData?.networkAnalysis?.connections
                    ?.slice(0, 4)
                    .map((conn: any, i: number) => (
                      <div
                        key={i}
                        className="text-xs bg-matrix-surface/50 p-2 rounded"
                      >
                        <div className="font-mono text-neon-blue truncate">
                          {conn.destIP}:{conn.destPort}
                        </div>
                        <div className="text-muted-foreground">
                          {conn.protocol} • {conn.status}
                        </div>
                      </div>
                    )) || (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      暂无连接数据
                    </div>
                  )}
                </div>
              </div>

              {/* 威胁指标 */}
              <div className="cyber-card p-3">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  威胁指标
                </h4>
                <div className="space-y-2">
                  {displayData?.threatIntelligence?.relatedThreats
                    ?.slice(0, 3)
                    .map((threat: any, i: number) => (
                      <div
                        key={i}
                        className="text-xs bg-red-500/10 p-2 rounded border border-red-500/20"
                      >
                        <div className="font-mono text-red-400 truncate">
                          {threat.ip}
                        </div>
                        <div className="text-muted-foreground">
                          相似度: {threat.similarity}%
                        </div>
                      </div>
                    )) || (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      暂无威胁关联
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 流量分析 - 紧凑表格布局 */}
        <TabsContent value="analysis" className="space-y-3">
          <div className="cyber-card p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-neural-500" />
              网络流量分析
            </h3>

            {displayData?.networkAnalysis?.connections ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-matrix-border">
                      <th className="text-left py-2 text-muted-foreground">
                        协议
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        连接
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        状态
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        流量
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        时长
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.networkAnalysis.connections
                      .slice(0, 8)
                      .map((conn: any, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-matrix-border/50 hover:bg-matrix-surface/30"
                        >
                          <td className="py-2">
                            <Badge
                              className={cn(
                                "px-2 py-1 text-xs",
                                getRiskColor(
                                  conn.status === "active" ? "medium" : "low",
                                ),
                              )}
                            >
                              {conn.protocol}
                            </Badge>
                          </td>
                          <td className="py-2 font-mono text-xs text-neon-blue">
                            {conn.destIP}:{conn.destPort}
                          </td>
                          <td className="py-2">
                            <Badge
                              className={cn(
                                "px-2 py-1 text-xs",
                                conn.status === "active"
                                  ? "bg-green-500/20 text-green-400 border-green-500/40"
                                  : conn.status === "closed"
                                    ? "bg-gray-500/20 text-gray-400 border-gray-500/40"
                                    : "bg-amber-500/20 text-amber-400 border-amber-500/40",
                              )}
                            >
                              {conn.status}
                            </Badge>
                          </td>
                          <td className="py-2 text-xs text-muted-foreground">
                            {(conn.bytes / 1024).toFixed(1)} KB
                          </td>
                          <td className="py-2 text-xs text-muted-foreground">
                            {conn.duration}s
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">暂无网络流量数据</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 路径追踪 - 表格布局 */}
        <TabsContent value="paths" className="space-y-3">
          <div className="cyber-card p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-tech-accent" />
              网络路径追踪
            </h3>

            {networkPaths.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-matrix-border">
                      <th className="text-left py-2 text-muted-foreground">
                        路径
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        目标
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        协议:端口
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        跳数
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        延迟
                      </th>
                      <th className="text-left py-2 text-muted-foreground">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {networkPaths.map((path) => (
                      <tr
                        key={path.id}
                        className="border-b border-matrix-border/50 hover:bg-matrix-surface/30"
                      >
                        <td className="py-2">
                          <Badge
                            className={cn(
                              "px-2 py-1 text-xs",
                              getRiskColor(path.risk),
                            )}
                          >
                            路径 {path.id + 1}
                          </Badge>
                        </td>
                        <td className="py-2 font-mono text-xs text-neon-blue">
                          {path.destination}
                        </td>
                        <td className="py-2 text-xs text-white">
                          {path.protocol}:{path.port}
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {path.hops}
                          </div>
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {path.latency}
                        </td>
                        <td className="py-2">
                          <Badge
                            className={cn(
                              "px-2 py-1 text-xs",
                              path.status === "active"
                                ? "bg-green-500/20 text-green-400 border-green-500/40"
                                : "bg-gray-500/20 text-gray-400 border-gray-500/40",
                            )}
                          >
                            {path.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Share2 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">暂无路径追踪数据</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 威胁传播分析 */}
      {displayData?.threatIntelligence?.relatedThreats?.length > 0 && (
        <div className="cyber-card p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-400" />
            威胁传播分析
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayData.threatIntelligence.relatedThreats
              .slice(0, 4)
              .map((threat: any, index: number) => (
                <div
                  key={index}
                  className="bg-red-500/5 border border-red-500/20 p-3 rounded"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-red-400">
                      {threat.ip}
                    </span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                      {threat.similarity}% 相似
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    风险评分: {threat.riskScore}/100
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {threat.attackTypes.map((type: string, i: number) => (
                      <Badge
                        key={i}
                        className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
