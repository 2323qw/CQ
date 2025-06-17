import { useState, useEffect, useRef, useCallback } from "react";
import {
  apiService,
  type SystemMetrics,
  type SystemMetricsSummary,
} from "@/services/api";

// 实时数据Hook配置
interface UseRealTimeDataConfig {
  interval?: number;
  enabled?: boolean;
  fallbackToMock?: boolean;
}

// 标准化的数据格式（兼容现有组件）
export interface StandardizedData {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeConnections: number;
  bandwidthUsage: number;
  onlineNodes: number;
  realTimeThreats: number;
  timestamp: string;
  // 新增的详细数据
  cpu_count?: number;
  memory_total?: number;
  memory_available?: number;
  disk_total?: number;
  disk_used?: number;
  net_bytes_sent?: number;
  net_bytes_recv?: number;
  alerts?: {
    cpu_alert: boolean;
    memory_alert: boolean;
    disk_alert: boolean;
  };
}

// 模拟数据生成器（作为fallback）
const generateMockData = (): StandardizedData => {
  const cpu = Math.round(Math.random() * 40 + 30);
  const memory = Math.round(Math.random() * 30 + 50);
  const disk = Math.round(Math.random() * 20 + 40);

  return {
    cpuUsage: cpu,
    memoryUsage: memory,
    diskUsage: disk,
    networkLatency: Math.round(Math.random() * 50 + 10),
    activeConnections: Math.round(Math.random() * 1000 + 8000),
    bandwidthUsage: Math.round(Math.random() * 40 + 30),
    onlineNodes: Math.round(Math.random() * 3 + 45),
    realTimeThreats: Math.round(Math.random() * 5 + 1),
    timestamp: new Date().toISOString(),
    alerts: {
      cpu_alert: cpu > 80,
      memory_alert: memory > 85,
      disk_alert: disk > 90,
    },
  };
};

// 数据转换函数
const transformApiData = (metrics: SystemMetrics): StandardizedData => {
  return {
    cpuUsage: Math.round(metrics.cpu_percent),
    memoryUsage: Math.round(metrics.memory_percent),
    diskUsage: Math.round(metrics.disk_percent),
    networkLatency: Math.round(Math.random() * 50 + 10), // API暂时没有延迟数据
    activeConnections: Math.round(Math.random() * 1000 + 8000), // 需要从网络连接API获取
    bandwidthUsage: Math.round(
      ((metrics.net_bytes_sent + metrics.net_bytes_recv) / 1024 / 1024 / 100) %
        100,
    ), // 转换为百分比
    onlineNodes: 47, // 固定值，需要从进程或服务API获取
    realTimeThreats:
      metrics.cpu_alert || metrics.memory_alert || metrics.disk_alert
        ? Math.round(Math.random() * 5 + 3)
        : Math.round(Math.random() * 3 + 1),
    timestamp: metrics.timestamp,

    // 原始详细数据
    cpu_count: metrics.cpu_count,
    memory_total: metrics.memory_total,
    memory_available: metrics.memory_available,
    disk_total: metrics.disk_total,
    disk_used: metrics.disk_used,
    net_bytes_sent: metrics.net_bytes_sent,
    net_bytes_recv: metrics.net_bytes_recv,
    alerts: {
      cpu_alert: metrics.cpu_alert,
      memory_alert: metrics.memory_alert,
      disk_alert: metrics.disk_alert,
    },
  };
};

// 主要的实时数据Hook
export function useRealTimeAPI(config: UseRealTimeDataConfig = {}) {
  const { interval = 5000, enabled = true, fallbackToMock = true } = config;

  const [data, setData] = useState<StandardizedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);

  // 获取数据的核心函数
  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);

      // 尝试获取真实数据
      const response = await apiService.getCurrentMetrics();

      if (response.data) {
        const transformedData = transformApiData(response.data);
        setData(transformedData);
        setIsUsingMockData(false);

        if (isFirstLoad.current) {
          setLoading(false);
          isFirstLoad.current = false;
        }
      } else {
        throw new Error(response.error || "Failed to fetch data");
      }
    } catch (err) {
      console.warn("API data fetch failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");

      // 如果允许fallback，使用模拟数据
      if (fallbackToMock) {
        const mockData = generateMockData();
        setData(mockData);
        setIsUsingMockData(true);

        if (isFirstLoad.current) {
          setLoading(false);
          isFirstLoad.current = false;
        }
      } else {
        setLoading(false);
      }
    }
  }, [enabled, fallbackToMock]);

  // 立即获取数据
  const fetchNow = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // 设置定时器
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 立即获取一次数据
    fetchData();

    // 设置定时器
    intervalRef.current = setInterval(fetchData, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, fetchData]);

  return {
    data,
    loading,
    error,
    isUsingMockData,
    fetchNow,
    refetch: fetchData,
  };
}

// 系统摘要数据Hook
export function useSystemSummary() {
  const [summary, setSummary] = useState<SystemMetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setError(null);
      const response = await apiService.getSystemMetricsSummary();

      if (response.data) {
        setSummary(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch summary");
      }
    } catch (err) {
      console.error("Summary fetch failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
}

// 网络接口数据Hook
export function useNetworkInterfaces() {
  const [interfaces, setInterfaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterfaces = useCallback(async () => {
    try {
      setError(null);
      const response = await apiService.getCurrentNetworkMetrics();

      if (response.data && response.data.metrics) {
        setInterfaces(response.data.metrics);
      } else {
        throw new Error(response.error || "Failed to fetch network interfaces");
      }
    } catch (err) {
      console.error("Network interfaces fetch failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterfaces();
  }, [fetchInterfaces]);

  return {
    interfaces,
    loading,
    error,
    refetch: fetchInterfaces,
  };
}

// 进程监控Hook
export function useProcesses(limit: number = 20) {
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = useCallback(async () => {
    try {
      setError(null);
      const response = await apiService.getProcesses({ limit });

      if (response.data) {
        setProcesses(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch processes");
      }
    } catch (err) {
      console.error("Processes fetch failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  return {
    processes,
    loading,
    error,
    refetch: fetchProcesses,
  };
}

// 服务状态Hook
export function useServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setError(null);
      const response = await apiService.getServices();

      if (response.data) {
        setServices(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch services");
      }
    } catch (err) {
      console.error("Services fetch failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}

// 健康检查Hook
export function useHealthCheck() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      setError(null);
      const response = await apiService.healthCheck();

      if (response.data !== undefined) {
        setHealth(response.data);
      } else {
        throw new Error(response.error || "Health check failed");
      }
    } catch (err) {
      console.error("Health check failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    health,
    loading,
    error,
    refetch: checkHealth,
  };
}

// 兼容现有代码的Hook（向后兼容）
export function useRealTimeData(
  dataGenerator: () => any,
  config: { interval?: number; enabled?: boolean } = {},
) {
  const { data, loading, error, isUsingMockData } = useRealTimeAPI({
    interval: config.interval,
    enabled: config.enabled,
    fallbackToMock: true,
  });

  return {
    data,
    loading,
    error,
    isUsingMockData,
  };
}

// 批量数据收集函数
export async function collectAllMetrics(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await apiService.collectAllMetrics();
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 导出主要Hook以供使用
export default useRealTimeAPI;
