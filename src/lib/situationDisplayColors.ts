/**
 * 3D态势大屏专用统一配色方案 - 2024 科幻增强版
 * Unified Color Scheme for 3D Situation Display Screen - 2024 Sci-Fi Enhanced Edition
 */

// 主色彩系统 - 专为大屏显示优化
export const DISPLAY_COLORS = {
  // 核心企业色彩 - Core Enterprise Colors (更强烈的科技感)
  corporate: {
    primary: "#0052ff", // 深科技蓝 - Deep Tech Blue
    secondary: "#0066ff", // 科技蓝 - Tech Blue
    accent: "#00d4ff", // 亮科技蓝 - Bright Tech Blue
    light: "#3d7bff", // 浅科技蓝 - Light Tech Blue
    gradient: "linear-gradient(135deg, #0052ff 0%, #00d4ff 100%)",
  },

  // 功能状态色彩 - Functional Status Colors (霓虹强化)
  status: {
    normal: "#00ff88", // 正常绿 - Normal Green (更亮的霓虹绿)
    warning: "#ff8800", // 警告橙 - Warning Orange (更鲜艳的橙色)
    critical: "#ff3366", // 危险红 - Critical Red (更强烈的红色)
    offline: "#6b7280", // 离线灰 - Offline Gray
    active: "#39ff14", // 活跃绿 - Active Green (霓虹绿)
    processing: "#00f5ff", // 处理蓝 - Processing Blue (霓虹蓝)
    quantum: "#bf00ff", // 量子紫 - Quantum Purple
    neural: "#00ff88", // 神经绿 - Neural Green
    ai: "#aa33ff", // AI紫 - AI Purple
  },

  // 网络层级色彩 - Network Layer Colors (科幻升级)
  network: {
    core: "#0052ff", // 核心层 - Core Layer (主科技蓝)
    distribution: "#00ff88", // 分布层 - Distribution Layer (霓虹绿)
    access: "#00ccff", // 接入层 - Access Layer (霓虹青)
    edge: "#aa33ff", // 边缘层 - Edge Layer (霓虹紫)
    connection: "#00d4ff", // 连接线 - Connection Lines (亮科技蓝)
    quantum: "#bf00ff", // 量子层 - Quantum Layer
    neural: "#39ff14", // 神经层 - Neural Layer
  },

  // 安全等级色彩 - Security Level Colors (更鲜明的警报色)
  security: {
    safe: "#00ff88", // 安全 - Safe (霓虹绿)
    low: "#39ff14", // 低风险 - Low Risk
    medium: "#ff8800", // 中等风险 - Medium Risk (鲜艳橙)
    high: "#ff3366", // 高风险 - High Risk (鲜明红)
    critical: "#ff0040", // 极高风险 - Critical Risk (警报红)
    quantum: "#bf00ff", // 量子威胁 - Quantum Threat
    neural: "#ff1493", // 神经威胁 - Neural Threat
  },

  // 设施类型色彩 - Facility Type Colors (科幻主题)
  facility: {
    headquarters: "#0052ff", // 总部大楼 - Headquarters (主科技蓝)
    office: "#00ff88", // 办公楼 - Office Buildings (霓虹绿)
    datacenter: "#00ccff", // 数据中心 - Data Centers (霓虹青)
    research: "#aa33ff", // 研发中心 - Research Centers (霓虹紫)
    security: "#ff3366", // 安全设施 - Security Facilities (警报红)
    server: "#39ff14", // 服务器 - Servers (亮绿)
    quantum: "#bf00ff", // 量子设施 - Quantum Facilities
    neural: "#00ff88", // 神经网络 - Neural Networks
    ai: "#aa33ff", // AI设施 - AI Facilities
  },

  // 大屏UI色彩 - Display UI Colors (深空科幻主题)
  ui: {
    // 背景色系 - 深空渐变背景
    background: {
      primary: "#0a0e1a", // 主背景 - 深空蓝黑
      secondary: "#111827", // 次背景 - 深灰蓝
      tertiary: "#1f2937", // 三级背景 - 中灰蓝
      overlay: "rgba(10, 14, 26, 0.95)", // 覆盖层背景
      accent: "#0f172a", // 强调背景 - 极��蓝
      card: "rgba(17, 24, 39, 0.8)", // 卡片背景
      panel: "rgba(31, 41, 55, 0.7)", // 面板背景
    },

    // 文本色系 - 高对比度科技文本
    text: {
      primary: "#f8fafc", // 主文本 - 纯白
      secondary: "#cbd5e1", // 次文本 - 浅灰
      accent: "#00d4ff", // 强调文本 - 科技蓝
      muted: "#94a3b8", // 辅助文本 - 中灰
      success: "#00ff88", // 成功文本 - 霓虹绿
      warning: "#ff8800", // 警告文本 - 警告橙
      danger: "#ff3366", // 危险文本 - 危险红
      info: "#00ccff", // 信息文本 - 信息青
    },

    // 边框色系 - 科技边框
    border: {
      primary: "#374151", // 主边框 - 中深灰
      secondary: "#4b5563", // 次边框 - 浅深灰
      accent: "#00d4ff", // 强调边框 - 科技蓝
      success: "#00ff88", // 成功边框 - 霓虹绿
      warning: "#ff8800", // 警告边框 - 警告橙
      danger: "#ff3366", // 危险边框 - 危险红
      glow: "#00f5ff", // 发光边框 - 霓虹蓝
      quantum: "#bf00ff", // 量子边框 - 量子紫
    },

    // 渐变色系 - 科幻渐变
    gradient: {
      primary: "linear-gradient(135deg, #0052ff 0%, #00d4ff 100%)",
      success: "linear-gradient(135deg, #00ff88 0%, #39ff14 100%)",
      warning: "linear-gradient(135deg, #ff8800 0%, #ffaa33 100%)",
      danger: "linear-gradient(135deg, #ff3366 0%, #ff0040 100%)",
      info: "linear-gradient(135deg, #00ccff 0%, #00f5ff 100%)",
      dark: "linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #1f2937 100%)",
      neon: "linear-gradient(45deg, #00f5ff 0%, #39ff14 25%, #bf00ff 50%, #ff1493 75%, #00f5ff 100%)",
      quantum: "linear-gradient(135deg, #bf00ff 0%, #aa33ff 100%)",
      neural: "linear-gradient(135deg, #00ff88 0%, #39ff14 100%)",
      matrix:
        "linear-gradient(180deg, transparent 0%, #39ff14 50%, transparent 100%)",
      hologram:
        "linear-gradient(45deg, transparent 0%, #00d4ff 50%, transparent 100%)",
    },
  },

  // 3D材质专用色彩 - 3D Material Colors (科幻强化)
  material: {
    building: {
      base: "#0052ff", // 建筑基础色 - 科技蓝
      highlight: "#00d4ff", // 建筑高亮色 - 亮科技蓝
      shadow: "#003acc", // 建筑阴影色 - 深科技蓝
      emissive: "#0066ff", // 建筑发光色 - 中科技蓝
      quantum: "#bf00ff", // 量子建筑 - 量子紫
      neural: "#00ff88", // 神经建筑 - 霓虹绿
    },
    platform: {
      base: "#1f2937", // 平台基础色 - 深灰蓝
      grid: "#374151", // 网格线色 - 中灰
      highlight: "#00d4ff", // 平台高亮色 - 科技蓝
      hologram: "#00f5ff", // 全息平台 - 霓虹蓝
    },
    effect: {
      particle: "#00d4ff", // 粒子色 - 科技蓝
      beam: "#00f5ff", // 光束色 - 霓虹蓝
      scan: "#39ff14", // 扫描线色 - 霓虹绿
      alert: "#ff3366", // 警报色 - 危险红
      energy: "#ffff00", // 能量色 - 霓虹黄
      plasma: "#ff1493", // 等离子色 - 霓虹粉
      quantum: "#bf00ff", // 量子效果 - 量子紫
      neural: "#00ff88", // 神经效果 - 神经绿
      hologram: "#00ccff", // 全息效果 - 全息青
      matrix: "#39ff14", // 矩阵效果 - 矩阵绿
    },
  },

  // 霓虹色系 - Neon Colors (完整霓虹系列)
  neon: {
    blue: "#00f5ff", // 霓虹蓝
    green: "#39ff14", // 霓虹绿
    purple: "#bf00ff", // 霓虹紫
    pink: "#ff1493", // 霓虹粉
    orange: "#ff6600", // 霓虹橙
    yellow: "#ffff00", // 霓虹黄
    cyan: "#00ffff", // 霓虹青
    red: "#ff0040", // 霓虹红
    lime: "#ccff00", // 霓虹柠檬
    magenta: "#ff00ff", // 霓虹洋红
  },
} as const;

