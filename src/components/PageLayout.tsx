import React from "react";
import { LucideIcon } from "lucide-react";

interface PageLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  description,
  icon: Icon,
  children,
  headerActions,
  className = "",
}: PageLayoutProps) {
  return (
    <div
      className={`p-8 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}
    >
      {/* 页面头部 */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl border border-blue-500/30">
              <Icon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-slate-400 text-lg mt-1">{description}</p>
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center space-x-4">{headerActions}</div>
          )}
        </div>
      </div>

      {/* 页面内容 */}
      {children}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "emerald" | "amber";
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      border: "hover:border-blue-500/50",
      bg: "from-blue-500/5",
      iconBg: "bg-blue-500/20 border-blue-500/30",
      iconColor: "text-blue-400",
      valueColor: "text-blue-400",
    },
    green: {
      border: "hover:border-emerald-500/50",
      bg: "from-emerald-500/5",
      iconBg: "bg-emerald-500/20 border-emerald-500/30",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    emerald: {
      border: "hover:border-emerald-500/50",
      bg: "from-emerald-500/5",
      iconBg: "bg-emerald-500/20 border-emerald-500/30",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    purple: {
      border: "hover:border-purple-500/50",
      bg: "from-purple-500/5",
      iconBg: "bg-purple-500/20 border-purple-500/30",
      iconColor: "text-purple-400",
      valueColor: "text-purple-400",
    },
    orange: {
      border: "hover:border-orange-500/50",
      bg: "from-orange-500/5",
      iconBg: "bg-orange-500/20 border-orange-500/30",
      iconColor: "text-orange-400",
      valueColor: "text-orange-400",
    },
    red: {
      border: "hover:border-red-500/50",
      bg: "from-red-500/5",
      iconBg: "bg-red-500/20 border-red-500/30",
      iconColor: "text-red-400",
      valueColor: "text-red-400",
    },
    amber: {
      border: "hover:border-amber-500/50",
      bg: "from-amber-500/5",
      iconBg: "bg-amber-500/20 border-amber-500/30",
      iconColor: "text-amber-400",
      valueColor: "text-amber-400",
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 ${classes.border} transition-all duration-300`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${classes.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold mb-1 ${classes.valueColor}`}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs ${
                  trend.direction === "up" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {trend.direction === "up" ? "↗" : "↘"} {Math.abs(trend.value)}
                %
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${classes.iconBg}`}>
          <Icon className={`w-6 h-6 ${classes.iconColor}`} />
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Card({
  children,
  className = "",
  title,
  description,
  actions,
}: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 ${className}`}
    >
      {(title || description || actions) && (
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            {title && (
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            )}
            {description && (
              <p className="text-slate-400 mt-1">{description}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={title || description || actions ? "p-6" : "p-0"}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
