import React from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
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
  // Always show notification when there's an error
  if (!error) {
    return null;
  }

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
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="border-orange-500/50 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20"
          >
            <Database className="w-4 h-4 mr-2" />
            重试连接
          </Button>
          <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
            <WifiOff className="w-3 h-3" />
            <span>已自动启用模拟数据</span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default ApiFailureNotification;
