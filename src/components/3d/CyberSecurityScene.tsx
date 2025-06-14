import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { CyberSecurityModel } from "./CyberSecurityModel";

export function CyberSecurityScene() {
  return (
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
        count={3000}
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
        autoRotateSpeed={1}
        maxDistance={20}
        minDistance={5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
      />

      {/* 网络安全3D模型 */}
      <CyberSecurityModel />

      {/* 雾效 */}
      <fog attach="fog" args={["#0d1117", 10, 30]} />
    </Canvas>
  );
}
