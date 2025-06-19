import { Node, Edge } from "reactflow";

export interface NetworkNode {
  id: string;
  ip: string;
  label: string;
  type:
    | "target"
    | "router"
    | "server"
    | "internet"
    | "device"
    | "mobile"
    | "database"
    | "cloud"
    | "firewall"
    | "load_balancer";
  risk: "critical" | "high" | "medium" | "low" | "unknown";
  ports?: number[];
  threats?: number;
  connections?: number;
  performance?: {
    cpu: number;
    bandwidth: number;
    memory?: number;
    uptime?: number;
  };
  location?: {
    x?: number;
    y?: number;
    zone?: string;
  };
  metadata?: Record<string, any>;
}

export interface NetworkConnection {
  sourceIP: string;
  destIP: string;
  sourcePort?: number;
  destPort: number;
  protocol: string;
  status: "active" | "inactive" | "timeout" | "blocked" | "threat";
  bandwidth?: number;
  latency?: string;
  bytes?: number;
  packets?: number;
  duration?: number;
  timestamp?: string;
}

export interface TopologyAnalysisResult {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
  metrics: {
    totalNodes: number;
    activeConnections: number;
    securityScore: number;
    performanceScore: number;
    threatLevel: "low" | "medium" | "high" | "critical";
  };
  recommendations: string[];
}

/**
 * 计算网络节点重要性评分
 */
export function calculateNodeImportance(node: NetworkNode): number {
  let importance = 0;

  // 基础重要性评分
  if (node.type === "target") importance += 100;
  if (node.type === "firewall") importance += 80;
  if (node.type === "router") importance += 70;
  if (node.type === "load_balancer") importance += 60;
  if (node.type === "server") importance += 50;
  if (node.type === "database") importance += 45;

  // 威胁和连接数加权
  if (node.threats) importance += node.threats * 15;
  if (node.connections) importance += Math.min(node.connections * 3, 30);

  // 开放端口风险评估
  if (node.ports) {
    const criticalPorts = node.ports.filter((port) => port < 1024).length;
    importance += criticalPorts * 10;
  }

  // 性能影响
  if (node.performance) {
    if (node.performance.cpu > 80) importance += 20;
    if (node.performance.bandwidth > 100) importance += 15;
  }

  return Math.min(importance, 200); // 最大重要性评分200
}

/**
 * 优化的力导向布局算法
 */
