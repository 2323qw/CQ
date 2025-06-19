import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Shield,
  AlertTriangle,
  Eye,
  Activity,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageLayout, StatsCard, Card } from "@/components/PageLayout";

// 模拟威胁趋势数据
const threatTrendData = [
  { month: "1月", threats: 234, blocked: 187, resolved: 201 },
  { month: "2月", threats: 287, blocked: 234, resolved: 245 },
  { month: "3月", threats: 312, blocked: 267, resolved: 289 },
  { month: "4月", threats: 289, blocked: 245, resolved: 267 },
  { month: "5月", threats: 356, blocked: 298, resolved: 334 },
  { month: "6月", threats: 423, blocked: 367, resolved: 398 },
];

// 威胁类型分布数据
const threatTypeData = [
  { name: "恶意软件", value: 35 },
  { name: "钓鱼攻击", value: 28 },
  { name: "DDoS", value: 18 },
  { name: "SQL注入", value: 12 },
  { name: "其他", value: 7 },
];

// 安全评分数据
const securityScoreData = [
  { category: "网络安全", score: 85 },
  { category: "数据保护", score: 92 },
  { category: "访问控制", score: 78 },
  { category: "合规性", score: 88 },
  { category: "威胁检测", score: 94 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// 报告数据
const reports = [
  {
    id: "1",
    title: "月度安全评估报告",
    description: "2024年1月系统安全状况综合评估",
    type: "security",
    generated: "2024-01-15 10:30:00",
    status: "completed",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "合规性检查报告",
    description: "ISO 27001 合规性检查结果",
    type: "compliance",
    generated: "2024-01-12 14:20:00",
    status: "completed",
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "威胁情报分析报告",
    description: "本月威胁情报收集与分析总结",
    type: "incident",
    generated: "2024-01-10 09:15:00",
    status: "completed",
    size: "3.2 MB",
  },
  {
    id: "4",
    title: "实时监控报告",
    description: "当前系统实时监控数据汇总",
    type: "realtime",
    generated: "正在生成...",
    status: "generating",
    size: "-",
  },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl">
        <p className="text-blue-400 font-medium text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [reportType, setReportType] = useState("all");

  const filteredReports = reports.filter(
    (report) => reportType === "all" || report.type === reportType,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "generating":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "generating":
        return "生成中";
      case "failed":
        return "生成失败";
      default:
        return status;
    }
  };

  return (
    <PageLayout
      title="安全报告中心"
      description="生成和查看系统安全分析报告、威胁趋势和合规性检查"
      icon={FileText}
      headerActions={
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
            <Download className="w-4 h-4" />
            <span>导出报告</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="本月威胁"
            value="1,234"
            subtitle="检测到的威胁总数"
            icon={Shield}
            color="blue"
            trend={{ value: 12, direction: "up" }}
          />
          <StatsCard
            title="已阻止"
            value="987"
            subtitle="成功拦截的威胁"
            icon={Shield}
            color="emerald"
            trend={{ value: 8, direction: "up" }}
          />
          <StatsCard
            title="待处理"
            value="67"
            subtitle="需要人工干预"
            icon={AlertTriangle}
            color="amber"
            trend={{ value: 5, direction: "down" }}
          />
          <StatsCard
            title="报告生成"
            value="45"
            subtitle="本月生成的报告"
            icon={FileText}
            color="purple"
            trend={{ value: 15, direction: "up" }}
          />
        </div>

        {/* 威胁趋势分析 */}
        <Card
          title="威胁趋势分析"
          description="系统威胁检测和处理的时间趋势"
          actions={
            <div className="flex space-x-2">
              {["week", "month", "quarter", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedPeriod === period
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
                  }`}
                >
                  {period === "week"
                    ? "本周"
                    : period === "month"
                      ? "本月"
                      : period === "quarter"
                        ? "本季度"
                        : "本年"}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={threatTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#3b82f6" }}
                  name="检测威胁"
                />
                <Line
                  type="monotone"
                  dataKey="blocked"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#10b981" }}
                  name="成功阻止"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#8b5cf6" }}
                  name="已处理"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 详细分析图表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="威胁类型分布" description="各类威胁的检测比例">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {threatTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="系统安全评分" description="基于多维度指标的综合评分">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={securityScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {securityScoreData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* 报告列表 */}
        <Card
          title="生成的报告"
          description="查看和下载历史安全报告"
          actions={
            <div className="flex items-center space-x-4">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">全部类型</option>
                <option value="security">安全���告</option>
                <option value="compliance">合规报告</option>
                <option value="incident">事件报告</option>
                <option value="realtime">实时报告</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-200">
                <FileText className="w-4 h-4" />
                <span>生成新报告</span>
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="group p-6 bg-slate-800/30 hover:bg-slate-700/30 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-slate-400 mt-1">
                        {report.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{report.generated}</span>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(report.status)}`}
                        >
                          {getStatusText(report.status)}
                        </span>
                        {report.size !== "-" && (
                          <span className="text-sm text-slate-400">
                            {report.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                      title="查看报告"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all duration-200"
                      title="下载报告"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 无数据状态 */}
          {filteredReports.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                暂无相关报告
              </h3>
              <p className="text-slate-400">请尝试调整筛选条件或生成新报告</p>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
