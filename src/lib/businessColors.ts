/**
 * 企业级统一配色方案 - 2024 未来科技版
 * Enterprise Unified Color Scheme - 2024 Future Tech Edition
 */

export const BUSINESS_COLORS = {
  // 主色调 - Primary Colors (更加现代化的渐变色)
  primary: "#0052ff", // 科技蓝 - Tech Blue
  primaryLight: "#3d7bff", // 亮科技蓝 - Bright Tech Blue
  primaryDark: "#003acc", // 深科技蓝 - Deep Tech Blue
  primaryAccent: "#00d4ff", // 科技亮蓝 - Tech Accent Blue

  // 功能色 - Functional Colors (更鲜明的对比)
  success: "#00ff88", // 成功绿 - Success Green (更亮的霓虹绿)
  successLight: "#33ffaa", // 浅绿 - Light Green
  successDark: "#00cc66", // 深绿 - Dark Green

  warning: "#ff8800", // 警告橙 - Warning Orange (更鲜艳的橙色)
  warningLight: "#ffaa33", // 浅橙 - Light Orange
  warningDark: "#cc6600", // 深橙 - Dark Orange

  danger: "#ff3366", // 危险红 - Danger Red (更鲜明的红色)
  dangerLight: "#ff5577", // 浅红 - Light Red
  dangerDark: "#cc1144", // 深红 - Dark Red

  // 信息色 - Information Colors (增强的青色系)
  info: "#00ccff", // 信息青 - Info Cyan (更亮的青色)
  infoLight: "#33ddff", // 浅青 - Light Cyan
  infoDark: "#0099cc", // 深青 - Dark Cyan

  // 特殊功能色 - Special Function Colors (霓虹色系)
  purple: "#aa33ff", // 紫色 - Purple (更亮的紫色)
  purpleLight: "#bb55ff", // 浅紫 - Light Purple
  purpleDark: "#8811cc", // 深紫 - Dark Purple

  indigo: "#6644ff", // 靛蓝 - Indigo (更鲜艳的靛蓝)
  indigoLight: "#8866ff", // 浅靛蓝 - Light Indigo
  indigoDark: "#4422cc", // 深靛蓝 - Dark Indigo

  // 霓虹色系 - Neon Colors (新增)
  neon: {
    blue: "#00f5ff", // 霓虹蓝
    green: "#39ff14", // 霓虹绿
    purple: "#bf00ff", // 霓虹紫
    pink: "#ff1493", // 霓虹粉
    orange: "#ff6600", // 霓虹橙
    yellow: "#ffff00", // 霓虹黄
    cyan: "#00ffff", // 霓虹青
  },

  // 中性色 - Neutral Colors (深色主题优化)
  slate: "#64748b", // 板岩灰 - Slate Gray
  slateLight: "#94a3b8", // 浅板岩灰 - Light Slate
  slateDark: "#475569", // 深板岩灰 - Dark Slate

  // 背景色 - Background Colors (深色科技主题)
  backgroundPrimary: "#0a0e1a", // 主背景 - 深空蓝
  backgroundSecondary: "#111827", // 次背景 - 深灰蓝
  backgroundTertiary: "#1f2937", // 三级背景 - 中灰蓝
  backgroundAccent: "#0f172a", // 强调背景 - 极深蓝

  // 文本色 - Text Colors (高对比度)
  textPrimary: "#f8fafc", // 主文本 - 纯白
  textSecondary: "#cbd5e1", // 次文本 - 浅灰
  textTertiary: "#94a3b8", // 三级文本 - 中灰
  textAccent: "#00d4ff", // 强调文本 - 科技蓝

  // 3D材质专用色 - 3D Material Colors (科幻主题)
  material: {
    building: "#0052ff", // 建筑物 - 科技蓝
    server: "#00ff88", // 服务器 - 霓虹绿
    network: "#aa33ff", // 网络节点 - 霓虹紫
    platform: "#1f2937", // 平台基座 - 深灰
    grid: "#374151", // 网格线 - 中灰
    highlight: "#00f5ff", // 高亮 - 霓虹蓝
    security: "#ff3366", // 安全相关 - 警报红
    data: "#00ccff", // 数据相关 - 数据青
    energy: "#ffff00", // 能量 - 霓虹黄
    quantum: "#bf00ff", // 量子 - 量子紫
  },

  // 渐变色系 - Gradient Colors (新增)
  gradients: {
    primary: "linear-gradient(135deg, #0052ff 0%, #00d4ff 100%)",
    success: "linear-gradient(135deg, #00ff88 0%, #39ff14 100%)",
    warning: "linear-gradient(135deg, #ff8800 0%, #ffaa33 100%)",
    danger: "linear-gradient(135deg, #ff3366 0%, #ff5577 100%)",
    info: "linear-gradient(135deg, #00ccff 0%, #33ddff 100%)",
    purple: "linear-gradient(135deg, #aa33ff 0%, #bb55ff 100%)",
    cyber: "linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #1f2937 100%)",
    neon: "linear-gradient(45deg, #00f5ff 0%, #39ff14 25%, #bf00ff 50%, #ff1493 75%, #00f5ff 100%)",
    matrix:
      "linear-gradient(180deg, transparent 0%, #39ff14 50%, transparent 100%)",
  },
} as const;

