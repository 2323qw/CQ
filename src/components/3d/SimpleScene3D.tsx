import { Canvas } from "@react-three/fiber";
import { SimpleShieldModel } from "./SimpleShieldModel";

export function SimpleScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* 简化环境设置 */}
      <fog attach="fog" args={["#0d1117", 3, 15]} />

      {/* 简化的3D盾牌模型 */}
      <SimpleShieldModel />
    </Canvas>
  );
}
