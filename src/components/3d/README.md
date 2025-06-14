# CyberGuard 3D 网络安全模型系统

## 🌟 概述

CyberGuard系统提供了多个专业的3D可视化模型，用于展示网络安全相关的概念和实时数据。这些模型专为网络安全监控系统设计，提供直观的可视化体验。

## 🛡️ 可用模型

### 1. 网络安全中心 (CyberSecurityModel)

**文件**: `CyberSecurityModel.tsx`

**特性**:

- ✨ 动态防护盾牌（八边形设计，金属质感）
- 🔄 三层旋转防护环
- 🌐 网络节点网络（核心节点 + 外围节点）
- 📊 威胁检测雷达（实时扫描）
- 📦 数据立方体网格
- 💫 发光粒子效果
- 🎯 中心发光核心

**动画效果**:

- 盾牌自动旋转和摆动
- 防护环独立旋转
- 雷达扫描线360度旋转
- 网络节点脉冲效果
- 数据立方体浮动

### 2. 网络流量监控 (NetworkTrafficModel)

**文件**: `NetworkTrafficModel.tsx`

**特性**:

- 🖥️ 多种服务器节点类型：
  - 防火墙（橙色，带防护环）
  - 数据库（绿色，多层磁盘）
  - 路由器（紫色，四天线）
  - 普通服务器（蓝色）
- 📡 动态数据流粒子
- 🔗 网络连接线
- ⚡ 双向流量可视化
- 🔍 威胁检测扫描环
- 🛡️ 外围安全屏障

**交互特性**:

- 实时数据包传输动画
- 不同颜色表示不同数据类型
- 服务器状态指示灯
- 网络拓扑自动布局

### 3. 威胁可视化 (ThreatVisualization)

**文件**: `ThreatVisualization.tsx`

**特性**:

- ⚠️ 威胁等级可视化：
  - 🔴 严重 (Critical) - 红色，大尺寸
  - 🟠 高危 (High) - 橙色
  - 🟡 中危 (Medium) - 黄色
  - 🟢 低危 (Low) - 绿色
- 🎯 攻击路径追踪
- 💥 威胁扩散效果
- 🛡️ 中心防护节点
- 📊 交互式威胁信息显示
- 🔍 鼠标悬停详情

**威胁类型**:

- 恶意软件 (Malware)
- DDoS攻击
- 钓鱼攻击 (Phishing)
- 入侵检测 (Intrusion)
- 数据泄露 (Data Breach)

### 4. 简化防护盾 (SimpleShieldModel)

**文件**: `SimpleShieldModel.tsx`

**特性**:

- 🛡️ 基础盾牌设计
- ✨ 发光核心
- 🔵 单层防护环
- ⚡ 性能优化
- 📱 移动端友好

## 🎮 交互控制

### 鼠标操作

- **左键拖拽**: 旋转视角
- **滚轮**: 缩放
- **右键拖拽**: 平移（部分模型）
- **悬停**: 显示详细信息（威胁模型）

### 自动化

- **自动旋转**: 所有模型默认启用
- **实时动画**: 持续运行的粒子和动画效果
- **响应式**: 根据设备性能自动调整质量

## 🎨 视觉设计

### 配色方案

- **主要色彩**: 霓虹蓝 (#00f5ff)
- **成功/安全**: 霓虹绿 (#39ff14)
- **警告**: 霓虹黄 (#ffff00)
- **危险**: 威胁红 (#ff0040)
- **高危**: 橙色 (#ff6600)
- **特殊**: 紫色 (#bf00ff)

### 材质效果

- **金属质感**: 高metalness，低roughness
- **发光效果**: emissive材质
- **透明度**: 分层透明效果
- **线框**: 网格和连接线
- **粒子**: 小球体发光粒子

## 💡 使用方式

### 1. 单独使用

```tsx
import { CyberSecurityModel } from "./CyberSecurityModel";

<Canvas>
  <CyberSecurityModel />
</Canvas>;
```

### 2. 场景包装

```tsx
import { CyberSecurityScene } from "./CyberSecurityScene";

<CyberSecurityScene />;
```

### 3. 模型选择器

```tsx
import { ModelSelector } from "./ModelSelector";

<ModelSelector />;
```

## 🔧 技术规格

### 依赖

- React Three Fiber
- React Three Drei
- Three.js

### 性能考虑

- 粒子数量优化
- LOD (Level of Detail) 支持
- 设备性能检测
- 自动质量调整

### 兼容性

- WebGL 2.0
- 现代浏览器
- 移动端优化
- 错误边界保护

## 🛠️ 自定义

### 修改颜色

在各个模型文件中搜索颜色值并替换：

```tsx
// 修改主题色
const primaryColor = "#00f5ff"; // 霓虹蓝
const dangerColor = "#ff0040"; // 威胁红
```

### 调整动画

修改useFrame中的时间参数：

```tsx
useFrame((state) => {
  const time = state.clock.getElapsedTime();
  // 调整旋转速度
  mesh.rotation.y = time * 0.5; // 0.5 = 速度倍数
});
```

### 添加新威胁类型

在ThreatVisualization中扩展威胁类型：

```tsx
type ThreatType = "malware" | "ddos" | "phishing" | "your_new_type";
```

## 🚀 未来扩展

### 计划功能

- [ ] 实时数据集成
- [ ] 声音效果
- [ ] VR/AR支持
- [ ] 更多威胁类型
- [ ] 性能分析工具
- [ ] 导出功能

### 可能的新模���

- 数据中心布局
- 全球网络地图
- 时间线威胁历史
- AI防护机器人

## 📝 注意事项

1. **性能**: 3D渲染会消耗GPU资源
2. **兼容性**: 需要支持WebGL的浏览器
3. **移动端**: 在移动设备上会自动降级
4. **错误处理**: 包含完整的错误边界
5. **可访问性**: 提供文字替代方案

---

_这些3D模型专为网络安全专业人员设计，提供直观的可视化体验来理解复杂的网络安全概念。_
