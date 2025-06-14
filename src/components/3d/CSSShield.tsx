export function CSSShield() {
  return (
    <div className="css-3d-container">
      <div className="css-shield-wrapper">
        {/* 主盾牌 */}
        <div className="css-shield-main">
          <div className="css-shield-core"></div>

          {/* 盾牌上的六边形装饰 */}
          <div className="css-shield-hex css-shield-hex-1"></div>
          <div className="css-shield-hex css-shield-hex-2"></div>
          <div className="css-shield-hex css-shield-hex-3"></div>

          {/* 能量环 */}
          <div className="css-energy-ring css-energy-ring-1"></div>
          <div className="css-energy-ring css-energy-ring-2"></div>
          <div className="css-energy-ring css-energy-ring-3"></div>
        </div>

        {/* 环绕的能量球 */}
        <div className="css-orb css-orb-1"></div>
        <div className="css-orb css-orb-2"></div>
        <div className="css-orb css-orb-3"></div>
        <div className="css-orb css-orb-4"></div>

        {/* 背景光效 */}
        <div className="css-glow-bg"></div>
      </div>

      <style jsx>{`
        .css-3d-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }

        .css-shield-wrapper {
          position: relative;
          width: 300px;
          height: 300px;
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
        }

        .css-shield-main {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 180px;
          height: 200px;
          transform: translate(-50%, -50%) rotateX(15deg);
          background: linear-gradient(135deg, #001122, #002244);
          border: 3px solid #00f5ff;
          border-radius: 20px 20px 80px 80px;
          box-shadow:
            0 0 30px rgba(0, 245, 255, 0.5),
            inset 0 0 20px rgba(0, 245, 255, 0.2);
          animation: shield-rotate 20s linear infinite;
        }

        .css-shield-core {
          position: absolute;
          top: 40%;
          left: 50%;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, #00f5ff, #003366);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow:
            0 0 20px #00f5ff,
            0 0 40px #00f5ff,
            0 0 60px #00f5ff;
          animation: core-pulse 3s ease-in-out infinite;
        }

        .css-shield-hex {
          position: absolute;
          width: 20px;
          height: 20px;
          background: #00f5ff;
          clip-path: polygon(
            30% 0%,
            70% 0%,
            100% 50%,
            70% 100%,
            30% 100%,
            0% 50%
          );
          opacity: 0.6;
          animation: hex-glow 4s ease-in-out infinite;
        }

        .css-shield-hex-1 {
          top: 20%;
          left: 30%;
          animation-delay: 0s;
        }

        .css-shield-hex-2 {
          top: 20%;
          right: 30%;
          animation-delay: 1.3s;
        }

        .css-shield-hex-3 {
          bottom: 30%;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 2.6s;
        }

        .css-energy-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 2px solid #00f5ff;
          border-radius: 50%;
          opacity: 0.4;
          transform: translate(-50%, -50%);
          animation: ring-pulse 6s ease-in-out infinite;
        }

        .css-energy-ring-1 {
          width: 220px;
          height: 220px;
          animation-delay: 0s;
        }

        .css-energy-ring-2 {
          width: 260px;
          height: 260px;
          animation-delay: 2s;
        }

        .css-energy-ring-3 {
          width: 300px;
          height: 300px;
          animation-delay: 4s;
        }

        .css-orb {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #39ff14;
          border-radius: 50%;
          box-shadow: 0 0 10px #39ff14;
          animation: orb-orbit 8s linear infinite;
        }

        .css-orb-1 {
          animation-delay: 0s;
        }

        .css-orb-2 {
          animation-delay: 2s;
        }

        .css-orb-3 {
          animation-delay: 4s;
        }

        .css-orb-4 {
          animation-delay: 6s;
        }

        .css-glow-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(0, 245, 255, 0.1) 0%,
            transparent 70%
          );
          transform: translate(-50%, -50%);
          animation: bg-pulse 8s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotateY(0deg);
          }
          50% {
            transform: translateY(-20px) rotateY(180deg);
          }
        }

        @keyframes shield-rotate {
          0% {
            transform: translate(-50%, -50%) rotateX(15deg) rotateZ(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotateX(15deg) rotateZ(360deg);
          }
        }

        @keyframes core-pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow:
              0 0 20px #00f5ff,
              0 0 40px #00f5ff,
              0 0 60px #00f5ff;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            box-shadow:
              0 0 30px #00f5ff,
              0 0 60px #00f5ff,
              0 0 90px #00f5ff;
          }
        }

        @keyframes hex-glow {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes ring-pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes orb-orbit {
          0% {
            top: 20%;
            left: 50%;
            transform: translateX(-50%) rotate(0deg) translateX(120px)
              rotate(0deg);
          }
          100% {
            top: 20%;
            left: 50%;
            transform: translateX(-50%) rotate(360deg) translateX(120px)
              rotate(-360deg);
          }
        }

        @keyframes bg-pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
