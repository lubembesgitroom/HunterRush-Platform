"use client";

import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";

import { useDemo } from "@/hooks/useDemo";

import { formatCurrency } from "@/utils/formatCurrency";

export default function DemoBadge() {
  const {
    isDemo,
    demoBalance,
  } = useDemo();

  if (!isDemo) {
    return null;
  }

  return (
    <Panel
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span
          style={{
            color: "#9CA3AF",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Virtual Wallet
        </span>

        <strong
          style={{
            fontSize: 20,
            color: "#FFFFFF",
          }}
        >
          {formatCurrency(
            demoBalance,
          )}
        </strong>
      </div>

      <Badge
        color="#7C3AED"
      >
        DEMO
      </Badge>
    </Panel>
  );
}