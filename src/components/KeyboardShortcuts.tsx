import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const shortcuts = [
  { key: "1", path: "/", description: "仪表板" },
  { key: "2", path: "/situation", description: "3D态势大屏" },
  { key: "3", path: "/system-monitor", description: "系统监控" },
  { key: "4", path: "/alerts", description: "威胁告警" },
  { key: "5", path: "/evidence-collection", description: "证据收集" },
  { key: "6", path: "/reports", description: "安全报告" },
  { key: "7", path: "/threat-intelligence", description: "威胁情报" },
  { key: "8", path: "/assets", description: "资产管理" },
  { key: "9", path: "/users", description: "用户管理" },
  { key: "0", path: "/settings", description: "系统设置" },
];

export const KeyboardShortcuts: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 检查是否按下了 Ctrl/Cmd + Shift + 数字键
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        const shortcut = shortcuts.find((s) => s.key === event.key);
        if (shortcut) {
          event.preventDefault();
          navigate(shortcut.path);
        }
      }

      // ESC 键关闭模态框或返回上一页
      if (event.key === "Escape") {
        // 可以添加关闭模态框的逻辑
        console.log("ESC pressed");
      }

      // 快捷搜索 Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        navigate("/evidence-collection");
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  return null; // 这是一个无渲染组件
};

// 显示快捷键帮助的组件
export const KeyboardShortcutsHelp: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4">
        <div className="cyber-card border-2 border-neon-blue/30 p-6">
          <h3 className="text-xl font-bold text-white mb-4 neon-text">
            键盘快捷键
          </h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground mb-4">
              使用 Ctrl+Shift+数字 快速导航：
            </div>
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between py-2 border-b border-matrix-border/50"
              >
                <span className="text-white">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-matrix-surface text-neon-blue text-xs rounded border border-matrix-border font-mono">
                  Ctrl+Shift+{shortcut.key}
                </kbd>
              </div>
            ))}
            <div className="flex items-center justify-between py-2 border-b border-matrix-border/50">
              <span className="text-white">快捷搜索</span>
              <kbd className="px-2 py-1 bg-matrix-surface text-neon-blue text-xs rounded border border-matrix-border font-mono">
                Ctrl+K
              </kbd>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-white">帮助</span>
              <kbd className="px-2 py-1 bg-matrix-surface text-neon-blue text-xs rounded border border-matrix-border font-mono">
                ?
              </kbd>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full neon-button-purple py-2"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
