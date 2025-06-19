import { useState } from "react";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Shield,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Calendar,
  Activity,
  Settings,
  Crown,
  Eye,
  Lock,
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
    loginCount: 89,
    createdAt: "2023-08-20",
    permissions: ["read", "analyze"],
  },
  {
    id: "3",
    username: "viewer_zhang",
    email: "zhang@cyberguard.com",
    role: "viewer",
    status: "inactive",
    lastLogin: "2024-01-10 16:45:30",
    loginCount: 23,
    createdAt: "2023-09-12",
    permissions: ["read"],
  },
  {
    id: "4",
    username: "security_li",
    email: "li@cyberguard.com",
    role: "analyst",
    status: "locked",
    lastLogin: "2024-01-05 11:20:15",
    loginCount: 156,
    createdAt: "2023-07-08",
    permissions: ["read", "analyze"],
  },
];

export default function UserManagement() {
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Crown;
      case "analyst":
        return Activity;
      case "viewer":
        return Eye;
      default:
        return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-500/30";
      case "analyst":
        return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/30";
      case "viewer":
        return "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
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
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border border-emerald-500/30";
      case "inactive":
        return "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30";
      case "locked":
        return "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
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
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return UserCheck;
      case "inactive":
        return UserX;
      case "locked":
        return Lock;
      default:
        return Users;
    }
  };

  const handleUserAction = (action: string, user: User) => {
    console.log(`${action} user:`, user);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 页面头部 */}
      <div className="mb-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl border border-blue-500/30">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              用户管理中心
            </h1>
            <p className="text-slate-400 text-lg mt-1">
              管理系统用户账户、权限和访问控制
            </p>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 hover:border-blue-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">
                总用户数
              </p>
              <p className="text-3xl font-bold text-blue-400 mb-1">
                {users.length}
              </p>
              <p className="text-xs text-slate-500">系统注册用户</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">
                活跃用户
              </p>
              <p className="text-3xl font-bold text-emerald-400 mb-1">
                {users.filter((u) => u.status === "active").length}
              </p>
              <p className="text-xs text-slate-500">在线活跃</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <UserCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">
                非活跃用户
              </p>
              <p className="text-3xl font-bold text-amber-400 mb-1">
                {users.filter((u) => u.status === "inactive").length}
              </p>
              <p className="text-xs text-slate-500">暂时离线</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
              <UserX className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 hover:border-red-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">
                锁定用户
              </p>
              <p className="text-3xl font-bold text-red-400 mb-1">
                {users.filter((u) => u.status === "locked").length}
              </p>
              <p className="text-xs text-slate-500">安全锁定</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤控制面板 */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            {/* 过滤器 */}
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                >
                  <option value="all">所有角色</option>
                  <option value="admin">管理员</option>
                  <option value="analyst">分析师</option>
                  <option value="viewer">查看者</option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              >
                <option value="all">所有状态</option>
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
                <option value="locked">已锁定</option>
              </select>
            </div>
          </div>

          {/* 添加用户按钮 */}
          <button className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            <span>添加用户</span>
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/30">
                <th className="text-left p-6 text-slate-300 font-semibold text-sm tracking-wide">
                  用户信息
                </th>
                <th className="text-left p-6 text-slate-300 font-semibold text-sm tracking-wide">
                  角色权限
                </th>
                <th className="text-left p-6 text-slate-300 font-semibold text-sm tracking-wide">
                  状态
                </th>
                <th className="text-left p-6 text-slate-300 font-semibold text-sm tracking-wide">
                  活动信息
                </th>
                <th className="text-left p-6 text-slate-300 font-semibold text-sm tracking-wide">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const RoleIcon = getRoleIcon(user.role);
                const StatusIcon = getStatusIcon(user.status);

                return (
                  <tr
                    key={user.id}
                    className={cn(
                      "border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200",
                      index % 2 === 0 ? "bg-slate-800/10" : "bg-transparent",
                    )}
                  >
                    {/* 用户信息 */}
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                            <Users className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-slate-800"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-base">
                            {user.username}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <p className="text-sm text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 角色权限 */}
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                          <RoleIcon className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <span
                            className={cn(
                              "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium",
                              getRoleColor(user.role),
                            )}
                          >
                            {getRoleText(user.role)}
                          </span>
                          <p className="text-xs text-slate-400 mt-1">
                            权限: {user.permissions.join(", ")}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 状态 */}
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="w-5 h-5 text-slate-400" />
                        <span
                          className={cn(
                            "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium",
                            getStatusColor(user.status),
                          )}
                        >
                          {getStatusText(user.status)}
                        </span>
                      </div>
                    </td>

                    {/* 活动信息 */}
                    <td className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{user.lastLogin}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Activity className="w-4 h-4" />
                          <span>登录 {user.loginCount} 次</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>注册于 {user.createdAt}</span>
                        </div>
                      </div>
                    </td>

                    {/* 操作按钮 */}
                    <td className="p-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUserAction("edit", user)}
                          className="group p-2.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:scale-105"
                          title="编辑用户"
                        >
                          <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                        </button>

                        <button
                          onClick={() => handleUserAction("settings", user)}
                          className="group p-2.5 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-200 hover:scale-105"
                          title="用户设置"
                        >
                          <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <button
                          onClick={() => handleUserAction("delete", user)}
                          className="group p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-105"
                          title="删除用户"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>

                        <button
                          className="group p-2.5 text-slate-400 hover:bg-slate-500/10 rounded-lg transition-all duration-200 hover:scale-105"
                          title="更多操作"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 分页或无数据状态 */}
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              未找到匹配的用户
            </h3>
            <p className="text-slate-400">请尝试调整搜索条件或添加新用户</p>
          </div>
        )}
      </div>
    </div>
  );
}
