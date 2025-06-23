import React, { useState } from "react";
import {
  Settings,
  BarChart3,
  Network,
  Shield,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCw,
  Zap,
  ZapOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Filter,
  Layers,
  Globe,
  Command,
  Terminal,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Target,
  Scan,
  Radio,
  Satellite,
  Brain,
  Cpu,
  HardDrive,
  Monitor,
  Power,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DISPLAY_COLORS } from "@/lib/situationDisplayColors";

interface EnhancedRightPanelProps {
  realTimeData: any;
  isVisible: boolean;
  sceneConfig: any;
  onConfigChange: (config: any) => void;
}

export function EnhancedRightPanel({
  realTimeData,
  isVisible,
  sceneConfig,
  onConfigChange,
}: EnhancedRightPanelProps) {
  const [activeTab, setActiveTab] = useState("control");

  const tabs = [
    { id: "control", label: "场景控制", icon: Settings },
    { id: "analysis", label: "数据分析", icon: BarChart3 },
    { id: "network", label: "网络拓扑", icon: Network },
    { id: "tools", label: "工具箱", icon: Command },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 top-20 bottom-0 w-80 bg-gray-900/95 border-l border-gray-700 backdrop-blur-sm z-30 overflow-hidden">
      {/* 标签栏 */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-3 text-xs transition-all ${
              activeTab === tab.id
                ? "bg-neon-cyan/20 text-neon-cyan border-b-2 border-neon-cyan"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="h-full overflow-y-auto p-4">
        {activeTab === "control" && (
          <SceneControlTab
            sceneConfig={sceneConfig}
            onConfigChange={onConfigChange}
            realTimeData={realTimeData}
          />
        )}
        {activeTab === "analysis" && (
          <DataAnalysisTab realTimeData={realTimeData} />
        )}
        {activeTab === "network" && (
          <NetworkTopologyTab realTimeData={realTimeData} />
        )}
        {activeTab === "tools" && <ToolboxTab realTimeData={realTimeData} />}
      </div>
    </div>
  );
}

/**
 * 场景控制标签页
 */
function SceneControlTab({
  sceneConfig,
  onConfigChange,
  realTimeData,
}: {
  sceneConfig: any;
  onConfigChange: (config: any) => void;
  realTimeData: any;
}) {
  return (
    <div className="space-y-6">
      {/* 基础控制 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-cyan mb-3 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          基础控制
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">自动旋转</span>
            <button
              onClick={() =>
                onConfigChange({ autoRotate: !sceneConfig.autoRotate })
              }
              className={`w-12 h-6 rounded-full transition-all ${
                sceneConfig.autoRotate ? "bg-neon-blue" : "bg-gray-600"
              } relative`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  sceneConfig.autoRotate ? "translate-x-6" : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white">粒子效果</span>
            <button
              onClick={() =>
                onConfigChange({
                  particleEffects: !sceneConfig.particleEffects,
                })
              }
              className={`w-12 h-6 rounded-full transition-all ${
                sceneConfig.particleEffects ? "bg-neon-green" : "bg-gray-600"
              } relative`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  sceneConfig.particleEffects
                    ? "translate-x-6"
                    : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white">动态环境</span>
            <button
              onClick={() =>
                onConfigChange({
                  dynamicEnvironment: !sceneConfig.dynamicEnvironment,
                })
              }
              className={`w-12 h-6 rounded-full transition-all ${
                sceneConfig.dynamicEnvironment
                  ? "bg-neon-purple"
                  : "bg-gray-600"
              } relative`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  sceneConfig.dynamicEnvironment
                    ? "translate-x-6"
                    : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 视觉效果 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-blue mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          视觉效果
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">旋转速度</span>
              <span className="text-xs text-neon-cyan">
                {(sceneConfig.rotateSpeed || 0.15).toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.01"
              max="2"
              step="0.01"
              value={sceneConfig.rotateSpeed || 0.15}
              onChange={(e) =>
                onConfigChange({ rotateSpeed: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, ${DISPLAY_COLORS.neon.blue} 0%, ${DISPLAY_COLORS.neon.cyan} 100%)`,
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">星空密度</span>
              <span className="text-xs text-neon-green">
                {sceneConfig.starCount || 4000}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="8000"
              step="100"
              value={sceneConfig.starCount || 4000}
              onChange={(e) =>
                onConfigChange({ starCount: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">更新频率</span>
              <span className="text-xs text-neon-orange">
                {sceneConfig.updateInterval || 2000}ms
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={sceneConfig.updateInterval || 2000}
              onChange={(e) =>
                onConfigChange({ updateInterval: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-green mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          快速操作
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onConfigChange({ isPaused: !sceneConfig.isPaused })}
            className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs transition-all ${
              sceneConfig.isPaused
                ? "bg-neon-orange/20 text-neon-orange border border-neon-orange/50"
                : "bg-neon-green/20 text-neon-green border border-neon-green/50"
            }`}
          >
            {sceneConfig.isPaused ? (
              <Play className="w-3 h-3" />
            ) : (
              <Pause className="w-3 h-3" />
            )}
            <span>{sceneConfig.isPaused ? "播放" : "暂停"}</span>
          </button>

          <button
            onClick={() =>
              onConfigChange({ autoRotate: !sceneConfig.autoRotate })
            }
            className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/30 transition-all"
          >
            <RotateCw className="w-3 h-3" />
            <span>旋转</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            <span>重置</span>
          </button>

          <button className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs bg-neon-purple/20 text-neon-purple border border-neon-purple/50 hover:bg-neon-purple/30 transition-all">
            <Download className="w-3 h-3" />
            <span>截图</span>
          </button>
        </div>
      </div>

      {/* 系统状态 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-orange mb-3 flex items-center">
          <Monitor className="w-4 h-4 mr-2" />
          系统状态
        </h3>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">渲染帧率:</span>
              <span className="text-neon-green">60 FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">节点数量:</span>
              <span className="text-neon-blue">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">连接数量:</span>
              <span className="text-neon-cyan">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">粒子数量:</span>
              <span className="text-neon-purple">
                {sceneConfig.starCount || 4000}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 数据分析标签页
 */
function DataAnalysisTab({ realTimeData }: { realTimeData: any }) {
  const analyticsData = [
    {
      label: "网络吞吐量",
      value: "1.2 GB/s",
      trend: "up",
      change: "+12%",
      color: DISPLAY_COLORS.neon.blue,
    },
    {
      label: "响应时间",
      value: "23ms",
      trend: "down",
      change: "-8%",
      color: DISPLAY_COLORS.neon.green,
    },
    {
      label: "错误率",
      value: "0.02%",
      trend: "down",
      change: "-45%",
      color: DISPLAY_COLORS.neon.orange,
    },
    {
      label: "安全得分",
      value: "98.7",
      trend: "up",
      change: "+2%",
      color: DISPLAY_COLORS.neon.purple,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-blue mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          关键指标
        </h3>
        <div className="space-y-3">
          {analyticsData.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">{metric.label}</span>
                <div className="flex items-center space-x-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-neon-green" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-neon-red" />
                  )}
                  <span
                    className="text-xs"
                    style={{
                      color:
                        metric.trend === "up"
                          ? DISPLAY_COLORS.neon.green
                          : DISPLAY_COLORS.neon.orange,
                    }}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: metric.color }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 实时图表 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-green mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          实时图表
        </h3>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="h-32 flex items-end justify-between space-x-1">
            {Array.from({ length: 20 }, (_, i) => {
              const height = 20 + Math.random() * 80;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    backgroundColor: DISPLAY_COLORS.neon.blue,
                    opacity: 0.7,
                  }}
                />
              );
            })}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            网络流量趋势 (最近20分钟)
          </div>
        </div>
      </div>

      {/* 节点性能 */}
      <div>
        <h3 className="text-sm font-semibold text-neon-cyan mb-3 flex items-center">
          <Cpu className="w-4 h-4 mr-2" />
          节点性能
        </h3>
        <div className="space-y-2">
          {[
            { name: "服务器集群", cpu: 68, memory: 72, load: "中等" },
            { name: "数据库节点", cpu: 45, memory: 56, load: "轻微" },
            { name: "云端节点", cpu: 89, memory: 82, load: "繁忙" },
            { name: "AI处理节点", cpu: 92, memory: 88, load: "高负载" },
          ].map((node, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">{node.name}</span>
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor:
                      node.cpu > 80
                        ? `${DISPLAY_COLORS.neon.orange}20`
                        : `${DISPLAY_COLORS.neon.green}20`,
                    color:
                      node.cpu > 80
                        ? DISPLAY_COLORS.neon.orange
                        : DISPLAY_COLORS.neon.green,
                  }}
                >
                  {node.load}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">CPU: {node.cpu}%</span>
                  <span className="text-gray-400">内存: {node.memory}%</span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-1">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${node.cpu}%`,
                        backgroundColor:
                          node.cpu > 80
                            ? DISPLAY_COLORS.neon.orange
                            : DISPLAY_COLORS.neon.blue,
                      }}
                    />
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-1">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${node.memory}%`,
                        backgroundColor: DISPLAY_COLORS.neon.green,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 网络拓扑标签页
 */
function NetworkTopologyTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-neon-cyan mb-3 flex items-center">
          <Network className="w-4 h-4 mr-2" />
          拓扑概览
        </h3>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="text-center py-8">
            <Network className="w-16 h-16 mx-auto mb-4 text-neon-cyan opacity-60" />
            <p className="text-gray-400 mb-4">3D网络拓扑</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-lg font-bold text-neon-blue">12</div>
                <div className="text-gray-400">活跃节点</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neon-green">15</div>
                <div className="text-gray-400">连接数</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neon-purple">3</div>
                <div className="text-gray-400">防护层</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neon-orange">98%</div>
                <div className="text-gray-400">可用性</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 工具箱标签页
 */
function ToolboxTab({ realTimeData }: { realTimeData: any }) {
  const tools = [
    {
      name: "网络扫描",
      icon: Scan,
      status: "可用",
      color: DISPLAY_COLORS.neon.green,
    },
    {
      name: "威胁检测",
      icon: Shield,
      status: "运行中",
      color: DISPLAY_COLORS.neon.blue,
    },
    {
      name: "性能分析",
      icon: BarChart3,
      status: "可用",
      color: DISPLAY_COLORS.neon.cyan,
    },
    {
      name: "日志分析",
      icon: FileText,
      status: "可用",
      color: DISPLAY_COLORS.neon.purple,
    },
    {
      name: "流量分析",
      icon: Radio,
      status: "可用",
      color: DISPLAY_COLORS.neon.orange,
    },
    {
      name: "AI诊断",
      icon: Brain,
      status: "处理中",
      color: DISPLAY_COLORS.neon.green,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-neon-purple mb-3 flex items-center">
          <Command className="w-4 h-4 mr-2" />
          安全工具
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool, index) => (
            <button
              key={index}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-all text-left"
            >
              <div className="flex items-center space-x-2 mb-2">
                <tool.icon className="w-4 h-4" style={{ color: tool.color }} />
                <span className="text-sm font-medium text-white">
                  {tool.name}
                </span>
              </div>
              <div className="text-xs" style={{ color: tool.color }}>
                {tool.status}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neon-green mb-3 flex items-center">
          <Terminal className="w-4 h-4 mr-2" />
          控制台
        </h3>
        <div className="bg-black/50 rounded-lg p-3 border border-gray-700 font-mono text-xs">
          <div className="text-neon-green mb-1">$ system status</div>
          <div className="text-gray-400 mb-1">✓ 所有系统运行正常</div>
          <div className="text-gray-400 mb-1">✓ 网络连接稳定</div>
          <div className="text-gray-400 mb-2">⚠ 检测到 3 个活跃威胁</div>
          <div className="text-neon-cyan">
            $ _<span className="animate-pulse">|</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedRightPanel;
