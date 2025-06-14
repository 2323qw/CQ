import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export function SimpleShieldModel() {
  const shieldRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 主盾牌缓慢旋转
    if (shieldRef.current) {
      shieldRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
      shieldRef.current.rotation.x = Math.cos(time * 0.2) * 0.05;
    }

    // 核心发光效果
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    }
  });

  return (
    <group>
      {/* 环境光 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f5ff" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#39ff14" />

      {/* 主盾牌 */}
      <mesh ref={shieldRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 2.2, 0.3, 6]} />
        <meshStandardMaterial
          color="#001122"
          metalness={0.8}
          roughness={0.2}
          emissive="#003366"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 盾牌中心的发光核心 */}
      <mesh ref={coreRef} position={[0, 0, 0.2]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 外环 */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[2.3, 2.5, 32]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
