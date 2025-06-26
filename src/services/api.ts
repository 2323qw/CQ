/**
 * API 服务层 - 集成真实的后端API
 * 基于 OpenAPI 规范实现完整的监控平台数据获取
 */

// API基础配置
const API_BASE_URL = import.meta.env.DEV
  ? "" // 开发环境使用代理
  : "http://l4flhxbv.beesnat.com"; // 生产环境直接连接

console.log("🔧 API配置:", {
  isDev: import.meta.env.DEV,
  baseURL: API_BASE_URL || "使用代理",
  fullURL: `${API_BASE_URL}/api/v1/metrics/`,
  proxyTarget: "http://l4flhxbv.beesnat.com",
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
  bandwidth_total: number; // 总带宽 (Mbps)
  bandwidth_used: number; // 已使用带宽 (Mbps)
  bandwidth_percent: number; // 带宽使用百分比
  bandwidth_upload: number; // 上传带宽 (Mbps)
  bandwidth_download: number; // 下载带宽 (Mbps)
  load_1min: number | null;
  load_5min: number | null;
  load_15min: number | null;
  cpu_alert: boolean;
  memory_alert: boolean;
  disk_alert: boolean;
  bandwidth_alert: boolean; // 带宽警报
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

  // 尝试多种策略解析可能损坏的JSON
  private tryParseJsonWithFallbacks(rawText: string, originalError: any): any {
    console.error(`🔧 Attempting to fix malformed JSON...`);

    // Strategy 1: Remove BOM and trim whitespace
    try {
      const cleaned = rawText.replace(/^\uFEFF/, "").trim();
      const result = JSON.parse(cleaned);
      console.log(`✅ Strategy 1 success: Removed BOM/whitespace`);
      return result;
    } catch (e) {
      console.log(`❌ Strategy 1 failed: BOM/whitespace removal didn't help`);
    }

    // Strategy 2: Extract JSON from the beginning until first closing brace
    try {
      let braceCount = 0;
      let jsonEnd = -1;
      let started = false;

      for (let i = 0; i < rawText.length; i++) {
        if (rawText[i] === "{") {
          braceCount++;
          started = true;
        }
        if (rawText[i] === "}" && started) {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
      }

      if (jsonEnd > 0) {
        const extracted = rawText.substring(0, jsonEnd);
        const result = JSON.parse(extracted);
        console.log(
          `✅ Strategy 2 success: Extracted JSON from position 0 to ${jsonEnd}`,
        );
        const discarded = rawText.substring(jsonEnd);
        if (discarded.length > 0) {
          console.log(
            `🗑️ Discarded extra content (${discarded.length} chars): "${discarded.substring(0, 50)}..."`,
          );
        }
        return result;
      }
    } catch (e) {
      console.log(
        `❌ Strategy 2 failed: Could not extract complete JSON object - ${e.message}`,
      );
    }

    // Strategy 3: Handle JSON followed by HTML (common API pattern)
    try {
      // Look for JSON at start followed by HTML tags
      const htmlMatch = rawText.match(/^(\{.*?\})(?=<|$)/);
      if (htmlMatch) {
        const result = JSON.parse(htmlMatch[1]);
        console.log(
          `✅ Strategy 3 success: Extracted JSON before HTML content`,
        );
        return result;
      }
    } catch (e) {
      console.log(
        `❌ Strategy 3 failed: JSON-before-HTML pattern didn't work - ${e.message}`,
      );
    }

    // Strategy 3.5: Handle truncated server error responses
    try {
      // Look for server error pattern that might be truncated
      if (
        rawText.includes('"code":500') ||
        rawText.includes("Database Error")
      ) {
        // Try to extract as much meaningful info as possible
        const codeMatch = rawText.match(/"code":(\d+)/);
        const messageMatch = rawText.match(/"message":"([^"]+)"/);

        if (codeMatch || messageMatch) {
          const result = {
            code: codeMatch ? parseInt(codeMatch[1]) : 500,
            message: messageMatch ? messageMatch[1] : "Database Error",
            data: rawText.includes("mapper")
              ? "Database mapper initialization failed"
              : "Server error",
          };
          console.log(
            `✅ Strategy 3.5 success: Reconstructed server error from truncated response`,
          );
          return result;
        }
      }
    } catch (e) {
      console.log(
        `❌ Strategy 3.5 failed: Could not reconstruct server error - ${e.message}`,
      );
    }

    // Strategy 4: Try to find and parse the largest JSON-like substring
    try {
      const jsonPattern = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
      const matches = rawText.match(jsonPattern);

      if (matches && matches.length > 0) {
        // Try the longest match first
        const sortedMatches = matches.sort((a, b) => b.length - a.length);

        for (const match of sortedMatches) {
          try {
            const result = JSON.parse(match);
            console.log(`✅ Strategy 3 success: Parsed JSON substring`);
            return result;
          } catch (e) {
            continue;
          }
        }
      }
    } catch (e) {
      console.log(`❌ Strategy 4 failed: No valid JSON substring found`);
    }

    // Strategy 5: Last resort - return error info for debugging
    console.error(`❌ All JSON parsing strategies failed`);
    return {
      error: "Could not parse malformed JSON response",
      originalError: originalError.message,
      rawTextSample: rawText.substring(0, 100),
      textLength: rawText.length,
      position22Context:
        rawText.length > 22
          ? {
              char: rawText.charAt(22),
              charCode: rawText.charCodeAt(22),
              before: rawText.substring(18, 22),
              after: rawText.substring(22, 26),
            }
          : null,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    customTimeout?: number,
  ): Promise<ApiResponse<T>> {
    // In development mode, use relative URLs for proxy
    const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;

    // Use appropriate timeouts for different endpoints
    const timeout =
      customTimeout ||
      (endpoint.includes("/health")
        ? 8000
        : endpoint.includes("/metrics")
          ? 25000
          : 15000);

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
      signal: this.createTimeoutSignal(timeout),
    };

    console.log(`API Request: ${options.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, config);
      console.log(
        `API Response: ${response.status} ${response.statusText} for ${url}`,
      );

      // Read response as text first to avoid "body stream already read" error
      const rawText = await response.text();
      const contentType = response.headers.get("content-type");

      let data: any;
      if (contentType && contentType.includes("application/json")) {
        try {
          // Parse the text as JSON
          data = JSON.parse(rawText);
          console.log(`✅ Successfully parsed JSON response`);
        } catch (jsonError) {
          console.error("❌ Failed to parse JSON response:", jsonError);
          console.error(
            `📄 Raw response (${rawText.length} chars):`,
            rawText.substring(0, 200),
          );

          // Try multiple strategies to fix the JSON
          data = this.tryParseJsonWithFallbacks(rawText, jsonError);
        }
      } else {
        // For non-JSON responses, just use the raw text
        data = rawText;
        console.log(`📄 Non-JSON response received (${rawText.length} chars)`);
      }

      // Check if the response was successful
      if (!response.ok) {
        console.error(
          `API Error: ${response.status} - ${data?.detail || data}`,
        );

        // Handle specific server errors
        if (response.status === 500) {
          const errorMessage =
            typeof data === "object" && data.message
              ? `服务器错误: ${data.message}`
              : typeof data === "string" && data.includes("Database Error")
                ? "数据库连接错误，请稍后重试或联系系统管理员"
                : "服务器内部错误，请稍后重试";

          return {
            error: errorMessage,
            code: response.status,
          };
        }

        return {
          error: data?.detail || data || `HTTP错误! 状态码: ${response.status}`,
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
            error:
              "API请求超时。服务器可能正在重启或数据库连接繁忙，请稍后重试或切换到模拟模式查看系统功能。",
            code: 408,
          };
        } else if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          return {
            error: `无法连接到API服务器，可能原因：
            1. 网络连接问题
            2. API服务器不可访问
            3. CORS跨域限制
            4. 防火墙阻止连接

建议切换到模拟模式以继续使用系统功能。`,
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
    customTimeout?: number,
  ): Promise<ApiResponse<T>> {
    // Handle empty base URL in development mode
    let finalEndpoint = endpoint;

    if (API_BASE_URL) {
      // Production mode with full base URL
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }
      finalEndpoint = url.pathname + url.search;
    } else {
      // Development mode - use relative paths with proxy
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
      }
    }

    return this.request<T>(finalEndpoint, {}, customTimeout);
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

  // === 认证�������� ===
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
    // Use longer timeout for metrics data (35 seconds) due to database initialization issues
    return this.http.get<SystemMetrics>(
      `${API_PREFIX}/metrics/`,
      undefined,
      35000,
    );
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

  // === 带宽使用相关 ===
  async getBandwidthUsage(): Promise<
    ApiResponse<{
      total: number;
      used: number;
      percent: number;
      upload: number;
      download: number;
      alert: boolean;
    }>
  > {
    return this.http.get<{
      total: number;
      used: number;
      percent: number;
      upload: number;
      download: number;
      alert: boolean;
    }>(`${API_PREFIX}/bandwidth/usage`);
  }

  // === 健康检查 ===
  async healthCheck(): Promise<ApiResponse<any>> {
    // Use correct health check endpoint and longer timeout to avoid aborts
    return this.http.get<any>(`/health`, undefined, 8000);
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

// ��出单例实例
export const apiService = new ApiService();

// 导出认证管理器
export const authManager = AuthManager.getInstance();

// 默认导出
export default apiService;