/**
 * 3D模型配置 - 升级版
 * 3D Model Configurations - Enhanced Edition
 */
export const MODEL_CONFIG = {
  // 建筑区域配置 - 未来城市风格
  districts: [
    {
      name: "量子总部",
      nameEn: "Quantum HQ",
      position: [0, 0, 0],
      color: BUSINESS_COLORS.primary,
      accentColor: BUSINESS_COLORS.primaryAccent,
      theme: "quantum-headquarters",
      buildings: 5,
      height: 35,
      techLevel: "quantum",
    },
    {
      name: "神经网络中心",
      nameEn: "Neural Network Center",
      position: [45, 0, 0],
      color: BUSINESS_COLORS.success,
      accentColor: BUSINESS_COLORS.neon.green,
      theme: "neural-office",
      buildings: 7,
      height: 28,
      techLevel: "neural",
    },
    {
      name: "数据堡垒",
      nameEn: "Data Fortress",
      position: [-45, 0, 0],
      color: BUSINESS_COLORS.info,
      accentColor: BUSINESS_COLORS.neon.cyan,
      theme: "data-fortress",
      buildings: 4,
      height: 40,
      techLevel: "quantum",
    },
    {
      name: "AI研发区",
      nameEn: "AI Research Zone",
      position: [0, 0, 45],
      color: BUSINESS_COLORS.purple,
      accentColor: BUSINESS_COLORS.neon.purple,
      theme: "ai-research",
      buildings: 6,
      height: 30,
      techLevel: "ai",
    },
    {
      name: "网络安全基地",
      nameEn: "Cyber Security Base",
      position: [0, 0, -45],
      color: BUSINESS_COLORS.danger,
      accentColor: BUSINESS_COLORS.neon.pink,
      theme: "cyber-security",
      buildings: 4,
      height: 32,
      techLevel: "security",
    },
  ],

  // 网络拓扑配置 - 量子网络
  network: {
    quantum_core: {
      position: [0, 15, 0],
      color: BUSINESS_COLORS.primary,
      accentColor: BUSINESS_COLORS.neon.blue,
      size: 3,
      type: "quantum-core",
      energy: 100,
    },
    neural_hubs: [
      {
        position: [25, 10, 0],
        color: BUSINESS_COLORS.success,
        accentColor: BUSINESS_COLORS.neon.green,
        size: 2,
        energy: 85,
        connections: 12,
      },
      {
        position: [-25, 10, 0],
        color: BUSINESS_COLORS.success,
        accentColor: BUSINESS_COLORS.neon.green,
        size: 2,
        energy: 78,
        connections: 10,
      },
      {
        position: [0, 10, 25],
        color: BUSINESS_COLORS.success,
        accentColor: BUSINESS_COLORS.neon.green,
        size: 2,
        energy: 92,
        connections: 14,
      },
      {
        position: [0, 10, -25],
        color: BUSINESS_COLORS.success,
        accentColor: BUSINESS_COLORS.neon.green,
        size: 2,
        energy: 88,
        connections: 11,
      },
    ],
    data_nodes: [
      {
        position: [35, 6, 20],
        color: BUSINESS_COLORS.info,
        accentColor: BUSINESS_COLORS.neon.cyan,
        size: 1.5,
      },
      {
        position: [35, 6, -20],
        color: BUSINESS_COLORS.info,
        accentColor: BUSINESS_COLORS.neon.cyan,
        size: 1.5,
      },
      {
        position: [-35, 6, 20],
        color: BUSINESS_COLORS.info,
        accentColor: BUSINESS_COLORS.neon.cyan,
        size: 1.5,
      },
      {
        position: [-35, 6, -20],
        color: BUSINESS_COLORS.info,
        accentColor: BUSINESS_COLORS.neon.cyan,
        size: 1.5,
      },
      {
        position: [20, 6, 35],
        color: BUSINESS_COLORS.info,
        accentColor: BUSINESS_COLORS.neon.cyan,
        size: 1.5,
      },
      {
        position: [-20, 6, 35],
        color: BUSINESS_COLORS.info,
        accentColor: BUSINESS_COLORS.neon.cyan,
        size: 1.5,
      },
      {
        position: [20, 6, -35],
        color: BUSINESS_COLORS.info,
        accentColor: BUSINESS_COLORS.neon.cyan,
        size: 1.5,
      },
      {
        position: [-20, 6, -35],
        color: BUSINESS_COLORS.info,
        accentColor: BUSINESS_COLORS.neon.cyan,
        size: 1.5,
      },
    ],
  },

  // 数据中心配置 - 量子数据中心
  datacenters: [
    {
      name: "量子主数据中心",
      nameEn: "Quantum Primary Data Center",
      position: [-45, 8, 0],
      color: BUSINESS_COLORS.info,
      accentColor: BUSINESS_COLORS.neon.cyan,
      servers: 12,
      capacity: "1000PB",
      efficiency: 98.5,
      techType: "quantum",
    },
    {
      name: "AI神经网络中心",
      nameEn: "AI Neural Network Center",
      position: [45, 8, 0],
      color: BUSINESS_COLORS.success,
      accentColor: BUSINESS_COLORS.neon.green,
      servers: 10,
      capacity: "750PB",
      efficiency: 96.2,
      techType: "neural",
    },
    {
      name: "量子云计算中心",
      nameEn: "Quantum Cloud Center",
      position: [0, 8, 45],
      color: BUSINESS_COLORS.purple,
      accentColor: BUSINESS_COLORS.neon.purple,
      servers: 8,
      capacity: "500PB",
      efficiency: 97.8,
      techType: "quantum-cloud",
    },
    {
      name: "网络安全堡垒",
      nameEn: "Cyber Security Fortress",
      position: [0, 8, -45],
      color: BUSINESS_COLORS.danger,
      accentColor: BUSINESS_COLORS.neon.pink,
      servers: 6,
      capacity: "300PB",
      efficiency: 99.1,
      techType: "security",
    },
  ],

  // 性能配置 - 高性能优化
  performance: {
    particleCount: 1500, // 增加粒子数量
    instanceLimits: {
      buildings: 35, // 增加建筑数量
      vehicles: 20, // 增加载具数量
      networkNodes: 30, // 增加网络节点
      dataStreams: 50, // 新增数据流
    },
    lodDistances: {
      high: 40, // 高质量距离
      medium: 80, // 中等质量距离
      low: 120, // 低质量距离
    },
    animation: {
      rotationSpeed: 0.008, // 旋转速度
      pulseSpeed: 2.5, // 脉冲速度
      flowSpeed: 1.8, // 流动速度
      glowIntensity: 0.6, // 发光强度
    },
  },

  // 特效配置 - 新增
  effects: {
    hologram: {
      enabled: true,
      opacity: 0.7,
      animationSpeed: 1.2,
    },
    dataStream: {
      enabled: true,
      particleCount: 20,
      speed: 2.0,
      colors: [
        BUSINESS_COLORS.neon.blue,
        BUSINESS_COLORS.neon.green,
        BUSINESS_COLORS.neon.purple,
      ],
    },
    energyField: {
      enabled: true,
      intensity: 0.4,
      pulseFactor: 1.5,
    },
    quantumEffect: {
      enabled: true,
      flickerRate: 0.1,
      waveAmplitude: 0.3,
    },
  },
} as const;