// 威胁等级配色映射 - 增强版
export const THREAT_LEVEL_COLORS = {
  0: DISPLAY_COLORS.security.safe, // 无威胁 - 霓虹绿
  1: DISPLAY_COLORS.security.low, // 低威胁 - 亮绿
  2: DISPLAY_COLORS.security.low, // 低威胁
  3: DISPLAY_COLORS.security.medium, // 中等威胁 - 鲜艳橙
  4: DISPLAY_COLORS.security.medium, // 中等威胁
  5: DISPLAY_COLORS.security.high, // 高威胁 - 鲜明红
  6: DISPLAY_COLORS.security.high, // 高威胁
  7: DISPLAY_COLORS.security.critical, // 极高威胁 - 警报红
  8: DISPLAY_COLORS.security.critical, // 极高威胁
  9: DISPLAY_COLORS.security.quantum, // 量子威胁 - 量子紫
  10: DISPLAY_COLORS.security.neural, // 神经威胁 - 神经粉
} as const;

// 系统状态配色映射 - 扩展版
export const STATUS_COLORS = {
  online: DISPLAY_COLORS.status.normal,
  offline: DISPLAY_COLORS.status.offline,
  warning: DISPLAY_COLORS.status.warning,
  error: DISPLAY_COLORS.status.critical,
  processing: DISPLAY_COLORS.status.processing,
  maintenance: DISPLAY_COLORS.status.warning,
  quantum: DISPLAY_COLORS.status.quantum,
  neural: DISPLAY_COLORS.status.neural,
  ai: DISPLAY_COLORS.status.ai,
  active: DISPLAY_COLORS.status.active,
} as const;

