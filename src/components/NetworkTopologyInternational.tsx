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
  Wifi,
  Server,
  Globe,
  Router,
  Database,
  Cloud,
  Monitor,
  Activity,
  AlertTriangle,
  Lock,
  Zap,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NetworkTopologyInternationalProps {
  investigation: any;
  centerIP: string;
  className?: string;
}

// Modern node component with international design standards
const ModernNetworkNode = ({ data }: { data: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const getNodeIcon = useCallback((type: string) => {
    const iconMap = {
      target: Shield,
      router: Router,
      server: Server,
      internet: Globe,
      device: Monitor,
      database: Database,
      cloud: Cloud,
      firewall: Shield,
      load_balancer: Activity,
    };
    const IconComponent = iconMap[type as keyof typeof iconMap] || Wifi;
    return <IconComponent className="w-5 h-5" />;
  }, []);

  const getStatusColor = useCallback((risk: string) => {
    const statusColors = {
      critical: {
        bg: "bg-red-50 dark:bg-red-950",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-700 dark:text-red-300",
        icon: "text-red-600 dark:text-red-400",
        accent: "bg-red-500",
      },
      high: {
        bg: "bg-orange-50 dark:bg-orange-950",
        border: "border-orange-200 dark:border-orange-800",
        text: "text-orange-700 dark:text-orange-300",
        icon: "text-orange-600 dark:text-orange-400",
        accent: "bg-orange-500",
      },
      medium: {
        bg: "bg-yellow-50 dark:bg-yellow-950",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-700 dark:text-yellow-300",
        icon: "text-yellow-600 dark:text-yellow-400",
        accent: "bg-yellow-500",
      },
      low: {
        bg: "bg-green-50 dark:bg-green-950",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-700 dark:text-green-300",
        icon: "text-green-600 dark:text-green-400",
        accent: "bg-green-500",
      },
      unknown: {
        bg: "bg-blue-50 dark:bg-blue-950",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
        icon: "text-blue-600 dark:text-blue-400",
        accent: "bg-blue-500",
      },
    };
    return (
      statusColors[risk as keyof typeof statusColors] || statusColors.unknown
    );
  }, []);

  const getTypeLabel = useCallback((type: string) => {
    const typeLabels = {
      target: "Target",
      router: "Router",
      server: "Server",
      internet: "Gateway",
      device: "Device",
      database: "Database",
      cloud: "Cloud",
      firewall: "Firewall",
      load_balancer: "Load Balancer",
    };
    return typeLabels[type as keyof typeof typeLabels] || "Device";
  }, []);

  const getPortSecurityLevel = useCallback((port: number) => {
    if (port < 1024)
      return {
        level: "system",
        color: "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300",
      };
    if (port < 49152)
      return {
        level: "registered",
        color:
          "text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-300",
      };
    return {
      level: "dynamic",
      color:
        "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300",
    };
  }, []);

  const colors = getStatusColor(data.risk);

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-300 ease-out",
        "min-w-[140px] max-w-[180px] p-4",
        "rounded-xl shadow-lg hover:shadow-xl",
        "border-2 backdrop-blur-sm",
        colors.bg,
        colors.border,
        data.isTarget && "ring-2 ring-blue-500 ring-opacity-50",
        isHovered && "scale-105 shadow-2xl",
        isSelected && "ring-2 ring-blue-400 ring-opacity-70",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsSelected(!isSelected)}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute -top-1 -right-1 w-3 h-3 rounded-full",
          colors.accent,
        )}
      />

      {/* Target indicator */}
      {data.isTarget && (
        <div className="absolute -top-2 -left-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Header with icon and type */}
        <div className="flex items-center justify-between">
          <div className={cn("p-2 rounded-lg", colors.bg, colors.icon)}>
            {getNodeIcon(data.type)}
          </div>
          <div className="text-right">
            <div
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                colors.text,
              )}
            >
              {getTypeLabel(data.type)}
            </div>
          </div>
        </div>

        {/* IP Address */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            IP Address
          </div>
          <div
            className={cn("font-mono text-sm font-semibold", colors.text)}
            title={data.ip}
          >
            {data.ip}
          </div>
        </div>

        {/* Ports */}
        {data.ports && data.ports.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Open Ports
            </div>
            <div className="flex flex-wrap gap-1">
              {data.ports.slice(0, 4).map((port: number, index: number) => {
                const security = getPortSecurityLevel(port);
                return (
                  <Badge
                    key={index}
                    className={cn(
                      "text-xs font-mono px-2 py-1 rounded-md border",
                      security.color,
                    )}
                  >
                    {port}
                  </Badge>
                );
              })}
              {data.ports.length > 4 && (
                <Badge className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  +{data.ports.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Status indicators */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {data.isTarget && (
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Target
                </span>
              </div>
            )}
            {data.risk === "critical" && (
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Critical
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <div className={cn("w-2 h-2 rounded-full", colors.accent)} />
            <span className={cn("text-xs font-medium capitalize", colors.text)}>
              {data.risk}
            </span>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      {isHovered && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
      )}
    </div>
  );
};

// Modern edge styling
const getModernEdgeStyle = (connection: any) => {
  const edgeStyles = {
    active: {
      stroke: "#3b82f6",
      strokeWidth: 2,
      strokeDasharray: "none",
    },
    threat: {
      stroke: "#ef4444",
      strokeWidth: 3,
      strokeDasharray: "8,4",
    },
    secure: {
      stroke: "#10b981",
      strokeWidth: 2,
      strokeDasharray: "none",
    },
    suspicious: {
      stroke: "#f59e0b",
      strokeWidth: 2,
      strokeDasharray: "6,3",
    },
    inactive: {
      stroke: "#9ca3af",
      strokeWidth: 1,
      strokeDasharray: "4,2",
    },
  };

  const getStyleKey = () => {
    if (connection.status === "threat") return "threat";
    if (connection.protocol === "HTTPS" || connection.protocol === "SSH")
      return "secure";
    if (connection.status === "active") return "active";
    if (connection.status === "suspicious") return "suspicious";
    return "inactive";
  };

  return edgeStyles[getStyleKey() as keyof typeof edgeStyles];
};

const nodeTypes = {
  modern: ModernNetworkNode,
};

export const NetworkTopologyInternational: React.FC<
  NetworkTopologyInternationalProps
> = ({ investigation, centerIP, className }) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Generate modern network data
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!investigation) return { nodes: [], edges: [] };

    const networkNodes = [];
    const networkEdges = [];

    // Target node
    networkNodes.push({
      id: centerIP,
      ip: centerIP,
      label: "Investigation Target",
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
        ?.slice(0, 6)
        .map((p: any) => p.port) || [80, 443, 22],
    });

    // Connection nodes
    if (investigation.networkAnalysis?.connections) {
      investigation.networkAnalysis.connections
        .slice(0, 8)
        .forEach((conn: any, index: number) => {
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
          });
        });
    }

    // Infrastructure nodes
    const infrastructureNodes = [
      {
        id: "internet-gateway",
        ip: "0.0.0.0/0",
        label: "Internet Gateway",
        type: "internet",
        risk: "medium",
        ports: [80, 443],
      },
      {
        id: "firewall",
        ip: "192.168.1.1",
        label: "Security Firewall",
        type: "firewall",
        risk: "low",
        ports: [443, 22, 8080],
      },
      {
        id: "router",
        ip: "192.168.1.254",
        label: "Core Router",
        type: "router",
        risk: "low",
        ports: [80, 443, 22, 23],
      },
    ];

    networkNodes.push(...infrastructureNodes);

    // Infrastructure connections
    networkEdges.push(
      {
        sourceIP: "internet-gateway",
        destIP: "firewall",
        destPort: 443,
        protocol: "HTTPS",
        status: "active",
        bandwidth: 500,
      },
      {
        sourceIP: "firewall",
        destIP: "router",
        destPort: 443,
        protocol: "HTTPS",
        status: "active",
        bandwidth: 400,
      },
      {
        sourceIP: "router",
        destIP: centerIP,
        destPort: 443,
        protocol: "HTTPS",
        status: "active",
        bandwidth: 300,
      },
    );

    // Threat nodes
    if (investigation.threatIntelligence?.relatedThreats) {
      investigation.threatIntelligence.relatedThreats
        .slice(0, 3)
        .forEach((threat: any, index: number) => {
          networkNodes.push({
            id: threat.ip,
            ip: threat.ip,
            label: `Threat Source ${index + 1}`,
            type: "cloud",
            risk: "critical",
            ports: [6667, 8080, 9999],
          });

          networkEdges.push({
            sourceIP: threat.ip,
            destIP: centerIP,
            destPort: 443,
            protocol: "THREAT",
            status: "threat",
            bandwidth: 0,
          });
        });
    }

    // Generate React Flow nodes and edges
    const reactFlowNodes: Node[] = networkNodes.map((node, index) => {
      const angle = (index * 2 * Math.PI) / networkNodes.length;
      const radius = node.isTarget ? 0 : 200 + (Math.random() - 0.5) * 100;
      const x = 400 + Math.cos(angle) * radius;
      const y = 300 + Math.sin(angle) * radius;

      return {
        id: node.id,
        type: "modern",
        position: { x: x - 90, y: y - 60 },
        data: node,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

    const reactFlowEdges: Edge[] = networkEdges.map((edge, index) => ({
      id: `edge-${index}`,
      source: edge.sourceIP,
      target: edge.destIP,
      type: edge.status === "active" ? "smoothstep" : "straight",
      animated: edge.status === "active" || edge.status === "threat",
      style: getModernEdgeStyle(edge),
      label: `${edge.protocol}${edge.destPort ? `:${edge.destPort}` : ""}`,
      labelStyle: {
        fill: "#6b7280",
        fontSize: "11px",
        fontWeight: "500",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "4px 8px",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
      markerEnd: {
        type: "arrowclosed",
        width: 12,
        height: 12,
        color: getModernEdgeStyle(edge).stroke,
      },
    }));

    return { nodes: reactFlowNodes, edges: reactFlowEdges };
  }, [investigation, centerIP]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => {
    // Connection logic if needed
  }, []);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full h-96 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg",
        className,
      )}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Network Topology
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Investigation: {centerIP}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Status
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-300">Critical</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-300">High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-300">Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-300">Low</span>
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.4, maxZoom: 1.5 }}
        className="bg-gray-50 dark:bg-gray-900"
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.2}
        maxZoom={2.0}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        zoomOnDoubleClick={true}
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
      >
        <Controls
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm"
          position="bottom-left"
        />
        <Background
          variant="dots"
          gap={[20, 20]}
          size={1}
          style={{ backgroundColor: "transparent" }}
          color="#e5e7eb"
          className="dark:opacity-30"
        />
      </ReactFlow>
    </div>
  );
};
