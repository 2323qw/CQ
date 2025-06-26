import { useState, useEffect, useCallback } from "react";
import { apiService, SystemMetrics } from "@/services/api";

// 工具函数
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function formatMemory(mb: number): string {
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

export function formatBandwidth(mbps: number): string {
  if (mbps < 1000) return `${mbps.toFixed(1)} Mbps`;
  return `${(mbps / 1000).toFixed(1)} Gbps`;
}

interface UseSystemMetricsOptions {
  interval?: number;
  enabled?: boolean;
}

export function useSystemMetrics(options: UseSystemMetricsOptions = {}) {
  const { interval = 5000, enabled = true } = options;

  const [data, setData] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  console.log(
    `🔧 useSystemMetrics: enabled=${enabled}, loading=${loading}, hasData=${!!data}`,
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
      uptime: Math.floor(Math.random() * 1000000), // Random uptime in seconds
      boot_time: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      process_count: Math.floor(Math.random() * 200) + 100, // 100-300 processes
      thread_count: Math.floor(Math.random() * 1000) + 500, // 500-1500 threads
      cpu_alert: Math.random() > 0.8, // 20% chance of CPU alert
      memory_alert: Math.random() > 0.85, // 15% chance of memory alert
      disk_alert: Math.random() > 0.9, // 10% chance of disk alert
      timestamp: now,
    };
  }, []);

  const fetchMetrics = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // 直接调用 /api/v1/metrics/ 不带任何参数
      const response = await apiService.getCurrentMetrics();

      console.log("🔧 API Response Debug:", {
        hasData: !!response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : null,
        code: response.code,
        error: response.error,
        rawData: response.data,
      });

      if (response.data) {
        // 验证数据完整性，但更宽松的检查
        const metrics = response.data;

        // 基本数据验证，如果某些字段缺失，用默认值补充
        const validatedMetrics = {
          cpu_percent:
            typeof metrics.cpu_percent === "number" ? metrics.cpu_percent : 0,
          cpu_count:
            typeof metrics.cpu_count === "number" ? metrics.cpu_count : 1,
          memory_total:
            typeof metrics.memory_total === "number"
              ? metrics.memory_total
              : 8192,
          memory_available:
            typeof metrics.memory_available === "number"
              ? metrics.memory_available
              : 4096,
          memory_percent:
            typeof metrics.memory_percent === "number"
              ? metrics.memory_percent
              : 0,
          disk_total:
            typeof metrics.disk_total === "number" ? metrics.disk_total : 500,
          disk_used:
            typeof metrics.disk_used === "number" ? metrics.disk_used : 100,
          disk_free:
            typeof metrics.disk_free === "number" ? metrics.disk_free : 400,
          disk_percent:
            typeof metrics.disk_percent === "number" ? metrics.disk_percent : 0,
          disk_is_simulated:
            typeof metrics.disk_is_simulated === "boolean"
              ? metrics.disk_is_simulated
              : false,
          net_bytes_sent:
            typeof metrics.net_bytes_sent === "number"
              ? metrics.net_bytes_sent
              : 0,
          net_bytes_recv:
            typeof metrics.net_bytes_recv === "number"
              ? metrics.net_bytes_recv
              : 0,
          bandwidth_total:
            typeof metrics.bandwidth_total === "number"
              ? metrics.bandwidth_total
              : 1000,
          bandwidth_used:
            typeof metrics.bandwidth_used === "number"
              ? metrics.bandwidth_used
              : 50,
          bandwidth_percent:
            typeof metrics.bandwidth_percent === "number"
              ? metrics.bandwidth_percent
              : 5,
          bandwidth_upload:
            typeof metrics.bandwidth_upload === "number"
              ? metrics.bandwidth_upload
              : 25,
          bandwidth_download:
            typeof metrics.bandwidth_download === "number"
              ? metrics.bandwidth_download
              : 25,
          load_1min: metrics.load_1min || 0,
          load_5min: metrics.load_5min || 0,
          load_15min: metrics.load_15min || 0,
          cpu_alert:
            typeof metrics.cpu_alert === "boolean" ? metrics.cpu_alert : false,
          memory_alert:
            typeof metrics.memory_alert === "boolean"
              ? metrics.memory_alert
              : false,
          disk_alert:
            typeof metrics.disk_alert === "boolean"
              ? metrics.disk_alert
              : false,
          bandwidth_alert:
            typeof metrics.bandwidth_alert === "boolean"
              ? metrics.bandwidth_alert
              : false,
          uptime: metrics.uptime || 0,
          boot_time: metrics.boot_time || new Date().toISOString(),
          process_count: metrics.process_count || 100,
          thread_count: metrics.thread_count || 500,
          id: metrics.id || 1,
          timestamp: metrics.timestamp || new Date().toISOString(),
        };

        setData(validatedMetrics);
        setLastUpdated(new Date());
        setIsUsingMockData(false);
        setError(null);
        console.log("✅ API metrics processed successfully", {
          timestamp: validatedMetrics.timestamp,
          cpu: validatedMetrics.cpu_percent,
          memory: validatedMetrics.memory_percent,
          disk: validatedMetrics.disk_percent,
          bandwidth: validatedMetrics.bandwidth_percent,
        });
      } else {
        throw new Error(response.error || "API返回空数据");
      }
    } catch (error) {
      console.warn("⚠️ API连接失败，切换到模拟数据模式:", error);

      // API失败时生成模拟数据 - 提供更好的用户体验
      const mockData = generateMockMetrics();
      setData(mockData);
      setLastUpdated(new Date());
      setIsUsingMockData(true);
      setError(`API暂时不可用，正在使用模拟数据展示系统功能`);

      // 记录详细错误信息供调试用
      console.error("🔧 API错误详情:", {
        error: error instanceof Error ? error.message : error,
        apiUrl: "http://rc56132tg24.vicp.fun/api/v1/metrics/",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [enabled, generateMockMetrics]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // 立即获取一次数据
    fetchMetrics();

    // 设置定时器
    const timer = setInterval(fetchMetrics, interval);

    return () => {
      clearInterval(timer);
    };
  }, [fetchMetrics, interval, enabled]);

  const refresh = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isUsingMockData,
  };
}
