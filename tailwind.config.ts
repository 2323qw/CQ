import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 网络安全主题色彩 - 增强版
        cyber: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        neon: {
          blue: "#00f5ff",
          green: "#39ff14",
          purple: "#bf00ff",
          pink: "#ff1493",
          orange: "#ff6600",
          yellow: "#ffff00",
          cyan: "#00ffff",
          red: "#ff0040",
          lime: "#ccff00",
          magenta: "#ff00ff",
        },
        threat: {
          critical: "#ff0040",
          high: "#ff3366",
          medium: "#ff8800",
          low: "#39ff14",
          info: "#00f5ff",
          quantum: "#bf00ff",
          neural: "#ff1493",
        },
        matrix: {
          bg: "#0a0e1a",
          surface: "#111827",
          accent: "#1f2937",
          border: "#374151",
          deep: "#0f172a",
        },
        tech: {
          primary: "#0052ff",
          secondary: "#0066ff",
          accent: "#00d4ff",
          light: "#3d7bff",
          dark: "#003acc",
        },
        quantum: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#bf00ff",
          600: "#a855f7",
          700: "#9333ea",
          800: "#7c3aed",
          900: "#6b21a8",
          950: "#581c87",
        },
        neural: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#00ff88",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
          },
          "50%": {
            boxShadow:
              "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
        "scan-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "data-flow": {
          "0%": { transform: "translateX(-100%) translateY(0)" },
          "100%": { transform: "translateX(100%) translateY(-10px)" },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "neon-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
          },
          "50%": {
            boxShadow:
              "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
        "hologram-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
          "75%": { opacity: "0.9" },
        },
        "quantum-phase": {
          "0%": {
            transform: "scale(1) rotate(0deg)",
            filter: "hue-rotate(0deg)",
          },
          "33%": {
            transform: "scale(1.05) rotate(120deg)",
            filter: "hue-rotate(120deg)",
          },
          "66%": {
            transform: "scale(0.95) rotate(240deg)",
            filter: "hue-rotate(240deg)",
          },
          "100%": {
            transform: "scale(1) rotate(360deg)",
            filter: "hue-rotate(360deg)",
          },
        },
        "neural-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: "0.7",
          },
        },
        "energy-flow": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },
          "90%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
        },
        "float-3d": {
          "0%, 100%": {
            transform: "translateY(0px) rotateX(0deg)",
          },
          "50%": {
            transform: "translateY(-20px) rotateX(10deg)",
          },
        },
        "cyber-scan": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scan-line": "scan-line 2s linear infinite",
        "data-flow": "data-flow 3s linear infinite",
        "matrix-rain": "matrix-rain 5s linear infinite",
        "neon-glow": "neon-glow 2s ease-in-out infinite",
        "hologram-flicker": "hologram-flicker 0.1s linear infinite",
        "quantum-phase": "quantum-phase 3s ease-in-out infinite",
        "neural-pulse": "neural-pulse 2s ease-in-out infinite",
        "energy-flow": "energy-flow 2s linear infinite",
        "float-3d": "float-3d 6s ease-in-out infinite",
        "cyber-scan": "cyber-scan 3s linear infinite",
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Consolas",
          "Monaco",
          "monospace",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
