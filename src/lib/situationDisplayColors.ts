/**
 * 3D态势大屏专用统一配色方案
 * Unified Color Scheme for 3D Situation Display Screen
 */

// 主色彩系统 - 专为大屏显示优化
export const DISPLAY_COLORS = {
  // 核心企业色彩 - Core Enterprise Colors
  corporate: {
    primary: "#1e40af", // 深企业蓝 - Deep Corporate Blue
    secondary: "#1d4ed8", // 企业蓝 - Corporate Blue
    accent: "#3b82f6", // 亮企业蓝 - Bright Corporate Blue
    light: "#60a5fa", // 浅企业蓝 - Light Corporate Blue
  },

  // 功能状态色彩 - Functional Status Colors
  status: {
    normal: "#059669", // 正常绿 - Normal Green
    warning: "#d97706", // 警告橙 - Warning Orange
    critical: "#dc2626", // 危险红 - Critical Red
    offline: "#6b7280", // 离线灰 - Offline Gray
    active: "#10b981", // 活跃绿 - Active Green
    processing: "#3b82f6", // 处理蓝 - Processing Blue
  },

  // 网络层级色彩 - Network Layer Colors
  network: {
    core: "#1e40af", // 核心层 - Core Layer
    distribution: "#059669", // 分布层 - Distribution Layer
    access: "#0891b2", // 接入层 - Access Layer
    edge: "#7c3aed", // 边缘层 - Edge Layer
    connection: "#60a5fa", // 连接线 - Connection Lines
  },

  // 安全等级色彩 - Security Level Colors
  security: {
    safe: "#059669", // 安全 - Safe
    low: "#10b981", // 低风险 - Low Risk
    medium: "#f59e0b", // 中等风险 - Medium Risk
    high: "#ef4444", // 高风险 - High Risk
    critical: "#dc2626", // 极高风险 - Critical Risk
  },

  // 设施类型色彩 - Facility Type Colors
  facility: {
    headquarters: "#1e40af", // 总部大楼 - Headquarters
    office: "#059669", // 办公楼 - Office Buildings
    datacenter: "#0891b2", // 数据中心 - Data Centers
    research: "#7c3aed", // 研发中心 - Research Centers
    security: "#dc2626", // 安全设施 - Security Facilities
    server: "#10b981", // 服务器 - Servers
  },

  // 大屏UI色彩 - Display UI Colors
  ui: {
    // 背景色系
    background: {
      primary: "#0f172a", // 主背景 - 深色大屏背景
      secondary: "#1e293b", // 次背景 - 卡片背景
      tertiary: "#334155", // 三级背景 - 面板背景
      overlay: "rgba(15, 23, 42, 0.9)", // 覆盖层背景
    },

    // 文本色系
    text: {
      primary: "#f8fafc", // 主文本 - 白色
      secondary: "#cbd5e1", // 次文本 - 浅灰
      accent: "#60a5fa", // 强调文本 - 蓝色
      muted: "#94a3b8", // 辅助文本 - 灰色
    },

    // 边框色系
    border: {
      primary: "#334155", // 主边框
      secondary: "#475569", // 次边框
      accent: "#3b82f6", // 强调边框
      success: "#10b981", // 成功边框
      warning: "#f59e0b", // 警告边框
      danger: "#ef4444", // 危险边框
    },

    // 渐变色系
    gradient: {
      primary: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
      success: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      warning: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
      danger: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      info: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
      dark: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
  },

  // 3D材质专用色彩 - 3D Material Colors
  material: {
    building: {
      base: "#1e40af", // 建筑基础色
      highlight: "#3b82f6", // 建筑高亮色
      shadow: "#1e3a8a", // 建筑阴影色
      emissive: "#1e40af", // 建筑发光色
    },
    platform: {
      base: "#334155", // 平台基础色
      grid: "#475569", // 网格线色
      highlight: "#60a5fa", // 平台高亮色
    },
    effect: {
      particle: "#60a5fa", // 粒子色
      beam: "#3b82f6", // 光束色
      scan: "#10b981", // 扫描线色
      alert: "#ef4444", // 警报色
    },
  },
} as const;

// 威胁等级配色映射
export const THREAT_LEVEL_COLORS = {
  0: DISPLAY_COLORS.security.safe, // 无威胁
  1: DISPLAY_COLORS.security.low, // 低威胁
  2: DISPLAY_COLORS.security.low, // 低威胁
  3: DISPLAY_COLORS.security.medium, // 中等威胁
  4: DISPLAY_COLORS.security.medium, // 中等威胁
  5: DISPLAY_COLORS.security.high, // 高威胁
  6: DISPLAY_COLORS.security.high, // 高威胁
  7: DISPLAY_COLORS.security.critical, // 极高威胁
  8: DISPLAY_COLORS.security.critical, // 极高威胁
  9: DISPLAY_COLORS.security.critical, // 极高威胁
  10: DISPLAY_COLORS.security.critical, // 极高威胁
} as const;

// 系统状态配色映射
export const STATUS_COLORS = {
  online: DISPLAY_COLORS.status.normal,
  offline: DISPLAY_COLORS.status.offline,
  warning: DISPLAY_COLORS.status.warning,
  error: DISPLAY_COLORS.status.critical,
  processing: DISPLAY_COLORS.status.processing,
  maintenance: DISPLAY_COLORS.status.warning,
} as const;

// 网络节点类型配色
export const NODE_TYPE_COLORS = {
  core: DISPLAY_COLORS.network.core,
  distribution: DISPLAY_COLORS.network.distribution,
  access: DISPLAY_COLORS.network.access,
  edge: DISPLAY_COLORS.network.edge,
  server: DISPLAY_COLORS.facility.server,
  router: DISPLAY_COLORS.network.distribution,
  switch: DISPLAY_COLORS.network.access,
  firewall: DISPLAY_COLORS.security.high,
} as const;

/**
 * 根据数值获取威胁等级颜色
 */
export function getThreatColor(level: number): string {
  const clampedLevel = Math.max(0, Math.min(10, Math.floor(level)));
  return THREAT_LEVEL_COLORS[clampedLevel as keyof typeof THREAT_LEVEL_COLORS];
}

/**
 * 根据状态获取对应颜色
 */
export function getStatusColor(status: keyof typeof STATUS_COLORS): string {
  return STATUS_COLORS[status] || DISPLAY_COLORS.status.offline;
}

/**
 * 根据节点类型获取颜色
 */
export function getNodeTypeColor(
  nodeType: keyof typeof NODE_TYPE_COLORS,
): string {
  return NODE_TYPE_COLORS[nodeType] || DISPLAY_COLORS.network.access;
}

/**
 * 根据性能值获取颜色（0-100）
 */
export function getPerformanceColor(value: number): string {
  if (value >= 90) return DISPLAY_COLORS.security.critical;
  if (value >= 75) return DISPLAY_COLORS.security.high;
  if (value >= 50) return DISPLAY_COLORS.security.medium;
  if (value >= 25) return DISPLAY_COLORS.security.low;
  return DISPLAY_COLORS.security.safe;
}

/**
 * 3D场景配置
 */
export const SCENE_CONFIG = {
  // 光照配置
  lighting: {
    ambient: {
      color: "#ffffff",
      intensity: 0.4,
    },
    directional: {
      color: "#ffffff",
      intensity: 0.8,
      position: [50, 50, 50],
    },
    point: {
      color: DISPLAY_COLORS.corporate.accent,
      intensity: 0.6,
      position: [0, 20, 0],
    },
  },

  // 环境配置
  environment: {
    backgroundColor: DISPLAY_COLORS.ui.background.primary,
    gridColor: DISPLAY_COLORS.ui.border.primary,
    platformColor: DISPLAY_COLORS.ui.background.secondary,
    starCount: 1500,
    starRadius: 200,
  },

  // 动画配置
  animation: {
    rotationSpeed: 0.005,
    pulseSpeed: 2.0,
    scanSpeed: 1.5,
    floatAmplitude: 0.5,
    floatSpeed: 1.0,
  },
} as const;

/**
 * UI主题配置 - 大屏专用
 */
export const DISPLAY_THEME = {
  // 边框圆角
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    xlarge: "16px",
  },

  // 阴影效果
  shadows: {
    small: "0 2px 4px rgba(0, 0, 0, 0.3)",
    medium: "0 4px 8px rgba(0, 0, 0, 0.4)",
    large: "0 8px 16px rgba(0, 0, 0, 0.5)",
    glow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}40`,
  },

  // 过渡动画
  transitions: {
    fast: "0.2s ease-out",
    medium: "0.3s ease-out",
    slow: "0.5s ease-out",
    smooth: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // 字体大小 - 大屏优化
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },

  // 间距 - 大屏优化
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
  },
} as const;
