import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationTriggerProps {
  onToggle: (isOpen: boolean) => void;
  className?: string;
}

export const MobileNavigationTrigger: React.FC<
  MobileNavigationTriggerProps
> = ({ onToggle, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg",
        "bg-matrix-surface border border-matrix-border",
        "text-white hover:text-neon-blue",
        "transition-all duration-200",
        "backdrop-blur-sm",
        className,
      )}
      aria-label={isOpen ? "关闭导航菜单" : "打开导航菜单"}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
};
