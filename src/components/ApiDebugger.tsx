import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ApiTestResult {
  endpoint: string;
  method: string;
  status: "pending" | "success" | "error" | "cors" | "timeout";
  statusCode?: number;
  response?: any;
  error?: string;
  duration?: number;
}

export function ApiDebugger() {
  const [tests, setTests] = useState<ApiTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [safeMode, setSafeMode] = useState(false);

  const API_BASE_URL = "http://jq41030xx76.vicp.fun";

  const testEndpoints = [
    { endpoint: "/health", method: "GET", name: "健康检查" },
    {
      endpoint: "/api/v1/auth/auth/login",
      method: "OPTIONS",
      name: "登录预检请求",
    },
    { endpoint: "/api/v1/metrics/current/", method: "GET", name: "当前指标" },
    // 添加一个图片请求来测试基本连通性（通常不会被CORS阻止）
    { endpoint: "/favicon.ico", method: "GET", name: "基础连通性测试" },
  ];

  const runApiTests = async () => {
    setIsRunning(true);
    setTests([]);

    // 如果是安全模式，不进行实际的网络请求
    if (safeMode) {
      for (const test of testEndpoints) {
        const testResult: ApiTestResult = {
          endpoint: test.endpoint,
          method: test.method,
          status: "cors",
          error: "安全模式：跳过实际网络请求以避免CORS错误",
          duration: 0,
        };
        setTests((prev) => [...prev, testResult]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setIsRunning(false);
      return;
    }

    for (const test of testEndpoints) {
      const testResult: ApiTestResult = {
        endpoint: test.endpoint,
        method: test.method,
        status: "pending",
      };

      setTests((prev) => [...prev, testResult]);

      const startTime = Date.now();
      let duration = 0;
      let status: ApiTestResult["status"] = "error";
      let errorMessage = "";
      let responseData: any = null;
      let statusCode: number | undefined = undefined;

      // 创建带超时的AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 8000); // 8秒超时

      try {
        let response: Response;

        if (test.method === "OPTIONS") {
          // 预检请求测试
          response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
            method: "OPTIONS",
            mode: "cors",
            signal: controller.signal,
            headers: {
              Origin: window.location.origin,
              "Access-Control-Request-Method": "POST",
              "Access-Control-Request-Headers": "Content-Type, Authorization",
            },
          });
        } else {
          response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
            method: test.method,
            mode: "cors",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        clearTimeout(timeoutId);
        duration = Date.now() - startTime;
        statusCode = response.status;

        // 尝试读取响应内容
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
          } else {
            const textData = await response.text();
            responseData =
              textData || `HTTP ${response.status} ${response.statusText}`;
          }
        } catch (e) {
          responseData = `HTTP ${response.status} ${response.statusText}`;
        }

        // 检查CORS相关的响应头
        const corsHeaders = {
          "access-control-allow-origin": response.headers.get(
            "access-control-allow-origin",
          ),
          "access-control-allow-methods": response.headers.get(
            "access-control-allow-methods",
          ),
          "access-control-allow-headers": response.headers.get(
            "access-control-allow-headers",
          ),
        };

        responseData = { data: responseData, corsHeaders };
        status = response.ok ? "success" : "error";
      } catch (error) {
        clearTimeout(timeoutId);
        duration = Date.now() - startTime;

        // 详细的错误分类和处理
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            status = "timeout";
            errorMessage = "请求超时 (>8秒)";
          } else if (error.message.includes("Failed to fetch")) {
            status = "cors";
            errorMessage =
              "CORS错误或网络连接问题 - 这是预期的，说明需要配置CORS";
          } else if (error.message.includes("NetworkError")) {
            status = "cors";
            errorMessage = "网络错误 - 可能是CORS策略阻止了请求";
          } else if (error.message.includes("blocked by CORS")) {
            status = "cors";
            errorMessage = "CORS策略明确阻止了请求";
          } else {
            status = "error";
            errorMessage = `网络错误: ${error.message}`;
          }
        } else {
          status = "error";
          errorMessage = "未知网络错误";
        }
      }

      // 更新测试结果 - 无��成功还是失败都会到这里
      setTests((prev) =>
        prev.map((t) =>
          t.endpoint === test.endpoint && t.method === test.method
            ? {
                ...t,
                status,
                statusCode,
                response: responseData,
                error: errorMessage || undefined,
                duration,
              }
            : t,
        ),
      );

      // 小延迟避免请求过于密集
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: ApiTestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Loader className="w-4 h-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "cors":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "timeout":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ApiTestResult["status"]) => {
    const variants = {
      pending: "default",
      success: "default",
      error: "destructive",
      cors: "destructive",
      timeout: "destructive",
    } as const;

    const labels = {
      pending: "测试中",
      success: "成功",
      error: "错误",
      cors: "CORS错误",
      timeout: "超时",
    };

    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>API连接诊断工具</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="safeMode"
                checked={safeMode}
                onChange={(e) => setSafeMode(e.target.checked)}
                className="rounded border-matrix-border"
              />
              <label
                htmlFor="safeMode"
                className="text-sm text-muted-foreground"
              >
                安全模式
              </label>
            </div>
            <Button
              onClick={runApiTests}
              disabled={isRunning}
              className="bg-neon-blue hover:bg-neon-blue/80"
            >
              {isRunning ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  {safeMode ? "模拟中..." : "诊断中..."}
                </>
              ) : safeMode ? (
                "模拟测试"
              ) : (
                "开始诊断"
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              目标服务器:{" "}
              <code className="bg-matrix-surface px-2 py-1 rounded text-neon-blue">
                {API_BASE_URL}
              </code>
            </p>
            <p>
              当前源地址:{" "}
              <code className="bg-matrix-surface px-2 py-1 rounded text-neon-blue">
                {window.location.origin}
              </code>
            </p>
            <div className="p-3 bg-matrix-accent/20 rounded-lg">
              <div className="font-semibold text-white text-xs mb-1">说明:</div>
              <div className="text-xs space-y-1">
                <div>
                  此工具检测API连接问题。CORS错误是正常的，说明服务器可访问但需要配置跨域头。
                </div>
                <div className="text-orange-300">
                  如果遇到控制台错误，请启用"安全模式"来避免实际的网络请求。
                </div>
              </div>
            </div>
          </div>

          {tests.length > 0 && (
            <div className="space-y-3">
              {tests.map((test, index) => (
                <div
                  key={`${test.endpoint}-${test.method}-${index}`}
                  className="border rounded-lg p-4 bg-matrix-surface/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <span className="font-mono text-sm">
                        <Badge variant="outline" className="mr-2">
                          {test.method}
                        </Badge>
                        {test.endpoint}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {test.duration && (
                        <span className="text-xs text-muted-foreground">
                          {test.duration}ms
                        </span>
                      )}
                      {getStatusBadge(test.status)}
                      {test.statusCode && (
                        <Badge variant="outline" className="text-xs">
                          {test.statusCode}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {test.error && (
                    <div className="text-sm text-red-400 mt-2 bg-red-950/20 p-2 rounded">
                      错误: {test.error}
                    </div>
                  )}

                  {test.response && test.status === "success" && (
                    <div className="text-sm text-green-400 mt-2 bg-green-950/20 p-2 rounded">
                      <details>
                        <summary className="cursor-pointer">
                          查看响应和CORS头
                        </summary>
                        <pre className="mt-2 text-xs overflow-auto">
                          {typeof test.response === "string"
                            ? test.response
                            : JSON.stringify(test.response, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}

                  {test.status === "cors" && (
                    <div className="text-sm text-orange-400 mt-2 bg-orange-950/20 p-2 rounded">
                      <div className="font-semibold mb-1">CORS配置建议:</div>
                      <div className="text-xs space-y-1">
                        <div>
                          • 后端需要添加{" "}
                          <code className="bg-matrix-surface px-1 rounded">
                            Access-Control-Allow-Origin
                          </code>{" "}
                          头
                        </div>
                        <div>
                          • 允许的源地址:{" "}
                          <code className="bg-matrix-surface px-1 rounded">
                            {window.location.origin}
                          </code>
                        </div>
                        <div>
                          • 需要允许的方法:{" "}
                          <code className="bg-matrix-surface px-1 rounded">
                            GET, POST, OPTIONS
                          </code>
                        </div>
                        <div>
                          • 需要允许的头:{" "}
                          <code className="bg-matrix-surface px-1 rounded">
                            Content-Type, Authorization
                          </code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tests.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              点击"开始诊断"来检测API连接问题
            </div>
          )}

          {tests.length > 0 && !isRunning && (
            <div className="mt-6 p-4 bg-matrix-surface/30 rounded-lg">
              <h4 className="font-semibold text-white mb-3">诊断总结</h4>
              <div className="space-y-2 text-sm">
                {tests.every((t) => t.status === "cors") && (
                  <div className="text-orange-400">
                    ⚠️
                    所有请求都被CORS策略阻止。这是正常的，需要后端配置CORS头来允许跨域访问。
                  </div>
                )}
                {tests.some((t) => t.status === "success") && (
                  <div className="text-green-400">
                    ✅ 部分端点可以访问，API服务器在线。
                  </div>
                )}
                {tests.some((t) => t.status === "timeout") && (
                  <div className="text-yellow-400">
                    ⏱️ 部分请求超时，可能是网络延迟或服务器响应慢。
                  </div>
                )}
                <div className="text-muted-foreground mt-3 pt-3 border-t border-matrix-border">
                  建议:
                  联系后端开发人员配置CORS，或者暂时使用测试账号登录系统进行演示。
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ApiDebugger;
