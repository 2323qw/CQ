import { useState, useEffect, useCallback } from "react";
import { apiService, SystemMetrics } from "@/services/api";

interface RealTimeDataOptions {
  interval?: number;
  enabled?: boolean;
}

export function useRealTimeData<T>(
  dataGenerator: () => T,
  options: RealTimeDataOptions = {},
) {
  const { interval = 5000, enabled = true } = options;

  // 验证dataGenerator是否为函数
  if (typeof dataGenerator !== "function") {
    throw new Error("useRealTimeData: dataGenerator must be a function");
  }

  const [data, setData] = useState<T>(() => {
    try {
      return dataGenerator();
    } catch (error) {
      console.error("Error in dataGenerator:", error);
      return {} as T;
    }
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const updateData = useCallback(() => {
    if (!enabled || typeof dataGenerator !== "function") return;

    setIsUpdating(true);
    setTimeout(() => {
      try {
        setData(dataGenerator());
      } catch (error) {
        console.error("Error updating data:", error);
      } finally {
        setIsUpdating(false);
      }
    }, 200); // 短暂延迟以显示更新状态
  }, [dataGenerator, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(updateData, interval);
    return () => clearInterval(timer);
  }, [updateData, interval, enabled]);

  return { data, isUpdating, updateData };
}

// 生成实时威胁数据
export function generateThreatMetrics() {
  return {
    realTimeThreats: Math.floor(Math.random() * 20) + 35,
    activeConnections: Math.floor(Math.random() * 300) + 1000,
    blockedAttacks: Math.floor(Math.random() * 100) + 800,
    systemHealth: Math.floor(Math.random() * 5) + 95,
    onlineNodes: Math.floor(Math.random() * 3) + 47,
    totalNodes: 50,
    networkStatus: Math.random() > 0.1 ? "正常" : "异常",
    cpuUsage: Math.floor(Math.random() * 30) + 45,
    memoryUsage: Math.floor(Math.random() * 25) + 55,
    diskUsage: Math.floor(Math.random() * 20) + 60,
    threatLevels: {
      critical: Math.floor(Math.random() * 3) + 1,
      high: Math.floor(Math.random() * 5) + 2,
      medium: Math.floor(Math.random() * 8) + 5,
      low: Math.floor(Math.random() * 15) + 12,
    },
    lastUpdate: new Date().toLocaleTimeString("zh-CN"),
  };
}

// 生成态势监控专用数据
export function generateSituationData() {
  return {
    // 活跃连接监控
    activeConnections: Math.floor(Math.random() * 500) + 1000,
    connectionGrowth: (Math.random() - 0.5) * 10, // -5% to +5%
    peakConnections: Math.floor(Math.random() * 200) + 1800,

    // 实时威胁
    realTimeThreats: Math.floor(Math.random() * 15) + 3,
    newThreats: Math.floor(Math.random() * 5),
    threatTrend:
      Math.random() > 0.7 ? "上升" : Math.random() > 0.4 ? "稳定" : "下降",

    // 系统性能
    cpuUsage: Math.floor(Math.random() * 40) + 40,
    memoryUsage: Math.floor(Math.random() * 35) + 50,
    diskUsage: Math.floor(Math.random() * 30) + 35,
    networkLatency: Math.floor(Math.random() * 50) + 10,

    // 防火墙连接
    firewallStatus: Math.random() > 0.1 ? "正常" : "告警",
    blockedAttacks: Math.floor(Math.random() * 200) + 800,
    firewallRules: Math.floor(Math.random() * 50) + 250,
    passThroughRate: Math.floor(Math.random() * 10) + 85,

    // 网络流量
    inboundTraffic: Math.floor(Math.random() * 50) + 60,
    outboundTraffic: Math.floor(Math.random() * 40) + 70,
    peakInbound: Math.floor(Math.random() * 30) + 120,
    peakOutbound: Math.floor(Math.random() * 25) + 110,
    bandwidthUsage: Math.floor(Math.random() * 20) + 65,

    // 网络状态
    networkStatus: Math.random() > 0.1 ? "正常" : "异常",
    onlineNodes: Math.floor(Math.random() * 5) + 45,
    totalNodes: 50,
    packetsPerSecond: Math.floor(Math.random() * 10000) + 50000,

    // 时间戳
    lastUpdate: new Date().toLocaleTimeString("zh-CN"),
    timestamp: Date.now(),
  };
}

// 生成实时网络数据
export function generateNetworkData() {
  const now = new Date();
  const data = [];

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      inbound: Math.floor(Math.random() * 100) + 20 + Math.sin(i * 0.5) * 20,
      outbound: Math.floor(Math.random() * 80) + 15 + Math.cos(i * 0.3) * 15,
      threats: Math.floor(Math.random() * 20) + Math.sin(i * 0.8) * 5,
      bandwidth:
        Math.floor(Math.random() * 500) + 100 + Math.sin(i * 0.2) * 100,
    });
  }

  return data;
}

// 生成实时告警数据
export function generateAlerts() {
  const alertTypes = [
    { type: "DDoS攻击检测", severity: "critical" },
    { type: "恶意软件感染", severity: "high" },
    { type: "异常登录尝试", severity: "medium" },
    { type: "端口扫描", severity: "low" },
    { type: "数据泄露风险", severity: "medium" },
    { type: "钓鱼邮件攻击", severity: "high" },
    { type: "暴力破解攻击", severity: "medium" },
    { type: "恶意文件上传", severity: "critical" },
  ];

  return Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => {
    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const now = new Date();

    return {
      id: `alert-${Date.now()}-${i}`,
      type: alert.severity as "critical" | "high" | "medium" | "low",
      title: alert.type,
      description: `检测到${alert.type}，来源IP: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: ["北京市", "上海市", "深圳市", "广州市", "杭州市"][
        Math.floor(Math.random() * 5)
      ],
      timestamp: new Date(
        now.getTime() - Math.random() * 3600000,
      ).toLocaleString("zh-CN"),
      status: ["active", "investigating", "resolved"][
        Math.floor(Math.random() * 3)
      ] as "active" | "investigating" | "resolved",
      severity: Math.floor(Math.random() * 10) + 1,
    };
  });
}
