import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Node,
  Edge,
  Position,
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

  // 根据设备类型选择不规则形状
  const getNodeShape = (type: string) => {
    switch (type) {
      case "target":
        return "clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"; // 六边形
      case "router":
        return "clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"; // 八角形
      case "server":
        return "clip-path: polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)"; // 服务器形状
      case "database":
        return "clip-path: ellipse(60% 40% at 50% 50%)"; // 椭圆形
      case "firewall":
        return "clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)"; // 盾形
      case "internet":
        return "clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"; // 星形
      case "cloud":
        return "border-radius: 20px 40px 30px 35px"; // 云朵形状
      default:
        return "clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"; // 切角矩形
    }
  };

  return (
    <div
      className={cn(
        "relative px-3 py-2 shadow-lg border min-w-[100px] max-w-[130px] bg-matrix-surface text-center transition-all duration-300 hover:scale-110",
        getRiskColor(data.risk),
        data.isTarget && "ring-2 ring-quantum-500 ring-opacity-75",
        isHovered && "shadow-2xl",
      )}
      style={{
        ...{
          [getNodeShape(data.type).includes("clip-path")
            ? "clipPath"
            : "borderRadius"]: getNodeShape(data.type).includes("clip-path")
            ? getNodeShape(data.type).replace("clip-path: ", "")
            : getNodeShape(data.type).replace("border-radius: ", ""),
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: data.isTarget
            ? "radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-1">
        <div className="p-1.5 rounded-full bg-current/20 backdrop-blur-sm">
          {getNodeIcon(data.type)}
        </div>

        <div
          className="font-mono text-xs font-bold text-white truncate w-full"
          title={data.ip}
        >
          {data.ip}
        </div>

        <div className="text-xs text-muted-foreground truncate w-full">
          {data.type === "target"
            ? "目���"
            : data.type === "router"
              ? "路由器"
              : data.type === "server"
                ? "服务器"
                : data.type === "database"
                  ? "数据库"
                  : data.type === "firewall"
                    ? "防火墙"
                    : data.type === "internet"
                      ? "网关"
                      : data.type === "cloud"
                        ? "云端"
                        : "设备"}
        </div>

        {/* 端口信息 */}
        {data.ports && data.ports.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.ports.slice(0, 3).map((port: number, index: number) => (
              <div
                key={index}
                className={cn(
                  "px-1.5 py-0.5 rounded text-xs font-mono",
                  port < 1024
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : port < 49152
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-green-500/20 text-green-400 border border-green-500/40",
                )}
              >
                {port}
              </div>
            ))}
            {data.ports.length > 3 && (
              <div className="px-1.5 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400 border border-gray-500/40">
                +{data.ports.length - 3}
              </div>
            )}
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

  // 分层��局算法
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
        // 移除标签，只保留连接线
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
      ports: investigation.networkAnalysis?.openPorts
        ?.slice(0, 5)
        .map((p: any) => p.port) || [80, 443, 22],
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
      },
      {
        id: "firewall",
        ip: "192.168.1.1",
        label: "Firewall",
        type: "firewall",
        risk: "low",
      },
      {
        id: "router",
        ip: "192.168.1.254",
        label: "Router",
        type: "router",
        risk: "low",
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
      {/* 简化标题 */}
      <div className="absolute top-4 left-4 z-10 bg-matrix-surface/80 backdrop-blur-sm rounded px-3 py-1 border border-matrix-border">
        <div className="text-sm text-white font-medium">网络拓扑关系图</div>
      </div>

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

        <Background
          variant="dots"
          gap={[30, 30]}
          size={1}
          style={{ backgroundColor: "rgb(10, 14, 26)" }}
          color="#374151"
        />
      </ReactFlow>

      {/* 简化图例 */}
      <div className="absolute bottom-4 right-4 z-10 bg-matrix-surface/80 backdrop-blur-sm rounded p-2 border border-matrix-border">
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-muted-foreground">高风险</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-muted-foreground">正常</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-quantum-500 rounded-full"></div>
            <span className="text-muted-foreground">目标</span>
          </div>
        </div>
      </div>

      {/* 节点详情模态框 */}
      <NodeDetailModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};
