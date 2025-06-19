import { useState, useEffect } from "react";
import { useDataSource } from "@/contexts/DataSourceContext";

export interface AttackEvent {
  id: string;
  timestamp: string;
  type:
    | "brute_force"
    | "port_scan"
    | "malware"
    | "ddos"
    | "intrusion"
    | "data_theft";
  severity: "low" | "medium" | "high" | "critical";
  target: string;
  method: string;
  status: "blocked" | "detected" | "successful";
  details: string;
}

export interface IPInvestigation {
  ip: string;
  country: string;
  organization: string;
  reputation: "clean" | "suspicious" | "malicious" | "unknown";
  firstSeen: string;
  lastActivity: string;
  totalAttacks: number;
  attackTypes: Record<string, number>;
  timeline: AttackEvent[];
  riskScore: number;
  isVPN: boolean;
  isTor: boolean;
  geolocation: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
}

// Mock data generator for IP investigation
const generateMockInvestigation = (ip: string): IPInvestigation => {
  const countries = [
    "俄罗斯",
    "中国",
    "美国",
    "朝鲜",
    "伊朗",
    "德国",
    "英国",
    "法国",
  ];
  const organizations = [
    "Unknown ISP",
    "VPS Provider",
    "Cloud Services",
    "University",
    "Government",
    "Enterprise",
  ];
  const attackTypes = [
    "brute_force",
    "port_scan",
    "malware",
    "ddos",
    "intrusion",
    "data_theft",
  ] as const;
  const severities = ["low", "medium", "high", "critical"] as const;
  const statuses = ["blocked", "detected", "successful"] as const;

  const attackTypeCount: Record<string, number> = {};
  const timeline: AttackEvent[] = [];

  // Generate attack events
  const eventCount = Math.floor(Math.random() * 20) + 5;
  for (let i = 0; i < eventCount; i++) {
    const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    attackTypeCount[type] = (attackTypeCount[type] || 0) + 1;

    timeline.push({
      id: `event_${i}`,
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      type,
      severity,
      target: `192.168.1.${Math.floor(Math.random() * 255)}`,
      method: `${type}_${Math.floor(Math.random() * 1000)}`,
      status,
      details: `${type}攻击尝试，目标端口${Math.floor(Math.random() * 65535)}`,
    });
  }

  timeline.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const riskScore = Math.floor(Math.random() * 100);
  const reputation =
    riskScore > 80
      ? "malicious"
      : riskScore > 60
        ? "suspicious"
        : riskScore > 30
          ? "unknown"
          : "clean";

  return {
    ip,
    country: countries[Math.floor(Math.random() * countries.length)],
    organization:
      organizations[Math.floor(Math.random() * organizations.length)],
    reputation,
    firstSeen: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    lastActivity: timeline[0]?.timestamp || new Date().toISOString(),
    totalAttacks: eventCount,
    attackTypes: attackTypeCount,
    timeline,
    riskScore,
    isVPN: Math.random() > 0.7,
    isTor: Math.random() > 0.9,
    geolocation: {
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      city: "未知城市",
      region: "未知区域",
    },
  };
};

export const useIPInvestigation = (ip?: string) => {
  const [investigation, setInvestigation] = useState<IPInvestigation | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isApiMode } = useDataSource();

  const investigateIP = async (targetIP: string) => {
    setLoading(true);
    setError(null);

    try {
      if (isApiMode) {
        // Real API call would go here
        const response = await fetch(`/api/investigation/ip/${targetIP}`);
        if (!response.ok) {
          throw new Error("调查失败");
        }
        const data = await response.json();
        setInvestigation(data);
      } else {
        // Mock data mode
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay
        const mockData = generateMockInvestigation(targetIP);
        setInvestigation(mockData);
      }
    } catch (err) {
      if (isApiMode) {
        // Fallback to mock data on API error
        const mockData = generateMockInvestigation(targetIP);
        setInvestigation(mockData);
      } else {
        setError(err instanceof Error ? err.message : "调查过程中发生错误");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (!investigation) return null;

    const reportData = {
      summary: {
        ip: investigation.ip,
        riskLevel:
          investigation.riskScore > 70
            ? "高风险"
            : investigation.riskScore > 40
              ? "中风险"
              : "低风险",
        totalIncidents: investigation.totalAttacks,
        timespan: `${new Date(investigation.firstSeen).toLocaleDateString()} - ${new Date(investigation.lastActivity).toLocaleDateString()}`,
      },
      analysis: {
        reputation: investigation.reputation,
        geography: `${investigation.country} - ${investigation.geolocation.city}`,
        infrastructure: investigation.organization,
        anonymization: {
          vpn: investigation.isVPN,
          tor: investigation.isTor,
        },
      },
      incidents: investigation.timeline.slice(0, 10), // Top 10 incidents
      recommendations: [
        "立即将该IP加入黑名单",
        "加强对相关网段的监控",
        "更新入侵检测规则",
        "通知相关安全团队",
      ],
    };

    return reportData;
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
    generateReport,
  };
};
