import React, { useRef, useMemo, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  // Line component removed to prevent uniform errors
  Html,
  Sphere,
  Billboard,
  Sparkles,
  Trail,
  useTexture,
} from "@react-three/drei";
import {
  Group,
  Vector3,
  Mesh,
  SphereGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Color,
  PointLight,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending,
  DoubleSide,
  MathUtils,
  Raycaster,
  Object3D,
} from "three";
import {
  DISPLAY_COLORS,
  SCENE_CONFIG,
  getThreatColor,
  getStatusColor,
  getDataFlowColor,
} from "@/lib/situationDisplayColors";

/**
 * AI威胁情报全球态势配置
 * AI Threat Intelligence Global Situation Configuration
 */
const AI_THREAT_GLOBE_CONFIG = {
  // 全球威胁节点
  globalThreats: [
    // 亚洲区域
    {
      id: "threat-asia-1",
      name: "APT29 - Cozy Bear",
      type: "apt",
      severity: 9,
      country: "俄罗斯",
      coordinates: [37.6176, 55.7558], // 莫斯科
      targetSectors: ["政府", "金融", "能源"],
      techniques: ["T1566", "T1055", "T1071"],
      active: true,
      victims: 1247,
      attribution: 95,
    },
    {
      id: "threat-asia-2",
      name: "Lazarus Group",
      type: "financial",
      severity: 8,
      country: "朝鲜",
      coordinates: [125.7625, 39.0392], // 平壤
      targetSectors: ["金融", "加密货币", "娱乐"],
      techniques: ["T1566", "T1204", "T1059"],
      active: true,
      victims: 892,
      attribution: 88,
    },
    {
      id: "threat-asia-3",
      name: "Comment Crew",
      type: "espionage",
      severity: 7,
      country: "中国",
      coordinates: [116.4074, 39.9042], // 北京
      targetSectors: ["军事", "技术", "研发"],
      techniques: ["T1190", "T1083", "T1005"],
      active: false,
      victims: 567,
      attribution: 72,
    },

    // 欧洲区域
    {
      id: "threat-europe-1",
      name: "Turla",
      type: "espionage",
      severity: 8,
      country: "俄罗斯",
      coordinates: [37.6176, 55.7558], // 莫斯科
      targetSectors: ["政府", "外交", "军事"],
      techniques: ["T1071", "T1032", "T1027"],
      active: true,
      victims: 234,
      attribution: 91,
    },
    {
      id: "threat-europe-2",
      name: "Carbanak",
      type: "financial",
      severity: 6,
      country: "未知",
      coordinates: [2.3522, 48.8566], // 巴黎
      targetSectors: ["银行", "支付", "ATM"],
      techniques: ["T1566", "T1055", "T1105"],
      active: false,
      victims: 1000,
      attribution: 65,
    },

    // 北美区域
    {
      id: "threat-america-1",
      name: "Equation Group",
      type: "advanced",
      severity: 10,
      country: "美国",
      coordinates: [-77.0369, 38.9072], // 华盛顿
      targetSectors: ["全球目标"],
      techniques: ["T1190", "T1055", "T1027"],
      active: false,
      victims: 0,
      attribution: 0,
    },
    {
      id: "threat-america-2",
      name: "FIN7",
      type: "financial",
      severity: 7,
      country: "未知",
      coordinates: [-74.006, 40.7128], // 纽约
      targetSectors: ["零售", "餐饮", "酒店"],
      techniques: ["T1566", "T1204", "T1059"],
      active: true,
      victims: 3000,
      attribution: 78,
    },

    // 中东区域
    {
      id: "threat-middle-east-1",
      name: "Shamoon",
      type: "destructive",
      severity: 9,
      country: "伊朗",
      coordinates: [51.389, 35.6892], // 德黑兰
      targetSectors: ["石油", "天然气", "能源"],
      techniques: ["T1485", "T1490", "T1561"],
      active: true,
      victims: 45,
      attribution: 85,
    },

    // 非洲区域
    {
      id: "threat-africa-1",
      name: "SilverTerrier",
      type: "fraud",
      severity: 5,
      country: "尼日利亚",
      coordinates: [7.5399, 9.0765], // 阿布贾
      targetSectors: ["个人", "小企业", "电商"],
      techniques: ["T1566", "T1204", "T1078"],
      active: true,
      victims: 15000,
      attribution: 90,
    },

    // 大洋洲区域
    {
      id: "threat-oceania-1",
      name: "Winnti",
      type: "espionage",
      severity: 6,
      country: "中国",
      coordinates: [151.2093, -33.8688], // 悉尼
      targetSectors: ["游戏", "医疗", "电信"],
      techniques: ["T1190", "T1055", "T1071"],
      active: false,
      victims: 120,
      attribution: 80,
    },
  ],

  // 全球网络攻击实时数据流
  attackFlows: [
    {
      from: [125.7625, 39.0392], // 平壤
      to: [-74.006, 40.7128], // 纽约
      type: "financial",
      intensity: 8,
      packets: 1247,
      protocol: "https",
    },
    {
      from: [37.6176, 55.7558], // 莫斯科
      to: [2.3522, 48.8566], // 巴黎
      type: "espionage",
      intensity: 6,
      packets: 567,
      protocol: "dns",
    },
    {
      from: [116.4074, 39.9042], // 北京
      to: [-122.4194, 37.7749], // 旧金山
      type: "intellectual-property",
      intensity: 7,
      packets: 892,
      protocol: "tcp",
    },
    {
      from: [51.389, 35.6892], // 德黑兰
      to: [46.7219, 24.6877], // 利雅得
      type: "destructive",
      intensity: 9,
      packets: 234,
      protocol: "scada",
    },
  ],

  // AI防护节点
  defenseNodes: [
    {
      id: "defense-us",
      name: "CISA网络防护",
      coordinates: [-77.0369, 38.9072], // 华盛顿
      type: "government",
      effectiveness: 92,
      coverage: "北美",
      aiModels: 156,
    },
    {
      id: "defense-eu",
      name: "ENISA网络安全",
      coordinates: [2.3522, 48.8566], // 巴黎
      type: "regional",
      effectiveness: 88,
      coverage: "欧盟",
      aiModels: 98,
    },
    {
      id: "defense-asia",
      name: "亚太网络安全联盟",
      coordinates: [139.6917, 35.6895], // 东京
      type: "coalition",
      effectiveness: 85,
      coverage: "亚太",
      aiModels: 134,
    },
    {
      id: "defense-china",
      name: "国家网络安全中心",
      coordinates: [116.4074, 39.9042], // 北京
      type: "national",
      effectiveness: 90,
      coverage: "中国",
      aiModels: 245,
    },
  ],

  // 威胁情报共享网络
  intelligenceSharing: [
    {
      nodes: ["defense-us", "defense-eu"],
      type: "bilateral",
      classification: "top-secret",
      volume: 15000,
    },
    {
      nodes: ["defense-asia", "defense-us"],
      type: "multilateral",
      classification: "secret",
      volume: 8500,
    },
    {
      nodes: ["defense-eu", "defense-asia"],
      type: "bilateral",
      classification: "confidential",
      volume: 6200,
    },
  ],

  // 全球网络安全态势
  globalStatus: {
    threatLevel: 7,
    activeThreats: 12847,
    blockedAttacks: 2456789,
    protectedAssets: 98765432,
    aiDetectionRate: 96.7,
    responseTime: 1.3, // 分钟
  },
};

