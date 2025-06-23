/**
 * API 服务层 - 集成真实的后端API
 * 基于 OpenAPI 规范实现完整的监控平台数据获取
 */

// API基础配置
const API_BASE_URL = import.meta.env.DEV
  ? "" // 开发环境使用代理
  : "http://jq41030xx76.vicp.fun"; // 生产环境直接连接

console.log("🔧 API配置:", {
  isDev: import.meta.env.DEV,
  baseURL: API_BASE_URL || "使用代理",
  fullURL: `${API_BASE_URL}/api/v1/metrics/`,
});
const API_VERSION = "v1";
const API_PREFIX = `/api/${API_VERSION}`;

// TypeScript 类型定义
export interface SystemMetrics {
  cpu_percent: number;
  cpu_count: number;
  memory_total: number;
  memory_available: number;
  memory_percent: number;
  disk_total: number;
  disk_used: number;
  disk_free: number;
  disk_percent: number;
  disk_is_simulated: boolean;
  net_bytes_sent: number;
  net_bytes_recv: number;
  load_1min: number | null;
  load_5min: number | null;
  load_15min: number | null;
  cpu_alert: boolean;
  memory_alert: boolean;
  disk_alert: boolean;
  id: number;
  timestamp: string;
}

export interface SystemMetricsSummary {
  current_cpu_percent: number;
  current_memory_percent: number;
  current_disk_percent: number;
  has_alerts: boolean;
  alert_count: number;
}

export interface NetworkInterfaceMetrics {
  id: number;
  timestamp: string;
  interface_name: string;
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
  errin: number;
  errout: number;
  dropin: number;
  dropout: number;
  config?: NetworkInterfaceConfig;
}

export interface NetworkInterfaceConfig {
  interface_name: string;
  ip_address?: string;
  netmask?: string;
  mac_address?: string;
  is_up: boolean;
  mtu?: number;
  speed?: number;
  duplex?: string;
}

export interface ProcessMetrics {
  pid: number;
  name: string;
  status: string;
  username?: string;
  cpu_percent: number;
  memory_percent: number;
  memory_rss: number;
  memory_vms: number;
  io_read_bytes?: number;
  io_write_bytes?: number;
  threads_count: number;
  create_time: string;
  id: number;
  timestamp: string;
}

export interface NetworkConnection {
  protocol: string;
  local_address: string;
  local_port: number;
  remote_address: string;
  remote_port: number;
  status: string;
  pid?: number;
  process_name?: string;
  id: number;
  timestamp: string;
}

export interface ServiceStatus {
  name: string;
  status: string;
  running: boolean;
}

export interface AuthTokenResponse {
  code: number;
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  code: number;
}

// 认证管理类
class AuthManager {
  private static instance: AuthManager;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem("access_token");
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem("access_token");
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }
}

// HTTP 客户端类
class HttpClient {
  private authManager: AuthManager;

  constructor() {
    this.authManager = AuthManager.getInstance();
  }

  // 创建超时信号，兼容旧浏览器
  private createTimeoutSignal(timeout: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    // 添加更多CORS和网络兼容性选项
    const config: RequestInit = {
      ...options,
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        ...this.authManager.getAuthHeaders(),
        ...options.headers,
      },
      signal: this.createTimeoutSignal(15000), // 增加到15秒超时
    };

