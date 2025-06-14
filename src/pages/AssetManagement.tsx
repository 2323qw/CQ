import { useState } from "react";
import {
  Server,
  Monitor,
  Smartphone,
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Asset {
  id: string;
  name: string;
  type: "server" | "workstation" | "mobile" | "network" | "iot";
  ip: string;
  mac: string;
  os: string;
  location: string;
  owner: string;
  status: "online" | "offline" | "maintenance" | "vulnerable";
  riskLevel: "critical" | "high" | "medium" | "low";
  lastSeen: string;
  vulnerabilities: number;
  cpu?: number;
  memory?: number;
  disk?: number;
  criticality: "critical" | "high" | "medium" | "low";
}

const mockAssets: Asset[] = [
  {
    id: "1",
    name: "WEB-SERVER-01",
    type: "server",
    ip: "192.168.1.10",
    mac: "AA:BB:CC:DD:EE:01",
    os: "Ubuntu 20.04 LTS",
    location: "数据中心-机房A",
    owner: "IT运维部",
    status: "online",
    riskLevel: "medium",
    lastSeen: "2024-01-15 14:30:25",
    vulnerabilities: 3,
    cpu: 45,
    memory: 67,
    disk: 23,
    criticality: "critical",
  },
  {
    id: "2",
    name: "DB-SERVER-02",
    type: "server",
    ip: "192.168.1.20",
    mac: "AA:BB:CC:DD:EE:02",
    os: "Windows Server 2019",
    location: "数据中心-机房A",
    owner: "数据库管理员",
    status: "online",
    riskLevel: "high",
    lastSeen: "2024-01-15 14:29:18",
    vulnerabilities: 7,
    cpu: 78,
    memory: 89,
    disk: 56,
    criticality: "critical",
  },
  {
    id: "3",
    name: "ADMIN-PC-001",
    type: "workstation",
    ip: "192.168.2.45",
    mac: "AA:BB:CC:DD:EE:03",
    os: "Windows 11 Pro",
    location: "办公室-3楼",
    owner: "张三",
    status: "offline",
    riskLevel: "low",
    lastSeen: "2024-01-15 18:00:00",
    vulnerabilities: 1,
    criticality: "medium",
  },
  {
    id: "4",
    name: "SWITCH-CORE-01",
    type: "network",
    ip: "192.168.1.1",
    mac: "AA:BB:CC:DD:EE:04",
    os: "Cisco IOS 15.2",
    location: "数据中心-网络机房",
    owner: "网络管理员",
    status: "online",
    riskLevel: "critical",
    lastSeen: "2024-01-15 14:31:42",
    vulnerabilities: 2,
    criticality: "critical",
  },
  {
    id: "5",
    name: "IOT-CAMERA-15",
    type: "iot",
    ip: "192.168.3.115",
    mac: "AA:BB:CC:DD:EE:05",
    os: "Embedded Linux",
    location: "大厅-监控点",
    owner: "安防部门",
    status: "vulnerable",
    riskLevel: "high",
    lastSeen: "2024-01-15 14:25:33",
    vulnerabilities: 5,
    criticality: "low",
  },
];

export default function AssetManagement() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ip.includes(searchTerm) ||
      asset.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || asset.status === statusFilter;
    const matchesRisk = riskFilter === "all" || asset.riskLevel === riskFilter;

    return matchesSearch && matchesType && matchesStatus && matchesRisk;
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "server":
        return <Server className="w-5 h-5" />;
      case "workstation":
        return <Monitor className="w-5 h-5" />;
      case "mobile":
        return <Smartphone className="w-5 h-5" />;
      case "network":
        return <Wifi className="w-5 h-5" />;
      case "iot":
        return <Activity className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-neon-green bg-neon-green/20";
      case "offline":
        return "text-muted-foreground bg-muted/20";
      case "maintenance":
        return "text-threat-medium bg-threat-medium/20";
      case "vulnerable":
        return "text-threat-critical bg-threat-critical/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-threat-critical bg-threat-critical/20";
      case "high":
        return "text-threat-high bg-threat-high/20";
      case "medium":
        return "text-threat-medium bg-threat-medium/20";
      case "low":
        return "text-threat-low bg-threat-low/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "server":
        return "服务器";
      case "workstation":
        return "工作站";
      case "mobile":
        return "移动设备";
      case "network":
        return "网络设备";
      case "iot":
        return "物联网设备";
      default:
        return "未知";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "在线";
      case "offline":
        return "离线";
      case "maintenance":
        return "维护中";
      case "vulnerable":
        return "存在漏洞";
      default:
        return "未知";
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
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
    <div className="ml-64 p-8 min-h-screen matrix-bg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white glow-text mb-2">
          资产管理
        </h1>
        <p className="text-muted-foreground">
          IT资产清单管理，监控设备状态和安全风险
        </p>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="cyber-card p-4 border-l-4 border-l-neon-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">总资产</p>
              <p className="text-xl font-bold text-white">{assets.length}</p>
            </div>
            <Server className="w-6 h-6 text-neon-blue" />
          </div>
        </div>
        <div className="cyber-card p-4 border-l-4 border-l-neon-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">在线</p>
              <p className="text-xl font-bold text-neon-green">
                {assets.filter((a) => a.status === "online").length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-neon-green" />
          </div>
        </div>
        <div className="cyber-card p-4 border-l-4 border-l-threat-critical">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">存在漏洞</p>
              <p className="text-xl font-bold text-threat-critical">
                {assets.filter((a) => a.status === "vulnerable").length}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-threat-critical" />
          </div>
        </div>
        <div className="cyber-card p-4 border-l-4 border-l-threat-high">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">高风险</p>
              <p className="text-xl font-bold text-threat-high">
                {
                  assets.filter(
                    (a) => a.riskLevel === "critical" || a.riskLevel === "high",
                  ).length
                }
              </p>
            </div>
            <Shield className="w-6 h-6 text-threat-high" />
          </div>
        </div>
        <div className="cyber-card p-4 border-l-4 border-l-muted">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">离线</p>
              <p className="text-xl font-bold text-muted-foreground">
                {assets.filter((a) => a.status === "offline").length}
              </p>
            </div>
            <Monitor className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="cyber-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="搜索资产名称、IP、位置或负责人..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white"
            >
              <option value="all">所有类型</option>
              <option value="server">服务器</option>
              <option value="workstation">工作站</option>
              <option value="mobile">移动设备</option>
              <option value="network">网络设备</option>
              <option value="iot">物联网设备</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white"
            >
              <option value="all">所有状态</option>
              <option value="online">在线</option>
              <option value="offline">离线</option>
              <option value="maintenance">维护中</option>
              <option value="vulnerable">存在漏洞</option>
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white"
            >
              <option value="all">所有风险级别</option>
              <option value="critical">严重</option>
              <option value="high">高危</option>
              <option value="medium">中危</option>
              <option value="low">低危</option>
            </select>
          </div>
          <button className="neon-button flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>添加资产</span>
          </button>
        </div>
      </div>

      {/* 资产列表 */}
      <div className="cyber-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-matrix-border">
                <th className="text-left p-4 text-muted-foreground font-medium">
                  资产
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  类型
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  状态
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  风险级别
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  漏洞数
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  负责人
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  最后在线
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-matrix-border/50 hover:bg-matrix-accent/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center border border-neon-blue/30">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{asset.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {asset.ip}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {asset.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white">
                      {getTypeText(asset.type)}
                    </span>
                    <p className="text-xs text-muted-foreground">{asset.os}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs",
                        getStatusColor(asset.status),
                      )}
                    >
                      {getStatusText(asset.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs",
                        getRiskColor(asset.riskLevel),
                      )}
                    >
                      {getRiskText(asset.riskLevel)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "font-mono font-bold",
                        asset.vulnerabilities > 5
                          ? "text-threat-critical"
                          : asset.vulnerabilities > 2
                            ? "text-threat-medium"
                            : asset.vulnerabilities > 0
                              ? "text-threat-low"
                              : "text-neon-green",
                      )}
                    >
                      {asset.vulnerabilities}
                    </span>
                  </td>
                  <td className="p-4 text-white">{asset.owner}</td>
                  <td className="p-4 text-muted-foreground text-sm font-mono">
                    {asset.lastSeen}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="p-2 text-neon-blue hover:bg-neon-blue/10 rounded transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-neon-green hover:bg-neon-green/10 rounded transition-colors"
                        title="编辑资产"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-threat-critical hover:bg-threat-critical/10 rounded transition-colors"
                        title="删除资产"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 资产详情弹窗 */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedAsset(null)}
          />
          <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="cyber-card border-2 border-neon-blue/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getAssetIcon(selectedAsset.type)}
                  <h3 className="text-2xl font-bold text-white">
                    {selectedAsset.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-muted-foreground hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        IP地址
                      </label>
                      <p className="text-white font-mono">{selectedAsset.ip}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        MAC地址
                      </label>
                      <p className="text-white font-mono">
                        {selectedAsset.mac}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        操作系统
                      </label>
                      <p className="text-white">{selectedAsset.os}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        设备类型
                      </label>
                      <p className="text-white">
                        {getTypeText(selectedAsset.type)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        物理位置
                      </label>
                      <p className="text-white">{selectedAsset.location}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        负责人
                      </label>
                      <p className="text-white">{selectedAsset.owner}</p>
                    </div>
                  </div>

                  {/* 性能指标 */}
                  {selectedAsset.cpu !== undefined && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">
                        性能指标
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-matrix-surface rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Cpu className="w-4 h-4 text-neon-blue" />
                              <span className="text-sm text-muted-foreground">
                                CPU
                              </span>
                            </div>
                            <span className="text-white font-mono">
                              {selectedAsset.cpu}%
                            </span>
                          </div>
                          <div className="w-full bg-matrix-border rounded-full h-2">
                            <div
                              className={cn(
                                "h-2 rounded-full transition-all",
                                selectedAsset.cpu > 80
                                  ? "bg-threat-critical"
                                  : selectedAsset.cpu > 60
                                    ? "bg-threat-medium"
                                    : "bg-neon-green",
                              )}
                              style={{ width: `${selectedAsset.cpu}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-matrix-surface rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <MemoryStick className="w-4 h-4 text-neon-blue" />
                              <span className="text-sm text-muted-foreground">
                                内存
                              </span>
                            </div>
                            <span className="text-white font-mono">
                              {selectedAsset.memory}%
                            </span>
                          </div>
                          <div className="w-full bg-matrix-border rounded-full h-2">
                            <div
                              className={cn(
                                "h-2 rounded-full transition-all",
                                selectedAsset.memory! > 80
                                  ? "bg-threat-critical"
                                  : selectedAsset.memory! > 60
                                    ? "bg-threat-medium"
                                    : "bg-neon-green",
                              )}
                              style={{ width: `${selectedAsset.memory}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-matrix-surface rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <HardDrive className="w-4 h-4 text-neon-blue" />
                              <span className="text-sm text-muted-foreground">
                                磁盘
                              </span>
                            </div>
                            <span className="text-white font-mono">
                              {selectedAsset.disk}%
                            </span>
                          </div>
                          <div className="w-full bg-matrix-border rounded-full h-2">
                            <div
                              className={cn(
                                "h-2 rounded-full transition-all",
                                selectedAsset.disk! > 80
                                  ? "bg-threat-critical"
                                  : selectedAsset.disk! > 60
                                    ? "bg-threat-medium"
                                    : "bg-neon-green",
                              )}
                              style={{ width: `${selectedAsset.disk}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-matrix-surface rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      状态信息
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">当前状态:</span>
                        <span
                          className={
                            getStatusColor(selectedAsset.status).split(" ")[0]
                          }
                        >
                          {getStatusText(selectedAsset.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">风险级别:</span>
                        <span
                          className={
                            getRiskColor(selectedAsset.riskLevel).split(" ")[0]
                          }
                        >
                          {getRiskText(selectedAsset.riskLevel)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">重要性:</span>
                        <span
                          className={
                            getRiskColor(selectedAsset.criticality).split(
                              " ",
                            )[0]
                          }
                        >
                          {getRiskText(selectedAsset.criticality)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">漏洞数量:</span>
                        <span
                          className={cn(
                            "font-mono",
                            selectedAsset.vulnerabilities > 5
                              ? "text-threat-critical"
                              : selectedAsset.vulnerabilities > 2
                                ? "text-threat-medium"
                                : selectedAsset.vulnerabilities > 0
                                  ? "text-threat-low"
                                  : "text-neon-green",
                          )}
                        >
                          {selectedAsset.vulnerabilities}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">最后在线:</span>
                        <span className="text-white font-mono text-xs">
                          {selectedAsset.lastSeen}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full neon-button">启动安全扫描</button>
                    <button className="w-full bg-threat-medium/10 border border-threat-medium text-threat-medium hover:bg-threat-medium/20 px-4 py-2 rounded transition-colors">
                      设为维护模式
                    </button>
                    <button className="w-full bg-neon-green/10 border border-neon-green text-neon-green hover:bg-neon-green/20 px-4 py-2 rounded transition-colors">
                      编辑资产信息
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
