import { useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Wifi,
  Bell,
  Users,
  Database,
  Monitor,
  Lock,
  Save,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const settingSections: SettingSection[] = [
  {
    id: "security",
    title: "安全配置",
    icon: Shield,
    description: "防火墙、入侵检测和访问控制设置",
  },
  {
    id: "network",
    title: "网络设置",
    icon: Wifi,
    description: "网络监控、带宽限制和流量分析配置",
  },
  {
    id: "alerts",
    title: "告警配置",
    icon: Bell,
    description: "告警规则、通知方式和阈值设置",
  },
  {
    id: "users",
    title: "用户管理",
    icon: Users,
    description: "用户权限、角色分配和访问管理",
  },
  {
    id: "database",
    title: "数据管理",
    icon: Database,
    description: "数据备份、清理和存储配置",
  },
  {
    id: "monitoring",
    title: "监控配置",
    icon: Monitor,
    description: "系统监控、性能指标和日志配置",
  },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("security");
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // 安全配置
    firewallEnabled: true,
    intrusionDetection: true,
    autoBlock: true,
    blockDuration: 3600,
    maxLoginAttempts: 5,
    passwordComplexity: "high",

    // 网络设置
    bandwidthLimit: 1000,
    trafficMonitoring: true,
    packetInspection: true,
    geoBlocking: true,

    // 告警配置
    emailNotifications: true,
    smsNotifications: false,
    criticalThreshold: 5,
    highThreshold: 10,
    autoEscalation: true,

    // 监控配置
    dataRetention: 90,
    logLevel: "info",
    realTimeUpdates: true,
    performanceMetrics: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // 模拟保存
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSaving(false);

    if (window.showToast) {
      window.showToast({
        title: "设置已保存",
        description: "系统配置已成功更新",
        type: "success",
      });
    }
  };

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-neon-blue" />
          <span>防护设置</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">防火墙保护</label>
              <p className="text-sm text-muted-foreground">
                启用智能防火墙拦截恶意流量
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.firewallEnabled}
              onChange={(e) =>
                handleSettingChange("firewallEnabled", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">入侵检测</label>
              <p className="text-sm text-muted-foreground">
                实时检测和分析网络入侵行为
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.intrusionDetection}
              onChange={(e) =>
                handleSettingChange("intrusionDetection", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">自动阻断</label>
              <p className="text-sm text-muted-foreground">
                检测到威胁时自动阻断来源IP
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoBlock}
              onChange={(e) =>
                handleSettingChange("autoBlock", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              阻断持续时间 (秒)
            </label>
            <input
              type="number"
              value={settings.blockDuration}
              onChange={(e) =>
                handleSettingChange("blockDuration", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              最大登录尝试次数
            </label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) =>
                handleSettingChange(
                  "maxLoginAttempts",
                  parseInt(e.target.value),
                )
              }
              className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              密码复杂度要求
            </label>
            <select
              value={settings.passwordComplexity}
              onChange={(e) =>
                handleSettingChange("passwordComplexity", e.target.value)
              }
              className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white"
            >
              <option value="low">低 - 6位以上</option>
              <option value="medium">中 - 8位以上，包含数字</option>
              <option value="high">
                高 - 12位以上，包含大小写字母、数字和特殊字符
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNetworkSettings = () => (
    <div className="space-y-6">
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Wifi className="w-5 h-5 text-neon-green" />
          <span>网络监控</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              带宽限制 (Mbps)
            </label>
            <input
              type="number"
              value={settings.bandwidthLimit}
              onChange={(e) =>
                handleSettingChange("bandwidthLimit", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">流量监控</label>
              <p className="text-sm text-muted-foreground">
                实时监控网络流量状态
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.trafficMonitoring}
              onChange={(e) =>
                handleSettingChange("trafficMonitoring", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">深度包检测</label>
              <p className="text-sm text-muted-foreground">
                分析数据包内容检测威胁
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.packetInspection}
              onChange={(e) =>
                handleSettingChange("packetInspection", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">地理位置拦截</label>
              <p className="text-sm text-muted-foreground">
                根据IP地理位置阻断可疑流量
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.geoBlocking}
              onChange={(e) =>
                handleSettingChange("geoBlocking", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlertSettings = () => (
    <div className="space-y-6">
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Bell className="w-5 h-5 text-threat-medium" />
          <span>通知设置</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">邮件通知</label>
              <p className="text-sm text-muted-foreground">
                通过邮件发送告警通知
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                handleSettingChange("emailNotifications", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">短信通知</label>
              <p className="text-sm text-muted-foreground">
                通过短信发送紧急告警
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) =>
                handleSettingChange("smsNotifications", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              严重告警阈值
            </label>
            <input
              type="number"
              value={settings.criticalThreshold}
              onChange={(e) =>
                handleSettingChange(
                  "criticalThreshold",
                  parseInt(e.target.value),
                )
              }
              className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              高危告警阈值
            </label>
            <input
              type="number"
              value={settings.highThreshold}
              onChange={(e) =>
                handleSettingChange("highThreshold", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">自动升级</label>
              <p className="text-sm text-muted-foreground">
                严重告警自动升级通知级别
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoEscalation}
              onChange={(e) =>
                handleSettingChange("autoEscalation", e.target.checked)
              }
              className="toggle-switch"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "security":
        return renderSecuritySettings();
      case "network":
        return renderNetworkSettings();
      case "alerts":
        return renderAlertSettings();
      case "users":
        return (
          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              用户权限管理
            </h3>
            <p className="text-muted-foreground">用户管理功能正在开发中...</p>
          </div>
        );
      case "database":
        return (
          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              数据库配置
            </h3>
            <p className="text-muted-foreground">数据管理功能正在开发中...</p>
          </div>
        );
      case "monitoring":
        return (
          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">监控配置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  数据保留天数
                </label>
                <input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) =>
                    handleSettingChange(
                      "dataRetention",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  日志级别
                </label>
                <select
                  value={settings.logLevel}
                  onChange={(e) =>
                    handleSettingChange("logLevel", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">实时更新</label>
                  <p className="text-sm text-muted-foreground">
                    启用数据实时更新
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.realTimeUpdates}
                  onChange={(e) =>
                    handleSettingChange("realTimeUpdates", e.target.checked)
                  }
                  className="toggle-switch"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ml-64 p-8 min-h-screen matrix-bg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white glow-text mb-2">
          系统设置
        </h1>
        <p className="text-muted-foreground">
          配置和管理CyberGuard安全监控系统
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 设置导航 */}
        <div className="lg:col-span-1">
          <div className="cyber-card p-4 sticky top-8">
            <h3 className="text-lg font-semibold text-white mb-4">设置分类</h3>
            <nav className="space-y-2">
              {settingSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3",
                      activeSection === section.id
                        ? "bg-neon-blue/20 border border-neon-blue text-neon-blue"
                        : "text-muted-foreground hover:text-white hover:bg-matrix-accent",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs opacity-80">
                        {section.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 设置内容 */}
        <div className="lg:col-span-3">
          {renderSectionContent()}

          {/* 保存按钮 */}
          <div className="mt-8 flex items-center justify-end space-x-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="neon-button flex items-center space-x-2 px-6 py-3"
            >
              {isSaving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isSaving ? "保存中..." : "保存设置"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
