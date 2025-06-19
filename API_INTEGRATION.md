# CyberGuard API 集成指南

本文档描述了 CyberGuard 监控平台与后端 API 的集成功能，基于提供的 OpenAPI 规范实现。

## 🌐 API 服务器信息

- **基础URL**: `http://jq41030xx76.vicp.fun`
- **API版本**: v1
- **API前缀**: `/api/v1`

## 🔧 集成功能概述

### 1. 认证系统 (`/api/v1/auth/`)

#### 登录功能

- **端点**: `POST /api/v1/auth/auth/login`
- **功能**: OAuth2 兼容的令牌登录
- **支持**: 真实API账号 + 测试账号fallback

#### 用户管理

- **端点**: `GET /api/v1/auth/auth/me`
- **功能**: 获取当前用户信息
- **端点**: `POST /api/v1/auth/auth/register`
- **功能**: 注册新用户

### 2. 系统指标监控 (`/api/v1/metrics/`)

#### 实时系统指标

- **端点**: `GET /api/v1/metrics/current/`
- **数据**: CPU、内存、磁盘、网络使用率
- **更新频率**: 可配置（默认5秒）

#### 历史数据查询

- **端点**: `GET /api/v1/metrics/`
- **参数**: `start_time`, `end_time`
- **功能**: 获取指定时间范围的历史数据

#### 系统摘要

- **端点**: `GET /api/v1/metrics/summary/`
- **功能**: 获取系统关键指标摘要

### 3. 网络接口监控 (`/api/v1/metrics/network-interfaces/`)

#### 实时网络流量

- **端点**: `GET /api/v1/metrics/network-interfaces/current/`
- **数据**: 字节发送/接收、数据包统计、错误率

#### 单个接口监控

- **端点**: `GET /api/v1/metrics/network-interfaces/{interface_name}/`
- **功能**: 获取指定网卡的详细数据

### 4. 进程监控 (`/api/v1/system/processes`)

#### 进程列表

- **端点**: `GET /api/v1/system/processes`
- **数据**: PID、CPU使用率、内存使用、I/O统计

#### 实时收集

- **端点**: `POST /api/v1/system/processes/collect`
- **功能**: 收集并保存当前进程指标

### 5. 网络连接监控 (`/api/v1/system/network`)

#### 连接列表

- **端点**: `GET /api/v1/system/network`
- **数据**: 协议、本地/远程地址、连接状态

### 6. 服务状态监控 (`/api/v1/system/services`)

#### 服务列表

- **端点**: `GET /api/v1/system/services`
- **数据**: 服务名称、运行状态、服务状态

### 7. 日志管理 (`/api/v1/logs/`)

#### 日志级别控制

- **端点**: `GET /api/v1/logs/log-levels`
- **端点**: `PUT /api/v1/logs/log-level`
- **功能**: 动态调整系统日志级别

## 💻 前端集成架构

### 服务层架构 (`src/services/api.ts`)

```typescript
// API服务层
export class ApiService {
  // 认证相关
  async login(credentials: LoginCredentials);
  async getCurrentUser();

  // 系统指标
  async getSystemMetrics();
  async getCurrentMetrics();

  // 网络接口
  async getNetworkInterfaces();
  async getCurrentNetworkMetrics();

  // 进程和服务
  async getProcesses();
  async getServices();

  // 批量收集
  async collectAllMetrics();
}
```

### Hook层架构 (`src/hooks/useRealTimeAPI.ts`)

```typescript
// 主要数据获取Hook
useRealTimeAPI({
  interval: 5000, // 更新间隔
  enabled: true, // 是否启用
  fallbackToMock: true, // 是否使用模拟数据作为fallback
});

// 专用Hooks
useSystemSummary(); // 系统摘要
useNetworkInterfaces(); // 网络接口
useProcesses(); // 进程监控
useServices(); // 服务状态
useHealthCheck(); // 健康检查
```

