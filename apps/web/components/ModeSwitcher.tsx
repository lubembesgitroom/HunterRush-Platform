"use client";

import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";

import { useDemo } from "@/hooks/useDemo";

export default function ModeSwitcher() {
  const {
    mode,
    switchToDemo,
    switchToReal,
  } = useDemo();

  return (
    <Panel
      style={{
        display: "flex",
        padding: 4,
        gap: 4,
        width: "100%",
      }}
    >
      <Button
        fullWidth
        onClick={switchToReal}
        style={{
          background:
            mode === "REAL"
              ? "#2563EB"
              : "transparent",

          color:
            mode === "REAL"
              ? "#FFFFFF"
              : "#9CA3AF",
        }}
      >
        REAL
      </Button>

      <Button
        fullWidth
        onClick={switchToDemo}
        style={{
          background:
            mode === "DEMO"
              ? "#7C3AED"
              : "transparent",

          color:
            mode === "DEMO"
              ? "#FFFFFF"
              : "#9CA3AF",
        }}
      >
        DEMO
      </Button>
    </Panel>
  );
}