export function generateForceDirectedLayout(
  nodes: NetworkNode[],
  connections: NetworkConnection[],
  options: {
    width?: number;
    height?: number;
    centerIP?: string;
    iterations?: number;
    repulsionStrength?: number;
    attractionStrength?: number;
  } = {},
): { nodes: Node[]; edges: Edge[] } {
  const {
    width = 800,
    height = 600,
    centerIP,
    iterations = 100,
    repulsionStrength = 1000,
    attractionStrength = 0.1,
  } = options;

  // 初始化节点位置
  const layoutNodes: Array<
    NetworkNode & { x: number; y: number; vx: number; vy: number }
  > = nodes.map((node, index) => ({
    ...node,
    x: node.id === centerIP ? width / 2 : Math.random() * width,
    y: node.id === centerIP ? height / 2 : Math.random() * height,
    vx: 0,
    vy: 0,
  }));

  // 构建连接图
  const connectionMap = new Map<string, string[]>();
  connections.forEach((conn) => {
    if (!connectionMap.has(conn.sourceIP)) {
      connectionMap.set(conn.sourceIP, []);
    }
    if (!connectionMap.has(conn.destIP)) {
      connectionMap.set(conn.destIP, []);
    }
    connectionMap.get(conn.sourceIP)?.push(conn.destIP);
    connectionMap.get(conn.destIP)?.push(conn.sourceIP);
  });

  // 力导向布局迭代
  for (let iter = 0; iter < iterations; iter++) {
    // 重置力
    layoutNodes.forEach((node) => {
      node.vx = 0;
      node.vy = 0;
    });

    // 计算排斥力
    for (let i = 0; i < layoutNodes.length; i++) {
      for (let j = i + 1; j < layoutNodes.length; j++) {
        const nodeA = layoutNodes[i];
        const nodeB = layoutNodes[j];

        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = repulsionStrength / (distance * distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        nodeA.vx += fx;
        nodeA.vy += fy;
        nodeB.vx -= fx;
        nodeB.vy -= fy;
      }
    }

    // 计算连接吸引力
    connections.forEach((conn) => {
      const sourceNode = layoutNodes.find((n) => n.id === conn.sourceIP);
      const destNode = layoutNodes.find((n) => n.id === conn.destIP);

      if (sourceNode && destNode) {
        const dx = destNode.x - sourceNode.x;
        const dy = destNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = attractionStrength * distance;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        sourceNode.vx += fx;
        sourceNode.vy += fy;
        destNode.vx -= fx;
        destNode.vy -= fy;
      }
    });

    // 应用力并更新位置
    layoutNodes.forEach((node) => {
      // 目标节点固定在中心
      if (node.id === centerIP) {
        node.x = width / 2;
        node.y = height / 2;
        return;
      }

      // 阻尼系数
      const damping = 0.9;
      node.vx *= damping;
      node.vy *= damping;

      node.x += node.vx;
      node.y += node.vy;

      // 边界约束
      const margin = 50;
      node.x = Math.max(margin, Math.min(width - margin, node.x));
      node.y = Math.max(margin, Math.min(height - margin, node.y));
    });
  }

  // 转换为ReactFlow格式
  const reactFlowNodes: Node[] = layoutNodes.map((node) => ({
    id: node.id,
    type: "custom",
    position: { x: node.x - 50, y: node.y - 25 }, // 调整偏移
    data: {
      ...node,
      importance: calculateNodeImportance(node) > 50 ? "high" : "normal",
    },
    sourcePosition: "right" as const,
    targetPosition: "left" as const,
  }));

  const reactFlowEdges: Edge[] = connections.map((conn, index) => ({
    id: `edge-${index}`,
    source: conn.sourceIP,
    target: conn.destIP,
    type: conn.status === "active" ? "smoothstep" : "straight",
    animated: conn.status === "active" && (conn.bandwidth || 0) > 50,
    style: getEdgeStyle(conn),
    label: `${conn.protocol}:${conn.destPort}`,
    labelStyle: {
      fill: "#ffffff",
      fontSize: "10px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    markerEnd: {
      type: "arrowclosed",
      width: 10,
      height: 10,
      color: getEdgeColor(conn),
    },
  }));

  return { nodes: reactFlowNodes, edges: reactFlowEdges };
}

/**
 * 获取边的样式
 */
function getEdgeStyle(connection: NetworkConnection) {
  const baseStyle = {
    strokeWidth: 2,
    strokeDasharray: "none",
  };

  switch (connection.status) {
    case "threat":
      return {
        ...baseStyle,
        stroke: "#ff0040",
        strokeWidth: 3,
        strokeDasharray: "8,4",
      };
    case "active":
      return {
        ...baseStyle,
        stroke: connection.protocol === "HTTPS" ? "#39ff14" : "#00f5ff",
        strokeWidth: Math.min(3, Math.max(1, (connection.bandwidth || 0) / 50)),
      };
    case "blocked":
      return {
        ...baseStyle,
        stroke: "#ff6600",
        strokeWidth: 2,
        strokeDasharray: "6,3",
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
}

/**
 * 获取边的颜色
 */
function getEdgeColor(connection: NetworkConnection): string {
  switch (connection.status) {
    case "threat":
      return "#ff0040";
    case "active":
      return connection.protocol === "HTTPS" ? "#39ff14" : "#00f5ff";
    case "blocked":
      return "#ff6600";
    case "inactive":
      return "#6b7280";
    default:
      return "#6b7280";
  }
}

/**
 * 分析网络拓扑安全性
 */
export function analyzeNetworkSecurity(analysis: TopologyAnalysisResult): {
  score: number;
  risks: Array<{
    level: "low" | "medium" | "high" | "critical";
    description: string;
  }>;
  recommendations: string[];
} {
  const risks: Array<{
    level: "low" | "medium" | "high" | "critical";
    description: string;
  }> = [];
  const recommendations: string[] = [];
  let score = 100;

  // 分析威胁节点
  const threatNodes = analysis.nodes.filter((node) => (node.threats || 0) > 0);
  if (threatNodes.length > 0) {
    score -= threatNodes.length * 15;
    risks.push({
      level: threatNodes.length > 3 ? "critical" : "high",
      description: `发现 ${threatNodes.length} 个存在威胁的节点`,
    });
    recommendations.push("立即隔离或封锁威胁节点");
  }

  // 分析开放端口
  const openPorts = analysis.nodes.reduce(
    (acc, node) => acc + (node.ports?.length || 0),
    0,
  );
  const criticalPorts = analysis.nodes.reduce(
    (acc, node) =>
      acc + (node.ports?.filter((port) => port < 1024).length || 0),
    0,
  );

  if (criticalPorts > 5) {
    score -= criticalPorts * 5;
    risks.push({
      level: "medium",
      description: `${criticalPorts} 个关键端口暴露在网络中`,
    });
    recommendations.push("关闭不必要的服务端口");
  }

  // 分析连接安全性
  const insecureConnections = analysis.connections.filter(
    (conn) =>
      conn.protocol === "HTTP" ||
      conn.protocol === "FTP" ||
      conn.protocol === "TELNET",
  );

  if (insecureConnections.length > 0) {
    score -= insecureConnections.length * 8;
    risks.push({
      level: "medium",
      description: `${insecureConnections.length} 个不安全的连接协议`,
    });
    recommendations.push("将不安全协议升级为加密版本");
  }

  // 分析网络分段
  const hasFirewall = analysis.nodes.some((node) => node.type === "firewall");
  if (!hasFirewall) {
    score -= 20;
    risks.push({
      level: "high",
      description: "网络中缺少防火墙保护",
    });
    recommendations.push("部署网络防火墙以加强安全防护");
  }

  // 性能风险评估
  const highLoadNodes = analysis.nodes.filter(
    (node) => (node.performance?.cpu || 0) > 80,
  );

  if (highLoadNodes.length > 0) {
    score -= highLoadNodes.length * 10;
    risks.push({
      level: "medium",
      description: `${highLoadNodes.length} 个节点CPU使用率过高`,
    });
    recommendations.push("优化高负载节点的资源分配");
  }

  return {
    score: Math.max(0, score),
    risks,
    recommendations,
  };
}

/**
 * 生成网络拓扑报告
 */
export function generateTopologyReport(analysis: TopologyAnalysisResult): {
  summary: string;
  details: {
    infrastructure: string;
    security: string;
    performance: string;
    recommendations: string;
  };
} {
  const security = analyzeNetworkSecurity(analysis);

  return {
    summary: `网络拓扑分析完成：共发现 ${analysis.nodes.length} 个节点，${analysis.connections.length} 个连接。安全评分：${security.score}/100。`,
    details: {
      infrastructure: `网络基础设施包含 ${analysis.nodes.length} 个节点，主要设备类型：${[...new Set(analysis.nodes.map((n) => n.type))].join("、")}。`,
      security: `安全状况：${security.risks.length} 个风险项目，其中 ${security.risks.filter((r) => r.level === "critical" || r.level === "high").length} 个高风险项目需要立即处理。`,
      performance: `性能状况：平均CPU使用率 ${Math.round(analysis.nodes.reduce((acc, n) => acc + (n.performance?.cpu || 0), 0) / analysis.nodes.length)}%，网络连接活跃度 ${Math.round((analysis.metrics.activeConnections / Math.max(analysis.connections.length, 1)) * 100)}%。`,
      recommendations: security.recommendations.join("；") + "。",
    },
  };
}

/**
 * 网络拓扑数据缓存
 */
export class TopologyCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5分钟缓存

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// 全局缓存实例
export const topologyCache = new TopologyCache();
