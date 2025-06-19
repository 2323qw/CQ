import React, { useMemo, useCallback, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NodeDetailModal } from "./NodeDetailModal";

interface NetworkTopologyProps {
  investigation: any;
  centerIP: string;
  className?: string;
}

// 自定义节点类型
const CustomNode = ({ data }: { data: any }) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case "target":
        return <Shield className="w-5 h-5 text-quantum-500" />;
      case "router":
        return <Router className="w-4 h-4 text-tech-accent" />;
      case "server":
        return <Server className="w-4 h-4 text-neural-500" />;
      case "internet":
        return <Globe className="w-4 h-4 text-blue-400" />;
      case "device":
        return <Monitor className="w-4 h-4 text-green-400" />;
      case "mobile":
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      case "database":
        return <Database className="w-4 h-4 text-amber-400" />;
      case "cloud":
        return <Cloud className="w-4 h-4 text-red-400" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "border-red-500 bg-red-500/20 text-red-400";
      case "high":
        return "border-orange-500 bg-orange-500/20 text-orange-400";
      case "medium":
        return "border-amber-500 bg-amber-500/20 text-amber-400";
      case "low":
        return "border-green-500 bg-green-500/20 text-green-400";
      default:
        return "border-blue-500 bg-blue-500/20 text-blue-400";
    }
  };

  return (
    <div
      className={cn(
        "px-2 py-1.5 shadow-lg rounded-md border min-w-[90px] max-w-[120px] cyber-card text-center",
        getRiskColor(data.risk),
        data.isTarget && "ring-2 ring-quantum-500 ring-opacity-75 scale-110",
      )}
    >
      <div className="flex flex-col items-center gap-1">
        {getNodeIcon(data.type)}
        <div className="font-medium text-xs truncate w-full">{data.label}</div>
        <div className="text-xs opacity-75 font-mono truncate w-full">
          {data.ip}
        </div>
        {data.ports && data.ports.length > 0 && (
          <div className="text-xs opacity-60 truncate w-full">
            :{data.ports[0]}
            {data.ports.length > 1 && "+"}
          </div>
        )}
      </div>
    </div>
  );
};

