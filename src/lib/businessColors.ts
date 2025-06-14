/**
 * 企业级统一配色方案
 * Enterprise Unified Color Scheme
 */

export const BUSINESS_COLORS = {
  // 主色调 - Primary Colors
  primary: "#2563eb", // 企业蓝 - Corporate Blue
  primaryLight: "#3b82f6", // 浅蓝 - Light Blue
  primaryDark: "#1d4ed8", // 深蓝 - Dark Blue

  // 功能色 - Functional Colors
  success: "#16a34a", // 成功绿 - Success Green
  successLight: "#22c55e", // 浅绿 - Light Green
  successDark: "#15803d", // 深绿 - Dark Green

  warning: "#d97706", // 警告橙 - Warning Orange
  warningLight: "#ea580c", // 浅橙 - Light Orange
  warningDark: "#c2410c", // 深橙 - Dark Orange

  danger: "#dc2626", // 危险红 - Danger Red
  dangerLight: "#ef4444", // 浅红 - Light Red
  dangerDark: "#b91c1c", // 深红 - Dark Red

  // 信息色 - Information Colors
  info: "#0891b2", // 信息青 - Info Cyan
  infoLight: "#06b6d4", // 浅青 - Light Cyan
  infoDark: "#0e7490", // 深青 - Dark Cyan

  // 特殊功能色 - Special Function Colors
  purple: "#9333ea", // 紫色 - Purple
  purpleLight: "#a855f7", // 浅紫 - Light Purple
  purpleDark: "#7c3aed", // 深紫 - Dark Purple

  indigo: "#4f46e5", // 靛蓝 - Indigo
  indigoLight: "#6366f1", // 浅靛蓝 - Light Indigo
  indigoDark: "#4338ca", // 深靛蓝 - Dark Indigo

  // 中性色 - Neutral Colors
  slate: "#64748b", // 板岩灰 - Slate Gray
  slateLight: "#94a3b8", // 浅板岩灰 - Light Slate
  slateDark: "#475569", // 深板岩灰 - Dark Slate

  // 背景色 - Background Colors
  backgroundPrimary: "#f8fafc", // 主背景 - Primary Background
  backgroundSecondary: "#f1f5f9", // 次背景 - Secondary Background
  backgroundTertiary: "#e2e8f0", // 三级背景 - Tertiary Background

  // 文本色 - Text Colors
  textPrimary: "#1e293b", // 主文本 - Primary Text
  textSecondary: "#475569", // 次文本 - Secondary Text
  textTertiary: "#64748b", // 三级文本 - Tertiary Text

  // 3D材质专用色 - 3D Material Colors
  material: {
    building: "#2563eb", // 建筑物 - Buildings
    server: "#16a34a", // 服务器 - Servers
    network: "#9333ea", // 网络节点 - Network Nodes
    platform: "#f8fafc", // 平台基座 - Platform Base
    grid: "#e2e8f0", // 网格线 - Grid Lines
    highlight: "#fbbf24", // 高亮 - Highlight
    security: "#dc2626", // 安全相关 - Security
    data: "#0891b2", // 数据相关 - Data
  },
} as const;

/**
 * 3D模型配置
 * 3D Model Configurations
 */
export const MODEL_CONFIG = {
  // 建筑区域配置
  districts: [
    {
      name: "总部大楼",
      position: [0, 0, 0],
      color: BUSINESS_COLORS.primary,
      theme: "headquarters",
      buildings: 4,
    },
    {
      name: "办公区域",
      position: [40, 0, 0],
      color: BUSINESS_COLORS.success,
      theme: "office",
      buildings: 6,
    },
    {
      name: "数据中心",
      position: [-40, 0, 0],
      color: BUSINESS_COLORS.info,
      theme: "datacenter",
      buildings: 3,
    },
    {
      name: "研发中心",
      position: [0, 0, 40],
      color: BUSINESS_COLORS.purple,
      theme: "research",
      buildings: 4,
    },
  ],

  // 网络拓扑配置
  network: {
    core: {
      position: [0, 12, 0],
      color: BUSINESS_COLORS.primary,
      size: 2,
      type: "core",
    },
    distribution: [
      { position: [20, 8, 0], color: BUSINESS_COLORS.success, size: 1.5 },
      { position: [-20, 8, 0], color: BUSINESS_COLORS.success, size: 1.5 },
      { position: [0, 8, 20], color: BUSINESS_COLORS.success, size: 1.5 },
      { position: [0, 8, -20], color: BUSINESS_COLORS.success, size: 1.5 },
    ],
    access: [
      { position: [30, 4, 15], color: BUSINESS_COLORS.info, size: 1 },
      { position: [30, 4, -15], color: BUSINESS_COLORS.info, size: 1 },
      { position: [-30, 4, 15], color: BUSINESS_COLORS.info, size: 1 },
      { position: [-30, 4, -15], color: BUSINESS_COLORS.info, size: 1 },
      { position: [15, 4, 30], color: BUSINESS_COLORS.info, size: 1 },
      { position: [-15, 4, 30], color: BUSINESS_COLORS.info, size: 1 },
      { position: [15, 4, -30], color: BUSINESS_COLORS.info, size: 1 },
      { position: [-15, 4, -30], color: BUSINESS_COLORS.info, size: 1 },
    ],
  },

  // 数据中心配置
  datacenters: [
    {
      name: "主数据中心",
      position: [-40, 4, 0],
      color: BUSINESS_COLORS.info,
      servers: 8,
    },
    {
      name: "备份数据中心",
      position: [40, 4, 0],
      color: BUSINESS_COLORS.success,
      servers: 6,
    },
    {
      name: "云数据中心",
      position: [0, 4, 40],
      color: BUSINESS_COLORS.purple,
      servers: 4,
    },
  ],

  // 性能配置
  performance: {
    particleCount: 800, // 粒子数量
    instanceLimits: {
      // 实例化限制
      buildings: 28,
      vehicles: 12,
      networkNodes: 20,
    },
    lodDistances: {
      // LOD距离
      high: 30,
      medium: 60,
      low: 100,
    },
  },
} as const;

/**
 * 获取状态对应的颜色
 */
export function getStatusColor(
  status: "normal" | "warning" | "critical" | "offline",
): string {
  switch (status) {
    case "normal":
      return BUSINESS_COLORS.success;
    case "warning":
      return BUSINESS_COLORS.warning;
    case "critical":
      return BUSINESS_COLORS.danger;
    case "offline":
      return BUSINESS_COLORS.slate;
    default:
      return BUSINESS_COLORS.info;
  }
}

/**
 * 获取威胁等级对应的颜色
 */
export function getThreatLevelColor(
  level: "low" | "medium" | "high" | "critical",
): string {
  switch (level) {
    case "low":
      return BUSINESS_COLORS.success;
    case "medium":
      return BUSINESS_COLORS.warning;
    case "high":
      return BUSINESS_COLORS.danger;
    case "critical":
      return BUSINESS_COLORS.dangerDark;
    default:
      return BUSINESS_COLORS.info;
  }
}

/**
 * 企业UI主题配置
 */
export const UI_THEME = {
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
} as const;
