import React from "react";
import { Shield, AlertTriangle } from "lucide-react";

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
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-neon-blue/10 rounded-full flex items-center justify-center border-2 border-neon-blue/30 mb-4 relative mx-auto">
              <Shield className="w-10 h-10 text-neon-blue glow-text" />
              <div className="absolute inset-0 animate-pulse-glow">
                <Shield className="w-10 h-10 text-neon-blue opacity-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white glow-text mb-2">
                CyberGuard
              </h3>
              <p className="text-sm text-muted-foreground">网络安全监控系统</p>
            </div>
            <div className="text-xs text-threat-medium flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>3D渲染器加载中...</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
