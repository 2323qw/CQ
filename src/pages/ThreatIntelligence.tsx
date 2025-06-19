import { useState } from "react";
import {
  Shield,
  Globe,
  AlertTriangle,
  TrendingUp,
  Search,
  Eye,
  ExternalLink,
  MapPin,
  Clock,
  Users,
  Activity,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InvestigationTrigger } from "@/components/InvestigationTrigger";
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

interface ThreatData {
  id: string;
  name: string;
  type: "malware" | "phishing" | "ddos" | "vulnerability" | "botnet";
  severity: "critical" | "high" | "medium" | "low";
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  source: string;
  description: string;
  indicators: string[];
  geolocation: string;
  campaign?: string;
}

const mockThreats: ThreatData[] = [
  {
    id: "1",
    name: "APT29 Cozy Bear",
    type: "malware",
    severity: "critical",
    confidence: 95,
    firstSeen: "2024-01-10",
    lastSeen: "2024-01-15",
    source: "FireEye",
    description:
      "高级持续性威胁组织，疑似与国家级别攻击相关，主要针对政府和企业目标",
    indicators: ["192.168.1.100", "malicious.exe", "C2.example.com"],
    geolocation: "俄罗斯",
    campaign: "Operation Ghost",
  },
  {
    id: "2",
    name: "Zeus Banking Trojan",
    type: "malware",
    severity: "high",
    confidence: 89,
    firstSeen: "2024-01-12",
    lastSeen: "2024-01-15",
    source: "Symantec",
    description: "银行木马变种，专门窃取金融机构和用户的敏感信息",
    indicators: ["203.45.67.89", "zeus.dll", "banking-trojan.com"],
    geolocation: "美国",
  },
  {
    id: "3",
    name: "COVID-19 Phishing Campaign",
    type: "phishing",
    severity: "medium",
    confidence: 78,
    firstSeen: "2024-01-08",
    lastSeen: "2024-01-14",
    source: "IBM X-Force",
    description: "利用COVID-19疫情话题的钓鱼邮件活动，诱导用户点击恶意链接",
    indicators: ["covid-relief.fake.com", "pandemic@scam.com", "relief.exe"],
    geolocation: "中国",
    campaign: "Corona Scam",
  },
  {
    id: "4",
    name: "CVE-2024-0001 Remote Code Execution",
    type: "vulnerability",
    severity: "critical",
    confidence: 100,
    firstSeen: "2024-01-05",
    lastSeen: "2024-01-15",
    source: "NIST NVD",
    description:
      "Apache服务器远程代码执行漏洞，允许攻击者在目标系统上执行任意代码",
    indicators: ["/admin/config.php", "Apache/2.4.41", "exploit-kit.js"],
    geolocation: "全球",
  },
];

// 威胁趋势数据
const threatTrendData = [
  { month: "1月", malware: 45, phishing: 32, ddos: 28, vulnerability: 15 },
  { month: "2月", malware: 52, phishing: 41, ddos: 31, vulnerability: 22 },
  { month: "3月", malware: 38, phishing: 48, ddos: 25, vulnerability: 18 },
  { month: "4月", malware: 61, phishing: 35, ddos: 42, vulnerability: 28 },
  { month: "5月", malware: 55, phishing: 52, ddos: 38, vulnerability: 31 },
  { month: "6月", malware: 48, phishing: 46, ddos: 33, vulnerability: 25 },
];

// 威胁类型分布
const threatTypeData = [
  { name: "恶意软件", value: 35, color: "#ff0040" },
  { name: "钓鱼攻击", value: 28, color: "#ff6600" },
  { name: "DDoS攻击", value: 22, color: "#ffcc00" },
  { name: "漏洞利用", value: 15, color: "#39ff14" },
];

// 地理分布数据
const geoData = [
  { country: "美国", threats: 156, color: "#ff0040" },
  { country: "中国", threats: 134, color: "#ff6600" },
  { country: "俄罗斯", threats: 98, color: "#ffcc00" },
  { country: "德国", threats: 67, color: "#39ff14" },
  { country: "英国", threats: 45, color: "#00f5ff" },
  { country: "其他", threats: 89, color: "#bf00ff" },
];

