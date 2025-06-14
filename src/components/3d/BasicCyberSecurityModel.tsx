import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";

export function BasicCyberSecurityModel() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const ring3Ref = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.1;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.rotation.x = time * 0.5;
      coreRef.current.rotation.z = time * 0.3;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.8;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * 0.6;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 环境光 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00f5ff" />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ff6b00" />

      {/* 中央核心 */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00f5ff"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 内层防护环 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2, 0.1, 8, 32]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 中层防护环 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.5, 0.08, 8, 32]} />
        <meshStandardMaterial
          color="#ff6b00"
          emissive="#ff6b00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 外层防护环 */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[5, 0.06, 8, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 防护节点 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 4;
        const z = Math.sin(angle) * 4;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#00f5ff" : "#00ff88"}
              emissive={i % 2 === 0 ? "#00f5ff" : "#00ff88"}
              emissiveIntensity={0.6}
            />
          </mesh>
        );
      })}

      {/* 垂直防护柱 */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 6;
        const z = Math.sin(angle) * 6;
        return (
          <mesh key={`pillar-${i}`} position={[x, 0, z]}>
            <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
            <meshStandardMaterial
              color="#ff6b00"
              emissive="#ff6b00"
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {/* 扫描线 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7, 7.05, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
