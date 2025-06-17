import React, { useState, useEffect } from "react";
import {
  Cloud,
  CloudOff,
  AlertTriangle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { apiService } from "@/services/api";

interface ApiStatusProps {
  className?: string;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ className = "" }) => {
  const [status, setStatus] = useState<
    "checking" | "online" | "offline" | "error"
  >("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    try {
      setStatus("checking");
      const response = await apiService.healthCheck();

      if (response.data !== undefined && response.code === 200) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch (error) {
      console.error("API health check failed:", error);
      setStatus("error");
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    // 立即检查一次
    checkApiStatus();

    // 每30秒检查一次
    const interval = setInterval(checkApiStatus, 30000);

    return () => clearInterval(interval);
  }, []);

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
        className="text-xs px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
        disabled={status === "checking"}
      >
        刷新
      </button>
    </div>
  );
};

export default ApiStatus;
