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

  // 分析网络路径
  const analyzeNetworkPaths = () => {
    const paths = [];

    if (investigation?.networkAnalysis?.connections) {
      investigation.networkAnalysis.connections
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
    const connections = investigation?.networkAnalysis?.connections || [];
    const openPorts = investigation?.networkAnalysis?.openPorts || [];

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
    <div className={cn("space-y-6", className)}>
      {/* 网络统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="cyber-card p-3 text-center">
          <div className="text-lg font-bold text-tech-accent mb-1">
            {networkStats.totalConnections}
          </div>
          <div className="text-xs text-muted-foreground">总连接数</div>
        </div>
        <div className="cyber-card p-3 text-center">
          <div className="text-lg font-bold text-green-400 mb-1">
            {networkStats.activeConnections}
          </div>
          <div className="text-xs text-muted-foreground">活跃连接</div>
        </div>
        <div className="cyber-card p-3 text-center">
          <div className="text-lg font-bold text-quantum-400 mb-1">
            {networkStats.openPorts}
          </div>
          <div className="text-xs text-muted-foreground">开放端口</div>
        </div>
        <div className="cyber-card p-3 text-center">
          <div className="text-lg font-bold text-blue-400 mb-1">
            {networkStats.secureConnections}
          </div>
          <div className="text-xs text-muted-foreground">安全连接</div>
        </div>
        <div className="cyber-card p-3 text-center">
          <div className="text-lg font-bold text-amber-400 mb-1">
            {networkStats.suspiciousConnections}
          </div>
          <div className="text-xs text-muted-foreground">可疑连接</div>
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

        {/* 网络拓扑图 */}
        <TabsContent value="topology" className="space-y-4">
          <div className="cyber-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-quantum-500" />
                网络拓扑图
              </h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-quantum-500/20 text-quantum-400 border-quantum-500/40">
                  中心节点: {centerIP}
                </Badge>
                <Button size="sm" className="neon-button text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  全屏
                </Button>
              </div>
            </div>
            <NetworkTopology
              investigation={investigation}
              centerIP={centerIP}
              className="h-96 border border-matrix-border rounded-lg"
            />
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-muted-foreground">高风险</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span className="text-muted-foreground">中风险</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-muted-foreground">低风险</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-quantum-500 rounded-full ring-2 ring-quantum-500/50"></div>
                <span className="text-muted-foreground">调查目标</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 流量分析 */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="cyber-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-neural-500" />
              网络流量分析
            </h3>

            {investigation?.networkAnalysis?.connections ? (
              <div className="space-y-3">
                {investigation.networkAnalysis.connections
                  .slice(0, 8)
                  .map((conn: any, index: number) => (
                    <div
                      key={index}
                      className="bg-matrix-surface/50 p-3 rounded border-l-4 border-l-blue-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge
                            className={cn(
                              "px-2 py-1",
                              getRiskColor(
                                conn.status === "active" ? "medium" : "low",
                              ),
                            )}
                          >
                            {conn.protocol}
                          </Badge>
                          <span className="font-mono text-sm text-neon-blue">
                            {conn.sourceIP}:{conn.sourcePort} → {conn.destIP}:
                            {conn.destPort}
                          </span>
                        </div>
                        <Badge
                          className={cn(
                            "px-2 py-1",
                            conn.status === "active"
                              ? "bg-green-500/20 text-green-400 border-green-500/40"
                              : conn.status === "closed"
                                ? "bg-gray-500/20 text-gray-400 border-gray-500/40"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/40",
                          )}
                        >
                          {conn.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div>持续时间: {conn.duration}s</div>
                        <div>数据量: {(conn.bytes / 1024).toFixed(1)} KB</div>
                        <div>数据包: {conn.packets}</div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-2" />
                <p>暂无网络流量数据</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 路径追��� */}
        <TabsContent value="paths" className="space-y-4">
          <div className="cyber-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-tech-accent" />
              网络路径追踪
            </h3>

            {networkPaths.length > 0 ? (
              <div className="space-y-3">
                {networkPaths.map((path) => (
                  <div
                    key={path.id}
                    className="bg-matrix-surface/50 p-3 rounded"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={cn("px-2 py-1", getRiskColor(path.risk))}
                        >
                          路径 {path.id + 1}
                        </Badge>
                        <span className="font-mono text-sm text-white">
                          {path.source} → {path.destination}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Layers className="w-3 h-3" />
                        {path.hops} 跳
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground">
                      <div>协议: {path.protocol}</div>
                      <div>端口: {path.port}</div>
                      <div>延迟: {path.latency}</div>
                      <div>状态: {path.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Share2 className="w-12 h-12 mx-auto mb-2" />
                <p>暂无路径追踪数据</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 威胁传播分析 */}
      {investigation?.threatIntelligence?.relatedThreats?.length > 0 && (
        <div className="cyber-card p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-400" />
            威胁传播分析
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investigation.threatIntelligence.relatedThreats
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
