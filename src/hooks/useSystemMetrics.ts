import { useState, useEffect, useCallback } from "react";
import { apiService, SystemMetrics } from "@/services/api";

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

  const fetchMetrics = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);
      const response = await apiService.getLatestMetrics();

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

      setError(`API连接失败: ${errorMessage}`);
      setData(null);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

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
