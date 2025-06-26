import { useState, useEffect } from "react";

export interface ThreatIntelligenceResult {
  indicators: Array<{
    type: "ip" | "domain" | "hash" | "url";
    value: string;
    confidence: number;
    severity: "low" | "medium" | "high" | "critical";
    firstSeen: string;
    lastSeen: string;
    sources: string[];
    tags: string[];
  }>;
  relationships: Array<{
    source: string;
    target: string;
    relationship: string;
    confidence: number;
  }>;
  timeline: Array<{
    timestamp: string;
    event: string;
    severity: string;
    description: string;
  }>;
  riskScore: number;
  mitigation: string[];
}

export interface NetworkTopologyData {
  nodes: Array<{
    id: string;
    type: "server" | "client" | "router" | "firewall" | "unknown";
    ip: string;
    hostname?: string;
    status: "active" | "inactive" | "suspicious";
    metrics: {
      cpu: number;
      memory: number;
      network: number;
    };
    connections: number;
    lastSeen: string;
    threatLevel: "low" | "medium" | "high" | "critical";
    location?: {
      country: string;
      city: string;
    };
  }>;
  edges: Array<{
    source: string;
    target: string;
    protocol: "tcp" | "udp" | "icmp";
    port: number;
    bytes: number;
    packets: number;
    duration: number;
    status: "established" | "closed" | "listening";
  }>;
  statistics: {
    totalNodes: number;
    activeConnections: number;
    suspiciousActivity: number;
    bandwidthUsage: number;
  };
}

// 生成模拟威胁情报数据
const generateMockThreatIntelligence = (
  query: string,
): ThreatIntelligenceResult => {
  const severities: Array<"low" | "medium" | "high" | "critical"> = [
    "low",
    "medium",
    "high",
    "critical",
  ];
  const sources = ["VirusTotal", "AlienVault", "ThreatCrowd", "内部威胁库"];
  const tags = ["恶意软件", "钓鱼", "僵尸网络", "APT", "勒索软件"];

  return {
    indicators: Array.from(
      { length: Math.floor(Math.random() * 5) + 3 },
      () => ({
        type: ["ip", "domain", "hash", "url"][Math.floor(Math.random() * 4)] as
          | "ip"
          | "domain"
          | "hash"
          | "url",
        value: `${query}-related-indicator-${Math.floor(Math.random() * 1000)}`,
        confidence: Math.floor(Math.random() * 40) + 60,
        severity: severities[Math.floor(Math.random() * severities.length)],
        firstSeen: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastSeen: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        sources: sources.slice(0, Math.floor(Math.random() * 3) + 1),
        tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
      }),
    ),
    relationships: Array.from(
      { length: Math.floor(Math.random() * 3) + 2 },
      () => ({
        source: `node-${Math.floor(Math.random() * 100)}`,
        target: `node-${Math.floor(Math.random() * 100)}`,
        relationship: ["communicates_with", "downloads_from", "redirects_to"][
          Math.floor(Math.random() * 3)
        ],
        confidence: Math.floor(Math.random() * 30) + 70,
      }),
    ),
    timeline: Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
      event: ["恶意流量检测", "异常连接", "威胁指标匹配", "安全告警"][
        Math.floor(Math.random() * 4)
      ],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: `与 ${query} 相关的安全事件检测`,
    })),
    riskScore: Math.floor(Math.random() * 40) + 60,
    mitigation: [
      "阻断可疑IP地址",
      "更新安全规则",
      "加强监控",
      "通知安全团队",
    ].slice(0, Math.floor(Math.random() * 3) + 2),
  };
};

// 生成模拟网络拓扑数据
const generateMockNetworkTopology = (): NetworkTopologyData => {
  const nodeCount = Math.floor(Math.random() * 20) + 10;
  const types = ["server", "client", "router", "firewall", "unknown"] as const;
  const statuses = ["active", "inactive", "suspicious"] as const;
  const threatLevels = ["low", "medium", "high", "critical"] as const;
  const countries = ["美国", "中国", "日本", "德国", "英国"];
  const cities = ["纽约", "北京", "东京", "柏林", "伦敦"];

  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    type: types[Math.floor(Math.random() * types.length)],
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    hostname: Math.random() > 0.5 ? `host-${i}.local` : undefined,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    metrics: {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100),
    },
    connections: Math.floor(Math.random() * 50),
    lastSeen: new Date(
      Date.now() - Math.random() * 24 * 60 * 60 * 1000,
    ).toISOString(),
    threatLevel: threatLevels[Math.floor(Math.random() * threatLevels.length)],
    location:
      Math.random() > 0.3
        ? {
            country: countries[Math.floor(Math.random() * countries.length)],
            city: cities[Math.floor(Math.random() * cities.length)],
          }
        : undefined,
  }));

  const edgeCount = Math.floor(Math.random() * 30) + 10;
  const protocols = ["tcp", "udp", "icmp"] as const;
  const connectionStatuses = ["established", "closed", "listening"] as const;

  const edges = Array.from({ length: edgeCount }, () => ({
    source: `node-${Math.floor(Math.random() * nodeCount)}`,
    target: `node-${Math.floor(Math.random() * nodeCount)}`,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    port: Math.floor(Math.random() * 65535),
    bytes: Math.floor(Math.random() * 1000000),
    packets: Math.floor(Math.random() * 10000),
    duration: Math.floor(Math.random() * 3600),
    status:
      connectionStatuses[Math.floor(Math.random() * connectionStatuses.length)],
  }));

  return {
    nodes,
    edges,
    statistics: {
      totalNodes: nodeCount,
      activeConnections: edges.filter((e) => e.status === "established").length,
      suspiciousActivity: nodes.filter((n) => n.status === "suspicious").length,
      bandwidthUsage: Math.floor(Math.random() * 1000),
    },
  };
};

export function useAdvancedInvestigation() {
  const [threatData, setThreatData] = useState<ThreatIntelligenceResult | null>(
    null,
  );
  const [topologyData, setTopologyData] = useState<NetworkTopologyData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const investigateThreat = async (query: string): Promise<void> => {
    if (!query || !query.trim()) {
      setError("请输入查询条件");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 模拟API调用延迟
      await new Promise((resolve) =>
        setTimeout(resolve, 1500 + Math.random() * 2000),
      );

      const result = generateMockThreatIntelligence(query.trim());
      setThreatData(result);
    } catch (error) {
      console.error("Threat investigation failed:", error);
      setError(error instanceof Error ? error.message : "威胁调查失败");
    } finally {
      setLoading(false);
    }
  };

  const loadNetworkTopology = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 模拟API调用延迟
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1500),
      );

      const result = generateMockNetworkTopology();
      setTopologyData(result);
    } catch (error) {
      console.error("Network topology loading failed:", error);
      setError(error instanceof Error ? error.message : "网络拓扑加载失败");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setThreatData(null);
    setTopologyData(null);
    setError(null);
    setLoading(false);
  };

  // 自动加载网络拓扑数据
  useEffect(() => {
    loadNetworkTopology();
  }, []);

  return {
    threatData,
    topologyData,
    loading,
    error,
    investigateThreat,
    loadNetworkTopology,
    reset,
  };
}
