import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  History,
  Plus,
  Trash2,
  Share2,
  BookmarkPlus,
  AlertTriangle,
  RefreshCw,
  Settings,
  FileText,
  Database,
  Target,
  Shield,
  Eye,
  Brain,
  Zap,
  Activity,
  Globe,
  Network,
  Bug,
  FileSearch,
  Clock,
  TrendingUp,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { PageLayout, StatsCard, Card } from "@/components/PageLayout";
import { useIPInvestigation } from "@/hooks/useIPInvestigation";
import { useAdvancedInvestigation } from "@/hooks/useAdvancedInvestigation";
import { AdvancedInvestigationPanel } from "@/components/AdvancedInvestigationPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface InvestigationHistory {
  id: string;
  ip: string;
  timestamp: string;
  riskScore: number;
  status: "completed" | "failed" | "in-progress";
  duration: number;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: {
    riskLevel: string;
    timeRange: string;
    attackTypes: string[];
  };
}

const EvidenceCollection: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialIP = searchParams.get("ip") || "";
  const mode = searchParams.get("mode") || "basic";

  // State management
  const [searchIP, setSearchIP] = useState(initialIP);
  const [selectedIP, setSelectedIP] = useState(initialIP);
  const [investigationMode, setInvestigationMode] = useState<
    "basic" | "advanced"
  >(mode === "advanced" ? "advanced" : "basic");
  const [activeTab, setActiveTab] = useState("search");
  const [isLoading, setIsLoading] = useState(false);
  const [batchIPs, setBatchIPs] = useState<string[]>([]);
  const [newBatchIP, setNewBatchIP] = useState("");

  // Investigation history
  const [investigationHistory, setInvestigationHistory] = useState<
    InvestigationHistory[]
  >([
    {
      id: "1",
      ip: "192.168.1.100",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      riskScore: 85,
      status: "completed",
      duration: 45,
    },
    {
      id: "2",
      ip: "10.0.0.5",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      riskScore: 23,
      status: "completed",
      duration: 32,
    },
    {
      id: "3",
      ip: "203.45.67.89",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      riskScore: 67,
      status: "failed",
      duration: 0,
    },
  ]);

  // Saved filters
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    {
      id: "1",
      name: "高风险IP",
      filters: {
        riskLevel: "high",
        timeRange: "7d",
        attackTypes: ["malware", "ddos"],
      },
    },
    {
      id: "2",
      name: "最近威胁",
      filters: {
        riskLevel: "all",
        timeRange: "1d",
        attackTypes: [],
      },
    },
  ]);

  // Hooks
  const {
    investigation: basicInvestigation,
    loading: basicLoading,
    error: basicError,
    investigateIP: basicInvestigateIP,
    generateReport: basicGenerateReport,
  } = useIPInvestigation(selectedIP);

  const {
    investigation: advancedInvestigation,
    loading: advancedLoading,
    error: advancedError,
    investigateIP: advancedInvestigateIP,
    exportInvestigation,
  } = useAdvancedInvestigation(
    investigationMode === "advanced" ? selectedIP : undefined,
  );

  // Current investigation data
  const currentInvestigation = useMemo(() => {
    if (investigationMode === "advanced") {
      return advancedInvestigation;
    }
    return basicInvestigation;
  }, [investigationMode, advancedInvestigation, basicInvestigation]);

  const isCurrentlyLoading = useMemo(() => {
    return investigationMode === "advanced" ? advancedLoading : basicLoading;
  }, [investigationMode, advancedLoading, basicLoading]);

  const currentError = useMemo(() => {
    return investigationMode === "advanced" ? advancedError : basicError;
  }, [investigationMode, advancedError, basicError]);

  // Event handlers
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchIP.trim()) {
      setSelectedIP(searchIP.trim());
      // Update URL
      setSearchParams({
        ip: searchIP.trim(),
        mode: investigationMode,
      });

      // Add to history
      const newHistoryItem: InvestigationHistory = {
        id: Date.now().toString(),
        ip: searchIP.trim(),
        timestamp: new Date().toISOString(),
        riskScore: 0,
        status: "in-progress",
        duration: 0,
      };
      setInvestigationHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
    }
  };

  const handleModeSwitch = (mode: "basic" | "advanced") => {
    setInvestigationMode(mode);
    setSearchParams({
      ip: selectedIP,
      mode: mode,
    });
  };

  const handleBatchAdd = () => {
    if (newBatchIP.trim() && !batchIPs.includes(newBatchIP.trim())) {
      setBatchIPs([...batchIPs, newBatchIP.trim()]);
      setNewBatchIP("");
    }
  };

  const handleBatchRemove = (ip: string) => {
    setBatchIPs(batchIPs.filter((batchIP) => batchIP !== ip));
  };

  const handleBatchInvestigate = async () => {
    setIsLoading(true);
    // Simulate batch investigation
    for (const ip of batchIPs) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Investigating ${ip}...`);
    }
    setIsLoading(false);
  };

  const handleHistoryItemClick = (historyItem: InvestigationHistory) => {
    setSearchIP(historyItem.ip);
    setSelectedIP(historyItem.ip);
    setSearchParams({
      ip: historyItem.ip,
      mode: investigationMode,
    });
  };

  const handleExport = (format: string) => {
    if (investigationMode === "advanced" && advancedInvestigation) {
      exportInvestigation(format);
    } else if (investigationMode === "basic" && basicInvestigation) {
      const report = basicGenerateReport();
      if (report) {
        const content = JSON.stringify(report, null, 2);
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `investigation_${selectedIP}_${new Date().toISOString().split("T")[0]}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleSaveFilter = () => {
    // Implementation for saving current filter settings
    console.log("Save current filter settings");
  };

  // Update investigation history when investigation completes
  useEffect(() => {
    if (currentInvestigation && selectedIP) {
      setInvestigationHistory((prev) =>
        prev.map((item) =>
          item.ip === selectedIP && item.status === "in-progress"
            ? {
                ...item,
                riskScore:
                  investigationMode === "advanced"
                    ? (currentInvestigation as any).basicInfo?.riskScore || 0
                    : (currentInvestigation as any).riskScore || 0,
                status: "completed" as const,
                duration: Math.floor(Math.random() * 60) + 15,
              }
            : item,
        ),
      );
    }
  }, [currentInvestigation, selectedIP, investigationMode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/20";
      case "failed":
        return "text-red-400 bg-red-400/20";
      case "in-progress":
        return "text-amber-400 bg-amber-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 80) return "text-red-400";
    if (score >= 60) return "text-orange-400";
    if (score >= 40) return "text-amber-400";
    return "text-green-400";
  };

  return (
    <PageLayout
      title="证据收集与威胁调查"
      subtitle="高级IP威胁分析和取证调查平台"
      icon={FileSearch}
    >
      {/* 快速统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="今日调查"
          value={
            investigationHistory.filter((h) =>
              h.timestamp.startsWith(new Date().toISOString().split("T")[0]),
            ).length
          }
          icon={Search}
          trend="up"
          className="border-tech-accent/30 bg-tech-accent/10"
        />
        <StatsCard
          title="高风险发现"
          value={investigationHistory.filter((h) => h.riskScore > 70).length}
          icon={AlertTriangle}
          trend="up"
          className="border-red-500/30 bg-red-500/10"
        />
        <StatsCard
          title="平均调查时间"
          value={Math.round(
            investigationHistory
              .filter((h) => h.status === "completed")
              .reduce((sum, h) => sum + h.duration, 0) /
              investigationHistory.filter((h) => h.status === "completed")
                .length || 1,
          )}
          suffix="秒"
          icon={Clock}
          trend="down"
          className="border-quantum-500/30 bg-quantum-500/10"
        />
        <StatsCard
          title="成功率"
          value={Math.round(
            (investigationHistory.filter((h) => h.status === "completed")
              .length /
              investigationHistory.length) *
              100,
          )}
          suffix="%"
          icon={CheckCircle}
          trend="up"
          className="border-green-500/30 bg-green-500/10"
        />
      </div>

      {/* 主要标签页导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-matrix-surface border border-matrix-border mb-6">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            单IP调查
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            批量调查
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            调查历史
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选器
          </TabsTrigger>
        </TabsList>

        {/* 单IP调查标签页 */}
        <TabsContent value="search" className="space-y-6">
          {/* 搜索控制面板 */}
          <Card>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="输入要调查的IP地址 (例如: 192.168.1.100)"
                    value={searchIP}
                    onChange={(e) => setSearchIP(e.target.value)}
                    className="bg-matrix-surface border-matrix-border text-white"
                  />
                </div>
                <Select
                  value={investigationMode}
                  onValueChange={(value: "basic" | "advanced") =>
                    handleModeSwitch(value)
                  }
                >
                  <SelectTrigger className="w-32 bg-matrix-surface border-matrix-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">基础模式</SelectItem>
                    <SelectItem value="advanced">高级模式</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  className="neon-button-purple px-6"
                  disabled={isCurrentlyLoading}
                >
                  {isCurrentlyLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {isCurrentlyLoading ? "调查中..." : "开始调查"}
                </Button>
              </div>

              {/* 快捷操作 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "px-2 py-1",
                      investigationMode === "advanced"
                        ? "bg-quantum-500/20 text-quantum-400 border-quantum-500/40"
                        : "bg-tech-accent/20 text-tech-accent border-tech-accent/40",
                    )}
                  >
                    {investigationMode === "advanced" ? "高级模式" : "基础模式"}
                  </Badge>
                  {selectedIP && (
                    <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/40">
                      调查目标: {selectedIP}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="neon-button-green"
                        disabled={!currentInvestigation}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        导出
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExport("JSON")}>
                        JSON格式
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("CSV")}>
                        CSV格式
                      </DropdownMenuItem>
                      {investigationMode === "advanced" && (
                        <>
                          <DropdownMenuItem onClick={() => handleExport("PDF")}>
                            PDF报告
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport("XML")}>
                            XML格式
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    className="neon-button"
                    disabled={!currentInvestigation}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                  <Button
                    size="sm"
                    className="neon-button"
                    disabled={!currentInvestigation}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    分享
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* 加载状态 */}
          {isCurrentlyLoading && (
            <Card className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-quantum-500/30 border-t-quantum-500 rounded-full animate-spin"></div>
                  <Brain className="w-8 h-8 text-quantum-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-quantum-300">
                    正在深度分析 {selectedIP}
                  </h3>
                  <p className="text-muted-foreground">
                    {investigationMode === "advanced"
                      ? "执行高级威胁分析、取证调查和恶意软件检测..."
                      : "收集威胁情报和攻击证据..."}
                  </p>
                  <div className="mt-4 w-64 bg-matrix-surface rounded-full h-2 mx-auto">
                    <div className="bg-quantum-500 h-2 rounded-full animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 错误状态 */}
          {currentError && (
            <Card className="border-red-500/30 bg-red-500/10">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">调查失败</h3>
                  <p className="text-sm">{currentError}</p>
                </div>
              </div>
            </Card>
          )}

          {/* 调查结果展示 */}
          {currentInvestigation && !isCurrentlyLoading && (
            <div className="space-y-6">
              {investigationMode === "advanced" && advancedInvestigation ? (
                <AdvancedInvestigationPanel
                  investigation={advancedInvestigation}
                  onExport={handleExport}
                />
              ) : (
                basicInvestigation && (
                  // 基础模式的简化显示
                  <Card>
                    <h3 className="text-xl font-semibold text-white mb-6">
                      基础调查结果
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-quantum-400">
                          {basicInvestigation.riskScore}/100
                        </div>
                        <div className="text-sm text-muted-foreground">
                          风险评分
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-tech-accent">
                          {basicInvestigation.totalAttacks}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          攻击次数
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neural-500">
                          {Object.keys(basicInvestigation.attackTypes).length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          攻击类型
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-400">
                          {basicInvestigation.country}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          来源地区
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={() => handleModeSwitch("advanced")}
                        className="neon-button-purple"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        切换到高级模式查看详细分析
                      </Button>
                    </div>
                  </Card>
                )
              )}
            </div>
          )}

          {/* 无调查状态 */}
          {!selectedIP && !isCurrentlyLoading && (
            <Card className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-quantum-500 to-neural-500 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    开始威胁调查
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    输入IP地址开始深度安全分析和取证调查
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-tech-accent" />
                      <span>威胁检测</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-quantum-500" />
                      <span>网络分析</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bug className="w-4 h-4 text-neural-500" />
                      <span>恶意软件扫描</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* 批量调查标签页 */}
        <TabsContent value="batch" className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-tech-accent" />
              批量IP调查
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="输入IP地址"
                  value={newBatchIP}
                  onChange={(e) => setNewBatchIP(e.target.value)}
                  className="bg-matrix-surface border-matrix-border text-white"
                  onKeyPress={(e) => e.key === "Enter" && handleBatchAdd()}
                />
                <Button onClick={handleBatchAdd} className="neon-button">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {batchIPs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-white">
                    待调查IP列表 ({batchIPs.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {batchIPs.map((ip, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-matrix-surface/50 rounded"
                      >
                        <span className="font-mono text-neon-blue">{ip}</span>
                        <Button
                          size="sm"
                          onClick={() => handleBatchRemove(ip)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleBatchInvestigate}
                      disabled={isLoading}
                      className="neon-button-purple"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      开始批量调查
                    </Button>
                    <Button
                      onClick={() => setBatchIPs([])}
                      className="neon-button"
                    >
                      清空列表
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* 调查历史标签页 */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-quantum-500" />
              调查历史记录
            </h3>
            <div className="space-y-3">
              {investigationHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded cursor-pointer hover:bg-matrix-surface/80 transition-all"
                  onClick={() => handleHistoryItemClick(item)}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-neon-blue">{item.ip}</span>
                    <Badge
                      className={cn("px-2 py-1", getStatusColor(item.status))}
                    >
                      {item.status === "completed"
                        ? "已完成"
                        : item.status === "failed"
                          ? "失败"
                          : "进行中"}
                    </Badge>
                    {item.status === "completed" && (
                      <span
                        className={cn(
                          "font-medium",
                          getRiskLevelColor(item.riskScore),
                        )}
                      >
                        风险: {item.riskScore}/100
                      </span>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{new Date(item.timestamp).toLocaleString()}</div>
                    {item.status === "completed" && (
                      <div>用时: {item.duration}秒</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 筛选器标签页 */}
        <TabsContent value="filters" className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-tech-accent" />
              保存的筛选器
            </h3>
            <div className="space-y-3">
              {savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between p-3 bg-matrix-surface/50 rounded"
                >
                  <div>
                    <h4 className="font-medium text-white">{filter.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-tech-accent/20 text-tech-accent border-tech-accent/40">
                        {filter.filters.riskLevel}
                      </Badge>
                      <Badge className="bg-quantum-500/20 text-quantum-400 border-quantum-500/40">
                        {filter.filters.timeRange}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="neon-button">
                      应用
                    </Button>
                    <Button
                      size="sm"
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleSaveFilter} className="neon-button-green">
              <Plus className="w-4 h-4 mr-2" />
              保存当前筛选器
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default EvidenceCollection;
