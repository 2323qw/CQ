import { useState, useEffect, useRef, useCallback } from "react";
import {
  apiService,
  type SystemMetrics,
  type SystemMetricsSummary,
} from "@/services/api";
import { useDataSource } from "@/contexts/DataSourceContext";

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
    bandwidthUsage: Math.round(Math.random() * 500 + 200),
    onlineNodes: Math.round(Math.random() * 10 + 40),
    realTimeThreats:
      cpu > 80 || memory > 80
        ? Math.round(Math.random() * 5 + 3)
        : Math.round(Math.random() * 3 + 1),
    timestamp: new Date().toISOString(),
    cpu_count: 8,
    memory_total: 16 * 1024 * 1024 * 1024, // 16GB
    memory_available: Math.round(
      (16 * 1024 * 1024 * 1024 * (100 - memory)) / 100,
    ),
    disk_total: 500 * 1024 * 1024 * 1024, // 500GB
    disk_used: Math.round((500 * 1024 * 1024 * 1024 * disk) / 100),
    net_bytes_sent: Math.round(Math.random() * 1000000000),
    net_bytes_recv: Math.round(Math.random() * 2000000000),
    alerts: {
      cpu_alert: cpu > 80,
      memory_alert: memory > 80,
      disk_alert: disk > 85,
    },
  };
};

// API数据转换器
const transformApiToStandardData = (
  apiData: SystemMetrics,
): StandardizedData => {
  return {
    cpuUsage: Math.round(apiData.cpu_percent),
    memoryUsage: Math.round(apiData.memory_percent),
    diskUsage: Math.round(apiData.disk_percent),
    networkLatency: Math.round(Math.random() * 50 + 10), // API中没有这个字段，使用模拟值
    activeConnections: Math.round(Math.random() * 1000 + 8000), // API中没有这个字段，使用模拟值
    bandwidthUsage: Math.round(
      (apiData.net_bytes_sent + apiData.net_bytes_recv) / 1024 / 1024,
    ), // MB
    onlineNodes: 47, // 固定值，API中没有这个字段
    realTimeThreats:
      apiData.cpu_alert || apiData.memory_alert || apiData.disk_alert
        ? Math.round(Math.random() * 5 + 3)
        : Math.round(Math.random() * 3 + 1),
    timestamp: apiData.timestamp,
    cpu_count: apiData.cpu_count,
    memory_total: apiData.memory_total,
    memory_available: apiData.memory_available,
    disk_total: apiData.disk_total,
    disk_used: apiData.disk_used,
    net_bytes_sent: apiData.net_bytes_sent,
    net_bytes_recv: apiData.net_bytes_recv,
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
  const { isMockMode, isApiMode } = useDataSource();

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

      if (isMockMode) {
        // 模拟模式：直接生成模拟数据
        console.log("Data Source: Mock mode - generating simulated data");
        const mockData = generateMockData();
        setData(mockData);
        setIsConnected(true);
        setError(null);
      } else {
        // API模式：尝试从真实API获取数据
        console.log("Data Source: API mode - fetching from real backend");

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
      }
    } catch (error) {
      console.error("Data fetching error:", error);

      if (isApiMode) {
        // API模式下出错，回退到模拟数据
        console.log("API mode failed, falling back to mock data");
        const mockData = generateMockData();
        setData(mockData);
        setIsConnected(false);
        setError(
          `API连接失败: ${error instanceof Error ? error.message : "未知错误"}。正在使用模拟数据。`,
        );
      } else {
        // 模拟模��下也出错（不太可能），设置错误状态
        setIsConnected(false);
        setError(
          `数据生成错误: ${error instanceof Error ? error.message : "未知错误"}`,
        );
      }
    } finally {
      setLoading(false);
    }
  }, [isMockMode, isApiMode]);

  // 手动刷新数据
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // 设置和清理定时器
  useEffect(() => {
    isMountedRef.current = true;

    // 立即获取一次数据
    fetchData();

    // 设置定时器（如果启用）
    if (enabled) {
      intervalRef.current = setInterval(fetchData, interval);
    }

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchData, interval, enabled, isMockMode]); // 依赖isMockMode，数据源变化时重新获取

  return {
    data,
    loading,
    error,
    isConnected,
    refresh,
    dataSource: isMockMode ? "mock" : "api",
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
  const { isMockMode, isApiMode } = useDataSource();
  const [summary, setSummary] = useState<SystemMetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isMockMode) {
        // 模拟摘要数据
        const mockSummary: SystemMetricsSummary = {
          current_cpu_percent: Math.round(Math.random() * 40 + 30),
          current_memory_percent: Math.round(Math.random() * 30 + 50),
          current_disk_percent: Math.round(Math.random() * 20 + 40),
          has_alerts: Math.random() > 0.7,
          alert_count: Math.round(Math.random() * 3),
        };
        setSummary(mockSummary);
      } else {
        const response = await apiService.getSystemMetricsSummary();
        if (response.data) {
          setSummary(response.data);
        } else {
          throw new Error(response.error || "Failed to fetch summary");
        }
      }
    } catch (error) {
      console.error("Summary fetch error:", error);
      setError(error instanceof Error ? error.message : "Unknown error");

      // 回退到模拟数据
      if (isApiMode) {
        const mockSummary: SystemMetricsSummary = {
          current_cpu_percent: Math.round(Math.random() * 40 + 30),
          current_memory_percent: Math.round(Math.random() * 30 + 50),
          current_disk_percent: Math.round(Math.random() * 20 + 40),
          has_alerts: Math.random() > 0.7,
          alert_count: Math.round(Math.random() * 3),
        };
        setSummary(mockSummary);
      }
    } finally {
      setLoading(false);
    }
  }, [isMockMode, isApiMode]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refresh: fetchSummary };
}

