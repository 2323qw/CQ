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

      // 尝试从API获取数据
      const response = await apiService.getCurrentMetrics();

      if (response.data) {
        setData(response.data);
        setLastUpdated(new Date());
        console.log("✅ API metrics fetched successfully");
      } else {
        throw new Error(response.error || "API调用失败");
      }
    } catch (error) {
      console.warn("⚠️ API failed, using mock data:", error);

      // API失败时生成模拟数据
      const mockData = generateMockMetrics();
      setData(mockData);
      setLastUpdated(new Date());
      setError(
        `API连接失败，正在使用模拟数据: ${error instanceof Error ? error.message : "未知错误"}`,
      );
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
  };
}
