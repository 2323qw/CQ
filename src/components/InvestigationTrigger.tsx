import React from "react";
import { Search, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InvestigationTriggerProps {
  ip?: string;
  variant?: "button" | "icon" | "link";
  className?: string;
  children?: React.ReactNode;
}

export const InvestigationTrigger: React.FC<InvestigationTriggerProps> = ({
  ip,
  variant = "button",
  className = "",
  children,
}) => {
  const navigate = useNavigate();

  const handleStartInvestigation = () => {
    if (ip) {
      navigate(`/evidence-collection?ip=${encodeURIComponent(ip)}`);
    } else {
      navigate("/evidence-collection");
    }
  };

  const baseClasses = "transition-all duration-200 hover:scale-105";

  switch (variant) {
    case "icon":
      return (
        <button
          onClick={handleStartInvestigation}
          className={`${baseClasses} p-2 rounded-lg bg-quantum-500/20 text-quantum-400 hover:bg-quantum-500/30 hover:text-quantum-300 ${className}`}
          title={ip ? `调查IP: ${ip}` : "开始调查"}
        >
          <FileSearch className="w-4 h-4" />
        </button>
      );

    case "link":
      return (
        <button
          onClick={handleStartInvestigation}
          className={`${baseClasses} text-quantum-400 hover:text-quantum-300 underline underline-offset-4 ${className}`}
        >
          {children || "开始调查"}
        </button>
      );

    default:
      return (
        <button
          onClick={handleStartInvestigation}
          className={`${baseClasses} cyber-card-enhanced px-4 py-2 rounded-lg border border-quantum-500/30 bg-quantum-500/10 hover:bg-quantum-500/20 text-quantum-300 hover:text-quantum-200 flex items-center gap-2 ${className}`}
        >
          <Search className="w-4 h-4" />
          {children || (ip ? `调查 ${ip}` : "开始调查")}
        </button>
      );
  }
};
