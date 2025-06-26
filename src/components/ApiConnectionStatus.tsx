import { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react";
import { apiService } from "@/services/api";
import { cn } from "@/lib/utils";

export function ApiConnectionStatus() {
  const [status, setStatus] = useState<
    "checking" | "connected" | "disconnected" | "error"
  >("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const checkConnection = async () => {
    try {
      setStatus("checking");
      // 使用健康检查端点进行快速连接测试
      const response = await apiService.healthCheck();

      if (response.code >= 200 && response.code < 300) {
        setStatus("connected");
        setErrorMessage("");
      } else {
        setStatus("disconnected");
        setErrorMessage(response.error || "API健康检查失败");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "连接检查失败");
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // 每30秒检查一次
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-900/20",
          borderColor: "border-green-400/30",
          text: "API连接正常",
          pulse: false,
        };
      case "disconnected":
        return {
          icon: WifiOff,
          color: "text-red-400",
          bgColor: "bg-red-900/20",
          borderColor: "border-red-400/30",
          text: "API连接断开",
          pulse: false,
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-400",
          bgColor: "bg-red-900/20",
          borderColor: "border-red-400/30",
          text: "连接错误",
          pulse: true,
        };
      default:
        return {
          icon: Wifi,
          color: "text-blue-400",
          bgColor: "bg-blue-900/20",
          borderColor: "border-blue-400/30",
          text: "检查连接中...",
          pulse: true,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm",
        config.bgColor,
        config.borderColor,
        config.color,
      )}
    >
      <Icon className={cn("w-4 h-4", config.pulse && "animate-pulse")} />
      <span className="font-medium">{config.text}</span>
      {lastCheck && (
        <span className="text-xs opacity-70">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
      {status === "error" && errorMessage && (
        <button
          onClick={checkConnection}
          className="ml-2 text-xs underline hover:no-underline"
          title={errorMessage}
        >
          重试
        </button>
      )}
    </div>
  );
}
