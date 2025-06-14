import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 在开发环境中过滤Recharts的defaultProps警告
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("defaultProps will be removed")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
