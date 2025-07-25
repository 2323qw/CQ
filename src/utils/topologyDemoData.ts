// 为演示拓扑图功能生成模拟数据
export const generateTopologyDemoData = (centerIP: string) => {
  return {
    riskScore: 75,
    reputation: "suspicious",
    networkAnalysis: {
      openPorts: [
        {
          port: 80,
          protocol: "TCP",
          status: "open",
          service: "HTTP",
          timestamp: new Date().toISOString(),
        },
        {
          port: 443,
          protocol: "TCP",
          status: "open",
          service: "HTTPS",
          timestamp: new Date().toISOString(),
        },
        {
          port: 22,
          protocol: "TCP",
          status: "open",
          service: "SSH",
          timestamp: new Date().toISOString(),
        },
        {
          port: 21,
          protocol: "TCP",
          status: "closed",
          service: "FTP",
          timestamp: new Date().toISOString(),
        },
        {
          port: 3389,
          protocol: "TCP",
          status: "filtered",
          service: "RDP",
          timestamp: new Date().toISOString(),
        },
      ],
      connections: [
        {
          sourceIP: centerIP,
          destIP: "10.0.1.5",
          sourcePort: 54321,
          destPort: 80,
          protocol: "HTTP",
          status: "active",
          duration: 120,
          bytes: 45600,
          packets: 234,
          timestamp: new Date().toISOString(),
        },
        {
          sourceIP: centerIP,
          destIP: "192.168.2.100",
          sourcePort: 54322,
          destPort: 443,
          protocol: "HTTPS",
          status: "active",
          duration: 89,
          bytes: 123400,
          packets: 456,
          timestamp: new Date().toISOString(),
        },
        {
          sourceIP: centerIP,
          destIP: "172.16.0.50",
          sourcePort: 54323,
          destPort: 22,
          protocol: "SSH",
          status: "closed",
          duration: 15,
          bytes: 2340,
          packets: 12,
          timestamp: new Date().toISOString(),
        },
        {
          sourceIP: centerIP,
          destIP: "203.45.67.89",
          sourcePort: 54324,
          destPort: 3306,
          protocol: "MySQL",
          status: "timeout",
          duration: 30,
          bytes: 890,
          packets: 5,
          timestamp: new Date().toISOString(),
        },
        {
          sourceIP: centerIP,
          destIP: "8.8.8.8",
          sourcePort: 54325,
          destPort: 53,
          protocol: "DNS",
          status: "active",
          duration: 2,
          bytes: 156,
          packets: 2,
          timestamp: new Date().toISOString(),
        },
      ],
      protocols: {
        HTTP: 25,
        HTTPS: 45,
        SSH: 8,
        DNS: 12,
        FTP: 3,
        SMTP: 7,
      },
    },
    threatIntelligence: {
      blacklists: ["SURBL", "SpamCop"],
      relatedThreats: [
        {
          id: "threat_1",
          ip: "185.220.101.42",
          similarity: 85,
          lastSeen: new Date().toISOString(),
          riskScore: 88,
          attackTypes: ["malware", "ddos"],
        },
        {
          id: "threat_2",
          ip: "159.89.214.31",
          similarity: 72,
          lastSeen: new Date().toISOString(),
          riskScore: 65,
          attackTypes: ["brute_force", "port_scan"],
        },
        {
          id: "threat_3",
          ip: "94.142.241.194",
          similarity: 63,
          lastSeen: new Date().toISOString(),
          riskScore: 77,
          attackTypes: ["intrusion", "data_theft"],
        },
      ],
    },
    timeline: [
      {
        id: "1",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: "port_scan",
        severity: "medium",
        target: centerIP,
        method: "SYN_SCAN",
        status: "detected",
        details: "端口扫描活动检测",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: "brute_force",
        severity: "high",
        target: centerIP,
        method: "SSH_BRUTEFORCE",
        status: "blocked",
        details: "SSH暴力破解尝试",
      },
    ],
  };
};