// 节点类型定义
const nodeTypes = {
  custom: CustomNode,
};

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  investigation,
  centerIP,
  className,
}) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 生成网络拓扑数据
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // 中心目标节点 - 优化尺寸和位置
    nodes.push({
      id: "target",
      type: "custom",
      position: { x: 350, y: 250 },
      data: {
        label: "调查目标",
        ip: centerIP,
        type: "target",
        risk:
          investigation?.riskScore > 70
            ? "critical"
            : investigation?.riskScore > 50
              ? "high"
              : investigation?.riskScore > 30
                ? "medium"
                : "low",
        isTarget: true,
        ports: investigation?.networkAnalysis?.openPorts
          ?.slice(0, 2)
          .map((p: any) => p.port) ||
          investigation?.timeline
            ?.slice(0, 2)
            .map((_: any, i: number) => 80 + i * 10) || [80, 443],
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // 互联网网关 - 增加间距
    nodes.push({
      id: "internet",
      type: "custom",
      position: { x: 50, y: 250 },
      data: {
        label: "互联网",
        ip: "0.0.0.0/0",
        type: "internet",
        risk: "medium",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // 路由器/网关 - 优化位置
    nodes.push({
      id: "router",
      type: "custom",
      position: { x: 200, y: 250 },
      data: {
        label: "网关",
        ip: "192.168.1.1",
        type: "router",
        risk: "low",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // 基于调查结果生成相关节点 - 优化布局防止重叠
    if (investigation?.networkAnalysis?.connections) {
      investigation.networkAnalysis.connections
        .slice(0, 6)
        .forEach((conn: any, index: number) => {
          // 创建环形布局，确保节点不重叠
          const totalNodes = Math.min(
            investigation.networkAnalysis.connections.length,
            6,
          );
          const angle = (index * 2 * Math.PI) / totalNodes;
          const radius = 160; // 增加半径避免重叠
          const x = 350 + Math.cos(angle) * radius;
          const y = 250 + Math.sin(angle) * radius;

          const deviceType =
            conn.destPort === 80 || conn.destPort === 443
              ? "server"
              : conn.destPort === 22 || conn.destPort === 21
                ? "database"
                : conn.destPort === 53
                  ? "cloud"
                  : "device";

          nodes.push({
            id: `connection-${index}`,
            type: "custom",
            position: { x, y },
            data: {
              label: `${
                deviceType === "server"
                  ? "Web服务器"
                  : deviceType === "database"
                    ? "数据库"
                    : deviceType === "cloud"
                      ? "DNS服务"
                      : "终端设备"
              } ${index + 1}`,
              ip: conn.destIP,
              type: deviceType,
              risk:
                conn.status === "active"
                  ? conn.destPort < 1024
                    ? "high"
                    : "medium"
                  : "low",
              ports: [conn.destPort],
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });

          // 添加连接边 - 增强路径可视化
          edges.push({
            id: `edge-target-${index}`,
            source: "target",
            target: `connection-${index}`,
            type: "straight",
            animated: conn.status === "active",
            style: {
              stroke:
                conn.status === "active"
                  ? conn.destPort < 1024
                    ? "#ff0040"
                    : "#00f5ff"
                  : "#6b7280",
              strokeWidth: conn.status === "active" ? 3 : 2,
              strokeDasharray: conn.status === "active" ? "none" : "6,3",
            },
            label: `${conn.protocol}:${conn.destPort}`,
            labelStyle: {
              fill: "#ffffff",
              fontSize: "9px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: "1px 4px",
              borderRadius: "3px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
            labelBgPadding: [2, 1],
            labelBgBorderRadius: 3,
            markerEnd: {
              type: "arrowclosed",
              width: 12,
              height: 12,
              color:
                conn.status === "active"
                  ? conn.destPort < 1024
                    ? "#ff0040"
                    : "#00f5ff"
                  : "#6b7280",
            },
          });

          // 添加流向指示
          if (conn.status === "active") {
            edges.push({
              id: `flow-${index}`,
              source: "target",
              target: `connection-${index}`,
              type: "straight",
              animated: true,
              style: {
                stroke: "#39ff14",
                strokeWidth: 1,
                opacity: 0.6,
              },
              zIndex: 10,
            });
          }

          // 连接相邻节点形成网状结构
          if (index > 0) {
            edges.push({
              id: `inter-connection-${index}`,
              source: `connection-${index - 1}`,
              target: `connection-${index}`,
              type: "straight",
              style: {
                stroke: "#4b5563",
                strokeWidth: 1,
                strokeDasharray: "2,2",
                opacity: 0.4,
              },
              label: "邻接",
              labelStyle: {
                fill: "#6b7280",
                fontSize: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: "1px 2px",
                borderRadius: "2px",
              },
            });
          }

          // 每隔一个节点连接到路由器
          if (index % 2 === 0) {
            edges.push({
              id: `router-connection-${index}`,
              source: "router",
              target: `connection-${index}`,
              type: "straight",
              style: {
                stroke: "#6b7280",
                strokeWidth: 1,
                strokeDasharray: "4,2",
                opacity: 0.3,
              },
              label: "路由",
              labelStyle: {
                fill: "#6b7280",
                fontSize: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: "1px 2px",
                borderRadius: "2px",
              },
            });
          }
        });
    } else if (investigation?.timeline) {
      // 如果没有网络连接数据，基于时间线生成攻击路径节点
      investigation.timeline
        .slice(0, 5)
        .forEach((event: any, index: number) => {
          // 创建攻击路径布局，增加间距
          const totalNodes = Math.min(investigation.timeline.length, 5);
          const angle = (index * 2 * Math.PI) / totalNodes;
          const radius = 170; // 增加半径
          const x = 350 + Math.cos(angle) * radius;
          const y = 250 + Math.sin(angle) * radius;

          nodes.push({
            id: `event-${index}`,
            type: "custom",
            position: { x, y },
            data: {
              label: `攻击源 ${index + 1}`,
              ip: `${192 + Math.floor(index / 2)}.168.${index}.${100 + index}`,
              type: event.type?.includes("malware")
                ? "database"
                : event.type?.includes("ddos")
                  ? "cloud"
                  : "device",
              risk: event.severity || "medium",
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });

          // 攻击路径边 - 显示攻击方向和类型
          edges.push({
            id: `edge-attack-${index}`,
            source: `event-${index}`,
            target: "target",
            type: "default",
            animated: true,
            style: {
              stroke:
                event.severity === "critical"
                  ? "#ff0040"
                  : event.severity === "high"
                    ? "#ff6600"
                    : event.severity === "medium"
                      ? "#ffaa00"
                      : "#39ff14",
              strokeWidth:
                event.severity === "critical"
                  ? 4
                  : event.severity === "high"
                    ? 3
                    : 2,
              strokeDasharray: "8,4",
            },
            label: event.type?.replace("_", " ") || "attack",
            labelStyle: {
              fill: "#ffffff",
              fontSize: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
            markerEnd: {
              type: "arrowclosed",
              color:
                event.severity === "critical"
                  ? "#ff0040"
                  : event.severity === "high"
                    ? "#ff6600"
                    : "#39ff14",
            },
          });

          // 攻击源之间的关联连接
          if (index > 0) {
            edges.push({
              id: `attack-relation-${index}`,
              source: `event-${index - 1}`,
              target: `event-${index}`,
              type: "straight",
              style: {
                stroke: "#7c3aed",
                strokeWidth: 1,
                strokeDasharray: "3,3",
                opacity: 0.5,
              },
              label: "关联",
              labelStyle: {
                fill: "#7c3aed",
                fontSize: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: "1px 2px",
                borderRadius: "2px",
              },
            });
          }

          // 攻击源到路由器的潜在路径
          if (index % 2 === 1) {
            edges.push({
              id: `attack-route-${index}`,
              source: `event-${index}`,
              target: "router",
              type: "straight",
              style: {
                stroke: "#dc2626",
                strokeWidth: 1,
                strokeDasharray: "2,4",
                opacity: 0.3,
              },
              label: "攻击路径",
              labelStyle: {
                fill: "#dc2626",
                fontSize: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: "1px 2px",
                borderRadius: "2px",
              },
            });
          }
        });
    }

    // 威胁情报相关节点 - 优化位置避免重叠
    if (investigation?.threatIntelligence?.relatedThreats) {
      investigation.threatIntelligence.relatedThreats
        .slice(0, 3)
        .forEach((threat: any, index: number) => {
          // 在外圈放置威胁节点
          const angle = (index * Math.PI * 2) / 3 + Math.PI / 6; // 偏移角度避免与其他节点重叠
          const radius = 220;
          const x = 350 + Math.cos(angle) * radius;
          const y = 250 + Math.sin(angle) * radius;

          nodes.push({
            id: `threat-${index}`,
            type: "custom",
            position: { x, y },
            data: {
              label: `威胁 ${index + 1}`,
              ip: threat.ip,
              type: "cloud",
              risk: threat.riskScore > 70 ? "critical" : "high",
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });

          edges.push({
            id: `edge-threat-${index}`,
            source: `threat-${index}`,
            target: "target",
            type: "smoothstep",
            animated: true,
            style: {
              stroke: "#bf00ff",
              strokeWidth: 2,
              strokeDasharray: "5,5",
            },
            label: `${threat.similarity}% 相似`,
            labelStyle: {
              fill: "#bf00ff",
              fontSize: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "2px 4px",
              borderRadius: "4px",
            },
          });

          // 威胁节点之间的关联
          if (index > 0) {
            edges.push({
              id: `threat-relation-${index}`,
              source: `threat-${index - 1}`,
              target: `threat-${index}`,
              type: "straight",
              style: {
                stroke: "#dc2626",
                strokeWidth: 2,
                strokeDasharray: "4,4",
                opacity: 0.6,
              },
              label: "威胁网络",
              labelStyle: {
                fill: "#dc2626",
                fontSize: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "1px 3px",
                borderRadius: "2px",
              },
            });
          }

          // 威胁到互联网的连接
          edges.push({
            id: `threat-internet-${index}`,
            source: "internet",
            target: `threat-${index}`,
            type: "straight",
            style: {
              stroke: "#dc2626",
              strokeWidth: 1,
              strokeDasharray: "6,2",
              opacity: 0.4,
            },
            label: "外部威胁",
            labelStyle: {
              fill: "#dc2626",
              fontSize: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "1px 2px",
              borderRadius: "2px",
            },
          });
        });
    }

    // 添加网络基础设施的完整连接
    // 如果有连接节点，连接第一个和最后一个到路由器形成环路
    if (
      investigation?.networkAnalysis?.connections &&
      investigation.networkAnalysis.connections.length > 2
    ) {
      const totalConnections = Math.min(
        investigation.networkAnalysis.connections.length,
        6,
      );
      edges.push({
        id: "network-ring-closure",
        source: `connection-${totalConnections - 1}`,
        target: `connection-0`,
        type: "straight",
        style: {
          stroke: "#4b5563",
          strokeWidth: 1,
          strokeDasharray: "2,2",
          opacity: 0.3,
        },
        label: "网络环路",
        labelStyle: {
          fill: "#6b7280",
          fontSize: "8px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "1px 2px",
          borderRadius: "2px",
        },
      });
    }

    // 基础网络连接 - 优化线条样式
    edges.push(
      {
        id: "edge-internet-router",
        source: "internet",
        target: "router",
        type: "straight",
        style: {
          stroke: "#6b7280",
          strokeWidth: 2,
        },
        label: "WAN",
        labelStyle: {
          fill: "#9ca3af",
          fontSize: "9px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "1px 3px",
          borderRadius: "3px",
        },
        markerEnd: {
          type: "arrowclosed",
          width: 10,
          height: 10,
          color: "#6b7280",
        },
      },
      {
        id: "edge-router-target",
        source: "router",
        target: "target",
        type: "straight",
        style: {
          stroke: "#00f5ff",
          strokeWidth: 3,
        },
        label: "LAN",
        labelStyle: {
          fill: "#00f5ff",
          fontSize: "9px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "1px 3px",
          borderRadius: "3px",
        },
        markerEnd: {
          type: "arrowclosed",
          width: 12,
          height: 12,
          color: "#00f5ff",
        },
      },
    );

    return { nodes, edges };
  }, [investigation, centerIP]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => {
    // 可以在这里添加连接逻辑
  }, []);

  // 节点点击功能
  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  }, []);

  // 双击放大功能
  const onNodeDoubleClick = useCallback((event: any, node: any) => {
    // 防止双击时触发单击事件
    event.stopPropagation();

    // 计算放大后的视图
    const zoomLevel = 1.8;
    const viewportTransform = {
      x: -node.position.x * zoomLevel + 400, // 将节点居中
      y: -node.position.y * zoomLevel + 200,
      zoom: zoomLevel,
    };

    console.log("Double-clicked node for zoom:", node.data.label);
  }, []);

  // 关闭模态框
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);

  return (
    <div
      className={cn(
        "w-full h-80 bg-matrix-bg rounded-lg overflow-hidden border border-matrix-border",
        className,
      )}
    >
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
          padding: 0.3,
          minZoom: 0.4,
          maxZoom: 2.5,
        }}
        className="bg-matrix-bg"
        style={{
          backgroundColor: "rgb(10, 14, 26)",
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        minZoom={0.2}
        maxZoom={3.0}
        attributionPosition="bottom-left"
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
          style={{
            button: {
              backgroundColor: "rgb(31, 41, 55)",
              color: "white",
              border: "1px solid rgb(55, 65, 81)",
            },
          }}
          position="top-left"
        />
        <MiniMap
          className="bg-matrix-surface border border-matrix-border"
          style={{
            backgroundColor: "rgb(31, 41, 55)",
            width: 120,
            height: 80,
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
          variant="lines"
          gap={[40, 40]}
          size={1}
          style={{ backgroundColor: "rgb(10, 14, 26)" }}
          color="#374151"
          lineWidth={1}
        />
      </ReactFlow>

      {/* 节点详情模态框 */}
      <NodeDetailModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};
