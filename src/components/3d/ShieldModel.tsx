import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial } from "three";
import { Text, RoundedBox, Sphere, Ring } from "@react-three/drei";

export function ShieldModel() {
  const shieldRef = useRef<Mesh>(null);
  const orbsRef = useRef<Mesh[]>([]);
  const ringsRef = useRef<Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 主盾牌缓慢旋转
    if (shieldRef.current) {
      shieldRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
      shieldRef.current.rotation.x = Math.cos(time * 0.2) * 0.05;
    }

    // 环绕的能量球
    orbsRef.current.forEach((orb, index) => {
      if (orb) {
        const angle = time * 0.5 + (index * (Math.PI * 2)) / 3;
        orb.position.x = Math.cos(angle) * 2.5;
        orb.position.z = Math.sin(angle) * 2.5;
        orb.position.y = Math.sin(time * 2 + index) * 0.3;
      }
    });

    // 旋转的光环
    ringsRef.current.forEach((ring, index) => {
      if (ring) {
        ring.rotation.x = time * (0.5 + index * 0.3);
        ring.rotation.y = time * (0.3 + index * 0.2);
      }
    });
  });

  return (
    <group>
      {/* 主环境光 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#39ff14" />

      {/* 主盾牌 */}
      <mesh ref={shieldRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2.5, 0.3, 6]} />
        <meshStandardMaterial
          color="#001122"
          metalness={0.8}
          roughness={0.2}
          emissive="#003366"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 盾牌中心的发光核心 */}
      <mesh position={[0, 0, 0.2]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 盾牌边缘的能量环 */}
      {[1.5, 2.0, 2.5].map((radius, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) ringsRef.current[index] = el;
          }}
          position={[0, 0, 0]}
        >
          <ringGeometry args={[radius, radius + 0.1, 32]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* 环绕的能量球 */}
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) orbsRef.current[index] = el;
          }}
          position={[2.5, 0, 0]}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      {/* 背景六边形网格 */}
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const radius = 4 + Math.sin(index) * 0.5;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, -2]}
            rotation={[0, 0, angle]}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.05, 6]} />
            <meshStandardMaterial
              color="#002244"
              transparent
              opacity={0.3}
              emissive="#004488"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}

      {/* CyberGuard 文字 */}
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.4}
        color="#00f5ff"
        anchorX="center"
        anchorY="center"
        font="/fonts/JetBrainsMono-Bold.woff"
      >
        CYBERGUARD
      </Text>

      {/* 扫描线效果 */}
      <mesh position={[0, 0, 3]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#00f5ff"
          transparent
          opacity={0.1}
          emissive="#00f5ff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}
