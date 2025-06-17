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

  const API_BASE_URL = "http://jq41030xx76.vicp.fun";

  const testEndpoints = [
    { endpoint: "/health", method: "GET", name: "健康检查" },
    {
      endpoint: "/api/v1/auth/auth/login",
      method: "OPTIONS",
      name: "登录预检请求",
    },
    { endpoint: "/api/v1/metrics/current/", method: "GET", name: "当前指标" },
  ];

  const runApiTests = async () => {
    setIsRunning(true);
    setTests([]);

    for (const test of testEndpoints) {
      const testResult: ApiTestResult = {
        endpoint: test.endpoint,
        method: test.method,
        status: "pending",
      };

      setTests((prev) => [...prev, testResult]);

      try {
        const startTime = Date.now();

        let response: Response;

        if (test.method === "OPTIONS") {
          // 预检请求测试
          response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
            method: "OPTIONS",
            mode: "cors",
            headers: {
              Origin: window.location.origin,
              "Access-Control-Request-Method": "POST",
              "Access-Control-Request-Headers": "Content-Type",
            },
          });
        } else {
          response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
            method: test.method,
            mode: "cors",
          });
        }

        const duration = Date.now() - startTime;
        let responseData;

        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
          } else {
            responseData = await response.text();
          }
        } catch (e) {
          responseData = "Non-JSON response";
        }

        setTests((prev) =>
          prev.map((t) =>
            t.endpoint === test.endpoint && t.method === test.method
              ? {
                  ...t,
                  status: response.ok ? "success" : "error",
                  statusCode: response.status,
                  response: responseData,
                  duration,
                }
              : t,
          ),
        );
      } catch (error) {
        const duration = Date.now() - Date.now();
        let status: ApiTestResult["status"] = "error";
        let errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("Failed to fetch")) {
          status = "cors";
          errorMessage = "CORS error or network connectivity issue";
        } else if (errorMessage.includes("timeout")) {
          status = "timeout";
        }

        setTests((prev) =>
          prev.map((t) =>
            t.endpoint === test.endpoint && t.method === test.method
              ? {
                  ...t,
                  status,
                  error: errorMessage,
                  duration,
                }
              : t,
          ),
        );
      }

      // 小延迟避免请求过于密集
      await new Promise((resolve) => setTimeout(resolve, 500));
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
          <span>API连接测试</span>
          <Button
            onClick={runApiTests}
            disabled={isRunning}
            className="bg-neon-blue hover:bg-neon-blue/80"
          >
            {isRunning ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                测试中...
              </>
            ) : (
              "开始测试"
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
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
                        <summary className="cursor-pointer">查看响应</summary>
                        <pre className="mt-2 text-xs overflow-auto">
                          {typeof test.response === "string"
                            ? test.response
                            : JSON.stringify(test.response, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tests.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              点击"开始测试"来诊断API连接问题
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ApiDebugger;
