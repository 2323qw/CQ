import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Download,
  Upload,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  HardDrive,
  Smartphone,
  Monitor,
  Wifi,
  Database,
  Lock,
  Unlock,
  Key,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  Hash,
  Eye,
  EyeOff,
  Filter,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  Share2,
  Copy,
  Trash2,
  Edit,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Fingerprint,
  Microscope,
  Network,
  Terminal,
  Code,
  Binary,
  Cpu,
  MemoryStick,
  Camera,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Cloud,
  Server,
  Activity,
  Zap,
  Target,
  Layers,
  GitBranch,
  BookOpen,
  Flag,
  Tag,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Info,
} from "lucide-react";

// Types for evidence collection
interface EvidenceCase {
  id: string;
  name: string;
  description: string;
  status: "active" | "closed" | "suspended" | "pending";
  priority: "low" | "medium" | "high" | "critical";
  type: "criminal" | "civil" | "internal" | "compliance";
  createdDate: string;
  lastModified: string;
  investigator: string;
  evidenceCount: number;
  tags: string[];
}

interface DigitalEvidence {
  id: string;
  caseId: string;
  name: string;
  type:
    | "file"
    | "disk_image"
    | "memory_dump"
    | "network_capture"
    | "mobile_backup"
    | "email"
    | "document"
    | "media";
  source: string;
  hash: {
    md5: string;
    sha1: string;
    sha256: string;
  };
  size: number;
  createdDate: string;
  collectedDate: string;
  collectedBy: string;
  integrity: "verified" | "corrupted" | "unknown";
  metadata: Record<string, any>;
  chainOfCustody: ChainOfCustodyEntry[];
  analysis: AnalysisResult[];
  tags: string[];
  notes: string;
}

interface ChainOfCustodyEntry {
  id: string;
  timestamp: string;
  action: "collected" | "transferred" | "analyzed" | "stored" | "returned";
  person: string;
  location: string;
  description: string;
  signature: string;
}

interface AnalysisResult {
  id: string;
  type:
    | "hash_verification"
    | "file_recovery"
    | "metadata_extraction"
    | "malware_scan"
    | "content_analysis";
  status: "pending" | "completed" | "failed";
  startTime: string;
  endTime?: string;
  results: Record<string, any>;
  notes: string;
}

interface ForensicTool {
  id: string;
  name: string;
  version: string;
  type: "imaging" | "analysis" | "recovery" | "verification" | "reporting";
  status: "available" | "in_use" | "maintenance" | "offline";
  description: string;
  capabilities: string[];
  supportedFormats: string[];
}

interface ImagingJob {
  id: string;
  name: string;
  sourceDevice: string;
  targetPath: string;
  status: "queued" | "running" | "completed" | "failed" | "paused";
  progress: number;
  startTime: string;
  estimatedTime?: string;
  method: "dd" | "ewf" | "aff" | "raw";
  verification: boolean;
  compression: boolean;
  encryption: boolean;
}

