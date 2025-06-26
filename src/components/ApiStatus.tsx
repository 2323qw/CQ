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
      } else if (
        response.code === 408 ||
        response.error?.includes("请求超时")
      ) {
        setStatus("offline"); // Treat timeouts as offline
      } else if (response.code === 500 || response.error?.includes("数据库")) {
        setStatus("error"); // Database errors are different from offline
      } else if (response.code === 0 && response.error?.includes("无法连接")) {
        setStatus("offline");
      } else {
        setStatus("error");
      }

      setLastCheck(new Date());
    } catch (error) {
      console.error("API status check failed:", error);
      setStatus("offline");
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    // 初始检查
    checkApiStatus();

    // 定期检查API状态
    const interval = setInterval(checkApiStatus, 30000); // 每30秒检查一次

    return () => clearInterval(interval);
  }, []);

  const getStatusDisplay = () => {
    switch (status) {
      case "checking":
        return {
          icon: <Loader className="w-4 h-4 animate-spin" />,
          text: "检查中...",
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
        };
      case "online":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: "API在线",
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
        };
      case "offline":
        return {
          icon: <CloudOff className="w-4 h-4" />,
          text: "API离线",
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
        };
      case "error":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          text: "API错误",
          color: "text-orange-400",
          bgColor: "bg-orange-400/10",
          borderColor: "border-orange-400/30",
        };
      default:
        return {
          icon: <Database className="w-4 h-4" />,
          text: "未知状态",
          color: "text-gray-400",
          bgColor: "bg-gray-400/10",
          borderColor: "border-gray-400/30",
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.color} ${className}`}
    >
      {statusInfo.icon}
      <span className="text-sm font-medium">{statusInfo.text}</span>
      {lastCheck && (
        <span className="text-xs opacity-70">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default ApiStatus;