/**
 * 经纬度转换为3D球面坐标
 */
function latLonToVector3(
  lat: number,
  lon: number,
  radius: number = 10,
): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}

/**
 * 地球主体组件
 */
function EarthGlobe() {
  const earthRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.01;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.005;
    }
  });

  return (
    <group>
      {/* 地球主体 */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.ui.background.tertiary}
          emissive={DISPLAY_COLORS.corporate.primary}
          emissiveIntensity={0.1}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* 大气层 */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[10.5, 32, 32]} />
        <meshStandardMaterial
          color={DISPLAY_COLORS.neon.cyan}
          transparent
          opacity={0.1}
          side={2}
        />
      </mesh>

      {/* 地球网格线 */}
      <mesh>
        <sphereGeometry args={[10.1, 32, 16]} />
        <meshBasicMaterial
          color={DISPLAY_COLORS.ui.border.accent}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}

/**
 * 威胁标记组件
 */
function ThreatMarker({
  threat,
  realTimeData,
}: {
  threat: any;
  realTimeData: any;
}) {
  const markerRef = useRef<Group>(null);
  const pulseRef = useRef<Mesh>(null);

  const position = latLonToVector3(
    threat.coordinates[1],
    threat.coordinates[0],
  );
  const threatColor = getThreatColor(threat.severity);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (markerRef.current) {
      // 标记朝向相机
      markerRef.current.lookAt(state.camera.position);
    }

    if (pulseRef.current && threat.active) {
      const pulse = 1 + Math.sin(time * 4) * 0.3;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  const getThreatTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      apt: "高级持续威胁",
      financial: "金融犯罪",
      espionage: "网络间谍",
      advanced: "高级威胁",
      destructive: "破坏性攻击",
      fraud: "网络欺诈",
    };
    return names[type] || type;
  };

  return (
    <group ref={markerRef} position={position}>
      {/* 威胁标记 */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={threatColor}
          emissive={threatColor}
          emissiveIntensity={threat.active ? 0.8 : 0.3}
        />
      </mesh>

      {/* 脉冲环 */}
      {threat.active && (
        <mesh ref={pulseRef}>
          <torusGeometry args={[0.8, 0.05, 8, 32]} />
          <meshBasicMaterial color={threatColor} transparent opacity={0.6} />
        </mesh>
      )}

      {/* 威胁等级指示柱 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, threat.severity * 0.2, 8]} />
        <meshStandardMaterial
          color={threatColor}
          emissive={threatColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* 威胁信息 */}
      <Billboard position={[0, 2, 0]}>
        <Text
          fontSize={0.3}
          color={threatColor}
          anchorX="center"
          anchorY="middle"
        >
          {threat.name}
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.25}
          color={DISPLAY_COLORS.ui.text.secondary}
          anchorX="center"
          anchorY="middle"
        >
          {getThreatTypeName(threat.type)}
        </Text>
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.2}
          color={threatColor}
          anchorX="center"
          anchorY="middle"
        >
          威胁等级: {threat.severity}/10
        </Text>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.2}
          color={
            threat.active
              ? DISPLAY_COLORS.security.critical
              : DISPLAY_COLORS.ui.text.muted
          }
          anchorX="center"
          anchorY="middle"
        >
          {threat.active ? "活跃" : "已缓解"}
        </Text>
        <Text
          position={[0, -1.3, 0]}
          fontSize={0.18}
          color={DISPLAY_COLORS.ui.text.muted}
          anchorX="center"
          anchorY="middle"
        >
          受害者: {threat.victims.toLocaleString()}
        </Text>
      </Billboard>

      {/* 攻击技术可视化 */}
      {threat.techniques.map((technique, index) => (
        <mesh
          key={technique}
          position={[
            Math.cos((index / threat.techniques.length) * Math.PI * 2) * 0.6,
            0,
            Math.sin((index / threat.techniques.length) * Math.PI * 2) * 0.6,
          ]}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial
            color={DISPLAY_COLORS.neon.orange}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* 目标扇区指示器 */}
      {threat.targetSectors.length > 0 && (
        <mesh>
          <torusGeometry args={[1.2, 0.02, 8, 32]} />
          <meshBasicMaterial
            color={DISPLAY_COLORS.security.medium}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * 防护节点组件
 */
function DefenseNode({ node, realTimeData }: { node: any; realTimeData: any }) {
  const nodeRef = useRef<Group>(null);
  const shieldRef = useRef<Mesh>(null);

  const position = latLonToVector3(
    node.coordinates[1],
    node.coordinates[0],
    12,
  );
  const effectivenessColor = getPerformanceColor(node.effectiveness);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (nodeRef.current) {
      nodeRef.current.lookAt(state.camera.position);
    }

    if (shieldRef.current) {
      shieldRef.current.rotation.z = time * 0.5;
    }
  });

  return (
    <group ref={nodeRef} position={position}>
      {/* 防护盾牌 */}
      <mesh ref={shieldRef}>
        <octahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color={effectivenessColor}
          emissive={effectivenessColor}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
          wireframe
        />
      </mesh>

      {/* AI模型指示器 */}
      {Array.from({ length: Math.min(node.aiModels / 50, 6) }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 1.2,
            0,
            Math.sin((i / 6) * Math.PI * 2) * 1.2,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color={DISPLAY_COLORS.neon.blue}
            emissive={DISPLAY_COLORS.neon.blue}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* 防护范围指示 */}
      <mesh>
        <torusGeometry args={[2, 0.05, 8, 32]} />
        <meshBasicMaterial
          color={effectivenessColor}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 防护信息 */}
      <Billboard position={[0, 2, 0]}>
        <Text
          fontSize={0.35}
          color={effectivenessColor}
          anchorX="center"
          anchorY="middle"
        >
          {node.name}
        </Text>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.25}
          color={DISPLAY_COLORS.ui.text.secondary}
          anchorX="center"
          anchorY="middle"
        >
          覆盖: {node.coverage}
        </Text>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color={effectivenessColor}
          anchorX="center"
          anchorY="middle"
        >
          效率: {node.effectiveness}%
        </Text>
        <Text
          position={[0, -1.1, 0]}
          fontSize={0.2}
          color={DISPLAY_COLORS.neon.blue}
          anchorX="center"
          anchorY="middle"
        >
          AI模型: {node.aiModels}
        </Text>
      </Billboard>

      {/* AI处理特效 */}
      <Sparkles
        count={15}
        scale={[3, 3, 3]}
        size={2}
        speed={0.8}
        color={DISPLAY_COLORS.neon.blue}
        opacity={0.6}
      />
    </group>
  );
}

/**
 * 攻击流量可视化组件
 */
function AttackFlow({ flow, realTimeData }: { flow: any; realTimeData: any }) {
  const flowRef = useRef<Group>(null);
  const packetRef = useRef<Mesh>(null);

  const fromPos = latLonToVector3(flow.from[1], flow.from[0], 11);
  const toPos = latLonToVector3(flow.to[1], flow.to[0], 11);

  // 创建弧形路径
  const arcPath = useMemo(() => {
    const midPoint = new Vector3()
      .addVectors(fromPos, toPos)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(15); // 弧形高度

    return [fromPos, midPoint, toPos];
  }, [fromPos, toPos]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (packetRef.current) {
      // 沿弧形路径移动
      const progress = (Math.sin(time * 2 + flow.intensity) + 1) / 2;
      const t1 = progress;
      const t2 = 1 - progress;

      // 贝塞尔曲线插值
      const pos = new Vector3()
        .copy(arcPath[0])
        .multiplyScalar(t2 * t2)
        .add(new Vector3().copy(arcPath[1]).multiplyScalar(2 * t1 * t2))
        .add(new Vector3().copy(arcPath[2]).multiplyScalar(t1 * t1));

      packetRef.current.position.copy(pos);
    }
  });

  const getFlowColor = () => {
    switch (flow.type) {
      case "financial":
        return DISPLAY_COLORS.security.critical;
      case "espionage":
        return DISPLAY_COLORS.neon.purple;
      case "intellectual-property":
        return DISPLAY_COLORS.neon.orange;
      case "destructive":
        return DISPLAY_COLORS.security.critical;
      default:
        return DISPLAY_COLORS.ui.text.muted;
    }
  };

  const flowColor = getFlowColor();

  return (
    <group ref={flowRef}>
      {/* 攻击路径 */}
      {/* <Line
        points={arcPath}
        color={flowColor}
        lineWidth={Math.max(flow.intensity / 2, 1)}
        transparent
        opacity={0.6}
        dashed
        dashSize={0.5}
        gapSize={0.3}
      /> */}

      {/* 移动的攻击包 */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial
          color={flowColor}
          emissive={flowColor}
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* 攻击轨迹 */}
      <Trail
        width={0.2}
        length={6}
        color={flowColor}
        attenuation={(t) => t * t}
      >
        <mesh ref={packetRef}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color={flowColor} />
        </mesh>
      </Trail>

      {/* 攻击信息 */}
      <Billboard position={arcPath[1]}>
        <Text
          fontSize={0.2}
          color={flowColor}
          anchorX="center"
          anchorY="middle"
        >
          {flow.type.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.15}
          color={DISPLAY_COLORS.ui.text.secondary}
          anchorX="center"
          anchorY="middle"
        >
          强度: {flow.intensity}/10
        </Text>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color={DISPLAY_COLORS.ui.text.muted}
          anchorX="center"
          anchorY="middle"
        >
          数据包: {flow.packets}
        </Text>
      </Billboard>
    </group>
  );
}

