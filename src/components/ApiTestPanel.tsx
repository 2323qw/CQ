import { useState } from "react";
import {
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Globe,
  Clock,
  Database,
} from "lucide-react";
import { apiService, SystemMetrics } from "@/services/api";
import { cn } from "@/lib/utils";
import { formatBytes, formatMemory } from "@/hooks/useSystemMetrics";

interface TestResult {
  timestamp: Date;
  success: boolean;
  responseTime: number;
  data?: SystemMetrics;
  error?: string;
  httpStatus?: number;
}

export function ApiTestPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [autoTest, setAutoTest] = useState(false);

  const runApiTest = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      console.log("🚀 开始API连接测试...");
      const response = await apiService.getLatestMetrics();
      const responseTime = Date.now() - startTime;

      const result: TestResult = {
        timestamp: new Date(),
        success: !!response.data,
        responseTime,
        data: response.data || undefined,
        error: response.error || undefined,
        httpStatus: response.code,
      };

      setTestResults((prev) => [result, ...prev.slice(0, 9)]); // 保留最近10次测试

      if (result.success) {
        console.log("✅ API测试成功:", result);
      } else {
        console.log("❌ API测试失败:", result);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: TestResult = {
        timestamp: new Date(),
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : "未知错误",
      };

      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
      console.log("💥 API测试异常:", result);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (result: TestResult) => {
    if (result.success) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 500) return "text-green-400";
    if (time < 1000) return "text-yellow-400";
    return "text-red-400";
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="API连接测试"
      >
        <Globe className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
      {/* 标题栏 */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          API连接测试
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      {/* 控制按钮 */}
      <div className="p-4 border-b border-gray-700 flex gap-2">
        <button
          onClick={runApiTest}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isLoading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white",
          )}
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isLoading ? "测试中..." : "测试连接"}
        </button>

        <button
          onClick={() => setTestResults([])}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          清空记录
        </button>
      </div>

      {/* 测试结果 */}
      <div className="flex-1 overflow-y-auto p-4">
        {testResults.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">点击"测试连接"开始API测试</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border text-sm",
                  result.success
                    ? "bg-green-900/20 border-green-400/30"
                    : "bg-red-900/20 border-red-400/30",
                )}
              >
                {/* 测试结果头部 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result)}
                    <span className="font-medium">
                      {result.success ? "连接成功" : "连接失败"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {result.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {/* 响应时间 */}
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">响应时间:</span>
                  <span className={getResponseTimeColor(result.responseTime)}>
                    {result.responseTime}ms
                  </span>
                </div>

                {/* HTTP状态码 */}
                {result.httpStatus && (
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">HTTP状态:</span>
                    <span
                      className={
                        result.httpStatus === 200
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {result.httpStatus}
                    </span>
                  </div>
                )}

                {/* 错误信息 */}
                {result.error && (
                  <div className="mt-2 p-2 bg-red-900/30 rounded text-xs text-red-300">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{result.error}</span>
                    </div>
                  </div>
                )}

                {/* API数据预览 */}
                {result.data && (
                  <div className="mt-2 p-2 bg-green-900/30 rounded text-xs">
                    <div className="grid grid-cols-2 gap-1 text-green-300">
                      <div>CPU: {result.data.cpu_percent.toFixed(1)}%</div>
                      <div>内存: {result.data.memory_percent.toFixed(1)}%</div>
                      <div>磁盘: {result.data.disk_percent.toFixed(1)}%</div>
                      <div>核心: {result.data.cpu_count}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API信息 */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/50">
        <div className="text-xs text-gray-400">
          <div className="flex justify-between">
            <span>API地址:</span>
            <span className="text-blue-400 break-all">
              {import.meta.env.DEV ? "代理模式" : "http://jq41030xx76.vicp.fun"}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span>端点:</span>
            <span className="text-blue-400">/api/v1/metrics/</span>
          </div>
        </div>
      </div>
    </div>
  );
}