export default function ThreatIntelligence() {
  const [threats, setThreats] = useState<ThreatData[]>(mockThreats);
  const [selectedThreat, setSelectedThreat] = useState<ThreatData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.indicators.some((indicator) =>
        indicator.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesSeverity =
      severityFilter === "all" || threat.severity === severityFilter;
    const matchesType = typeFilter === "all" || threat.type === typeFilter;

    return matchesSearch && matchesSeverity && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-threat-critical bg-threat-critical/20 border-threat-critical/30";
      case "high":
        return "text-threat-high bg-threat-high/20 border-threat-high/30";
      case "medium":
        return "text-threat-medium bg-threat-medium/20 border-threat-medium/30";
      case "low":
        return "text-threat-low bg-threat-low/20 border-threat-low/30";
      default:
        return "text-muted-foreground bg-muted/20 border-muted/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "malware":
        return <AlertTriangle className="w-4 h-4" />;
      case "phishing":
        return <Users className="w-4 h-4" />;
      case "ddos":
        return <Activity className="w-4 h-4" />;
      case "vulnerability":
        return <Shield className="w-4 h-4" />;
      case "botnet":
        return <Globe className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "malware":
        return "恶意软件";
      case "phishing":
        return "钓鱼攻击";
      case "ddos":
        return "DDoS攻击";
      case "vulnerability":
        return "漏洞利用";
      case "botnet":
        return "僵尸网络";
      default:
        return "未知";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "critical":
        return "严重";
      case "high":
        return "高危";
      case "medium":
        return "中危";
      case "low":
        return "低危";
      default:
        return "未知";
    }
  };

  return (
    <div className="p-8 min-h-screen matrix-bg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white glow-text mb-2">
          威胁情报中心
        </h1>
        <p className="text-muted-foreground">
          全球威胁情报分析，实时监控最新安全威胁和攻击趋势
        </p>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="cyber-card p-6 border-l-4 border-l-threat-critical">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">活跃威胁</p>
              <p className="text-2xl font-bold text-threat-critical glow-text">
                {threats.length}
              </p>
              <p className="text-xs text-threat-critical">+12% 本周</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-threat-critical" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-threat-high">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">高危威胁</p>
              <p className="text-2xl font-bold text-threat-high glow-text">
                {
                  threats.filter(
                    (t) => t.severity === "critical" || t.severity === "high",
                  ).length
                }
              </p>
              <p className="text-xs text-threat-high">需要关注</p>
            </div>
            <Shield className="w-8 h-8 text-threat-high" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-neon-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">情报源</p>
              <p className="text-2xl font-bold text-neon-blue glow-text">15</p>
              <p className="text-xs text-neon-green">全部在线</p>
            </div>
            <Database className="w-8 h-8 text-neon-blue" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-neon-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">覆盖国家</p>
              <p className="text-2xl font-bold text-neon-green glow-text">
                156
              </p>
              <p className="text-xs text-neon-green">全球监控</p>
            </div>
            <Globe className="w-8 h-8 text-neon-green" />
          </div>
        </div>
      </div>

      {/* 威胁趋势图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-neon-blue" />
            <span>威胁趋势分析</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={threatTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="malware"
                  stroke="#ff0040"
                  strokeWidth={2}
                  name="恶意软件"
                />
                <Line
                  type="monotone"
                  dataKey="phishing"
                  stroke="#ff6600"
                  strokeWidth={2}
                  name="钓鱼攻击"
                />
                <Line
                  type="monotone"
                  dataKey="ddos"
                  stroke="#ffcc00"
                  strokeWidth={2}
                  name="DDoS攻击"
                />
                <Line
                  type="monotone"
                  dataKey="vulnerability"
                  stroke="#39ff14"
                  strokeWidth={2}
                  name="漏洞利用"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-threat-critical" />
            <span>威胁类型分布</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {threatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="cyber-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="搜索威胁名称、描述或指标..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white"
          >
            <option value="all">所有严重程度</option>
            <option value="critical">严重</option>
            <option value="high">高危</option>
            <option value="medium">中危</option>
            <option value="low">低危</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white"
          >
            <option value="all">所有类型</option>
            <option value="malware">恶意软件</option>
            <option value="phishing">钓鱼攻击</option>
            <option value="ddos">DDoS攻击</option>
            <option value="vulnerability">漏洞利用</option>
            <option value="botnet">僵尸网络</option>
          </select>
        </div>
      </div>

      {/* 威胁列表 */}
      <div className="cyber-card">
        <div className="p-6 border-b border-matrix-border">
          <h3 className="text-lg font-semibold text-white">
            威胁情报 ({filteredThreats.length})
          </h3>
        </div>

        <div className="divide-y divide-matrix-border/50">
          {filteredThreats.map((threat) => (
            <div
              key={threat.id}
              className="p-6 hover:bg-matrix-accent/30 transition-colors cursor-pointer"
              onClick={() => setSelectedThreat(threat)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(threat.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      {threat.name}
                    </h4>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs border",
                        getSeverityColor(threat.severity),
                      )}
                    >
                      {getSeverityText(threat.severity)}
                    </span>
                    <span className="text-xs text-muted-foreground bg-matrix-surface px-2 py-1 rounded">
                      {getTypeText(threat.type)}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-neon-blue">
                      <span>置信度: {threat.confidence}%</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-3">
                    {threat.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>首次发现: {threat.firstSeen}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{threat.geolocation}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Database className="w-4 h-4" />
                      <span>来源: {threat.source}</span>
                    </div>
                    {threat.campaign && (
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>活动: {threat.campaign}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      威胁指标:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {threat.indicators.slice(0, 3).map((indicator, index) => (
                        <span
                          key={index}
                          className="text-xs bg-matrix-surface text-neon-blue px-2 py-1 rounded font-mono"
                        >
                          {indicator}
                        </span>
                      ))}
                      {threat.indicators.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{threat.indicators.length - 3} 更多
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button className="text-neon-blue hover:text-white transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 威胁详情弹窗 */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedThreat(null)}
          />
          <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="cyber-card border-2 border-neon-blue/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {selectedThreat.name}
                </h3>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-muted-foreground hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">
                      威胁描述
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedThreat.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">
                      威胁指标 (IOCs)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedThreat.indicators.map((indicator, index) => (
                        <div
                          key={index}
                          className="bg-matrix-surface p-3 rounded flex items-center justify-between"
                        >
                          <code className="text-neon-blue font-mono">
                            {indicator}
                          </code>
                          {/* 检查是否为IP地址格式 */}
                          {/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(
                            indicator,
                          ) && (
                            <InvestigationTrigger
                              ip={indicator}
                              variant="icon"
                              className="ml-2"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-matrix-surface rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      基本信息
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">类型:</span>
                        <span className="text-white">
                          {getTypeText(selectedThreat.type)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">严重程度:</span>
                        <span
                          className={
                            getSeverityColor(selectedThreat.severity).split(
                              " ",
                            )[0]
                          }
                        >
                          {getSeverityText(selectedThreat.severity)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">置信度:</span>
                        <span className="text-white">
                          {selectedThreat.confidence}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          首���发现:
                        </span>
                        <span className="text-white">
                          {selectedThreat.firstSeen}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">最后发现:</span>
                        <span className="text-white">
                          {selectedThreat.lastSeen}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">地理位置:</span>
                        <span className="text-white">
                          {selectedThreat.geolocation}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">情报源:</span>
                        <span className="text-white">
                          {selectedThreat.source}
                        </span>
                      </div>
                      {selectedThreat.campaign && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            攻击活动:
                          </span>
                          <span className="text-white">
                            {selectedThreat.campaign}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full neon-button flex items-center justify-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>查看完整报告</span>
                    </button>
                    <button className="w-full bg-threat-critical/10 border border-threat-critical text-threat-critical hover:bg-threat-critical/20 px-4 py-2 rounded transition-colors">
                      添加到阻断列表
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
