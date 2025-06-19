import React, { useState, useEffect } from "react";
import {
  Cloud,
  CloudOff,
  AlertTriangle,
  CheckCircle,
  Loader,
  Database,
} from "lucide-react";
import { apiService } from "@/services/api";
import { useDataSource } from "@/contexts/DataSourceContext";

interface ApiStatusProps {
  className?: string;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ className = "" }) => {
  const { isMockMode, isApiMode } = useDataSource();
  const [status, setStatus] = useState<
    "checking" | "online" | "offline" | "error" | "mock"
  >("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    try {
      if (isMockMode) {
        // 模拟模式：不进行实际API调用
        setStatus("mock");
        setLastCheck(new Date());
        return;
      }

      setStatus("checking");
      const response = await apiService.healthCheck();

      if (response.data !== undefined && response.code === 200) {
        setStatus("online");
      } else if (response.code === 0 && response.error?.includes("无法连接")) {
        setStatus("offline");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("API health check failed:", error);

      // 根据错误类型设��不同状态
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        setStatus("offline");
      } else {
        setStatus("error");
      }
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    // 立即检查一次
    checkApiStatus();

    // 只在API模式下设置定时器
    let interval: NodeJS.Timeout | null = null;
    if (isApiMode) {
      interval = setInterval(checkApiStatus, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMockMode, isApiMode]); // 当数据源模式改变时重新检查

  const getStatusInfo = () => {
    switch (status) {
      case "checking":
        return {
          icon: Loader,
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          text: "检查中",
          description: "正在检查API连接状态...",
        };
      case "online":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          text: "API在线",
          description: "后端API服务正常",
        };
      case "offline":
        return {
          icon: CloudOff,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          text: "API离线",
          description: "无法连接到后端API服务",
        };
      case "error":
        return {
          icon: AlertTriangle,
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          text: "连接错误",
          description: "API连接出现错误",
        };
      case "mock":
        return {
          icon: Database,
          color: "text-neon-green",
          bgColor: "bg-neon-green/10",
          borderColor: "border-neon-green/30",
          text: "模拟模式",
          description: "使用本地模拟数据，无需API连接",
        };
      default:
        return {
          icon: CloudOff,
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          text: "未知状态",
          description: "无法确定API状态",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor} ${className}`}
      title={`最后检查: ${lastCheck ? lastCheck.toLocaleTimeString() : "未检查"}`}
    >
      <Icon
        className={`w-5 h-5 ${statusInfo.color} ${status === "checking" ? "animate-spin" : ""}`}
      />
      <div className="flex-1">
        <div className={`font-medium ${statusInfo.color}`}>
          {statusInfo.text}
        </div>
        <div className="text-xs text-gray-400">{statusInfo.description}</div>
      </div>
      <button
        onClick={checkApiStatus}
        className="text-xs px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={status === "checking" || status === "mock"}
      >
        {status === "mock" ? "模拟" : "刷新"}
      </button>
    </div>
  );
};

export default ApiStatus;
