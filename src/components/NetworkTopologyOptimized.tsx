import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Node,
  Edge,
  Position,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Shield,
  AlertTriangle,
  Wifi,
  Server,
  Globe,
  Router,
  Smartphone,
  Monitor,
  Database,
  Cloud,
  Network,
  Activity,
  Eye,
  Layers,
  Zap,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NodeDetailModal } from "./NodeDetailModal";

interface NetworkTopologyOptimizedProps {
  investigation: any;
  centerIP: string;
  className?: string;
  viewMode?: "default" | "threats" | "performance" | "simplified";
  showLabels?: boolean;
  autoLayout?: boolean;
}

// 优化的节点组件 - 支持多种视图模式和性能优化
const OptimizedNode = ({ data }: { data: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNodeIcon = useCallback((type: string) => {
    const iconMap = {
      target: Shield,
      router: Router,
      server: Server,
      internet: Globe,
      device: Monitor,
      mobile: Smartphone,
      database: Database,
      cloud: Cloud,
      firewall: Shield,
      load_balancer: Network,
    };
    const IconComponent = iconMap[type as keyof typeof iconMap] || Wifi;
    return <IconComponent className="w-4 h-4" />;
  }, []);

  const getRiskColor = useCallback((risk: string) => {
    const colorMap = {
      critical: "border-red-500 bg-red-500/20 text-red-400 shadow-red-500/50",
      high: "border-orange-500 bg-orange-500/20 text-orange-400 shadow-orange-500/50",
      medium:
        "border-amber-500 bg-amber-500/20 text-amber-400 shadow-amber-500/50",
      low: "border-green-500 bg-green-500/20 text-green-400 shadow-green-500/50",
      unknown:
        "border-blue-500 bg-blue-500/20 text-blue-400 shadow-blue-500/50",
    };
    return colorMap[risk as keyof typeof colorMap] || colorMap.unknown;
  }, []);

  const getNodeSize = useCallback(() => {
    if (data.isTarget) return "scale-125";
    if (data.importance === "high") return "scale-110";
    return "scale-100";
  }, [data.isTarget, data.importance]);

  return (
    <div
      className={cn(
        "px-3 py-2 shadow-lg rounded-lg border min-w-[100px] max-w-[140px] cyber-card text-center transition-all duration-300 hover:scale-105",
        getRiskColor(data.risk),
        getNodeSize(),
        data.isTarget &&
          "ring-2 ring-quantum-500 ring-opacity-75 animate-pulse",
        isHovered && "shadow-2xl",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center gap-1.5">
        <div className="p-1 rounded-full bg-current/10">
          {getNodeIcon(data.type)}
        </div>

        <div className="font-medium text-xs truncate w-full" title={data.label}>
          {data.label}
        </div>

        <div
          className="text-xs opacity-75 font-mono truncate w-full"
          title={data.ip}
        >
          {data.ip}
        </div>

        {/* 性能指标显示 */}
        {data.performance && (
          <div className="flex gap-1 text-xs">
            <Badge className="bg-current/20 text-current border-current/40 text-xs">
              CPU: {data.performance.cpu}%
            </Badge>
            {data.performance.bandwidth && (
              <Badge className="bg-current/20 text-current border-current/40 text-xs">
                {data.performance.bandwidth}MB/s
              </Badge>
            )}
          </div>
        )}

        {/* 端口信息 */}
        {data.ports && data.ports.length > 0 && (
          <div className="text-xs opacity-60 truncate w-full">
            :{data.ports.slice(0, 2).join(", ")}
            {data.ports.length > 2 && "..."}
          </div>
        )}

        {/* 威胁指示器 */}
        {data.threats && data.threats > 0 && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">{data.threats}</span>
            </div>
          </div>
        )}

        {/* 连接数指示器 */}
        {data.connections && data.connections > 0 && (
          <div className="absolute -top-1 -left-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">{data.connections}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 边的样式配置
const getEdgeStyle = (edge: any) => {
  const baseStyle = {
    strokeWidth: 2,
    strokeDasharray: "none",
  };

  switch (edge.type) {
    case "threat":
      return {
        ...baseStyle,
        stroke: "#ff0040",
        strokeWidth: 3,
        strokeDasharray: "8,4",
      };
    case "secure":
      return {
        ...baseStyle,
        stroke: "#39ff14",
        strokeWidth: 2,
      };
    case "suspicious":
      return {
        ...baseStyle,
        stroke: "#ff6600",
        strokeWidth: 2,
        strokeDasharray: "6,3",
      };
    case "normal":
      return {
        ...baseStyle,
        stroke: "#00f5ff",
        strokeWidth: 2,
      };
    case "inactive":
      return {
        ...baseStyle,
        stroke: "#6b7280",
        strokeWidth: 1,
        strokeDasharray: "4,2",
      };
    default:
      return {
        ...baseStyle,
        stroke: "#6b7280",
      };
  }
};

// 自动布局算法 - 改进的力导向布局
const generateOptimizedLayout = (
  nodes: any[],
  edges: any[],
  centerIP: string,
) => {
  const layoutNodes: Node[] = [];
  const layoutEdges: Edge[] = [];

  // 计算节点重要性和层级
  const getNodeImportance = (nodeData: any) => {
    let importance = 0;
    if (nodeData.isTarget) importance += 100;
    if (nodeData.type === "firewall") importance += 50;
    if (nodeData.type === "router") importance += 40;
    if (nodeData.type === "server") importance += 30;
    if (nodeData.threats > 0) importance += nodeData.threats * 10;
    if (nodeData.connections > 0) importance += nodeData.connections * 5;
    return importance;
  };

  // 层次化布局 - 中心目标在中心，其他节点按重要性分层
  const centerX = 400;
  const centerY = 300;

  // 目标节点
  const targetNode = nodes.find((n) => n.isTarget);
  if (targetNode) {
    layoutNodes.push({
      id: "target",
      type: "custom",
      position: { x: centerX, y: centerY },
      data: {
        ...targetNode,
        importance: "critical",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });
  }

  // 其他节点按重要性分层排列
  const otherNodes = nodes.filter((n) => !n.isTarget);
  const nodesByImportance = otherNodes.sort(
    (a, b) => getNodeImportance(b) - getNodeImportance(a),
  );

  // 分层布局算法
  const layers = [
    { radius: 180, maxNodes: 6 }, // 内层 - 重要基础设施
    { radius: 280, maxNodes: 12 }, // 中层 - 一般设备
    { radius: 380, maxNodes: 18 }, // 外层 - 边缘设备
  ];

  let currentLayer = 0;
  let currentLayerIndex = 0;

  nodesByImportance.forEach((nodeData, index) => {
    const layer = layers[currentLayer];
    const totalInLayer = Math.min(
      nodesByImportance.length - index,
      layer.maxNodes,
    );
    const angle = (currentLayerIndex / totalInLayer) * 2 * Math.PI;

    // 添加随机偏移避免完全对称
    const angleOffset = (Math.random() - 0.5) * 0.3;
    const radiusOffset = (Math.random() - 0.5) * 30;

    const x =
      centerX + Math.cos(angle + angleOffset) * (layer.radius + radiusOffset);
    const y =
      centerY + Math.sin(angle + angleOffset) * (layer.radius + radiusOffset);

    layoutNodes.push({
      id: `node-${index}`,
      type: "custom",
      position: { x, y },
      data: {
        ...nodeData,
        importance: getNodeImportance(nodeData) > 50 ? "high" : "normal",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    currentLayerIndex++;
    if (
      currentLayerIndex >= layer.maxNodes &&
      currentLayer < layers.length - 1
    ) {
      currentLayer++;
      currentLayerIndex = 0;
    }
  });

  // 生成优化的边连接
  edges.forEach((edge, index) => {
    const sourceNode = layoutNodes.find((n) => n.data.ip === edge.sourceIP);
    const targetNode = layoutNodes.find((n) => n.data.ip === edge.destIP);

    if (sourceNode && targetNode) {
      const edgeStyle = getEdgeStyle(edge);

      layoutEdges.push({
        id: `edge-${index}`,
        source: sourceNode.id,
        target: targetNode.id,
        type: edge.status === "active" ? "smoothstep" : "straight",
        animated: edge.status === "active" && edge.bandwidth > 50,
        style: edgeStyle,
        label: `${edge.protocol}:${edge.destPort}`,
        labelStyle: {
          fill: "#ffffff",
          fontSize: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "2px 6px",
          borderRadius: "4px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        labelBgPadding: [2, 1],
        labelBgBorderRadius: 4,
        markerEnd: {
          type: "arrowclosed",
          width: 12,
          height: 12,
          color: edgeStyle.stroke,
        },
        data: {
          bandwidth: edge.bandwidth || 0,
          latency: edge.latency || "unknown",
          protocol: edge.protocol,
        },
      });
    }
  });

  return { nodes: layoutNodes, edges: layoutEdges };
};

// 节点类型配置
const nodeTypes = {
  custom: OptimizedNode,
};

export const NetworkTopologyOptimized: React.FC<
  NetworkTopologyOptimizedProps
> = ({
  investigation,
  centerIP,
  className,
  viewMode = "default",
  showLabels = true,
  autoLayout = true,
}) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [showPerformance, setShowPerformance] = useState(false);

  // 生成优化的网络拓扑数据
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!investigation) return { nodes: [], edges: [] };

    const networkNodes = [];
    const networkEdges = [];

    // 生成目标节点
    networkNodes.push({
      id: centerIP,
      ip: centerIP,
      label: "调查目标",
      type: "target",
      isTarget: true,
      risk:
        investigation.riskScore > 70
          ? "critical"
          : investigation.riskScore > 50
            ? "high"
            : investigation.riskScore > 30
              ? "medium"
              : "low",
      ports:
        investigation.networkAnalysis?.openPorts
          ?.slice(0, 3)
          .map((p: any) => p.port) || [],
      threats: investigation.threatIntelligence?.blacklists?.length || 0,
      connections: investigation.networkAnalysis?.connections?.length || 0,
      performance: {
        cpu: Math.floor(Math.random() * 80) + 10,
        bandwidth: Math.floor(Math.random() * 100) + 50,
      },
    });

    // 生成网络连接节点
    if (investigation.networkAnalysis?.connections) {
      investigation.networkAnalysis.connections.forEach(
        (conn: any, index: number) => {
          const deviceType =
            conn.destPort === 80 || conn.destPort === 443
              ? "server"
              : conn.destPort === 22 || conn.destPort === 21
                ? "database"
                : conn.destPort === 53
                  ? "cloud"
                  : "device";

          networkNodes.push({
            id: conn.destIP,
            ip: conn.destIP,
            label: `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} ${index + 1}`,
            type: deviceType,
            risk:
              conn.status === "active"
                ? conn.destPort < 1024
                  ? "high"
                  : "medium"
                : "low",
            ports: [conn.destPort],
            threats: Math.floor(Math.random() * 3),
            connections: Math.floor(Math.random() * 10) + 1,
            performance: {
              cpu: Math.floor(Math.random() * 60) + 20,
              bandwidth: conn.bytes
                ? Math.floor(conn.bytes / 1024)
                : Math.floor(Math.random() * 200),
            },
          });

          networkEdges.push({
            sourceIP: centerIP,
            destIP: conn.destIP,
            destPort: conn.destPort,
            protocol: conn.protocol,
            status: conn.status,
            bandwidth: conn.bytes
              ? Math.floor(conn.bytes / 1024)
              : Math.floor(Math.random() * 200),
            latency: `${Math.floor(Math.random() * 50) + 5}ms`,
          });
        },
      );
    }

    // 添加基础设施节点
    const infrastructureNodes = [
      {
        id: "internet-gateway",
        ip: "0.0.0.0/0",
        label: "Internet Gateway",
        type: "internet",
        risk: "medium",
        ports: [80, 443],
        threats: 0,
        connections: networkNodes.length,
        performance: { cpu: 45, bandwidth: 1000 },
      },
      {
        id: "firewall",
        ip: "192.168.1.1",
        label: "Firewall",
        type: "firewall",
        risk: "low",
        ports: [443, 22],
        threats: 0,
        connections: Math.floor(networkNodes.length / 2),
        performance: { cpu: 65, bandwidth: 800 },
      },
      {
        id: "router",
        ip: "192.168.1.254",
        label: "Router",
        type: "router",
        risk: "low",
        ports: [80, 443, 22],
        threats: 0,
        connections: networkNodes.length + 2,
        performance: { cpu: 35, bandwidth: 1200 },
      },
    ];

    networkNodes.push(...infrastructureNodes);

    // 基础设施连接
    networkEdges.push(
      {
        sourceIP: "internet-gateway",
        destIP: "firewall",
        destPort: 443,
        protocol: "HTTPS",
        status: "active",
        bandwidth: 500,
        latency: "2ms",
      },
      {
        sourceIP: "firewall",
        destIP: "router",
        destPort: 443,
        protocol: "HTTPS",
        status: "active",
        bandwidth: 400,
        latency: "1ms",
      },
      {
        sourceIP: "router",
        destIP: centerIP,
        destPort: 443,
        protocol: "HTTPS",
        status: "active",
        bandwidth: 300,
        latency: "1ms",
      },
    );

    // 威胁情报节点
    if (investigation.threatIntelligence?.relatedThreats) {
      investigation.threatIntelligence.relatedThreats.forEach(
        (threat: any, index: number) => {
          networkNodes.push({
            id: threat.ip,
            ip: threat.ip,
            label: `Threat ${index + 1}`,
            type: "cloud",
            risk: "critical",
            ports: [],
            threats: threat.attackTypes?.length || 1,
            connections: 0,
            performance: { cpu: 0, bandwidth: 0 },
          });

          networkEdges.push({
            sourceIP: threat.ip,
            destIP: centerIP,
            destPort: 443,
            protocol: "THREAT",
            status: "threat",
            bandwidth: 0,
            latency: "unknown",
          });
        },
      );
    }

    if (autoLayout) {
      return generateOptimizedLayout(networkNodes, networkEdges, centerIP);
    }

    // 简单的手动布局作为后备
    const simpleNodes: Node[] = networkNodes.map((node, index) => ({
      id: node.id,
      type: "custom",
      position: {
        x: 400 + ((index % 3) - 1) * 200,
        y: 300 + Math.floor(index / 3) * 150,
      },
      data: node,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));

    const simpleEdges: Edge[] = networkEdges.map((edge, index) => ({
      id: `edge-${index}`,
      source: edge.sourceIP,
      target: edge.destIP,
      type: "straight",
      style: getEdgeStyle(edge),
      label: `${edge.protocol}:${edge.destPort}`,
    }));

    return { nodes: simpleNodes, edges: simpleEdges };
  }, [investigation, centerIP, autoLayout]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 视图模式切换效果
  useEffect(() => {
    if (currentViewMode !== viewMode) {
      setCurrentViewMode(viewMode);
      // 可以在这里添加视图切换的动画效果
    }
  }, [viewMode, currentViewMode]);

  const onConnect = useCallback((params: any) => {
    // 连接逻辑
  }, []);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  }, []);

  const onNodeDoubleClick = useCallback((event: any, node: any) => {
    event.stopPropagation();
    // 聚焦到节点
    console.log("Focus on node:", node.data.label);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);

  // 计算网络统计
  const networkStats = useMemo(() => {
    const totalNodes = nodes.length;
    const threatNodes = nodes.filter((n) => n.data.threats > 0).length;
    const activeConnections = edges.filter((e) => e.animated).length;
    const avgPerformance =
      nodes.reduce((acc, n) => acc + (n.data.performance?.cpu || 0), 0) /
      totalNodes;

    return {
      totalNodes,
      threatNodes,
      activeConnections,
      avgPerformance: Math.round(avgPerformance),
    };
  }, [nodes, edges]);

  return (
    <div
      className={cn(
        "relative w-full h-96 bg-matrix-bg rounded-lg overflow-hidden border border-matrix-border",
        className,
      )}
    >
      {/* 控制面板 */}
      <Panel position="top-left" className="space-x-2">
        <Button
          size="sm"
          variant={currentViewMode === "default" ? "default" : "outline"}
          onClick={() => setCurrentViewMode("default")}
          className="text-xs"
        >
          <Network className="w-3 h-3 mr-1" />
          默认
        </Button>
        <Button
          size="sm"
          variant={currentViewMode === "threats" ? "default" : "outline"}
          onClick={() => setCurrentViewMode("threats")}
          className="text-xs"
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          威胁
        </Button>
        <Button
          size="sm"
          variant={showPerformance ? "default" : "outline"}
          onClick={() => setShowPerformance(!showPerformance)}
          className="text-xs"
        >
          <Activity className="w-3 h-3 mr-1" />
          性能
        </Button>
      </Panel>

      {/* 统计面板 */}
      <Panel
        position="top-right"
        className="bg-matrix-surface/90 backdrop-blur-sm rounded-lg p-3 border border-matrix-border"
      >
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center">
            <div className="text-quantum-400 font-bold">
              {networkStats.totalNodes}
            </div>
            <div className="text-muted-foreground">节点</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 font-bold">
              {networkStats.threatNodes}
            </div>
            <div className="text-muted-foreground">威胁</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">
              {networkStats.activeConnections}
            </div>
            <div className="text-muted-foreground">活跃</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-bold">
              {networkStats.avgPerformance}%
            </div>
            <div className="text-muted-foreground">性能</div>
          </div>
        </div>
      </Panel>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 2.0,
        }}
        className="bg-matrix-bg"
        style={{ backgroundColor: "rgb(10, 14, 26)" }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        minZoom={0.3}
        maxZoom={3.0}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        zoomOnDoubleClick={true}
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
      >
        <Controls
          className="bg-matrix-surface border border-matrix-border text-white"
          position="bottom-left"
        />
        <MiniMap
          className="bg-matrix-surface border border-matrix-border"
          style={{
            backgroundColor: "rgb(31, 41, 55)",
            width: 140,
            height: 100,
          }}
          nodeColor={(node) => {
            switch (node.data?.risk) {
              case "critical":
                return "#ef4444";
              case "high":
                return "#f97316";
              case "medium":
                return "#eab308";
              case "low":
                return "#22c55e";
              default:
                return "#3b82f6";
            }
          }}
          position="bottom-right"
          pannable
          zoomable
        />
        <Background
          variant="dots"
          gap={[30, 30]}
          size={1}
          style={{ backgroundColor: "rgb(10, 14, 26)" }}
          color="#374151"
        />
      </ReactFlow>

      {/* 图例 */}
      <Panel
        position="bottom-center"
        className="bg-matrix-surface/90 backdrop-blur-sm rounded-lg p-2 border border-matrix-border"
      >
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-muted-foreground">严重</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
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
      </Panel>

      {/* 节点详情模态框 */}
      <NodeDetailModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};