// 健康检查Hook
export function useHealthCheck() {
  const { isApiMode } = useDataSource();
  const [isHealthy, setIsHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    if (!isApiMode) {
      // 模拟模式下总是健康的
      setIsHealthy(true);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.healthCheck();
      setIsHealthy(!!response.data);
    } catch (error) {
      console.error("Health check failed:", error);
      setIsHealthy(false);
      setError(error instanceof Error ? error.message : "Health check failed");
    } finally {
      setLoading(false);
    }
  }, [isApiMode]);

  useEffect(() => {
    checkHealth();

    // 每30秒检查一次健康状态
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  return { isHealthy, loading, error, checkHealth };
}

// 收集所有指标Hook
export function collectAllMetrics() {
  const { isMockMode } = useDataSource();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const collect = useCallback(async () => {
    if (isMockMode) {
      // 模拟模式：模拟收集操作
      console.log("Mock mode: Simulating metrics collection");
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟延迟
      setLoading(false);
      return { success: true, message: "模拟数据收集完成" };
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.collectAllMetrics();
      setLoading(false);

      if (response.data) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "收集失败");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error instanceof Error ? error.message : "收集失败";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [isMockMode]);

  return { collect, loading, error };
}

// 网络接口Hook - 占位符实现
export function useNetworkInterfaces() {
  const { isMockMode } = useDataSource();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isMockMode) {
      // 模拟网络接口数据
      setData([
        {
          interface_name: "eth0",
          bytes_sent: Math.random() * 1000000000,
          bytes_recv: Math.random() * 2000000000,
          is_up: true,
        },
        {
          interface_name: "wlan0",
          bytes_sent: Math.random() * 500000000,
          bytes_recv: Math.random() * 1000000000,
          is_up: Math.random() > 0.3,
        },
      ]);
    } else {
      try {
        const response = await apiService.getCurrentNetworkMetrics();
        setData(response.data?.metrics || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    }
  }, [isMockMode]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

// 进程Hook - 占位符实现
export function useProcesses(limit = 10) {
  const { isMockMode } = useDataSource();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isMockMode) {
      // 模拟进程数据
      const mockProcesses = [
        {
          pid: 1234,
          name: "chrome",
          cpu_percent: Math.random() * 30,
          memory_percent: Math.random() * 20,
          status: "running",
        },
        {
          pid: 5678,
          name: "node",
          cpu_percent: Math.random() * 15,
          memory_percent: Math.random() * 10,
          status: "running",
        },
        {
          pid: 9012,
          name: "firefox",
          cpu_percent: Math.random() * 25,
          memory_percent: Math.random() * 18,
          status: "running",
        },
        {
          pid: 3456,
          name: "vscode",
          cpu_percent: Math.random() * 20,
          memory_percent: Math.random() * 15,
          status: "running",
        },
      ];
      setData(mockProcesses.slice(0, limit));
    } else {
      try {
        const response = await apiService.getProcesses({ limit });
        setData(response.data || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    }
  }, [isMockMode, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

// 服务Hook - 占位符实现
export function useServices() {
  const { isMockMode } = useDataSource();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isMockMode) {
      // 模拟服务数据
      setData([
        {
          name: "nginx",
          status: "active",
          running: true,
        },
        {
          name: "mysql",
          status: "active",
          running: true,
        },
        {
          name: "redis",
          status: Math.random() > 0.8 ? "inactive" : "active",
          running: Math.random() > 0.8 ? false : true,
        },
      ]);
    } else {
      try {
        const response = await apiService.getServices({ limit: 10 });
        setData(response.data || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    }
  }, [isMockMode]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

export default useRealTimeAPI;
