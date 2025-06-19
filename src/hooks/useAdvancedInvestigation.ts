import { useState, useEffect } from "react";
import { useDataSource } from "@/contexts/DataSourceContext";

export interface RelatedThreat {
  id: string;
  ip: string;
  similarity: number;
  lastSeen: string;
  riskScore: number;
  attackTypes: string[];
}

export interface GeolocationInfo {
  lat: number;
  lng: number;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  timezone: string;
  isp: string;
  organization: string;
  asn: string;
}

export interface PortScan {
  port: number;
  protocol: "TCP" | "UDP";
  status: "open" | "closed" | "filtered";
  service: string;
  version?: string;
  timestamp: string;
}

export interface NetworkConnection {
  sourceIP: string;
  destIP: string;
  sourcePort: number;
  destPort: number;
  protocol: string;
  duration: number;
  bytes: number;
  packets: number;
  timestamp: string;
  status: "active" | "closed" | "timeout";
}

export interface MalwareSignature {
  id: string;
  name: string;
  family: string;
  type: "trojan" | "virus" | "worm" | "ransomware" | "spyware" | "adware";
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  md5: string;
  sha256: string;
  fileSize: number;
}

export interface ForensicEvidence {
  id: string;
  type: "file" | "registry" | "network" | "memory" | "process";
  artifact: string;
  description: string;
  timestamp: string;
  hash: string;
  size?: number;
  location: string;
  risk: "low" | "medium" | "high" | "critical";
}

export interface AdvancedInvestigation {
  ip: string;
  basicInfo: {
    country: string;
    organization: string;
    reputation: "clean" | "suspicious" | "malicious" | "unknown";
    firstSeen: string;
    lastActivity: string;
    riskScore: number;
    confidenceLevel: number;
  };
  geolocation: GeolocationInfo;
  networkAnalysis: {
    openPorts: PortScan[];
    connections: NetworkConnection[];
    bandwidth: {
      inbound: number;
      outbound: number;
      peak: number;
    };
    protocols: Record<string, number>;
  };
  threatIntelligence: {
    blacklists: string[];
    relatedThreats: RelatedThreat[];
    campaigns: string[];
    actors: string[];
  };
  malwareAnalysis: {
    signatures: MalwareSignature[];
    behaviors: string[];
    indicators: string[];
  };
  forensics: {
    artifacts: ForensicEvidence[];
    timeline: Array<{
      timestamp: string;
      event: string;
      severity: string;
      source: string;
    }>;
  };
  mitigation: {
    status: "none" | "partial" | "full";
    actions: Array<{
      action: string;
      status: "pending" | "completed" | "failed";
      timestamp: string;
    }>;
    recommendations: string[];
  };
  exportFormats: string[];
}

