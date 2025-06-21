import React from "react";
import {
  Target,
  Brain,
  Search,
  TrendingUp,
  AlertTriangle,
  Shield,
  Database,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ThreatHunting: React.FC = () => {
  return (
    <div className="min-h-screen bg-matrix-bg text-white p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white neon-text">
                AI威胁猎捕
              </h1>
              <p className="text-lg text-muted-foreground">
                基于机器学习的主动威胁发现平台
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="cyber-card p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-300">活跃猎捕</p>
                <p className="text-3xl font-bold text-white">7</p>
                <p className="text-xs text-red-400">正在进行</p>
              </div>
              <Target className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">发现威胁</p>
                <p className="text-3xl font-bold text-white">23</p>
                <p className="text-xs text-blue-400">本月新增</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">AI准确率</p>
                <p className="text-3xl font-bold text-white">94.2%</p>
                <p className="text-xs text-green-400">持续优化</p>
              </div>
              <Brain className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">数据源</p>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-xs text-purple-400">实时接入</p>
              </div>
              <Database className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="cyber-card p-8">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/25">
              <Target className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                AI威胁猎捕即将上线
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                基于先进的机器学习算法，主动搜寻隐藏在网络中的高级持续性威胁(APT)。
                结合行为分析、异常检测和威胁情报，提供前所未有的威胁发现能力。
              </p>
              <div className="flex justify-center space-x-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/40 px-4 py-2">
                  <Brain className="w-4 h-4 mr-2" />
                  AI驱动
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-4 py-2">
                  <Activity className="w-4 h-4 mr-2" />
                  实时分析
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  主动防护
                </Badge>
              </div>
            </div>
            <Button className="neon-button-red px-8 py-3 text-lg">
              申请beta测试
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatHunting;
