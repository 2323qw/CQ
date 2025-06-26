import { useState, useEffect } from "react";

export interface IPInvestigationResult {
  ip: string;
  country: string;
  city: string;
  organization: string;
  isp: string;
  threatLevel: "low" | "medium" | "high" | "critical";
  reputation: number;
  lastSeen: string;
  categories: string[];
  blocklisted: boolean;
  whoisInfo: {
    registrar: string;
    creationDate: string;
    expirationDate: string;
    contacts: {
      admin: string;
      tech: string;
    };
  };
  dnsRecords: {
    type: string;
    value: string;
  }[];
  relatedDomains: string[];
  trafficAnalysis: {
    inbound: number;
    outbound: number;
    protocols: {
      tcp: number;
      udp: number;
      icmp: number;
    };
  };
  historicalData: {
    date: string;
    events: number;
    threatType: string;
  }[];
}

// 模拟IP调查数据生成
const generateMockIPInvestigation = (ip: string): IPInvestigationResult => {
  const threatLevels: Array<"low" | "medium" | "high" | "critical"> = [
    "low",
    "medium",
    "high",
    "critical",
  ];
  const countries = ["美国", "中国", "俄罗斯", "德国", "日本", "英国"];
  const cities = ["纽约", "北京", "莫斯科", "柏林", "东京", "伦敦"];
  const isps = [
    "Amazon",
    "Google Cloud",
    "Cloudflare",
    "DigitalOcean",
    "阿里云",
  ];

  const threatLevel =
    threatLevels[Math.floor(Math.random() * threatLevels.length)];
  const reputation = Math.floor(Math.random() * 100);

  return {
    ip,
    country: countries[Math.floor(Math.random() * countries.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    organization: isps[Math.floor(Math.random() * isps.length)],
    isp: isps[Math.floor(Math.random() * isps.length)],
    threatLevel,
    reputation,
    lastSeen: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    categories: ["云服务", "CDN", "代理服务器"].slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    ),
    blocklisted: Math.random() > 0.8,
    whoisInfo: {
      registrar: "Example Registrar Inc.",
      creationDate: new Date(
        Date.now() - Math.random() * 365 * 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      expirationDate: new Date(
        Date.now() + Math.random() * 365 * 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      contacts: {
        admin: "admin@example.com",
        tech: "tech@example.com",
      },
    },
    dnsRecords: [
      { type: "A", value: ip },
      { type: "PTR", value: "example.com" },
    ],
    relatedDomains: [
      `example-${Math.floor(Math.random() * 1000)}.com`,
      `test-${Math.floor(Math.random() * 1000)}.org`,
    ],
    trafficAnalysis: {
      inbound: Math.floor(Math.random() * 10000),
      outbound: Math.floor(Math.random() * 8000),
      protocols: {
        tcp: Math.floor(Math.random() * 5000),
        udp: Math.floor(Math.random() * 3000),
        icmp: Math.floor(Math.random() * 100),
      },
    },
    historicalData: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      events: Math.floor(Math.random() * 100),
      threatType: ["扫描", "恶意软件", "钓鱼", "DDoS"][
        Math.floor(Math.random() * 4)
      ],
    })),
  };
};

export function useIPInvestigation() {
  const [data, setData] = useState<IPInvestigationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const investigate = async (ip: string): Promise<void> => {
    if (!ip || !ip.trim()) {
      setError("请输入有效的IP地址");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 模拟API调用延迟
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000),
      );

      // 这里应该调用真实的API，现在使用模拟数据
      const result = generateMockIPInvestigation(ip.trim());
      setData(result);
    } catch (error) {
      console.error("IP investigation failed:", error);
      setError(error instanceof Error ? error.message : "调查失败");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    investigate,
    reset,
  };
}