const EvidenceCollection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    | "dashboard"
    | "cases"
    | "evidence"
    | "tools"
    | "imaging"
    | "analysis"
    | "reports"
  >("dashboard");

  const [cases, setCases] = useState<EvidenceCase[]>([]);
  const [evidence, setEvidence] = useState<DigitalEvidence[]>([]);
  const [tools, setTools] = useState<ForensicTool[]>([]);
  const [imagingJobs, setImagingJobs] = useState<ImagingJob[]>([]);
  const [selectedCase, setSelectedCase] = useState<EvidenceCase | null>(null);
  const [selectedEvidence, setSelectedEvidence] =
    useState<DigitalEvidence | null>(null);

  // Initialize sample data
  useEffect(() => {
    setCases([
      {
        id: "case-001",
        name: "网络入侵调查案",
        description: "针对公司服务器被黑客入侵事件的数字取证调查",
        status: "active",
        priority: "high",
        type: "criminal",
        createdDate: "2024-01-15",
        lastModified: "2024-01-20",
        investigator: "张法医",
        evidenceCount: 12,
        tags: ["网络犯罪", "APT", "数据泄露"],
      },
      {
        id: "case-002",
        name: "员工违规案件",
        description: "内部员工涉嫌泄露商业机密的取证调查",
        status: "active",
        priority: "medium",
        type: "internal",
        createdDate: "2024-01-10",
        lastModified: "2024-01-19",
        investigator: "李分析师",
        evidenceCount: 8,
        tags: ["内部威胁", "数据泄露", "合规"],
      },
      {
        id: "case-003",
        name: "勒索软件感染调查",
        description: "企业网络遭受勒索软件攻击的应急取证",
        status: "closed",
        priority: "critical",
        type: "criminal",
        createdDate: "2024-01-08",
        lastModified: "2024-01-18",
        investigator: "王专家",
        evidenceCount: 15,
        tags: ["勒索软件", "恶意软件", "应急响应"],
      },
    ]);

    setEvidence([
      {
        id: "evidence-001",
        caseId: "case-001",
        name: "受害���务器硬盘镜像",
        type: "disk_image",
        source: "Dell PowerEdge R720 - /dev/sda",
        hash: {
          md5: "5d41402abc4b2a76b9719d911017c592",
          sha1: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d",
          sha256:
            "2cf24dba4f21d4288094e9b60de5f0f6ae4c7e7e9b88b5beb1bd4b32a3b77329",
        },
        size: 500000000000, // 500GB
        createdDate: "2024-01-15",
        collectedDate: "2024-01-15",
        collectedBy: "张法医",
        integrity: "verified",
        metadata: {
          device: "/dev/sda",
          model: "SEAGATE ST500DM002",
          serial: "Z3T6K9QR",
          capacity: "500GB",
          filesystem: "NTFS",
        },
        chainOfCustody: [],
        analysis: [],
        tags: ["服务器", "主证据", "已验证"],
        notes: "从受攻击的Web服务器获取的完整磁盘镜像，包含操作系统和应用数据",
      },
      {
        id: "evidence-002",
        caseId: "case-001",
        name: "网络流量包",
        type: "network_capture",
        source: "防火墙日志 - eth0",
        hash: {
          md5: "098f6bcd4621d373cade4e832627b4f6",
          sha1: "356a192b7913b04c54574d18c28d46e6395428ab",
          sha256:
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
        size: 2500000000, // 2.5GB
        createdDate: "2024-01-15",
        collectedDate: "2024-01-15",
        collectedBy: "张法医",
        integrity: "verified",
        metadata: {
          interface: "eth0",
          duration: "24小时",
          protocol: "TCP/UDP/ICMP",
          packets: 15000000,
        },
        chainOfCustody: [],
        analysis: [],
        tags: ["网络", "流量分析", "攻击向量"],
        notes: "攻击期间的完整网络流量捕获，包含入侵相关的所有通信",
      },
      {
        id: "evidence-003",
        caseId: "case-002",
        name: "嫌疑人工作电脑",
        type: "disk_image",
        source: "Lenovo ThinkPad T480 - C盘",
        hash: {
          md5: "d41d8cd98f00b204e9800998ecf8427e",
          sha1: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
          sha256:
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
        size: 250000000000, // 250GB
        createdDate: "2024-01-10",
        collectedDate: "2024-01-10",
        collectedBy: "李分析师",
        integrity: "verified",
        metadata: {
          device: "C:\\",
          model: "Samsung SSD 860 EVO",
          serial: "S3Z9NX0M123456",
          capacity: "250GB",
          filesystem: "NTFS",
        },
        chainOfCustody: [],
        analysis: [],
        tags: ["笔记本", "员工设备", "主证据"],
        notes: "涉嫌违规员工的工作笔记本电脑完整镜像",
      },
    ]);

    setTools([
      {
        id: "tool-001",
        name: "EnCase Forensic",
        version: "v21.4",
        type: "analysis",
        status: "available",
        description: "专业数字取证分析平台",
        capabilities: [
          "磁盘分析",
          "文件恢复",
          "时间线分析",
          "关键词搜索",
          "报告生成",
        ],
        supportedFormats: ["E01", "L01", "DD", "Raw", "VMDK"],
      },
      {
        id: "tool-002",
        name: "FTK Imager",
        version: "v4.7.1",
        type: "imaging",
        status: "available",
        description: "数字证据获取和镜像工具",
        capabilities: ["磁盘镜像", "内存转储", "哈希验证", "预览功能"],
        supportedFormats: ["E01", "DD", "Raw", "AD1"],
      },
      {
        id: "tool-003",
        name: "Autopsy",
        version: "v4.19.3",
        type: "analysis",
        status: "in_use",
        description: "开源数字取证平台",
        capabilities: [
          "时间线分析",
          "文件类型检测",
          "关键词搜索",
          "哈希查找",
          "报告生成",
        ],
        supportedFormats: ["E01", "Raw", "VHD", "VMDK"],
      },
      {
        id: "tool-004",
        name: "X-Ways Forensics",
        version: "v20.4",
        type: "analysis",
        status: "available",
        description: "高级十六进制编辑器和取证工具",
        capabilities: ["原始数据分析", "文件恢复", "RAM分析", "注册表分析"],
        supportedFormats: ["Raw", "E01", "DD", "VHD"],
      },
      {
        id: "tool-005",
        name: "HashCalc",
        version: "v2.02",
        type: "verification",
        status: "available",
        description: "文件哈希计算和验证工具",
        capabilities: ["MD5", "SHA1", "SHA256", "批量计算"],
        supportedFormats: ["所有文件类型"],
      },
    ]);

    setImagingJobs([
      {
        id: "job-001",
        name: "服务器硬盘镜像",
        sourceDevice: "/dev/sda (500GB)",
        targetPath: "/forensics/case-001/server_hdd.E01",
        status: "completed",
        progress: 100,
        startTime: "2024-01-15 09:00:00",
        method: "ewf",
        verification: true,
        compression: true,
        encryption: false,
      },
      {
        id: "job-002",
        name: "笔记本SSD镜像",
        sourceDevice: "C:\\ (250GB)",
        targetPath: "/forensics/case-002/laptop_ssd.E01",
        status: "running",
        progress: 67,
        startTime: "2024-01-20 14:30:00",
        estimatedTime: "45分钟",
        method: "ewf",
        verification: true,
        compression: true,
        encryption: true,
      },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "running":
      case "available":
      case "verified":
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "pending":
      case "queued":
      case "paused":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "closed":
      case "suspended":
      case "maintenance":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "failed":
      case "corrupted":
      case "offline":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case "disk_image":
        return HardDrive;
      case "memory_dump":
        return MemoryStick;
      case "network_capture":
        return Network;
      case "mobile_backup":
        return Smartphone;
      case "email":
        return Mail;
      case "document":
        return FileText;
      case "media":
        return Image;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <Search className="w-8 h-8 text-cyan-400" />
              数字证据收集
            </h1>
            <p className="text-muted-foreground mt-2">
              专业数字取证和证据收集管理平台
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30">
              <Plus className="w-4 h-4 mr-2" />
              新建案件
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Upload className="w-4 h-4 mr-2" />
              导入证据
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="cyber-card-enhanced border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃案件</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {cases.filter((c) => c.status === "active").length}
                  </p>
                  <p className="text-xs text-cyan-400 mt-1">进行中</p>
                </div>
                <Folder className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">数字证据</p>
                  <p className="text-2xl font-bold text-green-400">
                    {evidence.length}
                  </p>
                  <p className="text-xs text-green-400 mt-1">已收集</p>
                </div>
                <Database className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">取证工具</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {tools.filter((t) => t.status === "available").length}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">可用</p>
                </div>
                <Settings className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">镜像任务</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {imagingJobs.filter((j) => j.status === "running").length}
                  </p>
                  <p className="text-xs text-purple-400 mt-1">执行中</p>
                </div>
                <Copy className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card-enhanced border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">完整性</p>
                  <p className="text-2xl font-bold text-amber-400">100%</p>
                  <p className="text-xs text-amber-400 mt-1">验证通过</p>
                </div>
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-7 bg-matrix-surface/50">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-cyan-400/20"
            >
              总览
            </TabsTrigger>
            <TabsTrigger
              value="cases"
              className="data-[state=active]:bg-cyan-400/20"
            >
              案件管理
            </TabsTrigger>
            <TabsTrigger
              value="evidence"
              className="data-[state=active]:bg-cyan-400/20"
            >
              证据库
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="data-[state=active]:bg-cyan-400/20"
            >
              取证工具
            </TabsTrigger>
            <TabsTrigger
              value="imaging"
              className="data-[state=active]:bg-cyan-400/20"
            >
              镜像任务
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="data-[state=active]:bg-cyan-400/20"
            >
              分析报告
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-cyan-400/20"
            >
              法庭报告
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Cases */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-cyan-400" />
                    最近案件
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cases.slice(0, 3).map((case_) => (
                    <div
                      key={case_.id}
                      className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCase(case_)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {case_.name}
                          </span>
                          <Badge className={getStatusColor(case_.status)}>
                            {case_.status}
                          </Badge>
                          <Badge className={getPriorityColor(case_.priority)}>
                            {case_.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {case_.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>证据: {case_.evidenceCount}件</span>
                          <span>调查员: {case_.investigator}</span>
                          <span>更新: {case_.lastModified}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Evidence */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-400" />
                    最新证据
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {evidence.slice(0, 3).map((item) => {
                    const IconComponent = getEvidenceTypeIcon(item.type);
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedEvidence(item)}
                      >
                        <IconComponent className="w-8 h-8 text-green-400 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {item.name}
                            </span>
                            <Badge className={getStatusColor(item.integrity)}>
                              {item.integrity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.source}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>大小: {formatFileSize(item.size)}</span>
                            <span>收集: {item.collectedBy}</span>
                            <span>日期: {item.collectedDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Active Imaging Jobs */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-purple-400" />
                  活跃镜像任务
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagingJobs
                    .filter(
                      (job) =>
                        job.status === "running" || job.status === "queued",
                    )
                    .map((job) => (
                      <div
                        key={job.id}
                        className="p-4 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{job.name}</h3>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {job.progress}%
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span>源设备: {job.sourceDevice}</span>
                            <span>目标: {job.targetPath}</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>开始时间: {job.startTime}</span>
                          {job.estimatedTime && (
                            <span>预计剩余: {job.estimatedTime}</span>
                          )}
                          <div className="flex gap-2">
                            <span>方法: {job.method.toUpperCase()}</span>
                            {job.verification && <span>✓验证</span>}
                            {job.compression && <span>✓压缩</span>}
                            {job.encryption && <span>✓加密</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cases Tab */}
          <TabsContent value="cases" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-cyan-400" />
                    案件管理
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="筛选状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="active">进行中</SelectItem>
                        <SelectItem value="closed">已关闭</SelectItem>
                        <SelectItem value="suspended">暂停</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      <Plus className="w-4 h-4 mr-2" />
                      新建案件
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cases.map((case_) => (
                    <Card
                      key={case_.id}
                      className="cyber-card-enhanced border-matrix-border hover:border-cyan-400/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedCase(case_)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-lg">
                                {case_.name}
                              </h3>
                              <Badge className={getStatusColor(case_.status)}>
                                {case_.status}
                              </Badge>
                              <Badge
                                className={getPriorityColor(case_.priority)}
                              >
                                {case_.priority}
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                                {case_.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {case_.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  创建日期
                                </p>
                                <p className="text-sm">{case_.createdDate}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  最后修改
                                </p>
                                <p className="text-sm">{case_.lastModified}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  调查员
                                </p>
                                <p className="text-sm">{case_.investigator}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  证据数量
                                </p>
                                <p className="text-sm font-bold text-green-400">
                                  {case_.evidenceCount}件
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {case_.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  className="bg-matrix-surface/50 text-muted-foreground border-matrix-border text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-400" />
                    数字证据库
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40 bg-matrix-surface/50 border-matrix-border">
                        <SelectValue placeholder="证据类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="disk_image">磁盘镜像</SelectItem>
                        <SelectItem value="memory_dump">内存转储</SelectItem>
                        <SelectItem value="network_capture">
                          网络捕获
                        </SelectItem>
                        <SelectItem value="mobile_backup">移动设备</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Upload className="w-4 h-4 mr-2" />
                      添加证据
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evidence.map((item) => {
                    const IconComponent = getEvidenceTypeIcon(item.type);
                    return (
                      <Card
                        key={item.id}
                        className="cyber-card-enhanced border-matrix-border hover:border-green-400/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedEvidence(item)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                              <IconComponent className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-lg">
                                  {item.name}
                                </h3>
                                <Badge
                                  className={getStatusColor(item.integrity)}
                                >
                                  {item.integrity}
                                </Badge>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                                  {item.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                来源: {item.source}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    文件大小
                                  </p>
                                  <p className="text-sm font-bold">
                                    {formatFileSize(item.size)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    收集者
                                  </p>
                                  <p className="text-sm">{item.collectedBy}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    收集日期
                                  </p>
                                  <p className="text-sm">
                                    {item.collectedDate}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    SHA256
                                  </p>
                                  <p className="text-xs font-mono">
                                    {item.hash.sha256.substring(0, 16)}...
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {item.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-matrix-surface/50 text-muted-foreground border-matrix-border text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              {item.notes && (
                                <div className="bg-matrix-surface/30 p-3 rounded-lg">
                                  <p className="text-xs text-muted-foreground mb-1">
                                    备注:
                                  </p>
                                  <p className="text-sm">{item.notes}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                              >
                                <Microscope className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  数字取证工具
                </CardTitle>
                <CardDescription>管理和监控数字取证分析工具</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tools.map((tool) => (
                    <Card
                      key={tool.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {tool.name}
                          </CardTitle>
                          <Badge className={getStatusColor(tool.status)}>
                            {tool.status}
                          </Badge>
                        </div>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              版本
                            </p>
                            <p className="font-mono text-sm">{tool.version}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              类型
                            </p>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                              {tool.type}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            功能
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {tool.capabilities.map((capability, index) => (
                              <Badge
                                key={index}
                                className="bg-green-500/20 text-green-400 border-green-500/40 text-xs"
                              >
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            支持格式
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {tool.supportedFormats.map((format, index) => (
                              <Badge
                                key={index}
                                className="bg-purple-500/20 text-purple-400 border-purple-500/40 text-xs"
                              >
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            启动
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-cyan-400/20 text-cyan-400 border-cyan-400/30"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            配置
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Imaging Tab */}
          <TabsContent value="imaging" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="w-5 h-5 text-purple-400" />
                    磁盘镜像任务
                  </CardTitle>
                  <Button className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <Plus className="w-4 h-4 mr-2" />
                    新建任务
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagingJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-lg">
                                {job.name}
                              </h3>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  源设备
                                </p>
                                <p className="text-sm font-mono">
                                  {job.sourceDevice}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  目标路径
                                </p>
                                <p className="text-sm font-mono text-xs">
                                  {job.targetPath}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  开始时间
                                </p>
                                <p className="text-sm">{job.startTime}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  镜像方法
                                </p>
                                <p className="text-sm font-mono">
                                  {job.method.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-400 mb-1">
                              {job.progress}%
                            </div>
                            {job.estimatedTime && (
                              <p className="text-xs text-muted-foreground">
                                剩余: {job.estimatedTime}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Progress value={job.progress} className="h-3" />

                          <div className="flex items-center justify-between">
                            <div className="flex gap-4 text-xs">
                              {job.verification && (
                                <div className="flex items-center gap-1 text-green-400">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>哈希验证</span>
                                </div>
                              )}
                              {job.compression && (
                                <div className="flex items-center gap-1 text-blue-400">
                                  <Archive className="w-3 h-3" />
                                  <span>压缩</span>
                                </div>
                              )}
                              {job.encryption && (
                                <div className="flex items-center gap-1 text-amber-400">
                                  <Lock className="w-3 h-3" />
                                  <span>加密</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {job.status === "running" && (
                                <Button
                                  size="sm"
                                  className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                >
                                  <Pause className="w-4 h-4" />
                                </Button>
                              )}
                              {job.status === "paused" && (
                                <Button
                                  size="sm"
                                  className="bg-green-500/20 text-green-400 border-green-500/30"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                className="bg-red-500/20 text-red-400 border-red-500/30"
                              >
                                <Square className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-amber-400" />
                  取证分析报告
                </CardTitle>
                <CardDescription>自动化和手动��析结果汇总</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Microscope className="w-20 h-20 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    分析功能开发中
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    即将支持自动化恶意软件检测、时间线分析、关键词搜索等功能
                  </p>
                  <Button className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    查看计划功能
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  法庭报告生成
                </CardTitle>
                <CardDescription>符合法律要求的取证报告和文档</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    报告生成器
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    自动生成符合法庭要求的取证报告，包含完整的���据链和分析结果
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
                      生成详细报告
                    </Button>
                    <Button className="bg-green-500/20 text-green-400 border-green-500/30">
                      导出PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EvidenceCollection;
