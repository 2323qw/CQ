import { useState } from "react";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "analyst" | "viewer";
  status: "active" | "inactive" | "locked";
  lastLogin: string;
  loginCount: number;
  createdAt: string;
  permissions: string[];
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@cyberguard.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15 14:30:25",
    loginCount: 247,
    createdAt: "2023-06-15",
    permissions: ["all"],
  },
  {
    id: "2",
    username: "analyst_wang",
    email: "wang@cyberguard.com",
    role: "analyst",
    status: "active",
    lastLogin: "2024-01-15 09:15:10",
    loginCount: 156,
    createdAt: "2023-08-20",
    permissions: ["view_alerts", "manage_alerts", "view_reports"],
  },
  {
    id: "3",
    username: "viewer_li",
    email: "li@cyberguard.com",
    role: "viewer",
    status: "inactive",
    lastLogin: "2024-01-10 16:45:33",
    loginCount: 89,
    createdAt: "2023-10-05",
    permissions: ["view_dashboard", "view_alerts"],
  },
  {
    id: "4",
    username: "security_zhao",
    email: "zhao@cyberguard.com",
    role: "analyst",
    status: "locked",
    lastLogin: "2024-01-14 11:20:15",
    loginCount: 203,
    createdAt: "2023-07-12",
    permissions: ["view_alerts", "manage_alerts", "view_network"],
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-threat-critical bg-threat-critical/20";
      case "analyst":
        return "text-neon-blue bg-neon-blue/20";
      case "viewer":
        return "text-neon-green bg-neon-green/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-neon-green bg-neon-green/20";
      case "inactive":
        return "text-threat-medium bg-threat-medium/20";
      case "locked":
        return "text-threat-critical bg-threat-critical/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "系统管理员";
      case "analyst":
        return "安全分析师";
      case "viewer":
        return "只读用户";
      default:
        return "未知";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "活跃";
      case "inactive":
        return "非活跃";
      case "locked":
        return "已锁定";
      default:
        return "未知";
    }
  };

  const handleUserAction = (action: string, user: User) => {
    switch (action) {
      case "edit":
        setSelectedUser(user);
        setIsModalOpen(true);
        break;
      case "activate":
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, status: "active" as const } : u,
          ),
        );
        if (window.showToast) {
          window.showToast({
            title: "用户已激活",
            description: `用户 ${user.username} 已成功激活`,
            type: "success",
          });
        }
        break;
      case "deactivate":
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, status: "inactive" as const } : u,
          ),
        );
        if (window.showToast) {
          window.showToast({
            title: "用户已停用",
            description: `用户 ${user.username} 已停用`,
            type: "warning",
          });
        }
        break;
      case "lock":
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, status: "locked" as const } : u,
          ),
        );
        if (window.showToast) {
          window.showToast({
            title: "用户已锁定",
            description: `用户 ${user.username} 已被锁定`,
            type: "error",
          });
        }
        break;
      case "delete":
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        if (window.showToast) {
          window.showToast({
            title: "用户已删除",
            description: `用户 ${user.username} 已从系统中删除`,
            type: "error",
          });
        }
        break;
    }
  };

  return (
    <div className="p-8 min-h-screen matrix-bg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white glow-text mb-2">
          用户管理
        </h1>
        <p className="text-muted-foreground">
          管理系统用户账户、权限和访问控制
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="cyber-card p-6 border-l-4 border-l-neon-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">总用户数</p>
              <p className="text-2xl font-bold text-neon-blue glow-text">
                {users.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-neon-blue" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-neon-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">活跃用户</p>
              <p className="text-2xl font-bold text-neon-green glow-text">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-neon-green" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-threat-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">非活跃用户</p>
              <p className="text-2xl font-bold text-threat-medium glow-text">
                {users.filter((u) => u.status === "inactive").length}
              </p>
            </div>
            <UserX className="w-8 h-8 text-threat-medium" />
          </div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-threat-critical">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">锁定用户</p>
              <p className="text-2xl font-bold text-threat-critical glow-text">
                {users.filter((u) => u.status === "locked").length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-threat-critical" />
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="cyber-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            >
              <option value="all">所有角色</option>
              <option value="admin">系统管理员</option>
              <option value="analyst">安全分析师</option>
              <option value="viewer">只读用户</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-matrix-surface border border-matrix-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            >
              <option value="all">所有状态</option>
              <option value="active">活跃</option>
              <option value="inactive">非活跃</option>
              <option value="locked">已锁定</option>
            </select>
          </div>
          <button className="neon-button flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>添加用户</span>
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="cyber-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-matrix-border">
                <th className="text-left p-4 text-muted-foreground font-medium">
                  用户
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  角色
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  状态
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  最后登录
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  登录次数
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-matrix-border/50 hover:bg-matrix-accent/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center border border-neon-blue/30">
                        <Users className="w-5 h-5 text-neon-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {user.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-mono",
                        getRoleColor(user.role),
                      )}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-mono",
                        getStatusColor(user.status),
                      )}
                    >
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{user.lastLogin}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white font-mono">
                    {user.loginCount}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUserAction("edit", user)}
                        className="p-2 text-neon-blue hover:bg-neon-blue/10 rounded transition-colors"
                        title="编辑用户"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {user.status === "active" ? (
                        <button
                          onClick={() => handleUserAction("deactivate", user)}
                          className="p-2 text-threat-medium hover:bg-threat-medium/10 rounded transition-colors"
                          title="停用用户"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction("activate", user)}
                          className="p-2 text-neon-green hover:bg-neon-green/10 rounded transition-colors"
                          title="���活用户"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleUserAction("lock", user)}
                        className="p-2 text-threat-critical hover:bg-threat-critical/10 rounded transition-colors"
                        title="锁定用户"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction("delete", user)}
                        className="p-2 text-threat-critical hover:bg-threat-critical/10 rounded transition-colors"
                        title="删除用户"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
