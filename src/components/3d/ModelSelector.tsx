import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { CyberSecurityModel } from "./CyberSecurityModel";
import { NetworkTrafficModel } from "./NetworkTrafficModel";
import { ThreatVisualization } from "./ThreatVisualization";
import { SimpleShieldModel } from "./SimpleShieldModel";

type ModelType = "cybersecurity" | "network" | "threats" | "shield";

interface ModelOption {
  type: ModelType;
  name: string;
  description: string;
  icon: string;
}

const modelOptions: ModelOption[] = [
  {
    type: "cybersecurity",
    name: "网络安全中心",
    description: "完整的安全防护系统",
    icon: "🛡️",
  },
  {
    type: "network",
    name: "网络流量监控",
    description: "实时网络拓扑和数据流",
    icon: "🌐",
  },
  {
    type: "threats",
    name: "威胁可视化",
    description: "威胁检测和攻击路径",
    icon: "⚠️",
  },
  {
    type: "shield",
    name: "简化防护盾",
    description: "轻量级3D盾牌",
    icon: "🔒",
  },
];

export function ModelSelector() {
  const [activeModel, setActiveModel] = useState<ModelType>("cybersecurity");

  const renderModel = () => {
    switch (activeModel) {
      case "cybersecurity":
        return <CyberSecurityModel />;
      case "network":
        return <NetworkTrafficModel />;
      case "threats":
        return <ThreatVisualization />;
      case "shield":
        return <SimpleShieldModel />;
      default:
        return <CyberSecurityModel />;
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D场景 */}
      <Canvas
        camera={{ position: [8, 6, 8], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* 星空背景 */}
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* 相机控制 */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.8}
          maxDistance={20}
          minDistance={3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
        />

        {/* 动态渲染选中的模型 */}
        {renderModel()}

        {/* 雾效 */}
        <fog attach="fog" args={["#0d1117", 10, 30]} />
      </Canvas>

      {/* 模型选择器UI */}
      <div className="absolute top-4 left-4 z-10">
        <div className="cyber-card p-4 bg-matrix-surface/90 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
            <span>🎛️</span>
            <span>3D模型选择</span>
          </h3>
          <div className="space-y-2">
            {modelOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setActiveModel(option.type)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  activeModel === option.type
                    ? "bg-neon-blue/20 border border-neon-blue text-neon-blue"
                    : "bg-matrix-accent/30 hover:bg-matrix-accent/50 text-muted-foreground hover:text-white"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{option.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{option.name}</div>
                    <div className="text-xs opacity-80 mt-1">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 信息显示 */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="cyber-card p-3 bg-matrix-surface/90 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>🖱️ 鼠标拖拽旋转</div>
            <div>🔍 滚轮缩放</div>
            <div>⚡ 自动旋转已启用</div>
          </div>
        </div>
      </div>

      {/* 当前模型信息 */}
      <div className="absolute top-4 right-4 z-10">
        <div className="cyber-card p-4 bg-matrix-surface/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">
              {modelOptions.find((opt) => opt.type === activeModel)?.icon}
            </div>
            <div className="text-sm font-semibold text-white">
              {modelOptions.find((opt) => opt.type === activeModel)?.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {
                modelOptions.find((opt) => opt.type === activeModel)
                  ?.description
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
