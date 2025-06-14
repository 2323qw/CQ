import { useState } from "react";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Shield,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  description: string;
  permissions: string[];
  status: "active" | "expired" | "revoked";
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
  usageCount: number;
  rateLimit: number;
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Dashboard Integration",
    key: "ak_live_1234567890abcdef",
    description: "用于仪表板数据集成的API密钥",
    permissions: ["read:alerts", "read:metrics", "read:reports"],
    status: "active",
    createdAt: "2024-01-01",
    expiresAt: "2024-12-31",
    lastUsed: "2024-01-15 14:30:25",
    usageCount: 1247,
    rateLimit: 1000,
  },
  {
    id: "2",
    name: "Mobile App API",
    key: "ak_live_abcdef1234567890",
    description: "移动应用程序访问API",
    permissions: ["read:alerts", "write:alerts", "read:assets"],
    status: "active",
    createdAt: "2024-01-05",
    expiresAt: "2024-06-30",
    lastUsed: "2024-01-15 10:15:33",
    usageCount: 856,
    rateLimit: 500,
  },
  {
    id: "3",
    name: "Third Party Integration",
    key: "ak_live_xyz789012345",
    description: "第三方系统集成密钥（已过期）",
    permissions: ["read:logs", "read:metrics"],
    status: "expired",
    createdAt: "2023-06-15",
    expiresAt: "2024-01-01",
    lastUsed: "2023-12-28 16:45:22",
    usageCount: 2134,
    rateLimit: 200,
  },
];

