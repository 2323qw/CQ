import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Users,
  Clock,
  Activity,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  User,
  Calendar,
  MapPin,
  Fingerprint,
  Zap,
  Shield,
  Settings,
  BarChart3,
  PieChart,
  Target,
  Lock,
  Unlock,
  Monitor,
  Globe,
  FileText,
  Database,
} from "lucide-react";

interface UserBehavior {
  id: string;
  userId: string;
  userName: string;
  department: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  lastActivity: string;
  location: string;
  device: string;
  anomalies: number;
  baseline: {
    loginTime: string;
    accessPatterns: string[];
    dataUsage: number;
  };
}

interface BehaviorAnomaly {
  id: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  userId: string;
  userName: string;
  details: string;
  confidence: number;
}

interface ActivityPattern {
  hour: number;
  normalActivity: number;
  currentActivity: number;
  riskLevel: number;
}

export default function BehaviorAnalysis() {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "users" | "anomalies" | "patterns"
  >("overview");
  const [timeRange, setTimeRange] = useState("24h");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserBehavior | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 模拟用户行为数据
  const [userBehaviors] = useState<UserBehavior[]>([
    {
      id: "user-001",
      userId: "U001",
      userName: "张三",
      department: "技术部",
      riskScore: 85,
      riskLevel: "high",
      lastActivity: "2024-01-20 14:30:25",
      location: "北京办公室",
      device: "Windows工作站",
      anomalies: 3,
      baseline: {
        loginTime: "09:00-18:00",
        accessPatterns: ["内网文件服务器", "邮件系统", "开发工具"],
        dataUsage: 2048,
      },
    },
    {
      id: "user-002",
      userId: "U002",
      userName: "李四",
      department: "财务部",
      riskScore: 45,
      riskLevel: "medium",
      lastActivity: "2024-01-20 14:25:15",
      location: "上海办公室",
      device: "MacBook Pro",
      anomalies: 1,
      baseline: {
        loginTime: "08:30-17:30",
        accessPatterns: ["财务系统", "邮件系统", "OA系统"],
        dataUsage: 512,
      },
    },
    {
      id: "user-003",
      userId: "U003",
      userName: "王五",
      department: "人事部",
      riskScore: 25,
      riskLevel: "low",
      lastActivity: "2024-01-20 14:20:10",
      location: "深圳办公室",
      device: "移动设备",
      anomalies: 0,
      baseline: {
        loginTime: "09:00-18:00",
        accessPatterns: ["人事系统", "邮件系统"],
        dataUsage: 256,
      },
    },
    {
      id: "user-004",
      userId: "U004",
      userName: "赵六",
      department: "技术部",
      riskScore: 95,
      riskLevel: "critical",
      lastActivity: "2024-01-20 02:15:30",
      location: "未知位置",
      device: "个人设备",
      anomalies: 5,
      baseline: {
        loginTime: "09:00-18:00",
        accessPatterns: ["内网文件服务器", "数据库系统"],
        dataUsage: 4096,
      },
    },
  ]);

  // 模拟行为异常数据
  const [behaviorAnomalies] = useState<BehaviorAnomaly[]>([
    {
      id: "anomaly-001",
      type: "异常登录时间",
      description: "凌晨时段登录系统",
      severity: "high",
      timestamp: "2024-01-20 02:15:30",
      userId: "U004",
      userName: "赵六",
      details: "用户在非工作时间（凌晨2:15）登录系统，偏离正常行为模式",
      confidence: 92,
    },
    {
      id: "anomaly-002",
      type: "异常数据访问",
      description: "访问敏感数据文件",
      severity: "critical",
      timestamp: "2024-01-20 14:30:25",
      userId: "U001",
      userName: "张三",
      details: "访问了平时不会访问的财务敏感数据，存在数据泄露风险",
      confidence: 88,
    },
    {
      id: "anomaly-003",
      type: "异常地理位置",
      description: "从异常地理位置登录",
      severity: "medium",
      timestamp: "2024-01-20 13:45:12",
      userId: "U002",
      userName: "李四",
      details: "从与历史登录位置相距较远的地点登录，可能存在账户被盗用风险",
      confidence: 75,
    },
    {
      id: "anomaly-004",
      type: "异常设备登录",
      description: "使用未知设备登录",
      severity: "high",
      timestamp: "2024-01-20 11:20:45",
      userId: "U004",
      userName: "赵六",
      details: "使用从未注册过的个人设备登录企业系统",
      confidence: 85,
    },
    {
      id: "anomaly-005",
      type: "异常文件操作",
      description: "大量文件下载行为",
      severity: "critical",
      timestamp: "2024-01-20 10:15:20",
      userId: "U001",
      userName: "张三",
      details: "短时间内下载大量敏感文件，疑似数据窃取行为",
      confidence: 95,
    },
  ]);

  // 模拟活动模式数据
  const [activityPatterns] = useState<ActivityPattern[]>([
    { hour: 0, normalActivity: 2, currentActivity: 8, riskLevel: 85 },
    { hour: 1, normalActivity: 1, currentActivity: 5, riskLevel: 90 },
    { hour: 2, normalActivity: 1, currentActivity: 12, riskLevel: 95 },
    { hour: 3, normalActivity: 0, currentActivity: 3, riskLevel: 70 },
    { hour: 8, normalActivity: 45, currentActivity: 52, riskLevel: 15 },
    { hour: 9, normalActivity: 120, currentActivity: 118, riskLevel: 5 },
    { hour: 10, normalActivity: 150, currentActivity: 145, riskLevel: 5 },
    { hour: 14, normalActivity: 135, currentActivity: 142, riskLevel: 10 },
    { hour: 18, normalActivity: 85, currentActivity: 78, riskLevel: 12 },
    { hour: 22, normalActivity: 15, currentActivity: 25, riskLevel: 45 },
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-orange-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredUsers = userBehaviors.filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || user.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const filteredAnomalies = behaviorAnomalies.filter((anomaly) => {
    return (
      anomaly.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <Brain className="w-8 h-8 text-neon-blue" />
              用户行为分析
            </h1>
            <p className="text-muted-foreground mt-2">
              基于机器学习的用户行为建模，检测异常活动和安全威胁
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1小时</SelectItem>
                <SelectItem value="24h">24小时</SelectItem>
                <SelectItem value="7d">7天</SelectItem>
                <SelectItem value="30d">30天</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              刷新
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-card-enhanced border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃用户</p>
                  <p className="text-2xl font-bold text-cyan-400">1,247</p>
                  <p className="text-xs text-green-400 mt-1">↑ 8.5%</p>
                </div>
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">行为异常</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {behaviorAnomalies.length}
                  </p>
                  <p className="text-xs text-red-400 mt-1">↑ 12.3%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">高风险用户</p>
                  <p className="text-2xl font-bold text-red-400">
                    {
                      userBehaviors.filter(
                        (u) =>
                          u.riskLevel === "high" || u.riskLevel === "critical",
                      ).length
                    }
                  </p>
                  <p className="text-xs text-red-400 mt-1">↑ 5.7%</p>
                </div>
                <Target className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">模型准确率</p>
                  <p className="text-2xl font-bold text-green-400">94.2%</p>
                  <p className="text-xs text-green-400 mt-1">↑ 2.1%</p>
                </div>
                <Brain className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-matrix-surface/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-neon-blue/20"
            >
              概览分析
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-neon-blue/20"
            >
              用户画像
            </TabsTrigger>
            <TabsTrigger
              value="anomalies"
              className="data-[state=active]:bg-neon-blue/20"
            >
              异常检测
            </TabsTrigger>
            <TabsTrigger
              value="patterns"
              className="data-[state=active]:bg-neon-blue/20"
            >
              行为模式
            </TabsTrigger>
          </TabsList>

          {/* 概览分析 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 风险分布 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-neon-blue" />
                    用户风险等级分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        level: "critical",
                        count: 1,
                        percentage: 25,
                        color: "text-red-400",
                      },
                      {
                        level: "high",
                        count: 1,
                        percentage: 25,
                        color: "text-orange-400",
                      },
                      {
                        level: "medium",
                        count: 1,
                        percentage: 25,
                        color: "text-yellow-400",
                      },
                      {
                        level: "low",
                        count: 1,
                        percentage: 25,
                        color: "text-green-400",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-current ${item.color}`}
                          ></div>
                          <span className="capitalize">{item.level}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{item.count} 用户</span>
                          <div className="w-20 bg-matrix-surface rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-current ${item.color}`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm w-12 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 实时活动监控 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    实时活动监控
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium text-green-400">正常登录</p>
                          <p className="text-sm text-muted-foreground">
                            过去1小时
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-400">
                        1,235
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium text-yellow-400">
                            可疑活动
                          </p>
                          <p className="text-sm text-muted-foreground">
                            过去1小时
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-yellow-400">
                        12
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium text-red-400">高危行为</p>
                          <p className="text-sm text-muted-foreground">
                            过去1小时
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-red-400">3</span>
                    </div>
                  </div>

                  <Button className="w-full bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                    <Eye className="w-4 h-4 mr-2" />
                    查看实时详情
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 时间活动热图 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  24小时活动热图
                </CardTitle>
                <CardDescription>
                  显示用户在不同时间段的活动强度和异常情况
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-matrix-bg/50 rounded-lg border border-matrix-border p-4 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                    <p className="text-lg font-medium text-white">活动热图</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      24小时用户活动分布图表
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 用户画像 */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 用户列表 */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="cyber-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg">用户筛选</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索用户..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <Select
                      value={departmentFilter}
                      onValueChange={setDepartmentFilter}
                    >
                      <SelectTrigger className="bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有部门</SelectItem>
                        <SelectItem value="技术部">技术部</SelectItem>
                        <SelectItem value="财务部">财务部</SelectItem>
                        <SelectItem value="人事部">人事部</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="cyber-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      用户列表 ({filteredUsers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-custom">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                            selectedUser?.id === user.id
                              ? "border-neon-blue/50 bg-neon-blue/10"
                              : "border-matrix-border hover:border-neon-blue/30 hover:bg-matrix-accent/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">
                                  {user.userName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {user.department}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getRiskColor(user.riskLevel)}>
                                {user.riskScore}
                              </Badge>
                              {user.anomalies > 0 && (
                                <p className="text-xs text-red-400 mt-1">
                                  {user.anomalies} 异常
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 用户详情 */}
              <div className="lg:col-span-2 space-y-4">
                {selectedUser ? (
                  <>
                    <Card className="cyber-card-enhanced border-neon-blue/30">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Fingerprint className="w-5 h-5 text-neon-blue" />
                          用户详情 - {selectedUser.userName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              用户ID
                            </p>
                            <p className="font-medium font-mono">
                              {selectedUser.userId}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              所属部门
                            </p>
                            <p className="font-medium">
                              {selectedUser.department}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              风险评分
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-lg">
                                {selectedUser.riskScore}
                              </span>
                              <Badge
                                className={getRiskColor(selectedUser.riskLevel)}
                              >
                                {selectedUser.riskLevel}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              异常次数
                            </p>
                            <p
                              className={`font-medium ${selectedUser.anomalies > 0 ? "text-red-400" : "text-green-400"}`}
                            >
                              {selectedUser.anomalies} 次
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              最后活动
                            </p>
                            <p className="font-medium text-sm">
                              {selectedUser.lastActivity}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              登录位置
                            </p>
                            <p className="font-medium">
                              {selectedUser.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              使用设备
                            </p>
                            <p className="font-medium">{selectedUser.device}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="cyber-card-enhanced">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                          行为基线模式
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-matrix-surface/30 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">
                              常用登录时间
                            </p>
                            <p className="font-medium">
                              {selectedUser.baseline.loginTime}
                            </p>
                          </div>
                          <div className="p-3 bg-matrix-surface/30 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">
                              平均数据使用
                            </p>
                            <p className="font-medium">
                              {selectedUser.baseline.dataUsage} MB/日
                            </p>
                          </div>
                          <div className="p-3 bg-matrix-surface/30 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">
                              访问模式数
                            </p>
                            <p className="font-medium">
                              {selectedUser.baseline.accessPatterns.length} 种
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            常用系统
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.baseline.accessPatterns.map(
                              (pattern, index) => (
                                <Badge
                                  key={index}
                                  className="bg-neon-blue/20 text-neon-blue border-neon-blue/40"
                                >
                                  {pattern}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            size="sm"
                            className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            详细分析
                          </Button>
                          <Button
                            size="sm"
                            className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            调整基线
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="cyber-card-enhanced">
                    <CardContent className="p-12 text-center">
                      <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">
                        选择用户查看详情
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        从左侧列表中选择一个用户来查看详细的行为分析
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 异常检测 */}
          <TabsContent value="anomalies" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    行为异常检测
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select value="all">
                      <SelectTrigger className="w-32 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="严重程度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有级别</SelectItem>
                        <SelectItem value="critical">严重</SelectItem>
                        <SelectItem value="high">高危</SelectItem>
                        <SelectItem value="medium">中危</SelectItem>
                        <SelectItem value="low">低危</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAnomalies.map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border hover:border-neon-blue/30 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle
                              className={`w-5 h-5 ${getSeverityColor(anomaly.severity)}`}
                            />
                            <h3 className="font-medium text-white">
                              {anomaly.type}
                            </h3>
                            <Badge className={getRiskColor(anomaly.severity)}>
                              {anomaly.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              置信度: {anomaly.confidence}%
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {anomaly.description}
                          </p>
                          <p className="text-sm">{anomaly.details}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span>
                              用户: {anomaly.userName} ({anomaly.userId})
                            </span>
                            <span>时间: {anomaly.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500/20 text-red-400 border-red-500/30"
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 行为模式 */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 访问模式分析 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-neon-blue" />
                    访问模式分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        pattern: "邮件系统访问",
                        frequency: 95,
                        trend: "stable",
                      },
                      {
                        pattern: "文件服务器访问",
                        frequency: 78,
                        trend: "increasing",
                      },
                      {
                        pattern: "数据库查询",
                        frequency: 45,
                        trend: "decreasing",
                      },
                      {
                        pattern: "外部网站访问",
                        frequency: 32,
                        trend: "increasing",
                      },
                      {
                        pattern: "移动设备登录",
                        frequency: 18,
                        trend: "stable",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-matrix-surface/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.pattern}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.frequency}%</span>
                            <span
                              className={`text-xs ${
                                item.trend === "increasing"
                                  ? "text-green-400"
                                  : item.trend === "decreasing"
                                    ? "text-red-400"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {item.trend === "increasing"
                                ? "↗"
                                : item.trend === "decreasing"
                                  ? "↘"
                                  : "→"}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-matrix-bg rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-neon-blue to-green-400 h-2 rounded-full"
                            style={{ width: `${item.frequency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 设备使用模式 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-400" />
                    设备使用模式
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        device: "Windows工作站",
                        users: 856,
                        percentage: 68.7,
                        risk: "low",
                      },
                      {
                        device: "MacBook Pro",
                        users: 234,
                        percentage: 18.8,
                        risk: "low",
                      },
                      {
                        device: "移动设备",
                        users: 123,
                        percentage: 9.9,
                        risk: "medium",
                      },
                      {
                        device: "个人电脑",
                        users: 34,
                        percentage: 2.6,
                        risk: "high",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-matrix-surface/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.device}</span>
                            <Badge className={getRiskColor(item.risk)}>
                              {item.risk}
                            </Badge>
                          </div>
                          <span className="text-sm">{item.users} 用户</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.percentage}%</span>
                          <div className="w-20 bg-matrix-bg rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-1.5 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Settings className="w-4 h-4 mr-2" />
                    设备管理策略
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 机器学习模型状态 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  机器学习模型状态
                </CardTitle>
                <CardDescription>
                  行为分析模型的实时状态和性能指标
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg text-center">
                    <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-lg font-bold text-purple-400">94.2%</p>
                    <p className="text-sm text-muted-foreground">准确率</p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                    <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-400">91.7%</p>
                    <p className="text-sm text-muted-foreground">召回率</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                    <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-lg font-bold text-blue-400">2.3s</p>
                    <p className="text-sm text-muted-foreground">响应时间</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                    <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-lg font-bold text-amber-400">1.2M</p>
                    <p className="text-sm text-muted-foreground">训练样本</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