/**
 * 获取状态对应的颜色 - 升级版
 */
export function getStatusColor(
  status:
    | "normal"
    | "warning"
    | "critical"
    | "offline"
    | "quantum"
    | "neural"
    | "ai",
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
    case "quantum":
      return BUSINESS_COLORS.neon.blue;
    case "neural":
      return BUSINESS_COLORS.neon.green;
    case "ai":
      return BUSINESS_COLORS.neon.purple;
    default:
      return BUSINESS_COLORS.info;
  }
}

/**
 * 获取威胁等级对应的颜色 - 增强版
 */
export function getThreatLevelColor(
  level: "safe" | "low" | "medium" | "high" | "critical" | "quantum-threat",
): string {
  switch (level) {
    case "safe":
      return BUSINESS_COLORS.success;
    case "low":
      return BUSINESS_COLORS.neon.green;
    case "medium":
      return BUSINESS_COLORS.warning;
    case "high":
      return BUSINESS_COLORS.danger;
    case "critical":
      return BUSINESS_COLORS.dangerDark;
    case "quantum-threat":
      return BUSINESS_COLORS.neon.purple;
    default:
      return BUSINESS_COLORS.info;
  }
}

/**
 * 获取技术等级颜色
 */
export function getTechLevelColor(
  techLevel: "basic" | "advanced" | "quantum" | "neural" | "ai",
): string {
  switch (techLevel) {
    case "basic":
      return BUSINESS_COLORS.slate;
    case "advanced":
      return BUSINESS_COLORS.info;
    case "quantum":
      return BUSINESS_COLORS.neon.blue;
    case "neural":
      return BUSINESS_COLORS.neon.green;
    case "ai":
      return BUSINESS_COLORS.neon.purple;
    default:
      return BUSINESS_COLORS.primary;
  }
}

/**
 * 企业UI主题配置 - 2024版
 */
export const UI_THEME = {
  borderRadius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    neon: "0 0 20px rgba(0, 245, 255, 0.5)",
    glow: "0 0 30px rgba(57, 255, 20, 0.6)",
    quantum: "0 0 25px rgba(191, 0, 255, 0.4)",
  },
  animations: {
    duration: {
      fast: "0.2s",
      normal: "0.3s",
      slow: "0.5s",
      verySlow: "1s",
    },
    easing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
} as const;

/**
 * 响应式设计断点
 */
export const BREAKPOINTS = {
  mobile: "768px",
  tablet: "1024px",
  desktop: "1280px",
  ultrawide: "1920px",
} as const;

/**
 * 可访问性配置
 */
export const ACCESSIBILITY = {
  highContrast: {
    enabled: false,
    multiplier: 1.5,
  },
  reducedMotion: {
    respectPreference: true,
    fallbackDuration: "0.01s",
  },
  focus: {
    outlineColor: BUSINESS_COLORS.primaryAccent,
    outlineWidth: "2px",
    outlineStyle: "solid",
  },
} as const;
