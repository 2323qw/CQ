import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, Vector3 } from "three";
import { Text } from "@react-three/drei";

// 威胁类型定义
type ThreatType = "malware" | "ddos" | "phishing" | "intrusion" | "data_breach";

interface ThreatData {
  id: string;
  type: ThreatType;
  severity: "low" | "medium" | "high" | "critical";
  position: Vector3;
  detected: number; // 检测时间戳
}

// 威胁可视化球体
function ThreatSphere({ threat }: { threat: ThreatData }) {
  const sphereRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const getColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ff0040";
      case "high":
        return "#ff6600";
      case "medium":
        return "#ffcc00";
      case "low":
        return "#39ff14";
      default:
        return "#00f5ff";
    }
  };

  const getSize = (severity: string) => {
    switch (severity) {
      case "critical":
        return 0.3;
      case "high":
        return 0.25;
      case "medium":
        return 0.2;
      case "low":
        return 0.15;
      default:
        return 0.1;
    }
  };

  useFrame((state) => {
    if (sphereRef.current) {
      const time = state.clock.getElapsedTime();
      const pulseSpeed = threat.severity === "critical" ? 4 : 2;
      const scale = 1 + Math.sin(time * pulseSpeed) * 0.3;
      sphereRef.current.scale.setScalar(hovered ? scale * 1.5 : scale);
    }
  });

  return (
    <group position={threat.position}>
      <mesh
        ref={sphereRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[getSize(threat.severity), 16, 16]} />
        <meshStandardMaterial
          color={getColor(threat.severity)}
          emissive={getColor(threat.severity)}
          emissiveIntensity={hovered ? 1.2 : 0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 威胁等级环 */}
      <mesh>
        <ringGeometry
          args={[
            getSize(threat.severity) * 1.5,
            getSize(threat.severity) * 2,
            16,
          ]}
        />
        <meshStandardMaterial
          color={getColor(threat.severity)}
          emissive={getColor(threat.severity)}
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 悬停时显示信息 */}
      {hovered && (
        <Text
          position={[0, getSize(threat.severity) + 0.5, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="center"
        >
          {threat.type.toUpperCase()}
        </Text>
      )}

      {/* 威胁扩散效果 */}
      {threat.severity === "critical" && (
        <mesh>
          <sphereGeometry args={[getSize(threat.severity) * 3, 32, 32]} />
          <meshStandardMaterial
            color={getColor(threat.severity)}
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

// 攻击路径可视化
function AttackPath({
  start,
  end,
  severity = "medium",
}: {
  start: Vector3;
  end: Vector3;
  severity?: string;
}) {
  const pathRef = useRef<Group>(null);

  const getColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ff0040";
      case "high":
        return "#ff6600";
      case "medium":
        return "#ffcc00";
      default:
        return "#39ff14";
    }
  };

  useFrame((state) => {
    if (pathRef.current) {
      const time = state.clock.getElapsedTime();
      pathRef.current.rotation.z = Math.sin(time) * 0.1;
    }
  });

  // 创建攻击路径点
  const pathPoints = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const point = new Vector3().lerpVectors(start, end, progress);
    // 添加一些随机波动
    point.y += Math.sin(progress * Math.PI * 3) * 0.2;
    pathPoints.push(point);
  }

  return (
    <group ref={pathRef}>
      {/* 攻击路径粒子 */}
      {pathPoints.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial
            color={getColor(severity)}
            emissive={getColor(severity)}
            emissiveIntensity={1}
            transparent
            opacity={0.8 - (index / pathPoints.length) * 0.6}
          />
        </mesh>
      ))}

      {/* 攻击方向指示器 */}
      <mesh position={end}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial
          color={getColor(severity)}
          emissive={getColor(severity)}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

// 主威胁可视化组件
export function ThreatVisualization() {
  const groupRef = useRef<Group>(null);

  // 模拟威胁数据
  const threats: ThreatData[] = [
    {
      id: "threat-1",
      type: "malware",
      severity: "critical",
      position: new Vector3(-2, 1, -1),
      detected: Date.now() - 30000,
    },
    {
      id: "threat-2",
      type: "ddos",
      severity: "high",
      position: new Vector3(2, -1, 1),
      detected: Date.now() - 60000,
    },
    {
      id: "threat-3",
      type: "phishing",
      severity: "medium",
      position: new Vector3(-1, -2, 2),
      detected: Date.now() - 120000,
    },
    {
      id: "threat-4",
      type: "intrusion",
      severity: "high",
      position: new Vector3(1, 2, -2),
      detected: Date.now() - 90000,
    },
    {
      id: "threat-5",
      type: "data_breach",
      severity: "critical",
      position: new Vector3(3, 0, 0),
      detected: Date.now() - 45000,
    },
  ];

  // 攻击路径
  const attackPaths = [
    {
      start: new Vector3(5, 0, 0),
      end: new Vector3(-2, 1, -1),
      severity: "critical",
    },
    {
      start: new Vector3(-5, 2, 0),
      end: new Vector3(2, -1, 1),
      severity: "high",
    },
    {
      start: new Vector3(0, 0, -5),
      end: new Vector3(-1, -2, 2),
      severity: "medium",
    },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 威胁球体 */}
      {threats.map((threat) => (
        <ThreatSphere key={threat.id} threat={threat} />
      ))}

      {/* 攻击路径 */}
      {attackPaths.map((path, index) => (
        <AttackPath key={index} {...path} />
      ))}

      {/* 中心防护节点 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* 防护屏障 */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#00f5ff"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>

      {/* 扫描网格 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 4.2, 64]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 威胁等级说明 */}
      <Text
        position={[-4, 3, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="left"
        anchorY="center"
      >
        THREAT LEVELS
      </Text>

      <Text
        position={[-4, 2.5, 0]}
        fontSize={0.15}
        color="#ff0040"
        anchorX="left"
        anchorY="center"
      >
        ● CRITICAL
      </Text>

      <Text
        position={[-4, 2.2, 0]}
        fontSize={0.15}
        color="#ff6600"
        anchorX="left"
        anchorY="center"
      >
        ● HIGH
      </Text>

      <Text
        position={[-4, 1.9, 0]}
        fontSize={0.15}
        color="#ffcc00"
        anchorX="left"
        anchorY="center"
      >
        ● MEDIUM
      </Text>

      <Text
        position={[-4, 1.6, 0]}
        fontSize={0.15}
        color="#39ff14"
        anchorX="left"
        anchorY="center"
      >
        ● LOW
      </Text>
    </group>
  );
}
