import React, { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Wifi,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Settings,
  Database,
  Monitor,
  Zap,
  Globe,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  Eye,
  EyeOff,
  Cloud,
  Shield,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  useRealTimeAPI,
  useSystemSummary,
  useNetworkInterfaces,
  useProcesses,
  useServices,
  useHealthCheck,
  collectAllMetrics,
} from "@/hooks/useRealTimeAPI";
import { DISPLAY_COLORS } from "@/lib/situationDisplayColors";

// 类型定义
interface MetricCard {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: number;
  alert?: boolean;
}

const SystemMonitor: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 使用真实API Hooks
  const {
    data: realTimeData,
    loading: dataLoading,
    error: dataError,
    isUsingMockData,
    fetchNow,
  } = useRealTimeAPI({
    interval: 5000,
    enabled: !isPaused,
    fallbackToMock: true,
  });

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
  } = useSystemSummary();

  const {
    data: interfaces,
    loading: interfacesLoading,
    error: interfacesError,
    refresh: refetchInterfaces,
  } = useNetworkInterfaces();

  const {
    data: processes,
    loading: processesLoading,
    error: processesError,
    refresh: refetchProcesses,
  } = useProcesses();

  const {
    data: services,
    loading: servicesLoading,
    error: servicesError,
    refresh: refetchServices,
  } = useServices();

  const {
    health,
    loading: healthLoading,
    error: healthError,
    refetch: refetchHealth,
  } = useHealthCheck();

  // 手动刷新所有数据
  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchNow(),
        refetchInterfaces(),
        refetchProcesses(),
        refetchServices(),
        refetchHealth(),
      ]);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // 收集所有指标
  const handleCollectMetrics = async () => {
    try {
      const result = await collectAllMetrics();
      if (result.success) {
        handleRefreshAll();
      }
    } catch (error) {
      console.error("Failed to collect metrics:", error);
    }
  };

  // 生成指标卡片数据
  const getMetricCards = (): MetricCard[] => {
    if (!realTimeData) return [];

    return [
      {
        title: "CPU使用率",
        value: realTimeData.cpuUsage,
        unit: "%",
        icon: Cpu,
        color: DISPLAY_COLORS.neon.blue,
        alert: realTimeData.alerts?.cpu_alert,
      },
      {
        title: "内存使用率",
        value: realTimeData.memoryUsage,
        unit: "%",
        icon: MemoryStick,
        color: DISPLAY_COLORS.neon.green,
        alert: realTimeData.alerts?.memory_alert,
      },
      {
        title: "磁盘使用率",
        value: realTimeData.diskUsage,
        unit: "%",
        icon: HardDrive,
        color: DISPLAY_COLORS.neon.purple,
        alert: realTimeData.alerts?.disk_alert,
      },
      {
        title: "网络延迟",
        value: realTimeData.networkLatency,
        unit: "ms",
        icon: Wifi,
        color: DISPLAY_COLORS.neon.cyan,
      },
      {
        title: "活跃连接",
        value: realTimeData.activeConnections,
        unit: "个",
        icon: Network,
        color: DISPLAY_COLORS.neon.yellow,
      },
      {
        title: "在线节点",
        value: realTimeData.onlineNodes,
        unit: "个",
        icon: Server,
        color: DISPLAY_COLORS.neon.orange,
      },
    ];
  };

  // 状态指示器组件
  const StatusIndicator: React.FC<{ status: boolean; loading?: boolean }> = ({
    status,
    loading,
  }) => {
    if (loading) {
      return (
        <div className="animate-spin">
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </div>
      );
    }

    return status ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  // 数据状态横幅
  const DataStatusBanner: React.FC = () => {
    if (!isUsingMockData && !dataError) {
      return (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">
              正在使用真实API数据
            </span>
            <div className="ml-auto flex items-center space-x-2 text-green-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>实时同步</span>
            </div>
          </div>
        </div>
      );
    }

    if (isUsingMockData) {
      return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">
              正在使用模拟数据
            </span>
            <span className="text-yellow-300 text-sm">
              (API连接失败，已切换到演示模式)
            </span>
          </div>
        </div>
      );
    }

    if (dataError) {
      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">数据获取失败</span>
            <span className="text-red-300 text-sm">错误: {dataError}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold font-orbitron mb-2 neon-text-blue">
              系统监控中心
            </h1>
            <p className="text-gray-400">基于真实API的系统性能和状态监控</p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowRawData(!showRawData)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                showRawData
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {showRawData ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>原始数据</span>
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isPaused
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
              <span>{isPaused ? "继续" : "暂停"}</span>
            </button>

            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>刷新</span>
            </button>

            <button
              onClick={handleCollectMetrics}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>收集指标</span>
            </button>
          </div>
        </div>

        {/* 数据状态横幅 */}
        <DataStatusBanner />

        {/* 指标卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {getMetricCards().map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`bg-gray-800 rounded-lg p-6 border ${
                  metric.alert
                    ? "border-red-500/50 bg-red-500/5"
                    : "border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-8 h-8" style={{ color: metric.color }} />
                  {metric.alert && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                  <span className="text-lg ml-1">{metric.unit}</span>
                </div>
                <div className="text-sm text-gray-400">{metric.title}</div>
              </div>
            );
          })}
        </div>

        {/* 图表和详细信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 系统性能趋势 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              性能趋势
            </h3>
            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer>
                <LineChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 网络接口状态 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2 text-green-400" />
              网络接口
              <StatusIndicator
                status={!interfacesError}
                loading={interfacesLoading}
              />
            </h3>
            <div className="space-y-3">
              {(interfaces || []).slice(0, 6).map((iface, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{iface.interface_name}</div>
                    <div className="text-sm text-gray-400">
                      {iface.config?.ip_address || "无IP地址"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      ↑ {Math.round(iface.bytes_sent / 1024)} KB
                    </div>
                    <div className="text-sm">
                      ↓ {Math.round(iface.bytes_recv / 1024)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 进程和服务 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 进程监控 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-400" />
              进程监控
              <StatusIndicator
                status={!processesError}
                loading={processesLoading}
              />
            </h3>
            <div className="space-y-2">
              {(processes || []).slice(0, 8).map((process, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-700/30 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{process.name}</div>
                    <div className="text-xs text-gray-400">
                      PID: {process.pid}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-blue-400">
                      {process.cpu_percent.toFixed(1)}%
                    </span>
                    <span className="text-green-400">
                      {process.memory_percent.toFixed(1)}%
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        process.status === "running"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {process.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 服务状态 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2 text-orange-400" />
              服务状态
              <StatusIndicator
                status={!servicesError}
                loading={servicesLoading}
              />
            </h3>
            <div className="space-y-2">
              {(services || []).slice(0, 8).map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-700/30 rounded"
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.running
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {service.running ? "运行中" : "已停止"}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 原始数据视图 */}
        {showRawData && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-cyan-400" />
              原始API数据
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">
                {JSON.stringify(
                  {
                    realTimeData,
                    summary,
                    healthStatus: health,
                    dataSource: isUsingMockData ? "mock" : "api",
                    errors: {
                      data: dataError,
                      summary: summaryError,
                      interfaces: interfacesError,
                      processes: processesError,
                      services: servicesError,
                      health: healthError,
                    },
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        )}

        {/* 页面底部信息 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            API服务器:{" "}
            {process.env.REACT_APP_API_URL || "http://jq41030xx76.vicp.fun"} |
            数据源: {isUsingMockData ? "模拟数据" : "真实API"} | 最后��新:{" "}
            {realTimeData?.timestamp
              ? new Date(realTimeData.timestamp).toLocaleString()
              : "无数据"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
