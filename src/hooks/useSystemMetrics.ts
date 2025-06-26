import { useState, useEffect, useCallback } from "react";
import { apiService, SystemMetrics } from "@/services/api";
import { useDataSource } from "@/contexts/DataSourceContext";

interface UseSystemMetricsOptions {
  interval?: number;
  enabled?: boolean;
}

export function useSystemMetrics(options: UseSystemMetricsOptions = {}) {
  const { interval = 5000, enabled = true } = options;
  const { isMockMode, dataSource } = useDataSource();

  const [data, setData] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  console.log(
    `🔧 useSystemMetrics: mode=${dataSource}, enabled=${enabled}, loading=${loading}, hasData=${!!data}`,
  );

  // Generate mock system metrics
  const generateMockMetrics = useCallback((): SystemMetrics => {
    const now = new Date().toISOString();
    const bandwidthTotal = 1000; // 1Gbps total bandwidth
    const bandwidthUsed = Math.random() * 800 + 50; // 50-850 Mbps used
    const bandwidthPercent = (bandwidthUsed / bandwidthTotal) * 100;

    return {
      cpu_percent: Math.random() * 80 + 10, // 10-90%
      cpu_count: 8,
      memory_total: 16384, // 16GB in MB
      memory_available: Math.random() * 8192 + 4096, // 4-12GB available
      memory_percent: Math.random() * 60 + 20, // 20-80%
      disk_total: 500, // 500GB
      disk_used: Math.random() * 300 + 100, // 100-400GB used
      disk_free: Math.random() * 200 + 100, // 100-300GB free
      disk_percent: Math.random() * 70 + 10, // 10-80%
      disk_is_simulated: true,
      net_bytes_sent: Math.floor(Math.random() * 1000000000), // Random bytes
      net_bytes_recv: Math.floor(Math.random() * 1000000000),
      bandwidth_total: bandwidthTotal,
      bandwidth_used: bandwidthUsed,
      bandwidth_percent: bandwidthPercent,
      bandwidth_upload: Math.random() * 400 + 20, // 20-420 Mbps upload
      bandwidth_download: Math.random() * 600 + 30, // 30-630 Mbps download
      load_1min: Math.random() * 2,
      load_5min: Math.random() * 2,
      load_15min: Math.random() * 2,
      cpu_alert: Math.random() > 0.8, // 20% chance of alert
      memory_alert: Math.random() > 0.85, // 15% chance of alert
      disk_alert: Math.random() > 0.9, // 10% chance of alert
      bandwidth_alert: bandwidthPercent > 80, // Alert when > 80% bandwidth used
      id: Date.now(),
      timestamp: now,
    };
  }, []);

  const fetchMetrics = useCallback(async () => {
    if (!enabled) return;

    // If in mock mode, generate mock data
    if (isMockMode) {
      setLoading(true);
      setError(null);

      // Simulate network delay
      setTimeout(
        () => {
          const mockData = generateMockMetrics();
          setData(mockData);
          setLastUpdated(new Date());
          setLoading(false);
          console.log("✅ 模拟数据生成成功:", mockData);
        },
        200 + Math.random() * 300,
      ); // 200-500ms delay
      return;
    }

    try {
      setError(null);
      console.log("🔄 正在获取API数据...");
      const response = await apiService.getLatestMetrics();

      console.log("📥 API响应:", {
        hasData: !!response.data,
        error: response.error,
        code: response.code,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });

      if (response.data) {
        setData(response.data);
        setLastUpdated(new Date());
        console.log("✅ API数据获取成功:", response.data);
      } else {
        throw new Error(response.error || "API返回数据为空");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch metrics";
      console.error("❌ API数据获取失败:", errorMessage);

      // Provide helpful error message with suggestion to use mock mode
      if (
        errorMessage.includes("aborted") ||
        errorMessage.includes("timeout")
      ) {
        setError(
          "API请求超时，服务器响应缓慢。建议切换到模拟模式以查看系统功能。",
        );
      } else if (
        errorMessage.includes("Database Error") ||
        errorMessage.includes("数据库")
      ) {
        setError(
          "服务器数据库正在初始化或维护中，请稍后重试或切换到模拟模式。",
        );
      } else if (
        errorMessage.includes("服务器错误") ||
        errorMessage.includes("500")
      ) {
        setError("服务器遇到内部错误，建议切换到模拟模式以正常使用系统功能。");
      } else {
        setError(`API连接失败: ${errorMessage}`);
      }
      setData(null);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, isMockMode, generateMockMetrics]);

  // 初始加载
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // 定时更新
  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(fetchMetrics, interval);
    return () => clearInterval(timer);
  }, [fetchMetrics, interval, enabled]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchMetrics,
  };
}

// 格式化辅助函数
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatMemory(mb: number): string {
  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }
  return `${(mb / 1024).toFixed(1)} GB`;
}

export function formatBandwidth(mbps: number): string {
  if (mbps < 1) {
    return `${(mbps * 1000).toFixed(0)} Kbps`;
  } else if (mbps < 1000) {
    return `${mbps.toFixed(1)} Mbps`;
  } else {
    return `${(mbps / 1000).toFixed(2)} Gbps`;
  }
}