    console.log(`API Request: ${options.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, config);

      // 检查响应是否为有效的JSON
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        console.error(
          `API Error: ${response.status} - ${data?.detail || data}`,
        );
        return {
          error:
            data?.detail || data || `HTTP error! status: ${response.status}`,
          code: response.status,
        };
      }

      return {
        data,
        code: response.status,
      };
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);

      // 更详细的错误处理
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            error: "请求超时，请检查网络连接",
            code: 408,
          };
        } else if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          return {
            error: `无法连接到API服务器 (${API_BASE_URL})，可能原因：
            1. 网络连接问题
            2. CORS跨域限制
            3. API服务器不可访问
            4. 防火墙阻止连接`,
            code: 0,
            message: "Connection failed",
          };
        } else {
          return {
            error: error.message,
            code: 0,
          };
        }
      }

      return {
        error: "网络连接错误",
        code: 0,
      };
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postForm<T>(endpoint: string, data: FormData): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      method: "POST",
      body: data,
      headers: {
        ...this.authManager.getAuthHeaders(),
      },
    };

    // 移除 Content-Type，让浏览器自动设置
    delete (config.headers as any)["Content-Type"];

    return this.request<T>(endpoint, config);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// API 服务类
export class ApiService {
  private http: HttpClient;
  private auth: AuthManager;

  constructor() {
    this.http = new HttpClient();
    this.auth = AuthManager.getInstance();
  }

  // === 认证相关 ===
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<AuthTokenResponse>> {
    console.log(
      "Attempting login to:",
      `${API_BASE_URL}${API_PREFIX}/auth/auth/login`,
    );
    console.log("Login credentials:", {
      username: credentials.username,
      password: "***",
    });

    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("grant_type", "password");

    const response = await this.http.postForm<AuthTokenResponse>(
      `${API_PREFIX}/auth/auth/login`,
      formData,
    );

    console.log("Login response:", {
      code: response.code,
      hasData: !!response.data,
      error: response.error,
    });

    if (response.data && response.data.access_token) {
      this.auth.setToken(response.data.access_token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.http.get<User>(`${API_PREFIX}/auth/auth/me`);
  }

  async register(userData: {
    username: string;
    password: string;
    is_active?: boolean;
    is_superuser?: boolean;
  }): Promise<ApiResponse<User>> {
    return this.http.post<User>(`${API_PREFIX}/auth/auth/register`, userData);
  }

  logout(): void {
    this.auth.clearToken();
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  // === 系统指标相关 ===
  async getSystemMetrics(params?: {
    start_time?: string;
    end_time?: string;
  }): Promise<ApiResponse<{ metrics: SystemMetrics[] }>> {
    return this.http.get<{ metrics: SystemMetrics[] }>(
      `${API_PREFIX}/metrics/`,
      params,
    );
  }

  async getSystemMetricsSummary(): Promise<ApiResponse<SystemMetricsSummary>> {
    return this.http.get<SystemMetricsSummary>(
      `${API_PREFIX}/metrics/summary/`,
    );
  }

  async getCurrentMetrics(): Promise<ApiResponse<SystemMetrics>> {
    return this.http.get<SystemMetrics>(`${API_PREFIX}/metrics/`);
  }

  async getLatestMetrics(): Promise<ApiResponse<SystemMetrics>> {
    return this.http.get<SystemMetrics>(`${API_PREFIX}/metrics/`);
  }

  async collectMetrics(): Promise<ApiResponse<any>> {
    return this.http.post<any>(`${API_PREFIX}/metrics/collect/`);
  }

  // === 网络接��相关 ===
  async getNetworkInterfaces(params?: {
    start_time?: string;
    end_time?: string;
  }): Promise<ApiResponse<{ metrics: NetworkInterfaceMetrics[] }>> {
    return this.http.get<{ metrics: NetworkInterfaceMetrics[] }>(
      `${API_PREFIX}/metrics/network-interfaces/`,
      params,
    );
  }

  async getCurrentNetworkMetrics(): Promise<
    ApiResponse<{ metrics: NetworkInterfaceMetrics[] }>
  > {
    return this.http.get<{ metrics: NetworkInterfaceMetrics[] }>(
      `${API_PREFIX}/metrics/network-interfaces/current/`,
    );
  }

  async getNetworkInterface(
    interfaceName: string,
    params?: {
      start_time?: string;
      end_time?: string;
    },
  ): Promise<ApiResponse<{ metrics: NetworkInterfaceMetrics[] }>> {
    return this.http.get<{ metrics: NetworkInterfaceMetrics[] }>(
      `${API_PREFIX}/metrics/network-interfaces/${interfaceName}/`,
      params,
    );
  }

  // === 进程监控相关 ===
  async getProcesses(params?: {
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse<ProcessMetrics[]>> {
    return this.http.get<ProcessMetrics[]>(
      `${API_PREFIX}/system/processes`,
      params,
    );
  }

  async collectProcessMetrics(): Promise<ApiResponse<ProcessMetrics[]>> {
    return this.http.post<ProcessMetrics[]>(
      `${API_PREFIX}/system/processes/collect`,
    );
  }

  // === 网络连接相关 ===
  async getNetworkConnections(params?: {
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse<NetworkConnection[]>> {
    return this.http.get<NetworkConnection[]>(
      `${API_PREFIX}/system/network`,
      params,
    );
  }

  async collectNetworkConnections(): Promise<ApiResponse<NetworkConnection[]>> {
    return this.http.post<NetworkConnection[]>(
      `${API_PREFIX}/system/network/collect`,
    );
  }

  // === 服务状态相关 ===
  async getServices(params?: {
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse<ServiceStatus[]>> {
    return this.http.get<ServiceStatus[]>(
      `${API_PREFIX}/system/services`,
      params,
    );
  }

  async collectServiceStatus(): Promise<ApiResponse<ServiceStatus[]>> {
    return this.http.post<ServiceStatus[]>(
      `${API_PREFIX}/system/services/collect`,
    );
  }

  // === 批量收集 ===
  async collectAllMetrics(): Promise<ApiResponse<any>> {
    return this.http.post<any>(`${API_PREFIX}/system/collect-all`);
  }

  // === 日志管理 ===
  async getLogLevels(): Promise<ApiResponse<Record<string, string>>> {
    return this.http.get<Record<string, string>>(
      `${API_PREFIX}/logs/log-levels`,
    );
  }

  async updateLogLevel(data: {
    logger_name: string;
    level: string;
  }): Promise<ApiResponse<any>> {
    return this.http.put<any>(`${API_PREFIX}/logs/log-level`, data);
  }

  async getAvailableLogLevels(): Promise<ApiResponse<Record<string, string>>> {
    return this.http.get<Record<string, string>>(
      `${API_PREFIX}/logs/available-log-levels`,
    );
  }

  // === 健康检查 ===
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.http.get<any>("/health");
  }

  // === 数据转换工具 ===
  transformToLegacyFormat(metrics: SystemMetrics): any {
    return {
      cpuUsage: metrics.cpu_percent,
      memoryUsage: metrics.memory_percent,
      diskUsage: metrics.disk_percent,
      networkLatency: Math.round(Math.random() * 50 + 10), // 模拟网络延迟
      activeConnections: Math.round(Math.random() * 1000 + 8000),
      bandwidthUsage: Math.round(
        (metrics.net_bytes_sent + metrics.net_bytes_recv) / 1024 / 1024,
      ), // MB
      onlineNodes: 47,
      realTimeThreats:
        metrics.cpu_alert || metrics.memory_alert || metrics.disk_alert
          ? Math.round(Math.random() * 5 + 3)
          : Math.round(Math.random() * 3 + 1),
      timestamp: metrics.timestamp,
    };
  }

  // === 实时数据流 ===
  createRealTimeDataStream(interval: number = 5000): {
    start: () => void;
    stop: () => void;
    onData: (callback: (data: any) => void) => void;
  } {
    let intervalId: NodeJS.Timeout | null = null;
    let dataCallback: ((data: any) => void) | null = null;

    return {
      start: () => {
        if (intervalId) return;

        intervalId = setInterval(async () => {
          try {
            const response = await this.getCurrentMetrics();
            if (response.data && dataCallback) {
              const transformed = this.transformToLegacyFormat(response.data);
              dataCallback(transformed);
            }
          } catch (error) {
            console.error("Failed to fetch real-time data:", error);
          }
        }, interval);
      },

      stop: () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      },

      onData: (callback: (data: any) => void) => {
        dataCallback = callback;
      },
    };
  }
}

// 导出单例实例
export const apiService = new ApiService();

// 导出认证管理器
export const authManager = AuthManager.getInstance();

// 默认导出
export default apiService;