// 网络节点类型配色 - 科技升级版
export const NODE_TYPE_COLORS = {
  core: DISPLAY_COLORS.network.core,
  distribution: DISPLAY_COLORS.network.distribution,
  access: DISPLAY_COLORS.network.access,
  edge: DISPLAY_COLORS.network.edge,
  server: DISPLAY_COLORS.facility.server,
  router: DISPLAY_COLORS.network.distribution,
  switch: DISPLAY_COLORS.network.access,
  firewall: DISPLAY_COLORS.security.high,
  quantum: DISPLAY_COLORS.network.quantum,
  neural: DISPLAY_COLORS.network.neural,
  ai: DISPLAY_COLORS.facility.ai,
  database: DISPLAY_COLORS.facility.datacenter,
  cloud: DISPLAY_COLORS.network.connection,
} as const;

// 设施类型配色映射
export const FACILITY_TYPE_COLORS = {
  headquarters: DISPLAY_COLORS.facility.headquarters,
  office: DISPLAY_COLORS.facility.office,
  datacenter: DISPLAY_COLORS.facility.datacenter,
  research: DISPLAY_COLORS.facility.research,
  security: DISPLAY_COLORS.facility.security,
  quantum: DISPLAY_COLORS.facility.quantum,
  neural: DISPLAY_COLORS.facility.neural,
  ai: DISPLAY_COLORS.facility.ai,
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
 * 根据设施类型获取颜色
 */
export function getFacilityTypeColor(
  facilityType: keyof typeof FACILITY_TYPE_COLORS,
): string {
  return FACILITY_TYPE_COLORS[facilityType] || DISPLAY_COLORS.facility.office;
}

/**
 * 根据性能值获取颜色（0-100）
 */
export function getPerformanceColor(value: number): string {
  if (value >= 95) return DISPLAY_COLORS.status.active; // 优秀 - 霓虹绿
  if (value >= 85) return DISPLAY_COLORS.status.normal; // 良好 - 正常绿
  if (value >= 70) return DISPLAY_COLORS.status.processing; // 一般 - 处理蓝
  if (value >= 50) return DISPLAY_COLORS.status.warning; // 警告 - 警告橙
  if (value >= 25) return DISPLAY_COLORS.security.high; // 差 - 高风险红
  return DISPLAY_COLORS.security.critical; // 极差 - 极高风险红
}

/**
 * 根据数据流量获取颜色
 */
export function getDataFlowColor(bandwidth: number): string {
  if (bandwidth >= 90) return DISPLAY_COLORS.neon.green; // 高流量 - 霓虹绿
  if (bandwidth >= 70) return DISPLAY_COLORS.neon.blue; // 中高流量 - 霓虹蓝
  if (bandwidth >= 50) return DISPLAY_COLORS.neon.cyan; // 中等流量 - 霓虹青
  if (bandwidth >= 30) return DISPLAY_COLORS.neon.orange; // 低流量 - 霓虹橙
  return DISPLAY_COLORS.neon.red; // 极低流量 - 霓虹红
}

/**
 * 根据技术等级获取颜色
 */
export function getTechLevelColor(
  techLevel: "basic" | "advanced" | "quantum" | "neural" | "ai",
): string {
  switch (techLevel) {
    case "basic":
      return DISPLAY_COLORS.ui.text.muted;
    case "advanced":
      return DISPLAY_COLORS.corporate.accent;
    case "quantum":
      return DISPLAY_COLORS.neon.purple;
    case "neural":
      return DISPLAY_COLORS.neon.green;
    case "ai":
      return DISPLAY_COLORS.neon.pink;
    default:
      return DISPLAY_COLORS.corporate.primary;
  }
}

/**
 * 3D场景配置 - 科幻增强版
 */
export const SCENE_CONFIG = {
  // 光照配置 - 科幻照明系统
  lighting: {
    ambient: {
      color: "#ffffff",
      intensity: 0.3, // 降低环境光强度
    },
    directional: {
      color: "#ffffff",
      intensity: 0.6, // 降低主光源强度
      position: [50, 60, 50],
    },
    point: {
      color: DISPLAY_COLORS.corporate.accent,
      intensity: 0.8,
      position: [0, 25, 0],
      distance: 100,
    },
    quantum: {
      color: DISPLAY_COLORS.neon.purple,
      intensity: 0.4,
      position: [30, 20, 30],
      distance: 80,
    },
    neural: {
      color: DISPLAY_COLORS.neon.green,
      intensity: 0.4,
      position: [-30, 20, -30],
      distance: 80,
    },
  },

  // 环境配置 - 深空科幻环境
  environment: {
    backgroundColor: DISPLAY_COLORS.ui.background.primary,
    gridColor: DISPLAY_COLORS.ui.border.primary,
    platformColor: DISPLAY_COLORS.ui.background.secondary,
    starCount: 2500, // 增加星星数量
    starRadius: 300, // 扩大星域范围
    nebula: {
      enabled: true,
      colors: [
        DISPLAY_COLORS.neon.purple,
        DISPLAY_COLORS.neon.blue,
        DISPLAY_COLORS.neon.cyan,
      ],
      opacity: 0.3,
    },
  },

  // 动画配置 - 科幻动画系统
  animation: {
    rotationSpeed: 0.008, // 旋转速度
    pulseSpeed: 2.5, // 脉冲速度
    scanSpeed: 1.8, // 扫描速度
    floatAmplitude: 0.6, // 浮动幅度
    floatSpeed: 1.2, // 浮动速度
    glowPulseSpeed: 3.0, // 发光脉冲速度
    energyFlowSpeed: 2.0, // 能量流动速度
    hologramFlicker: 0.1, // 全息闪烁率
    quantumPhase: 1.5, // 量子相位变化
  },

  // 粒子系统配置
  particles: {
    ambient: {
      count: 1500,
      color: DISPLAY_COLORS.material.effect.particle,
      size: 1.2,
      opacity: 0.6,
      speed: 0.02,
    },
    energy: {
      count: 800,
      colors: [
        DISPLAY_COLORS.neon.blue,
        DISPLAY_COLORS.neon.green,
        DISPLAY_COLORS.neon.purple,
      ],
      size: 0.8,
      opacity: 0.8,
      speed: 0.05,
    },
    quantum: {
      count: 300,
      color: DISPLAY_COLORS.neon.purple,
      size: 1.5,
      opacity: 0.4,
      speed: 0.01,
    },
  },

  // 特效配置
  effects: {
    hologram: {
      enabled: true,
      opacity: 0.7,
      scanLines: true,
      flicker: true,
    },
    glow: {
      enabled: true,
      intensity: 0.6,
      bloomStrength: 1.5,
    },
    scanLine: {
      enabled: true,
      speed: 2.0,
      color: DISPLAY_COLORS.neon.green,
      opacity: 0.8,
    },
    energyField: {
      enabled: true,
      intensity: 0.4,
      waveSpeed: 1.5,
    },
  },
} as const;

/**
 * UI主题配置 - 大屏专用科幻版
 */
export const DISPLAY_THEME = {
  // 边框圆角 - 科技风格
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    xlarge: "16px",
    round: "50%",
  },

  // 阴影效果 - 霓虹发光
  shadows: {
    small: "0 2px 4px rgba(0, 0, 0, 0.3)",
    medium: "0 4px 8px rgba(0, 0, 0, 0.4)",
    large: "0 8px 16px rgba(0, 0, 0, 0.5)",
    glow: `0 0 20px ${DISPLAY_COLORS.corporate.accent}60`,
    neonBlue: `0 0 30px ${DISPLAY_COLORS.neon.blue}80`,
    neonGreen: `0 0 30px ${DISPLAY_COLORS.neon.green}80`,
    neonPurple: `0 0 30px ${DISPLAY_COLORS.neon.purple}80`,
    quantum: `0 0 25px ${DISPLAY_COLORS.neon.purple}60`,
    neural: `0 0 25px ${DISPLAY_COLORS.neon.green}60`,
  },

  // 过渡动画 - 流畅科技感
  transitions: {
    instant: "0.1s ease-out",
    fast: "0.2s ease-out",
    medium: "0.3s ease-out",
    slow: "0.5s ease-out",
    smooth: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
    "6xl": "3.75rem",
    "7xl": "4.5rem",
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
    "4xl": "4rem",
    "5xl": "5rem",
  },

  // Z-index层级
  zIndex: {
    background: 0,
    normal: 1,
    overlay: 10,
    modal: 20,
    popup: 30,
    tooltip: 40,
    top: 50,
  },

  // 动画关键帧
  keyframes: {
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    spin: "spin 1s linear infinite",
    bounce: "bounce 1s infinite",
    glow: "glow 2s ease-in-out infinite alternate",
    scanLine: "scanLine 3s linear infinite",
    dataFlow: "dataFlow 2s linear infinite",
    hologramFlicker: "hologramFlicker 0.1s linear infinite",
    quantumPhase: "quantumPhase 3s ease-in-out infinite",
  },
} as const;

/**
 * 性能配置
 */
export const PERFORMANCE_CONFIG = {
  // LOD (Level of Detail) 配置
  lod: {
    high: 40, // 高质量渲染距离
    medium: 80, // 中等质量渲染距离
    low: 120, // 低质量渲染距离
  },

  // 粒子系统限制
  particles: {
    maxCount: 3000, // 最大粒子数
    batchSize: 500, // 批处理大小
    cullingDistance: 100, // 剔除距离
  },

  // 帧率优化
  framerate: {
    target: 60, // 目标帧率
    adaptiveQuality: true, // 自适应质量
    vsync: true, // 垂直同步
  },

  // 内存管理
  memory: {
    texturePoolSize: 256, // 纹理池大小 (MB)
    geometryPoolSize: 128, // 几何体池大小 (MB)
    garbageCollectionInterval: 30000, // 垃圾回收间隔 (ms)
  },
} as const;
