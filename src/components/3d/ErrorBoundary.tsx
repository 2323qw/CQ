import React from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { CSSShield } from "./CSSShield";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ThreeErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("3D Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 使用CSS 3D作为fallback
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <CSSShield />
          <div className="text-center mt-6">
            <h3 className="text-xl font-bold text-white glow-text mb-2">
              CyberGuard
            </h3>
            <p className="text-sm text-muted-foreground">网络安全监控系统</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
