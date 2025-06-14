import { Shield } from "lucide-react";

export function SimpleShield() {
  return (
    <div className="relative flex items-center justify-center">
      {/* 主盾牌图标 */}
      <div className="relative">
        <Shield className="w-32 h-32 text-neon-blue glow-text" />

        {/* 脉冲环 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 border-2 border-neon-blue/30 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-36 h-36 border border-neon-green/20 rounded-full animate-pulse"></div>
        </div>

        {/* 中心发光点 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-neon-blue rounded-full animate-pulse"></div>
      </div>

      {/* 环绕的能量点 */}
      {[0, 1, 2, 3].map((index) => {
        const angle = index * 90 * (Math.PI / 180);
        const radius = 80;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={index}
            className="absolute w-2 h-2 bg-neon-green rounded-full animate-pulse"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              animationDelay: `${index * 0.5}s`,
            }}
          />
        );
      })}

      {/* 扫描线 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent animate-scan-line"></div>
      </div>
    </div>
  );
}