const availablePermissions = [
  { id: "read:alerts", label: "读取告警", category: "告警管理" },
  { id: "write:alerts", label: "管理告警", category: "告警管理" },
  { id: "read:metrics", label: "读取指标", category: "数据查询" },
  { id: "read:reports", label: "读取报告", category: "报告管理" },
  { id: "write:reports", label: "生成报告", category: "报告管理" },
  { id: "read:assets", label: "读取资产", category: "资产管理" },
  { id: "write:assets", label: "管理资产", category: "资产管理" },
  { id: "read:logs", label: "读取日志", category: "日志查询" },
  { id: "read:users", label: "读取用户", category: "用户管理" },
  { id: "write:users", label: "管理用户", category: "用户管理" },
  { id: "admin", label: "管理员权限", category: "系统管理" },
];

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-neon-green bg-neon-green/20";
      case "expired":
        return "text-threat-medium bg-threat-medium/20";
      case "revoked":
        return "text-threat-critical bg-threat-critical/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "活跃";
      case "expired":
        return "已过期";
      case "revoked":
        return "已撤销";
      default:
        return "未知";
    }
  };

  const maskApiKey = (key: string) => {
    return key.slice(0, 8) + "..." + key.slice(-4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (window.showToast) {
      window.showToast({
        title: "已复制",
        description: "API密钥已复制到剪贴板",
        type: "success",
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const revokeKey = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === keyId ? { ...key, status: "revoked" as const } : key,
      ),
    );
    if (window.showToast) {
      window.showToast({
        title: "密钥已撤销",
        description: "API密钥已成功撤销",
        type: "warning",
      });
    }
  };

  const deleteKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
    if (window.showToast) {
      window.showToast({
        title: "密钥已删除",
        description: "API密钥已从系统中删除",
        type: "error",
      });
    }
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="ml-64 p-8 min-h-screen matrix-bg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white glow-text mb-2">
          API密钥管理
        </h1>
        <p className="text-muted-foreground">
          管理和监控API访问密钥，控制第三方应用程序的访问权限
        </p>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="cyber-card p-6 border-l-4 border-l-neon-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">总密钥数</p>
              <p className="text-2xl font-bold text-white">{apiKeys.length}</p>
            </div>
            <Key className="w-8 h-8 text-neon-blue" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-neon-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">活跃密钥</p>
              <p className="text-2xl font-bold text-neon-green">
                {apiKeys.filter((k) => k.status === "active").length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-neon-green" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-threat-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">即将过期</p>
              <p className="text-2xl font-bold text-threat-medium">
                {
                  apiKeys.filter(
                    (k) => k.status === "active" && isExpiringSoon(k.expiresAt),
                  ).length
                }
              </p>
            </div>
            <Calendar className="w-8 h-8 text-threat-medium" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-threat-critical">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">已撤销</p>
              <p className="text-2xl font-bold text-threat-critical">
                {
                  apiKeys.filter(
                    (k) => k.status === "revoked" || k.status === "expired",
                  ).length
                }
              </p>
            </div>
            <Shield className="w-8 h-8 text-threat-critical" />
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">API密钥列表</h2>
          <p className="text-sm text-muted-foreground">
            显示 {apiKeys.length} 个API密钥
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="neon-button flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>创建新密钥</span>
        </button>
      </div>

      {/* API密钥列表 */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="cyber-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {apiKey.name}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs",
                      getStatusColor(apiKey.status),
                    )}
                  >
                    {getStatusText(apiKey.status)}
                  </span>
                  {isExpiringSoon(apiKey.expiresAt) &&
                    apiKey.status === "active" && (
                      <span className="px-2 py-1 rounded text-xs bg-threat-medium/20 text-threat-medium">
                        即将过期
                      </span>
                    )}
                </div>

                <p className="text-muted-foreground mb-4">
                  {apiKey.description}
                </p>

                {/* API密钥显示 */}
                <div className="bg-matrix-surface rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-neon-blue" />
                      <code className="text-neon-blue font-mono">
                        {showKey[apiKey.id]
                          ? apiKey.key
                          : maskApiKey(apiKey.key)}
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-1 text-muted-foreground hover:text-white transition-colors"
                      >
                        {showKey[apiKey.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-1 text-muted-foreground hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 权限标签 */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">权限:</p>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs font-mono"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 使用统计 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">创建时间</p>
                    <p className="text-white font-mono">{apiKey.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">过期时间</p>
                    <p
                      className={cn(
                        "font-mono",
                        isExpired(apiKey.expiresAt)
                          ? "text-threat-critical"
                          : isExpiringSoon(apiKey.expiresAt)
                            ? "text-threat-medium"
                            : "text-white",
                      )}
                    >
                      {apiKey.expiresAt}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">最后使用</p>
                    <p className="text-white font-mono">{apiKey.lastUsed}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">使用次数</p>
                    <p className="text-white font-mono">
                      {apiKey.usageCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-2 ml-6">
                <button
                  onClick={() => setSelectedKey(apiKey)}
                  className="p-2 text-neon-blue hover:bg-neon-blue/10 rounded transition-colors"
                  title="查看详情"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-neon-green hover:bg-neon-green/10 rounded transition-colors"
                  title="编辑密钥"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {apiKey.status === "active" && (
                  <button
                    onClick={() => revokeKey(apiKey.id)}
                    className="p-2 text-threat-medium hover:bg-threat-medium/10 rounded transition-colors"
                    title="撤销密钥"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteKey(apiKey.id)}
                  className="p-2 text-threat-critical hover:bg-threat-critical/10 rounded transition-colors"
                  title="删除密钥"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 创建新密钥弹窗 */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsCreating(false)}
          />
          <div className="relative w-full max-w-2xl mx-4">
            <div className="cyber-card border-2 border-neon-blue/30 p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                创建新的API密钥
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    密钥名称
                  </label>
                  <input
                    type="text"
                    placeholder="为这个API密钥起一个描述性的名称"
                    className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    描述
                  </label>
                  <textarea
                    placeholder="描述这个API密钥的用途"
                    rows={3}
                    className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    过期时间
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    请求频率限制 (每分钟)
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    权限设置
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availablePermissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center space-x-2 p-2 bg-matrix-surface rounded"
                      >
                        <input
                          type="checkbox"
                          className="text-neon-blue focus:ring-neon-blue"
                        />
                        <div>
                          <span className="text-sm text-white">
                            {permission.label}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {permission.category}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-white transition-colors"
                >
                  取消
                </button>
                <button className="neon-button">创建API密钥</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
