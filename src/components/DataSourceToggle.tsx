// DataSourceToggle组件已被移除，因为系统现在只使用API模式
// 此文件保留作为占位符，避免import错误

import React from "react";

interface DataSourceToggleProps {
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "compact" | "full";
}

export function DataSourceToggle(props: DataSourceToggleProps) {
  // 不再显示任何内容，因为只有API模式
  return null;
}

export default DataSourceToggle;