// Enhanced mock data generator
const generateAdvancedMockInvestigation = (
  ip: string,
): AdvancedInvestigation => {
  const countries = ["俄罗斯", "中国", "美国", "朝鲜", "伊朗", "德国", "英国"];
  const organizations = [
    "Unknown ISP",
    "VPS Provider",
    "Cloud Services",
    "University",
  ];
  const protocols = ["HTTP", "HTTPS", "FTP", "SSH", "SMTP", "DNS", "SNMP"];

  const riskScore = Math.floor(Math.random() * 100);
  const reputation =
    riskScore > 80
      ? "malicious"
      : riskScore > 60
        ? "suspicious"
        : riskScore > 30
          ? "unknown"
          : "clean";

  // Generate port scans
  const openPorts: PortScan[] = [];
  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995];
  for (let i = 0; i < Math.floor(Math.random() * 8) + 2; i++) {
    const port = commonPorts[Math.floor(Math.random() * commonPorts.length)];
    openPorts.push({
      port,
      protocol: Math.random() > 0.8 ? "UDP" : "TCP",
      status:
        Math.random() > 0.7
          ? "open"
          : Math.random() > 0.5
            ? "closed"
            : "filtered",
      service:
        port === 80 || port === 443
          ? "HTTP"
          : port === 22
            ? "SSH"
            : port === 21
              ? "FTP"
              : "Unknown",
      version: Math.random() > 0.5 ? "2.4.1" : undefined,
      timestamp: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });
  }

  // Generate network connections
  const connections: NetworkConnection[] = [];
  for (let i = 0; i < Math.floor(Math.random() * 15) + 5; i++) {
    connections.push({
      sourceIP: ip,
      destIP: `192.168.1.${Math.floor(Math.random() * 255)}`,
      sourcePort: Math.floor(Math.random() * 65535),
      destPort: commonPorts[Math.floor(Math.random() * commonPorts.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      duration: Math.floor(Math.random() * 3600),
      bytes: Math.floor(Math.random() * 1000000),
      packets: Math.floor(Math.random() * 10000),
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status:
        Math.random() > 0.3
          ? "closed"
          : Math.random() > 0.5
            ? "active"
            : "timeout",
    });
  }

  // Generate malware signatures
  const malwareTypes = [
    "trojan",
    "virus",
    "worm",
    "ransomware",
    "spyware",
    "adware",
  ] as const;
  const signatures: MalwareSignature[] = [];
  for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
    signatures.push({
      id: `mal_${Date.now()}_${i}`,
      name: `Malware.Generic.${Math.floor(Math.random() * 1000)}`,
      family: ["Zeus", "Conficker", "Stuxnet", "WannaCry", "Mirai"][
        Math.floor(Math.random() * 5)
      ],
      type: malwareTypes[Math.floor(Math.random() * malwareTypes.length)],
      confidence: Math.floor(Math.random() * 100),
      firstSeen: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      lastSeen: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      md5: Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join(""),
      sha256: Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join(""),
      fileSize: Math.floor(Math.random() * 10000000),
    });
  }

  return {
    ip,
    basicInfo: {
      country: countries[Math.floor(Math.random() * countries.length)],
      organization:
        organizations[Math.floor(Math.random() * organizations.length)],
      reputation,
      firstSeen: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      lastActivity: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      ).toISOString(),
      riskScore,
      confidenceLevel: Math.floor(Math.random() * 100),
    },
    geolocation: {
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      city: "未知城市",
      region: "未知区域",
      country: countries[Math.floor(Math.random() * countries.length)],
      countryCode: "XX",
      timezone: "UTC+8",
      isp: organizations[Math.floor(Math.random() * organizations.length)],
      organization:
        organizations[Math.floor(Math.random() * organizations.length)],
      asn: `AS${Math.floor(Math.random() * 65535)}`,
    },
    networkAnalysis: {
      openPorts,
      connections,
      bandwidth: {
        inbound: Math.floor(Math.random() * 1000),
        outbound: Math.floor(Math.random() * 1000),
        peak: Math.floor(Math.random() * 2000),
      },
      protocols: protocols.reduce(
        (acc, protocol) => {
          acc[protocol] = Math.floor(Math.random() * 100);
          return acc;
        },
        {} as Record<string, number>,
      ),
    },
    threatIntelligence: {
      blacklists: ["SURBL", "URIBL", "SpamCop"].filter(
        () => Math.random() > 0.6,
      ),
      relatedThreats: Array.from(
        { length: Math.floor(Math.random() * 5) },
        (_, i) => ({
          id: `threat_${i}`,
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          similarity: Math.floor(Math.random() * 100),
          lastSeen: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          riskScore: Math.floor(Math.random() * 100),
          attackTypes: ["brute_force", "malware", "ddos"].filter(
            () => Math.random() > 0.5,
          ),
        }),
      ),
      campaigns: ["APT29", "Lazarus", "Anonymous"].filter(
        () => Math.random() > 0.7,
      ),
      actors: ["Nation State", "Cybercriminal", "Hacktivist"].filter(
        () => Math.random() > 0.8,
      ),
    },
    malwareAnalysis: {
      signatures,
      behaviors: [
        "文件系统修改",
        "注册表修改",
        "网络通信",
        "进程注入",
        "反调试技术",
      ].filter(() => Math.random() > 0.5),
      indicators: [`${ip}:80`, "malicious.exe", "c:\\temp\\payload.dll"],
    },
    forensics: {
      artifacts: Array.from(
        { length: Math.floor(Math.random() * 10) + 3 },
        (_, i) => ({
          id: `artifact_${i}`,
          type: ["file", "registry", "network", "memory", "process"][
            Math.floor(Math.random() * 5)
          ] as any,
          artifact: `Artifact_${i}.exe`,
          description: `恶意文件 ${i}，检测到可疑行为`,
          timestamp: new Date(
            Date.now() - Math.random() * 24 * 60 * 60 * 1000,
          ).toISOString(),
          hash: Array.from({ length: 32 }, () =>
            Math.floor(Math.random() * 16).toString(16),
          ).join(""),
          size: Math.floor(Math.random() * 1000000),
          location: `C:\\Windows\\System32\\artifact_${i}.exe`,
          risk: ["low", "medium", "high", "critical"][
            Math.floor(Math.random() * 4)
          ] as any,
        }),
      ),
      timeline: Array.from(
        { length: Math.floor(Math.random() * 20) + 10 },
        (_, i) => ({
          timestamp: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          event: `事件 ${i}: 检测到异常活动`,
          severity: ["low", "medium", "high", "critical"][
            Math.floor(Math.random() * 4)
          ],
          source: ["IDS", "Firewall", "Antivirus", "SIEM"][
            Math.floor(Math.random() * 4)
          ],
        }),
      ).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    },
    mitigation: {
      status: ["none", "partial", "full"][Math.floor(Math.random() * 3)] as any,
      actions: [
        {
          action: "封禁IP地址",
          status: "completed",
          timestamp: new Date().toISOString(),
        },
        {
          action: "更新防火墙规则",
          status: "pending",
          timestamp: new Date().toISOString(),
        },
        {
          action: "通知安全团队",
          status: "completed",
          timestamp: new Date().toISOString(),
        },
      ],
      recommendations: [
        "立即封禁该IP地址",
        "增强监控相关网段",
        "更新入侵检测规则",
        "进行深度包检测",
        "隔离受感染主机",
      ],
    },
    exportFormats: ["JSON", "CSV", "PDF", "XML", "STIX"],
  };
};