### 认证上下文 (`src/contexts/AuthContext.tsx`)

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (credentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}
```

## 🎯 页面功能说明

### 1. 登录页面 (`/login`)

- **智能认证**: 优先尝试真实API，失败时fallback到测试账号
- **测试账号**: 保留原有的4个测试用户
- **错误处理**: 详细的错误信息显示

### 2. 系统监控页面 (`/system-monitor`)

- **实时数据**: 展示真实的系统指标
- **数据状态**: 清楚显示数据来源（API/模拟）
- **交互控制**: 暂停/继续、手动刷新、数据收集
- **原始数据**: 可查看原始API响应

### 3. 3D态势大屏 (`/situation`)

- **数据源**: 自动使用真实API数据
- **Fallback**: API失败时无缝切换到模拟数据
- **多视图**: 支持2D/3D/分屏/四分屏模式

### 4. 仪表板首页 (`/`)

- **API状态**: 实时显示API连接状态
- **健康检查**: 每30秒自动检查API可用性

## 🔄 数据流架构

```
API Server (jq41030xx76.vicp.fun)
    ↓
HttpClient (认证 + 请求处理)
    ↓
ApiService (业务逻辑层)
    ↓
useRealTimeAPI (React Hook层)
    ↓
React Components (UI组件)
```

## 🛡️ 错误处理策略

### 1. 分层错误处理

- **网络层**: HTTP错误、超时、连接失败
- **服务层**: API错误码、数据格式错误
- **Hook层**: 状态管理、重试机制
- **组件层**: 用户友好的错误显示

### 2. Fallback机制

- **认证**: API登录失败 → 测试账号
- **数据**: API数据失败 → 模拟数据
- **显示**: 错误状态 → 友好提示

### 3. 自动恢复

- **健康检查**: 定期检查API状态
- **自动重试**: 网络错误时自动重试
- **状态恢复**: API恢复时自动切换回真实数据

## 📊 数据格式标准化

### 输入格式（API响应）

```typescript
interface SystemMetrics {
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
  // ... 其他API字段
}
```

### 输出格式（组件使用）

```typescript
interface StandardizedData {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  // ... 标准化字段
}
```

## 🚀 使用方法

### 1. 开发环境

```bash
# 启动应用
npm run dev

# 访问页面
http://localhost:8080
```

### 2. 登录测试

- **真实API**: 使用后端提供的用户账号
- **测试账号**:
  - admin/123456 (超级管理员)
  - security/security123 (安全管理员)
  - analyst/analyst123 (数据分析师)
  - operator/operator123 (系统操作员)

### 3. 功能验证

1. **首页**: 查看API状态指示器
2. **系统监控**: 查看实时数据和数据源状态
3. **3D态势**: 验证数据更新和视图切换
4. **认证**: 测试登录/登出功能

## 🔧 配置选项

### API配置

```typescript
// src/services/api.ts
const API_BASE_URL = "http://jq41030xx76.vicp.fun";
const API_VERSION = "v1";
```

### Hook配置

```typescript
useRealTimeAPI({
  interval: 5000, // 数据更新间隔(ms)
  enabled: true, // 是否启用自动更新
  fallbackToMock: true, // 是否启用模拟数据fallback
});
```

## 📝 注意事项

1. **CORS设置**: 确保API服务器允许前端域名跨域访问
2. **认证令牌**: JWT token自动存储在localStorage中
3. **错误监控**: 所有API错误都会在控制台记录
4. **性能优化**: 使用React.memo和useMemo优化渲染性能
5. **数据缓存**: 避免重复请求，合理使用缓存机制

## 🐛 故障排除

### API连接失败

1. 检查网络连接
2. 验证API服务器状态
3. 查看浏览器控制台错误
4. 确认CORS配置

### 认证问题

1. 检查用户名密码
2. 验证API认证端点
3. 清除localStorage中的过期token
4. 使用测试账号验证

### 数据显示异常

1. 查看数据源状态（API/模拟）
2. 检查数据转换逻辑
3. 验证API响应格式
4. ��看Hook错误状态

---

通过以上集成，CyberGuard平台现在具备了完整的真实API数据获取能力，同时保持了良好的用户体验和容错机制。
