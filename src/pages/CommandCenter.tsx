import React from "react";
import {
  Command,
  Shield,
  Monitor,
  AlertTriangle,
  Users,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CommandCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-matrix-bg text-white p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl shadow-lg">
              <Command className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white neon-text">
                安全指挥中心
              </h1>
              <p className="text-lg text-muted-foreground">
                集中化安全运营与指挥调度平台
              </p>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="cyber-card p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">安全态势</p>
                <p className="text-3xl font-bold text-white">良好</p>
                <p className="text-xs text-green-400">无重大威胁</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">值班人员</p>
                <p className="text-3xl font-bold text-white">8</p>
                <p className="text-xs text-blue-400">24/7在线</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-300">
                  处理中事件
                </p>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-xs text-orange-400">需要关注</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <div className="cyber-card p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">响应时间</p>
                <p className="text-3xl font-bold text-white">2.3m</p>
                <p className="text-xs text-purple-400">平均响应</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="cyber-card p-8">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
              <Command className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                安全指挥中心
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                提供统一的安全事件管理、应急响应协调和安全团队协作平台。
                集成多种安全工具和数据源，实现安全运营的可视化和自动化。
              </p>
              <div className="flex justify-center space-x-4">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40 px-4 py-2">
                  <Command className="w-4 h-4 mr-2" />
                  统一指挥
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-4 py-2">
                  <Monitor className="w-4 h-4 mr-2" />
                  实时监控
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/40 px-4 py-2">
                  <Target className="w-4 h-4 mr-2" />
                  精准响应
                </Badge>
              </div>
            </div>
            <Button className="neon-button-purple px-8 py-3 text-lg">
              进入指挥中心
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