/**
 * 情报共享网络组件
 */
function IntelligenceSharingNetwork({
  sharing,
  defenseNodes,
}: {
  sharing: any[];
  defenseNodes: any[];
}) {
  const sharingRef = useRef<Group>(null);

  useFrame((state) => {
    if (sharingRef.current) {
      sharingRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={sharingRef}>
      {sharing.map((share, index) => {
        const fromNode = defenseNodes.find((n) => n.id === share.nodes[0]);
        const toNode = defenseNodes.find((n) => n.id === share.nodes[1]);

        if (!fromNode || !toNode) return null;

        const fromPos = latLonToVector3(
          fromNode.coordinates[1],
          fromNode.coordinates[0],
          13,
        );
        const toPos = latLonToVector3(
          toNode.coordinates[1],
          toNode.coordinates[0],
          13,
        );

        const getClassificationColor = () => {
          switch (share.classification) {
            case "top-secret":
              return DISPLAY_COLORS.security.critical;
            case "secret":
              return DISPLAY_COLORS.security.high;
            case "confidential":
              return DISPLAY_COLORS.security.medium;
            default:
              return DISPLAY_COLORS.ui.text.muted;
          }
        };

        const shareColor = getClassificationColor();

        return (
          <group key={index}>
            {/* 情报共享连接 */}
            {/* <Line
              points={[fromPos, toPos]}
              color={shareColor}
              lineWidth={3}
              transparent
              opacity={0.7}
            /> */}

            {/* 数据流动指示 */}
            {/* <Line
              points={[fromPos, toPos]}
              color={shareColor}
              lineWidth={5}
              transparent
              opacity={0.2}
              dashed
              dashSize={1}
              gapSize={0.5}
            /> */}

            {/* 共享信息标签 */}
            <Billboard
              position={[
                (fromPos.x + toPos.x) / 2,
                (fromPos.y + toPos.y) / 2,
                (fromPos.z + toPos.z) / 2,
              ]}
            >
              <Text
                fontSize={0.2}
                color={shareColor}
                anchorX="center"
                anchorY="middle"
              >
                {share.classification.toUpperCase()}
              </Text>
              <Text
                position={[0, -0.3, 0]}
                fontSize={0.15}
                color={DISPLAY_COLORS.ui.text.secondary}
                anchorX="center"
                anchorY="middle"
              >
                卷数: {share.volume.toLocaleString()}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

/**
 * 全球态势信息面板
 */
function GlobalStatusPanel({ status }: { status: any }) {
  return (
    <Billboard position={[0, 20, 0]}>
      <Html>
        <div
          style={{
            background: "rgba(10, 14, 26, 0.9)",
            border: `2px solid ${DISPLAY_COLORS.corporate.accent}`,
            borderRadius: "12px",
            padding: "20px",
            minWidth: "300px",
            color: DISPLAY_COLORS.ui.text.primary,
            fontFamily: "monospace",
            fontSize: "14px",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3
            style={{
              color: DISPLAY_COLORS.corporate.accent,
              margin: "0 0 15px 0",
              textAlign: "center",
              fontSize: "18px",
            }}
          >
            🌐 全球网络安全态势
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <div style={{ color: getThreatColor(status.threatLevel) }}>
                威胁等级: {status.threatLevel}/10
              </div>
              <div style={{ color: DISPLAY_COLORS.security.critical }}>
                活跃威胁: {status.activeThreats.toLocaleString()}
              </div>
              <div style={{ color: DISPLAY_COLORS.status.active }}>
                拦截攻击: {status.blockedAttacks.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ color: DISPLAY_COLORS.status.normal }}>
                保护资产: {status.protectedAssets.toLocaleString()}
              </div>
              <div style={{ color: DISPLAY_COLORS.neon.blue }}>
                AI检测率: {status.aiDetectionRate}%
              </div>
              <div style={{ color: DISPLAY_COLORS.status.processing }}>
                响应时间: {status.responseTime}分钟
              </div>
            </div>
          </div>
        </div>
      </Html>
    </Billboard>
  );
}

/**
 * AI威胁情报全球态势主组件
 */
export function AIThreatIntelligenceGlobe({
  realTimeData,
}: {
  realTimeData: any;
}) {
  const globeRef = useRef<Group>(null);

  useFrame((state) => {
    if (globeRef.current) {
      // 整体缓慢旋转
      globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <group ref={globeRef}>
      {/* 地球主体 */}
      <EarthGlobe />

      {/* 威胁标记 */}
      {AI_THREAT_GLOBE_CONFIG.globalThreats.map((threat) => (
        <ThreatMarker
          key={threat.id}
          threat={threat}
          realTimeData={realTimeData}
        />
      ))}

      {/* 防护节点 */}
      {AI_THREAT_GLOBE_CONFIG.defenseNodes.map((node) => (
        <DefenseNode key={node.id} node={node} realTimeData={realTimeData} />
      ))}

      {/* 攻击流量 */}
      {AI_THREAT_GLOBE_CONFIG.attackFlows.map((flow, index) => (
        <AttackFlow key={index} flow={flow} realTimeData={realTimeData} />
      ))}

      {/* 情报共享网络 */}
      <IntelligenceSharingNetwork
        sharing={AI_THREAT_GLOBE_CONFIG.intelligenceSharing}
        defenseNodes={AI_THREAT_GLOBE_CONFIG.defenseNodes}
      />

      {/* 全球态势信息面板 */}
      <GlobalStatusPanel status={AI_THREAT_GLOBE_CONFIG.globalStatus} />

      {/* 轨道环 */}
      <mesh>
        <torusGeometry args={[25, 0.1, 8, 64]} />
        <meshBasicMaterial
          color={DISPLAY_COLORS.neon.cyan}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 空间粒子效果 */}
      <Sparkles
        count={200}
        scale={[50, 50, 50]}
        size={2}
        speed={0.3}
        color={DISPLAY_COLORS.ui.text.secondary}
        opacity={0.4}
      />
    </group>
  );
}

export default AIThreatIntelligenceGlobe;
