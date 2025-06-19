import React, { useMemo, useCallback } from "react";
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
        return <Shield className="w-6 h-6" />;
      case "router":
        return <Router className="w-5 h-5" />;
      case "server":
        return <Server className="w-5 h-5" />;
      case "internet":
        return <Globe className="w-5 h-5" />;
      case "device":
        return <Monitor className="w-5 h-5" />;
      case "mobile":
        return <Smartphone className="w-5 h-5" />;
      case "database":
        return <Database className="w-5 h-5" />;
      case "cloud":
        return <Cloud className="w-5 h-5" />;
      default:
        return <Wifi className="w-5 h-5" />;
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
        "px-4 py-3 shadow-lg rounded-lg border-2 min-w-[120px] cyber-card",
        getRiskColor(data.risk),
        data.isTarget && "ring-2 ring-quantum-500 ring-opacity-50",
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {getNodeIcon(data.type)}
        <div className="font-medium text-sm">{data.label}</div>
      </div>
      <div className="text-xs opacity-75">{data.ip}</div>
      {data.ports && data.ports.length > 0 && (
        <div className="text-xs mt-1 opacity-60">
          端口: {data.ports.slice(0, 3).join(", ")}
          {data.ports.length > 3 && "..."}
        </div>
      )}
      {data.risk && (
        <div className="flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3 h-3" />
          <span className="text-xs">{data.risk}</span>
        </div>
      )}
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
  // 生成网络拓扑数据
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // 中心目标节点
    nodes.push({
      id: "target",
      type: "custom",
      position: { x: 400, y: 300 },
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
          ?.slice(0, 3)
          .map((p: any) => p.port) ||
          investigation?.timeline
            ?.slice(0, 3)
            .map((_: any, i: number) => 80 + i * 10) || [80, 443, 22],
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // 互联网网关
    nodes.push({
      id: "internet",
      type: "custom",
      position: { x: 100, y: 300 },
      data: {
        label: "互联网",
        ip: "0.0.0.0/0",
        type: "internet",
        risk: "medium",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // 路由器/网关
    nodes.push({
      id: "router",
      type: "custom",
      position: { x: 250, y: 300 },
      data: {
        label: "网络网关",
        ip: "192.168.1.1",
        type: "router",
        risk: "low",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // 基于调查结果生成相关节点
    if (investigation?.networkAnalysis?.connections) {
      investigation.networkAnalysis.connections
        .slice(0, 6)
        .forEach((conn: any, index: number) => {
          const angle = (index * Math.PI * 2) / 6;
          const radius = 150;
          const x = 400 + Math.cos(angle) * radius;
          const y = 300 + Math.sin(angle) * radius;

          nodes.push({
            id: `connection-${index}`,
            type: "custom",
            position: { x, y },
            data: {
              label: `设备 ${index + 1}`,
              ip: conn.destIP,
              type: index % 2 === 0 ? "server" : "device",
              risk: conn.status === "active" ? "medium" : "low",
              ports: [conn.destPort],
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });

          // 添加连接边
          edges.push({
            id: `edge-target-${index}`,
            source: "target",
            target: `connection-${index}`,
            type: "smoothstep",
            animated: conn.status === "active",
            style: {
              stroke: conn.status === "active" ? "#00f5ff" : "#6b7280",
              strokeWidth: 2,
            },
            label: `${conn.protocol}:${conn.destPort}`,
            labelStyle: {
              fill: "#ffffff",
              fontSize: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "2px 4px",
              borderRadius: "4px",
            },
          });
        });
    } else if (investigation?.timeline) {
      // 如果没有网络连接数据，基于时间线生成节点
      investigation.timeline
        .slice(0, 5)
        .forEach((event: any, index: number) => {
          const angle = (index * Math.PI * 2) / 5;
          const radius = 120;
          const x = 400 + Math.cos(angle) * radius;
          const y = 300 + Math.sin(angle) * radius;

          nodes.push({
            id: `event-${index}`,
            type: "custom",
            position: { x, y },
            data: {
              label: `攻击源 ${index + 1}`,
              ip: `10.0.${index}.${100 + index}`,
              type: event.type?.includes("malware") ? "database" : "device",
              risk: event.severity || "medium",
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });

          edges.push({
            id: `edge-attack-${index}`,
            source: `event-${index}`,
            target: "target",
            type: "smoothstep",
            animated: true,
            style: {
              stroke:
                event.severity === "critical"
                  ? "#ff0040"
                  : event.severity === "high"
                    ? "#ff6600"
                    : "#39ff14",
              strokeWidth: 2,
            },
            label: event.type?.replace("_", " ") || "attack",
            labelStyle: {
              fill: "#ffffff",
              fontSize: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "2px 4px",
              borderRadius: "4px",
            },
          });
        });
    }

    // 威胁情报相关节点
    if (investigation?.threatIntelligence?.relatedThreats) {
      investigation.threatIntelligence.relatedThreats
        .slice(0, 3)
        .forEach((threat: any, index: number) => {
          nodes.push({
            id: `threat-${index}`,
            type: "custom",
            position: { x: 600 + index * 100, y: 150 + index * 50 },
            data: {
              label: `威胁IP ${index + 1}`,
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
        });
    }

    // 基础网络连接
    edges.push(
      {
        id: "edge-internet-router",
        source: "internet",
        target: "router",
        type: "smoothstep",
        style: { stroke: "#6b7280", strokeWidth: 2 },
        label: "WAN",
        labelStyle: {
          fill: "#9ca3af",
          fontSize: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "2px 4px",
          borderRadius: "4px",
        },
      },
      {
        id: "edge-router-target",
        source: "router",
        target: "target",
        type: "smoothstep",
        style: { stroke: "#00f5ff", strokeWidth: 3 },
        label: "LAN",
        labelStyle: {
          fill: "#00f5ff",
          fontSize: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "2px 4px",
          borderRadius: "4px",
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

  return (
    <div
      className={cn(
        "w-full h-96 bg-matrix-bg rounded-lg overflow-hidden",
        className,
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-matrix-bg"
        style={{
          backgroundColor: "rgb(10, 14, 26)",
        }}
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
        />
        <MiniMap
          className="bg-matrix-surface border border-matrix-border"
          style={{
            backgroundColor: "rgb(31, 41, 55)",
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
        />
        <Background
          variant="dots"
          gap={20}
          size={1}
          style={{ backgroundColor: "rgb(10, 14, 26)" }}
          color="#374151"
        />
      </ReactFlow>
    </div>
  );
};
