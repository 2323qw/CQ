import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  Search,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Shield,
  Settings,
  Users,
  Target,
  Activity,
  Brain,
  Zap,
  Globe,
  Database,
  Network,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Coffee,
  Headphones,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: number;
  rating: number;
  views: number;
  lastUpdated: string;
  helpful: number;
  notHelpful: number;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  views: number;
  rating: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  createdDate: string;
  lastUpdate: string;
  assignee: string;
}

export default function HelpCenter() {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "docs" | "videos" | "faq" | "support" | "contact"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string[]>([]);

  // 模拟帮助文章数据
  const [helpArticles] = useState<HelpArticle[]>([
    {
      id: "article-001",
      title: "CyberGuard 平台快速入门指南",
      category: "入门指南",
      content:
        "本文将帮助您快速了解CyberGuard网络安全平台的基本功能和使用方法...",
      tags: ["入门", "基础", "平台介绍"],
      difficulty: "beginner",
      readTime: 5,
      rating: 4.8,
      views: 1247,
      lastUpdated: "2024-01-18",
      helpful: 89,
      notHelpful: 5,
    },
    {
      id: "article-002",
      title: "威胁检测和告警配置详解",
      category: "威胁检测",
      content:
        "详细介绍如何配置威胁检测规则，设置告警阈值，以及优化检测精度...",
      tags: ["威胁检测", "告警", "配置"],
      difficulty: "intermediate",
      readTime: 12,
      rating: 4.6,
      views: 856,
      lastUpdated: "2024-01-16",
      helpful: 67,
      notHelpful: 8,
    },
    {
      id: "article-003",
      title: "AI模型训练和优化指南",
      category: "AI分析",
      content: "学习如何训练和优化AI安全分析模型，提高检测准确率...",
      tags: ["AI", "机器学习", "模型训练"],
      difficulty: "advanced",
      readTime: 20,
      rating: 4.9,
      views: 523,
      lastUpdated: "2024-01-15",
      helpful: 45,
      notHelpful: 2,
    },
    {
      id: "article-004",
      title: "自动化响应规则配置",
      category: "自动化",
      content: "配置自动化安全响应规则，实现智能威胁处置...",
      tags: ["自动化", "响应", "SOAR"],
      difficulty: "intermediate",
      readTime: 15,
      rating: 4.7,
      views: 634,
      lastUpdated: "2024-01-14",
      helpful: 52,
      notHelpful: 6,
    },
  ]);

  // 模拟视频教程数据
  const [videoTutorials] = useState<VideoTutorial[]>([
    {
      id: "video-001",
      title: "平台概览和导航介绍",
      description: "5分钟了解CyberGuard平台的主要功能模块和导航结构",
      category: "基础入门",
      duration: "5:23",
      thumbnail: "/placeholder.svg",
      level: "beginner",
      tags: ["入门", "导航", "概览"],
      views: 2341,
      rating: 4.8,
    },
    {
      id: "video-002",
      title: "威胁检测配置实战",
      description: "从零开始配置威胁检测规则，包括阈值设置和告警策略",
      category: "威胁检测",
      duration: "12:45",
      thumbnail: "/placeholder.svg",
      level: "intermediate",
      tags: ["威胁检测", "配置", "实战"],
      views: 1567,
      rating: 4.6,
    },
    {
      id: "video-003",
      title: "AI分析模型深度解析",
      description: "深入了解AI安全分析的工作原理和高级配置技巧",
      category: "AI分析",
      duration: "18:32",
      thumbnail: "/placeholder.svg",
      level: "advanced",
      tags: ["AI", "分析", "模型"],
      views: 892,
      rating: 4.9,
    },
  ]);

  // 模拟FAQ数据
  const [faqs] = useState<FAQ[]>([
    {
      id: "faq-001",
      question: "如何重置密码？",
      answer:
        '您可以在登录页面点击"忘记密码"链接，输入注册邮箱后系统会发送重置密码的邮件。也可以联系管理员直接重置。',
      category: "账户管理",
      tags: ["密码", "重置", "登录"],
      helpful: 45,
      notHelpful: 2,
    },
    {
      id: "faq-002",
      question: "为什么收不到威胁告警？",
      answer:
        "请检查：1）告警规则是否正确配置 2）告警阈值是否合适 3）邮件或短信通知设置是否正确 4）是否被邮件过滤器拦截",
      category: "威胁检测",
      tags: ["告警", "通知", "配置"],
      helpful: 67,
      notHelpful: 5,
    },
    {
      id: "faq-003",
      question: "AI模型的准确率如何提升？",
      answer:
        "提升AI模型准确率的方法：1）增加训练数据量 2）优化特征工程 3）调整模型参数 4）定期重训练模型 5）结合专家知识",
      category: "AI分析",
      tags: ["AI", "准确率", "优化"],
      helpful: 89,
      notHelpful: 3,
    },
    {
      id: "faq-004",
      question: "如何配置自动化响应？",
      answer:
        "自动化响应配置步骤：1）定义触发条件 2）设计响应动作 3）配置执行参数 4）测试规则有效性 5）启用自动执行",
      category: "自动化",
      tags: ["自动化", "响应", "配置"],
      helpful: 56,
      notHelpful: 7,
    },
    {
      id: "faq-005",
      question: "系统支持哪些集成方式？",
      answer:
        "系统支持多种集成方式：1）RESTful API 2）Webhook回调 3）SYSLOG接入 4）SNMP监控 5）数据库直连 6）文件导入导出",
      category: "系统集成",
      tags: ["集成", "API", "接口"],
      helpful: 78,
      notHelpful: 4,
    },
  ]);

  // 模拟支持工单数据
  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: "TICKET-001",
      subject: "威胁检测误报率较高",
      category: "技术问题",
      priority: "high",
      status: "in_progress",
      createdDate: "2024-01-18",
      lastUpdate: "2024-01-19",
      assignee: "技术支持团队",
    },
    {
      id: "TICKET-002",
      subject: "API接口调用限制咨询",
      category: "使用咨询",
      priority: "medium",
      status: "waiting",
      createdDate: "2024-01-17",
      lastUpdate: "2024-01-18",
      assignee: "产品团队",
    },
    {
      id: "TICKET-003",
      subject: "系统性能优化建议",
      category: "优化建议",
      priority: "low",
      status: "resolved",
      createdDate: "2024-01-15",
      lastUpdate: "2024-01-17",
      assignee: "技术专家",
    },
  ]);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ((prev) =>
      prev.includes(id) ? prev.filter((faq) => faq !== id) : [...prev, id],
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "waiting":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "open":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      categoryFilter === "all" || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      categoryFilter === "all" || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-bg via-matrix-surface to-matrix-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white neon-text flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-neon-blue" />
              帮助中心
            </h1>
            <p className="text-muted-foreground mt-2">
              获取使用指南、视频教程和技术支持
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30">
              <MessageSquare className="w-4 h-4 mr-2" />
              在线客服
            </Button>
            <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
              <Phone className="w-4 h-4 mr-2" />
              联系支持
            </Button>
          </div>
        </div>

        {/* 搜索栏 */}
        <Card className="cyber-card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="搜索帮助文档、FAQ或功能说明..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-matrix-surface/50 border-matrix-border text-lg"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 h-12 bg-matrix-surface/50 border-matrix-border">
                  <SelectValue placeholder="选择类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类别</SelectItem>
                  <SelectItem value="入门指南">入门指南</SelectItem>
                  <SelectItem value="威胁检测">威胁检测</SelectItem>
                  <SelectItem value="AI分析">AI分析</SelectItem>
                  <SelectItem value="自动化">自动化</SelectItem>
                  <SelectItem value="系统集成">系统集成</SelectItem>
                  <SelectItem value="账户管理">账户管理</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 主要内容区域 */}
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6 bg-matrix-surface/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-neon-blue/20"
            >
              概览
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="data-[state=active]:bg-neon-blue/20"
            >
              文档
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="data-[state=active]:bg-neon-blue/20"
            >
              视频
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-neon-blue/20"
            >
              FAQ
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="data-[state=active]:bg-neon-blue/20"
            >
              技术支持
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-neon-blue/20"
            >
              联系我们
            </TabsTrigger>
          </TabsList>

          {/* 概览 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 快速入门 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  快速入门
                </CardTitle>
                <CardDescription>
                  新用户必看：快速掌握平台核心功能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: BookOpen,
                      title: "平台入门指南",
                      description: "5分钟了解平台基本功能",
                      color: "text-blue-400",
                      time: "5 min",
                    },
                    {
                      icon: Shield,
                      title: "威胁检测配置",
                      description: "设置第一个威胁检测规则",
                      color: "text-red-400",
                      time: "10 min",
                    },
                    {
                      icon: Activity,
                      title: "监控面板设置",
                      description: "配置个性化监控仪表���",
                      color: "text-green-400",
                      time: "8 min",
                    },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="cyber-card-enhanced border-matrix-border hover:border-neon-blue/30 transition-all cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg bg-matrix-surface/50 ${item.color}`}
                          >
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {item.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 功能模块导航 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-neon-blue" />
                  功能模块帮助
                </CardTitle>
                <CardDescription>按功能模块查找相关帮助文档</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      icon: Shield,
                      title: "威胁检测",
                      count: 12,
                      color: "text-red-400",
                    },
                    {
                      icon: Brain,
                      title: "AI分析",
                      count: 8,
                      color: "text-purple-400",
                    },
                    {
                      icon: Zap,
                      title: "自动化响应",
                      count: 6,
                      color: "text-amber-400",
                    },
                    {
                      icon: Activity,
                      title: "监控分析",
                      count: 10,
                      color: "text-green-400",
                    },
                    {
                      icon: Users,
                      title: "用户管理",
                      count: 5,
                      color: "text-blue-400",
                    },
                    {
                      icon: Settings,
                      title: "系统配置",
                      count: 7,
                      color: "text-cyan-400",
                    },
                    {
                      icon: Database,
                      title: "数据管理",
                      count: 4,
                      color: "text-orange-400",
                    },
                    {
                      icon: Globe,
                      title: "API接口",
                      count: 9,
                      color: "text-pink-400",
                    },
                  ].map((module, index) => (
                    <Card
                      key={index}
                      className="cyber-card-enhanced border-matrix-border hover:border-neon-blue/30 transition-all cursor-pointer"
                    >
                      <CardContent className="p-4 text-center">
                        <module.icon
                          className={`w-8 h-8 ${module.color} mx-auto mb-3`}
                        />
                        <h3 className="font-medium text-white mb-1">
                          {module.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {module.count} 篇文档
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 热门文章和最新更新 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    热门文章
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {helpArticles
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 4)
                    .map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-all cursor-pointer"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getDifficultyColor(article.difficulty)}
                            >
                              {article.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {article.views} 次阅读
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    最新更新
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {helpArticles
                    .sort(
                      (a, b) =>
                        new Date(b.lastUpdated).getTime() -
                        new Date(a.lastUpdated).getTime(),
                    )
                    .slice(0, 4)
                    .map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-3 bg-matrix-surface/30 rounded-lg hover:bg-matrix-surface/50 transition-all cursor-pointer"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {article.category}
                            </span>
                            <span className="text-xs text-green-400">
                              {article.lastUpdated}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 文档 */}
          <TabsContent value="docs" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-neon-blue" />
                  帮助文档
                </CardTitle>
                <CardDescription>详细的功能说明和使用指南文档</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="cyber-card-enhanced border-matrix-border hover:border-neon-blue/30 transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-neon-blue" />
                              <h3 className="font-medium text-white">
                                {article.title}
                              </h3>
                              <Badge
                                className={getDifficultyColor(
                                  article.difficulty,
                                )}
                              >
                                {article.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {article.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>类别: {article.category}</span>
                              <span>阅读时长: {article.readTime} 分钟</span>
                              <span>阅读量: {article.views}</span>
                              <span>评分: {article.rating}/5</span>
                              <span>更新: {article.lastUpdated}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {article.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  className="bg-matrix-surface/50 text-muted-foreground border-matrix-border text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right text-xs">
                              <div className="flex items-center gap-1 text-green-400">
                                <ThumbsUp className="w-3 h-3" />
                                <span>{article.helpful}</span>
                              </div>
                              <div className="flex items-center gap-1 text-red-400 mt-1">
                                <ThumbsDown className="w-3 h-3" />
                                <span>{article.notHelpful}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                            >
                              阅读
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

          {/* 视频教程 */}
          <TabsContent value="videos" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-400" />
                  视频教程
                </CardTitle>
                <CardDescription>
                  通过视频快速学习平台功能和操作技巧
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoTutorials.map((video) => (
                    <Card
                      key={video.id}
                      className="cyber-card-enhanced border-matrix-border hover:border-neon-blue/30 transition-all cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="relative mb-3">
                          <div className="aspect-video bg-matrix-bg rounded-lg border border-matrix-border flex items-center justify-center">
                            <Video className="w-12 h-12 text-red-400" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <h3 className="font-medium text-white mb-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={getDifficultyColor(video.level)}>
                            {video.level}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{video.views} 观看</span>
                            <span>★ {video.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {video.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              className="bg-matrix-surface/50 text-muted-foreground border-matrix-border text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                          <Video className="w-4 h-4 mr-2" />
                          播放视频
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  常见问题 (FAQ)
                </CardTitle>
                <CardDescription>快速找到常见问题的解答</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card
                      key={faq.id}
                      className="cyber-card-enhanced border-matrix-border"
                    >
                      <CardContent className="p-4">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleFAQ(faq.id)}
                        >
                          <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5 text-green-400" />
                            <h3 className="font-medium text-white">
                              {faq.question}
                            </h3>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                              {faq.category}
                            </Badge>
                          </div>
                          {expandedFAQ.includes(faq.id) ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        {expandedFAQ.includes(faq.id) && (
                          <div className="mt-4 pt-4 border-t border-matrix-border">
                            <p className="text-sm text-muted-foreground mb-3">
                              {faq.answer}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {faq.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-matrix-surface/50 text-muted-foreground border-matrix-border text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1 text-green-400">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{faq.helpful}</span>
                                </div>
                                <div className="flex items-center gap-1 text-red-400">
                                  <ThumbsDown className="w-3 h-3" />
                                  <span>{faq.notHelpful}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 技术支持 */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 创建工单 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-neon-blue" />
                    提交技术支持工单
                  </CardTitle>
                  <CardDescription>
                    遇到问题？创建支持工单获得专业技术支持
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        问题类别
                      </label>
                      <Select>
                        <SelectTrigger className="bg-matrix-surface/50 border-matrix-border">
                          <SelectValue placeholder="选择问题类别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">技术问题</SelectItem>
                          <SelectItem value="feature">功能咨询</SelectItem>
                          <SelectItem value="integration">集成问题</SelectItem>
                          <SelectItem value="performance">性能问题</SelectItem>
                          <SelectItem value="other">其他问题</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        优先级
                      </label>
                      <Select>
                        <SelectTrigger className="bg-matrix-surface/50 border-matrix-border">
                          <SelectValue placeholder="选择优先级" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">低</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="urgent">紧急</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        问题标题
                      </label>
                      <Input
                        placeholder="简要描述您遇到的问题"
                        className="bg-matrix-surface/50 border-matrix-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        问题描述
                      </label>
                      <textarea
                        placeholder="详细描述问题的发生过程、错误信息等"
                        rows={4}
                        className="w-full p-3 bg-matrix-surface/50 border border-matrix-border rounded-lg text-white placeholder-muted-foreground resize-none"
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    提交工单
                  </Button>
                </CardContent>
              </Card>

              {/* 我的工单 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    我的支持工单
                  </CardTitle>
                  <CardDescription>
                    查看您提交的技术支持工单状态
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supportTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-3 bg-matrix-surface/30 rounded-lg border border-matrix-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {ticket.subject}
                            </span>
                            <Badge
                              className={getPriorityColor(ticket.priority)}
                            >
                              {ticket.priority}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>工单号: {ticket.id}</span>
                          <span>负责人: {ticket.assignee}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <span>创建: {ticket.createdDate}</span>
                          <span>更新: {ticket.lastUpdate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 支持资源 */}
            <Card className="cyber-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="w-5 h-5 text-purple-400" />
                  支持资源下载
                </CardTitle>
                <CardDescription>下载相关工具、文档和资源文件</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "API文档",
                      description: "完整的API接口文档",
                      icon: FileText,
                      size: "2.3 MB",
                      type: "PDF",
                    },
                    {
                      title: "配置工具",
                      description: "系统配置辅助工具",
                      icon: Settings,
                      size: "5.7 MB",
                      type: "EXE",
                    },
                    {
                      title: "日志分析脚本",
                      description: "日志分析和处理脚本",
                      icon: FileText,
                      size: "1.2 MB",
                      type: "ZIP",
                    },
                  ].map((resource, index) => (
                    <Card
                      key={index}
                      className="cyber-card-enhanced border-matrix-border hover:border-purple-400/30 transition-all cursor-pointer"
                    >
                      <CardContent className="p-4 text-center">
                        <resource.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                        <h3 className="font-medium text-white mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
                          <span>{resource.type}</span>
                          <span>•</span>
                          <span>{resource.size}</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          下载
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 联系我们 */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 联系方式 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-400" />
                    联系方式
                  </CardTitle>
                  <CardDescription>
                    多种方式联系我们的技术支持团队
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-matrix-surface/30 rounded-lg">
                      <Phone className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">技术支持热线</p>
                        <p className="text-sm text-muted-foreground">
                          400-123-4567
                        </p>
                        <p className="text-xs text-green-400">
                          工作日 9:00-18:00
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-matrix-surface/30 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">邮件支持</p>
                        <p className="text-sm text-muted-foreground">
                          support@cyberguard.com
                        </p>
                        <p className="text-xs text-blue-400">24小时内回复</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-matrix-surface/30 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">在线客服</p>
                        <p className="text-sm text-muted-foreground">
                          即时聊天支持
                        </p>
                        <p className="text-xs text-purple-400">
                          工作日 9:00-22:00
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-matrix-surface/30 rounded-lg">
                      <Globe className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="font-medium text-white">远程支持</p>
                        <p className="text-sm text-muted-foreground">
                          屏幕共享技术支持
                        </p>
                        <p className="text-xs text-amber-400">预约制</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 团队信息 */}
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    支持团队
                  </CardTitle>
                  <CardDescription>专业的技术支持团队</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        name: "技术支持团队",
                        role: "一线技术支持",
                        description: "处理常见技术问题和使用咨询",
                        icon: Headphones,
                        availability: "7x24小时",
                      },
                      {
                        name: "产品专家团队",
                        role: "产品功能专家",
                        description: "深度功能咨询和配置指导",
                        icon: Settings,
                        availability: "工作日",
                      },
                      {
                        name: "研发工程师",
                        role: "技术专家支持",
                        description: "复杂技术问题和定制开发",
                        icon: Coffee,
                        availability: "预约制",
                      },
                    ].map((team, index) => (
                      <div
                        key={index}
                        className="p-3 bg-matrix-surface/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <team.icon className="w-5 h-5 text-cyan-400" />
                          <div>
                            <p className="font-medium text-white">
                              {team.name}
                            </p>
                            <p className="text-sm text-cyan-400">{team.role}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {team.description}
                        </p>
                        <p className="text-xs text-green-400">
                          服务时间: {team.availability}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 快速链接和反馈 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-orange-400" />
                    快速链接
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "产品官网", icon: Globe },
                      { name: "开发者文档", icon: FileText },
                      { name: "社区论坛", icon: MessageSquare },
                      { name: "更新日志", icon: Clock },
                      { name: "API状态", icon: Activity },
                      { name: "培训资料", icon: BookOpen },
                    ].map((link, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start bg-matrix-surface/30 border-matrix-border hover:border-orange-400/30"
                      >
                        <link.icon className="w-4 h-4 mr-2 text-orange-400" />
                        {link.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-pink-400" />
                    意见反馈
                  </CardTitle>
                  <CardDescription>帮助我们改进产品和服务</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <textarea
                      placeholder="请告诉我们您的建议或意见..."
                      rows={3}
                      className="w-full p-3 bg-matrix-surface/50 border border-matrix-border rounded-lg text-white placeholder-muted-foreground resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        placeholder="您的邮箱（可选）"
                        className="flex-1 p-2 bg-matrix-surface/50 border border-matrix-border rounded text-white placeholder-muted-foreground"
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    提交反馈
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