export const useAdvancedInvestigation = (ip?: string) => {
  const [investigation, setInvestigation] =
    useState<AdvancedInvestigation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isApiMode } = useDataSource();

  const investigateIP = async (targetIP: string) => {
    setLoading(true);
    setError(null);

    try {
      if (isApiMode) {
        // Real API call would go here
        const response = await fetch(`/api/investigation/advanced/${targetIP}`);
        if (!response.ok) {
          throw new Error("高级调查失败");
        }
        const data = await response.json();
        setInvestigation(data);
      } else {
        // Mock data mode
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
        const mockData = generateAdvancedMockInvestigation(targetIP);
        setInvestigation(mockData);
      }
    } catch (err) {
      if (isApiMode) {
        // Fallback to mock data on API error
        const mockData = generateAdvancedMockInvestigation(targetIP);
        setInvestigation(mockData);
      } else {
        setError(err instanceof Error ? err.message : "调查过程中发生错误");
      }
    } finally {
      setLoading(false);
    }
  };

  const exportInvestigation = (format: string) => {
    if (!investigation) return;

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format.toLowerCase()) {
      case "json":
        content = JSON.stringify(investigation, null, 2);
        mimeType = "application/json";
        extension = "json";
        break;
      case "csv":
        // Convert to CSV format
        content = convertToCSV(investigation);
        mimeType = "text/csv";
        extension = "csv";
        break;
      default:
        content = JSON.stringify(investigation, null, 2);
        mimeType = "application/json";
        extension = "json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `advanced_investigation_${investigation.ip}_${new Date().toISOString().split("T")[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: AdvancedInvestigation): string => {
    // Basic CSV conversion for demonstration
    const lines = [
      "Type,Value,Details,Timestamp",
      `Basic Info,${data.ip},Risk Score: ${data.basicInfo.riskScore},${data.basicInfo.lastActivity}`,
      ...data.networkAnalysis.openPorts.map(
        (port) =>
          `Port Scan,${port.port},${port.service} (${port.status}),${port.timestamp}`,
      ),
      ...data.forensics.artifacts.map(
        (artifact) =>
          `Forensic Artifact,${artifact.artifact},${artifact.description},${artifact.timestamp}`,
      ),
    ];
    return lines.join("\n");
  };

  useEffect(() => {
    if (ip) {
      investigateIP(ip);
    }
  }, [ip, isApiMode]);

  return {
    investigation,
    loading,
    error,
    investigateIP,
    exportInvestigation,
  };
};
