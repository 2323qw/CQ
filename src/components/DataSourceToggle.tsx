import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDataSource } from "@/contexts/DataSourceContext";
import {
  Database,
  Cloud,
  ToggleLeft,
  ToggleRight,
  Wifi,
  WifiOff,
} from "lucide-react";

interface DataSourceToggleProps {
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "compact" | "full";
}

export function DataSourceToggle({
  showLabel = true,
  size = "md",
  variant = "full",
}: DataSourceToggleProps) {
  const { dataSource, toggleDataSource, isApiMode, isMockMode } =
    useDataSource();

  const sizeClasses = {
    sm: "text-xs p-2",
    md: "text-sm p-3",
    lg: "text-base p-4",
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center space-x-2">
        <Button
          onClick={toggleDataSource}
          variant="ghost"
          size="sm"
          className={`${sizeClasses[size]} transition-all duration-200 ${
            isApiMode
              ? "text-neon-blue hover:text-neon-blue/80"
              : "text-neon-green hover:text-neon-green/80"
          }`}
        >
          {isApiMode ? (
            <Cloud className="w-4 h-4" />
          ) : (
            <Database className="w-4 h-4" />
          )}
          {showLabel && (
            <span className="ml-2">{isApiMode ? "API" : "模拟"}</span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="cyber-card p-4 bg-matrix-surface/50 border-2 border-matrix-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-neon-blue" />
          <span className="text-sm font-medium text-white">数据源</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={isApiMode ? "default" : "outline"}
            className={`text-xs ${
              isApiMode
                ? "bg-neon-blue text-white"
                : "border-matrix-border text-muted-foreground"
            }`}
          >
            <Cloud className="w-3 h-3 mr-1" />
            真实API
          </Badge>
          <Badge
            variant={isMockMode ? "default" : "outline"}
            className={`text-xs ${
              isMockMode
                ? "bg-neon-green text-black"
                : "border-matrix-border text-muted-foreground"
            }`}
          >
            <Database className="w-3 h-3 mr-1" />
            模拟数据
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">
            当前模式: {isApiMode ? "真实API连接" : "本地模拟数据"}
          </div>
          <div
            className={`text-xs ${isApiMode ? "text-neon-blue" : "text-neon-green"}`}
          >
            {isApiMode ? (
              <div className="flex items-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>连接后端服务器</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <WifiOff className="w-3 h-3" />
                <span>使用离线演示数据</span>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={toggleDataSource}
          variant="ghost"
          size="sm"
          className="ml-4 p-2 hover:bg-matrix-accent/20 transition-all duration-200"
        >
          {isApiMode ? (
            <ToggleRight className="w-6 h-6 text-neon-blue" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-neon-green" />
          )}
        </Button>
      </div>

      <div className="mt-3 pt-3 border-t border-matrix-border">
        <div className="text-xs text-muted-foreground space-y-1">
          {isApiMode ? (
            <div>
              <div>• 使用真实的后端API</div>
              <div>• 需要网络连接</div>
              <div>• 可能遇到CORS问题</div>
            </div>
          ) : (
            <div>
              <div>• 使用本地模拟数据</div>
              <div>• 无需网络连接</div>
              <div>• 完整的演示功能</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataSourceToggle;
