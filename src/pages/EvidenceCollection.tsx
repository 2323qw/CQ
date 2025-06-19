import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Shield,
  AlertTriangle,
  Clock,
  Globe,
  Download,
  Eye,
  TrendingUp,
  Activity,
  Target,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { PageLayout, StatsCard, Card } from "@/components/PageLayout";
import { useIPInvestigation, AttackEvent } from "@/hooks/useIPInvestigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Timeline,
} from "recharts";

const EvidenceCollection: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialIP = searchParams.get("ip") || "";
  const [searchIP, setSearchIP] = useState(initialIP);
  const [selectedIP, setSelectedIP] = useState(initialIP);

  const { investigation, loading, error, investigateIP, generateReport } =
    useIPInvestigation(selectedIP);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchIP.trim()) {
      setSelectedIP(searchIP.trim());
    }
  };

  const handleDownloadReport = () => {
    const report = generateReport();
    if (report) {
      const reportContent = JSON.stringify(report, null, 2);
      const blob = new Blob([reportContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investigation_report_${selectedIP}_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case "malicious":
        return "text-red-400 bg-red-400/20 border-red-400/40";
      case "suspicious":
        return "text-amber-400 bg-amber-400/20 border-amber-400/40";
      case "unknown":
        return "text-gray-400 bg-gray-400/20 border-gray-400/40";
      case "clean":
        return "text-green-400 bg-green-400/20 border-green-400/40";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/40";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-amber-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "blocked":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "detected":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case "successful":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Prepare chart data
  const attackTypeData = investigation
    ? Object.entries(investigation.attackTypes).map(([type, count]) => ({
        name: type.replace("_", " "),
        value: count,
        count,
      }))
    : [];

  const timelineData = investigation
    ? investigation.timeline
        .slice(0, 10)
        .reverse()
        .map((event, index) => ({
          time: new Date(event.timestamp).toLocaleDateString(),
          attacks: index + 1,
          severity: event.severity,
        }))
    : [];

  const pieColors = [
    "#00f5ff",
    "#39ff14",
    "#bf00ff",
    "#ff1493",
    "#ff6600",
    "#ffff00",
  ];

  return (
    <PageLayout
      title="证据收集与分析"
      subtitle="IP地址威胁调查和攻击行为分析平台"
      icon={FileText}
    >
      {/* Search Section */}
      <Card className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="输入要调查的IP地址..."
              value={searchIP}
              onChange={(e) => setSearchIP(e.target.value)}
              className="bg-matrix-surface border-matrix-border text-white"
            />
          </div>
          <Button
            type="submit"
            className="neon-button-purple px-6"
            disabled={loading}
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? "调查中..." : "开始调查"}
          </Button>
        </form>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-quantum-500/30 border-t-quantum-500 rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-quantum-300">
            正在分析 {selectedIP}
          </h3>
          <p className="text-muted-foreground">收集威胁情报和攻击证据...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">调查失败</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Investigation Results */}
      {investigation && !loading && (
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="风险评分"
              value={investigation.riskScore}
              suffix="/100"
              icon={TrendingUp}
              trend={
                investigation.riskScore > 70
                  ? "up"
                  : investigation.riskScore > 40
                    ? "neutral"
                    : "down"
              }
              className={
                investigation.riskScore > 70
                  ? "border-red-500/30 bg-red-500/10"
                  : investigation.riskScore > 40
                    ? "border-amber-500/30 bg-amber-500/10"
                    : "border-green-500/30 bg-green-500/10"
              }
            />
            <StatsCard
              title="攻击次数"
              value={investigation.totalAttacks}
              icon={Target}
              trend="up"
              className="border-quantum-500/30 bg-quantum-500/10"
            />
            <StatsCard
              title="攻击类型"
              value={Object.keys(investigation.attackTypes).length}
              icon={Activity}
              trend="neutral"
              className="border-neural-500/30 bg-neural-500/10"
            />
            <StatsCard
              title="活跃天数"
              value={Math.ceil(
                (new Date(investigation.lastActivity).getTime() -
                  new Date(investigation.firstSeen).getTime()) /
                  (1000 * 60 * 60 * 24),
              )}
              icon={Clock}
              trend="up"
              className="border-tech-accent/30 bg-tech-accent/10"
            />
          </div>

          {/* IP Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-tech-accent" />
                IP 基础信息
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">IP 地址</span>
                  <span className="font-mono text-tech-accent">
                    {investigation.ip}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">声誉状态</span>
                  <Badge
                    className={getReputationColor(investigation.reputation)}
                  >
                    {investigation.reputation === "malicious"
                      ? "恶意"
                      : investigation.reputation === "suspicious"
                        ? "可疑"
                        : investigation.reputation === "clean"
                          ? "干净"
                          : "未知"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">地理位置</span>
                  <div className="text-right">
                    <div>{investigation.country}</div>
                    <div className="text-sm text-muted-foreground">
                      {investigation.geolocation.city}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">组织</span>
                  <span>{investigation.organization}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">首次发现</span>
                  <span>
                    {new Date(investigation.firstSeen).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">最后活动</span>
                  <span>
                    {new Date(investigation.lastActivity).toLocaleString()}
                  </span>
                </div>
                {investigation.isVPN && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">VPN 检测</span>
                    <Badge className="text-amber-400 bg-amber-400/20 border-amber-400/40">
                      VPN
                    </Badge>
                  </div>
                )}
                {investigation.isTor && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tor 检测</span>
                    <Badge className="text-red-400 bg-red-400/20 border-red-400/40">
                      Tor
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-quantum-500" />
                攻击类型分布
              </h3>
              {attackTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attackTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {attackTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  暂无攻击数据
                </div>
              )}
            </Card>
          </div>

          {/* Attack Timeline */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-neural-500" />
                攻击时间线
              </h3>
              <Button
                onClick={handleDownloadReport}
                className="neon-button-green"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                下载报告
              </Button>
            </div>

            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="time"
                    stroke="#9ca3af"
                    tick={{ fill: "#9ca3af" }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar dataKey="attacks" fill="#00f5ff" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                暂无时间线数据
              </div>
            )}
          </Card>

          {/* Detailed Attack Log */}
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-tech-accent" />
              详细攻击记录
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-matrix-border">
                    <th className="text-left py-3 px-4 text-muted-foreground">
                      时间
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground">
                      类型
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground">
                      严重程度
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground">
                      目标
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground">
                      状态
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground">
                      详情
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {investigation.timeline
                    .slice(0, 10)
                    .map((event: AttackEvent) => (
                      <tr
                        key={event.id}
                        className="border-b border-matrix-border/50 hover:bg-matrix-surface/50"
                      >
                        <td className="py-3 px-4 text-sm font-mono">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-quantum-500/20 text-quantum-300 border-quantum-500/40">
                            {event.type.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${getSeverityColor(event.severity)}`}
                          >
                            {event.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {event.target}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(event.status)}
                            {event.status}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">
                          {event.details}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* No Investigation State */}
      {!selectedIP && !loading && (
        <Card className="text-center py-12">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            开始威胁调查
          </h3>
          <p className="text-muted-foreground">
            输入IP地址开始收集证据和分析攻击行为
          </p>
        </Card>
      )}
    </PageLayout>
  );
};

export default EvidenceCollection;
