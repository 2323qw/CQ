import React, { useState } from "react";
import {
  Settings,
  Eye,
  EyeOff,
  Zap,
  ZapOff,
  RotateCw,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Star,
  Globe,
  Cpu,
  Shield,
  Network,
  Target,
  Brain,
  Sparkles,
  Sun,
  Moon,
  Layers,
  Filter,
  Sliders,
} from "lucide-react";
import { DISPLAY_COLORS } from "@/lib/situationDisplayColors";

interface Enhanced3DSceneControlsProps {
  sceneConfig: any;
  onConfigChange: (config: any) => void;
  isVisible: boolean;
  onToggle: () => void;
}

/**
 * 增强版3D场景控制面板
 */
export function Enhanced3DSceneControls({
  sceneConfig,
  onConfigChange,
  isVisible,
  onToggle,
}: Enhanced3DSceneControlsProps) {
  const [activeSection, setActiveSection] = useState("display");

  const sections = [
    { id: "display", label: "显示", icon: Eye },
    { id: "animation", label: "动画", icon: Zap },
    { id: "environment", label: "环境", icon: Globe },
    { id: "effects", label: "特效", icon: Sparkles },
    { id: "performance", label: "性能", icon: Gauge },
  ];

  const renderDisplayControls = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-neon-cyan mb-3">显示设置</h4>

      {/* 场景模式 */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">场景模式</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "quantum-command", label: "量子指挥", icon: Target },
            { id: "quantum-topology", label: "网络拓扑", icon: Network },
            { id: "ai-globe", label: "威胁情报", icon: Globe },
            { id: "overview", label: "经典视图", icon: Eye },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onConfigChange({ mode: mode.id })}
              className={`flex items-center justify-center space-x-1 px-2 py-2 rounded text-xs transition-all ${
                sceneConfig.mode === mode.id
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/50"
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <mode.icon className="w-3 h-3" />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 基础显示选项 */}
      <div className="space-y-3">
        <ToggleControl
          label="显示网格"
          checked={sceneConfig.showGrid}
          onChange={(checked) => onConfigChange({ showGrid: checked })}
          icon={Layers}
        />
        <ToggleControl
          label="显示标签"
          checked={sceneConfig.showLabels}
          onChange={(checked) => onConfigChange({ showLabels: checked })}
          icon={Eye}
        />
        <ToggleControl
          label="连接线"
          checked={sceneConfig.showConnectionLines}
          onChange={(checked) =>
            onConfigChange({ showConnectionLines: checked })
          }
          icon={Network}
        />
      </div>

      {/* 视角控制 */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">相机视角</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "俯视", value: "top" },
            { label: "侧视", value: "side" },
            { label: "自由", value: "free" },
          ].map((view) => (
            <button
              key={view.value}
              onClick={() => onConfigChange({ cameraView: view.value })}
              className={`px-2 py-1 rounded text-xs transition-all ${
                sceneConfig.cameraView === view.value
                  ? "bg-neon-green/20 text-neon-green"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnimationControls = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-neon-cyan mb-3">动画设置</h4>

      <ToggleControl
        label="自动旋转"
        checked={sceneConfig.autoRotate}
        onChange={(checked) => onConfigChange({ autoRotate: checked })}
        icon={RotateCw}
      />

      <SliderControl
        label="旋转速度"
        value={sceneConfig.rotateSpeed || 0.5}
        min={0.1}
        max={2.0}
        step={0.1}
        onChange={(value) => onConfigChange({ rotateSpeed: value })}
        disabled={!sceneConfig.autoRotate}
      />

      <ToggleControl
        label="启用动画"
        checked={sceneConfig.enableAnimation}
        onChange={(checked) => onConfigChange({ enableAnimation: checked })}
        icon={Zap}
      />

      <ToggleControl
        label="动态环境"
        checked={sceneConfig.dynamicEnvironment}
        onChange={(checked) => onConfigChange({ dynamicEnvironment: checked })}
        icon={Globe}
      />

      <ToggleControl
        label="呼吸效果"
        checked={sceneConfig.breathingEffect}
        onChange={(checked) => onConfigChange({ breathingEffect: checked })}
        icon={Sparkles}
      />

      <SliderControl
        label="动画速度"
        value={sceneConfig.animationSpeed || 1.0}
        min={0.1}
        max={3.0}
        step={0.1}
        onChange={(value) => onConfigChange({ animationSpeed: value })}
      />
    </div>
  );

  const renderEnvironmentControls = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-neon-cyan mb-3">环境设置</h4>

      <SliderControl
        label="星空密度"
        value={sceneConfig.starCount || 3000}
        min={500}
        max={5000}
        step={100}
        onChange={(value) => onConfigChange({ starCount: value })}
      />

      <SliderControl
        label="星空半径"
        value={sceneConfig.starRadius || 800}
        min={200}
        max={1500}
        step={50}
        onChange={(value) => onConfigChange({ starRadius: value })}
      />

      <SliderControl
        label="星空速度"
        value={sceneConfig.starSpeed || 0.01}
        min={0.001}
        max={0.05}
        step={0.001}
        onChange={(value) => onConfigChange({ starSpeed: value })}
      />

      <ToggleControl
        label="雾效"
        checked={sceneConfig.enableFog}
        onChange={(checked) => onConfigChange({ enableFog: checked })}
        icon={Sun}
      />

      <ToggleControl
        label="环境光照"
        checked={sceneConfig.enableAmbientLight}
        onChange={(checked) => onConfigChange({ enableAmbientLight: checked })}
        icon={Sun}
      />

      {/* 环境主题 */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">环境主题</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "space", label: "深空", color: "#0a0e1a" },
            { id: "cyber", label: "赛博", color: "#001122" },
            { id: "matrix", label: "矩阵", color: "#000a00" },
            { id: "quantum", label: "量子", color: "#1a0a1a" },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => onConfigChange({ environmentTheme: theme.id })}
              className={`flex items-center justify-center space-x-1 px-2 py-2 rounded text-xs transition-all ${
                sceneConfig.environmentTheme === theme.id
                  ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/50"
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
              style={{ borderLeftColor: theme.color, borderLeftWidth: "3px" }}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEffectsControls = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-neon-cyan mb-3">特效设置</h4>

      <ToggleControl
        label="粒子效果"
        checked={sceneConfig.particleEffects}
        onChange={(checked) => onConfigChange({ particleEffects: checked })}
        icon={Sparkles}
      />

      <ToggleControl
        label="发光效果"
        checked={sceneConfig.enableGlow}
        onChange={(checked) => onConfigChange({ enableGlow: checked })}
        icon={Star}
      />

      <ToggleControl
        label="量子效果"
        checked={sceneConfig.quantumEffects}
        onChange={(checked) => onConfigChange({ quantumEffects: checked })}
        icon={Brain}
      />

      <SliderControl
        label="特效强度"
        value={sceneConfig.effectsIntensity || 1.0}
        min={0.1}
        max={2.0}
        step={0.1}
        onChange={(value) => onConfigChange({ effectsIntensity: value })}
      />

      <SliderControl
        label="粒子密度"
        value={sceneConfig.particleDensity || 1.0}
        min={0.1}
        max={3.0}
        step={0.1}
        onChange={(value) => onConfigChange({ particleDensity: value })}
      />

      <ToggleControl
        label="扫描线"
        checked={sceneConfig.enableScanLines}
        onChange={(checked) => onConfigChange({ enableScanLines: checked })}
        icon={Filter}
      />

      <ToggleControl
        label="全息效果"
        checked={sceneConfig.hologramEffect}
        onChange={(checked) => onConfigChange({ hologramEffect: checked })}
        icon={Eye}
      />
    </div>
  );

  const renderPerformanceControls = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-neon-cyan mb-3">性能设置</h4>

      {/* 质量等级 */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">渲染质量</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "low", label: "低", desc: "流畅优先" },
            { id: "medium", label: "中", desc: "平衡模式" },
            { id: "high", label: "高", desc: "质量优先" },
          ].map((quality) => (
            <button
              key={quality.id}
              onClick={() => onConfigChange({ renderQuality: quality.id })}
              className={`px-2 py-2 rounded text-xs transition-all ${
                sceneConfig.renderQuality === quality.id
                  ? "bg-neon-orange/20 text-neon-orange border border-neon-orange/50"
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
              title={quality.desc}
            >
              {quality.label}
            </button>
          ))}
        </div>
      </div>

      <SliderControl
        label="更新频率 (ms)"
        value={sceneConfig.updateInterval || 2000}
        min={500}
        max={5000}
        step={100}
        onChange={(value) => onConfigChange({ updateInterval: value })}
      />

      <ToggleControl
        label="自适应质量"
        checked={sceneConfig.adaptiveQuality}
        onChange={(checked) => onConfigChange({ adaptiveQuality: checked })}
        icon={Cpu}
      />

      <ToggleControl
        label="抗锯齿"
        checked={sceneConfig.enableAntialiasing}
        onChange={(checked) => onConfigChange({ enableAntialiasing: checked })}
        icon={Filter}
      />

      <SliderControl
        label="渲染距离"
        value={sceneConfig.renderDistance || 2000}
        min={500}
        max={5000}
        step={100}
        onChange={(value) => onConfigChange({ renderDistance: value })}
      />

      {/* 性能统计 */}
      <div className="mt-4 p-3 bg-gray-900/50 rounded border border-gray-700">
        <div className="text-xs text-gray-400 mb-2">性能统计</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className="text-neon-green">60</span>
          </div>
          <div className="flex justify-between">
            <span>渲染时间:</span>
            <span className="text-neon-blue">16.7ms</span>
          </div>
          <div className="flex justify-between">
            <span>顶点数:</span>
            <span className="text-neon-cyan">245K</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gray-900/90 border border-neon-blue/50 rounded-full flex items-center justify-center text-neon-blue hover:bg-neon-blue/20 transition-all duration-300 z-50"
        title="打开场景控制"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 max-h-96 bg-gray-900/95 border border-neon-blue/30 rounded-lg backdrop-blur-sm overflow-hidden z-50">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-neon-blue">场景控制</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {/* 分类标签 */}
      <div className="flex border-b border-gray-700">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-2 text-xs transition-all ${
              activeSection === section.id
                ? "bg-neon-blue/20 text-neon-blue border-b-2 border-neon-blue"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <section.icon className="w-3 h-3" />
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </div>

      {/* 控制内容 */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {activeSection === "display" && renderDisplayControls()}
        {activeSection === "animation" && renderAnimationControls()}
        {activeSection === "environment" && renderEnvironmentControls()}
        {activeSection === "effects" && renderEffectsControls()}
        {activeSection === "performance" && renderPerformanceControls()}
      </div>
    </div>
  );
}

/**
 * 切换控制组件
 */
function ToggleControl({
  label,
  checked,
  onChange,
  icon: Icon,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: any;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`w-10 h-5 rounded-full border transition-all duration-200 ${
          checked
            ? "bg-neon-blue/20 border-neon-blue"
            : "bg-gray-800 border-gray-600"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          className={`w-4 h-4 rounded-full transition-all duration-200 ${
            checked ? "bg-neon-blue ml-5" : "bg-gray-400 ml-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/**
 * 滑动条控制组件
 */
function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-xs text-neon-cyan font-mono">
          {typeof value === "number" ? value.toFixed(step < 1 ? 2 : 0) : value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => !disabled && onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${DISPLAY_COLORS.neon.blue} 0%, ${DISPLAY_COLORS.neon.blue} ${percentage}%, #374151 ${percentage}%, #374151 100%)`,
          }}
        />
      </div>
    </div>
  );
}

export default Enhanced3DSceneControls;
