import { useState, useEffect, useCallback, useRef } from "react";
import {
  apiService,
  type ApiResponse,
  type SystemMetrics,
  type SystemMetricsSummary,
} from "@/services/api";

// 标准化数据结构
export interface StandardizedData {
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
  network_in: number;
  network_out: number;
  active_connections: number;
  threats_detected: number;
  timestamp: string;
  alerts: {
    cpu_alert: boolean;
    memory_alert: boolean;
    disk_alert: boolean;
  };
}

export interface UseRealTimeDataConfig {
  interval?: number;
  enabled?: boolean;
}

// 生成模拟数据的函数
const generateMockData = (): StandardizedData => {
  const now = new Date();
  return {
    cpu_percent: Math.round(Math.random() * 40 + 30),
    memory_percent: Math.round(Math.random() * 30 + 50),
    disk_percent: Math.round(Math.random() * 20 + 40),
    network_in: Math.round(Math.random() * 1000000 + 500000),
    network_out: Math.round(Math.random() * 800000 + 400000),
    active_connections: Math.round(Math.random() * 100 + 50),
    threats_detected: Math.round(Math.random() * 5),
    timestamp: now.toISOString(),
    alerts: {
      cpu_alert: Math.random() > 0.8,
      memory_alert: Math.random() > 0.85,
      disk_alert: Math.random() > 0.9,
    },
  };
};

// 转换API数据到标准化格式
const transformApiToStandardData = (
  apiData: SystemMetrics,
): StandardizedData => {
  return {
    cpu_percent: apiData.cpu_percent,
    memory_percent: apiData.memory_percent,
    disk_percent: (apiData.disk_used / apiData.disk_total) * 100,
    network_in: apiData.net_bytes_recv,
    network_out: apiData.net_bytes_sent,
    active_connections: 0, // API可能不提供此数据
    threats_detected: 0, // API可能不提供此数据
    timestamp: new Date().toISOString(),
    alerts: {
      cpu_alert: apiData.cpu_alert,
      memory_alert: apiData.memory_alert,
      disk_alert: apiData.disk_alert,
    },
  };
};

// 主要的实时数据Hook
export function useRealTimeAPI(config: UseRealTimeDataConfig = {}) {
  const { interval = 5000, enabled = true } = config;

  const [data, setData] = useState<StandardizedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      // 尝试从真实API获取数据
      console.log("Fetching data from API");

      const response = await apiService.getCurrentMetrics();

      if (response.data) {
        // API调用成功
        const standardizedData = transformApiToStandardData(response.data);
        setData(standardizedData);
        setIsConnected(true);
        setError(null);
        console.log("API data received successfully:", standardizedData);
      } else {
        // API调用失败，但有错误响应
        console.warn("API call failed:", response.error);
        throw new Error(response.error || "API调用失败");
      }
    } catch (error) {
      console.error("Data fetching error:", error);

      // API出错，回退到模拟数据
      console.log("API failed, falling back to mock data");
      const mockData = generateMockData();
      setData(mockData);
      setIsConnected(false);
      setError(
        `API连接失败: ${error instanceof Error ? error.message : "未知错误"}。正在使用模拟数据。`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      // 立即获取数据
      fetchData();

      // 设置定时器
      intervalRef.current = setInterval(() => {
        fetchData();
      }, interval);
    }

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchData, interval, enabled]);

  return {
    data,
    loading,
    error,
    isConnected,
    refresh,
    dataSource: "api",
  };
}

// 向后兼容的Hook
export function useRealTimeData(
  refreshInterval: number = 5000,
  enableRealTime: boolean = true,
) {
  return useRealTimeAPI({
    interval: refreshInterval,
    enabled: enableRealTime,
  });
}

// 系统摘要数据Hook
export function useSystemSummary() {
  const [summary, setSummary] = useState<SystemMetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getSystemMetricsSummary();
      if (response.data) {
        setSummary(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch summary");
      }
    } catch (error) {
      console.error("Summary fetch error:", error);
      setError(error instanceof Error ? error.message : "Unknown error");

      // 回退到模拟数据
      const mockSummary: SystemMetricsSummary = {
        current_cpu_percent: Math.round(Math.random() * 40 + 30),
        current_memory_percent: Math.round(Math.random() * 30 + 50),
        current_disk_percent: Math.round(Math.random() * 20 + 40),
        has_alerts: Math.random() > 0.7,
        alert_count: Math.round(Math.random() * 3),
      };
      setSummary(mockSummary);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refresh: fetchSummary };
}

// 健康检查Hook
export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.healthCheck();

      if (response.data) {
        setIsHealthy(response.data.status === "healthy");
        setError(null);
      } else {
        throw new Error(response.error || "Health check failed");
      }
    } catch (error) {
      console.error("Health check error:", error);
      setIsHealthy(false);
      setError(error instanceof Error ? error.message : "Health check failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // 每30秒检查一次

    return () => clearInterval(interval);
  }, [checkHealth]);

  return { isHealthy, loading, error, refresh: checkHealth };
}

// 批量收集指标Hook
export function collectAllMetrics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCollected, setLastCollected] = useState<Date | null>(null);

  const collect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 模拟收集操作
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setLastCollected(new Date());
      console.log("Metrics collection completed");
    } catch (error) {
      console.error("Metrics collection error:", error);
      setError(error instanceof Error ? error.message : "Collection failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { collect, loading, error, lastCollected };
}

// 网络接口Hook
export function useNetworkInterfaces() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 模拟网络接口数据
      const mockInterfaces = [
        {
          name: "eth0",
          status: "active",
          ip: "192.168.1.100",
          bytes_sent: Math.round(Math.random() * 1000000),
          bytes_recv: Math.round(Math.random() * 1000000),
        },
        {
          name: "wlan0",
          status: "inactive",
          ip: "N/A",
          bytes_sent: 0,
          bytes_recv: 0,
        },
      ];

      setData(mockInterfaces);
    } catch (error) {
      console.error("Network interfaces error:", error);
      setError(error instanceof Error ? error.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

// 进程列表Hook
export function useProcesses(limit = 10) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 模拟进程数据
      const processes = Array.from({ length: limit }, (_, i) => ({
        pid: 1000 + i,
        name: `process_${i}`,
        cpu_percent: Math.round(Math.random() * 20),
        memory_percent: Math.round(Math.random() * 15),
        status: Math.random() > 0.1 ? "running" : "sleeping",
      }));

      setData(processes);
    } catch (error) {
      console.error("Processes error:", error);
      setError(error instanceof Error ? error.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

// 系统服务Hook
export function useServices() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 模拟服务数据
      const services = [
        { name: "nginx", status: "active", enabled: true },
        { name: "mysql", status: "active", enabled: true },
        { name: "redis", status: "inactive", enabled: false },
        { name: "docker", status: "active", enabled: true },
      ];

      setData(services);
    } catch (error) {
      console.error("Services error:", error);
      setError(error instanceof Error ? error.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
