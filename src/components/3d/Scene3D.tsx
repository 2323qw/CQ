import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import { ShieldModel } from "./ShieldModel";

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: "transparent" }}
      dpr={[1, 2]}
    >
      {/* 环境设置 */}
      <Environment preset="night" />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* 控制器 */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />

      {/* 3D盾牌模型 */}
      <ShieldModel />

      {/* 雾效 */}
      <fog attach="fog" args={["#0d1117", 5, 20]} />
    </Canvas>
  );
}
