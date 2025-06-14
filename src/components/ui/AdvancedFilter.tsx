import { useState } from "react";
import { Filter, X, Calendar, MapPin, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  type: "select" | "multiselect" | "daterange" | "text";
  options?: { value: string; label: string }[];
  value?: any;
}

interface AdvancedFilterProps {
  filters: FilterOption[];
  onFiltersChange: (filters: Record<string, any>) => void;
  className?: string;
}

export function AdvancedFilter({
  filters,
  onFiltersChange,
  className,
}: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...filterValues, [filterId]: value };

    // 移除空值
    Object.keys(newFilters).forEach((key) => {
      if (
        !newFilters[key] ||
        (Array.isArray(newFilters[key]) && newFilters[key].length === 0)
      ) {
        delete newFilters[key];
      }
    });

    setFilterValues(newFilters);
    setActiveFiltersCount(Object.keys(newFilters).length);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilterValues({});
    setActiveFiltersCount(0);
    onFiltersChange({});
  };

  const renderFilterField = (filter: FilterOption) => {
    const value = filterValues[filter.id];

    switch (filter.type) {
      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue"
          >
            <option value="">全部</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFilterChange(filter.id, newValues);
                  }}
                  className="text-neon-blue focus:ring-neon-blue"
                />
                <span className="text-sm text-white">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            placeholder={`搜索${filter.label}...`}
            className="w-full px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
        );

      case "daterange":
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="datetime-local"
              value={value?.start || ""}
              onChange={(e) =>
                handleFilterChange(filter.id, {
                  ...value,
                  start: e.target.value,
                })
              }
              className="px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
            <input
              type="datetime-local"
              value={value?.end || ""}
              onChange={(e) =>
                handleFilterChange(filter.id, {
                  ...value,
                  end: e.target.value,
                })
              }
              className="px-3 py-2 bg-matrix-surface border border-matrix-border rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* 过滤器按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
          activeFiltersCount > 0
            ? "bg-neon-blue/20 border border-neon-blue text-neon-blue"
            : "bg-matrix-surface border border-matrix-border text-muted-foreground hover:text-white",
        )}
      >
        <Filter className="w-4 h-4" />
        <span>高级过滤</span>
        {activeFiltersCount > 0 && (
          <span className="bg-neon-blue text-black text-xs px-2 py-0.5 rounded-full font-medium">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* 过滤器面板 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 z-40">
          <div className="cyber-card border border-neon-blue/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">高级过滤器</h3>
              <div className="flex items-center space-x-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    清除全部
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-white mb-2">
                    {filter.label}
                  </label>
                  {renderFilterField(filter)}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-matrix-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>活跃过滤器: {activeFiltersCount}</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="neon-button text-xs px-3 py-1"
                >
                  应用过滤器
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 预定义的过滤器配置
export const alertFilters: FilterOption[] = [
  {
    id: "severity",
    label: "威胁级别",
    type: "multiselect",
    options: [
      { value: "critical", label: "严重" },
      { value: "high", label: "高危" },
      { value: "medium", label: "中危" },
      { value: "low", label: "低危" },
    ],
  },
  {
    id: "status",
    label: "状态",
    type: "multiselect",
    options: [
      { value: "active", label: "活跃" },
      { value: "investigating", label: "调查中" },
      { value: "resolved", label: "已解决" },
    ],
  },
  {
    id: "location",
    label: "地理位置",
    type: "text",
  },
  {
    id: "source",
    label: "来源IP",
    type: "text",
  },
  {
    id: "timeRange",
    label: "时间范围",
    type: "daterange",
  },
];
