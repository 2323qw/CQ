import React from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { useDataSource } from "@/contexts/DataSourceContext";
import { WifiOff, Database, AlertTriangle } from "lucide-react";

interface ApiFailureNotificationProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export function ApiFailureNotification({
  error,
  onRetry,
  className,
}: ApiFailureNotificationProps) {
  const { isApiMode, setDataSource } = useDataSource();

  // Only show this notification when in API mode and there's an error
  if (!isApiMode || !error) {
    return null;
  }

  const handleSwitchToMockMode = () => {
    setDataSource("mock");
  };

  return (
    <Alert className={`border-orange-500/50 bg-orange-500/10 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-500" />
      <AlertDescription className="flex flex-col space-y-3">
        <div>
          <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
            API连接失败
          </p>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            {error}
          </p>
          {error.includes("超时") && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              💡 服务器响应缓慢，切换到模拟模式可立即查看完整功能
            </p>
          )}
          {(error.includes("数据库") || error.includes("Database Error")) && (
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 space-y-1">
              <p>🔧 服务器数据库正在初始化，这通常需要几分钟时间</p>
              <p>💡 建议切换到模拟模式，可立即体验所有系统功能</p>
            </div>
          )}
          {error.includes("500") && !error.includes("数据库") && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              ⚠️ 服务器内部错误，建议稍后重试或使用模拟模式
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="border-orange-500/50 hover:bg-orange-500/20"
            >
              <WifiOff className="w-4 h-4 mr-1" />
              重试连接
            </Button>
          )}

          <Button
            size="sm"
            variant="default"
            onClick={handleSwitchToMockMode}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Database className="w-4 h-4 mr-1" />
            切换到模拟模式
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
