"use client";

import { useGame } from "@/hooks/useGame";
import { theme } from "@/theme/theme";
import { layout } from "@/theme/layout";

export default function Header() {
  const { balance } = useGame();

  return (
    <header
      style={{
        height: 72,

        background: "#14171C",

        borderBottom: "1px solid #232833",

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        padding: "0 16px",

        position: "sticky",

        top: 0,

        zIndex: 100,
      }}
    >
      {/* Left */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: 14,
        }}
      >
        <div
          style={{
            width: 54,

            height: 54,

            borderRadius: 16,

            background: "#00C853",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            color: "#FFFFFF",

            fontWeight: 900,

            fontSize: 24,

            boxShadow: theme.shadow.glow,
          }}
        >
          H
        </div>

        <div>
          <div
            style={{
              color: "#FFFFFF",

              fontSize: 18,

              fontWeight: 800,

              lineHeight: 1.2,
            }}
          >
            HunterRush
          </div>
        </div>
      </div>

      {/* Right */}

      <div
        style={{
          textAlign: "right",
        }}
      >
        <div
          style={{
            color: "#9CA3AF",

            fontSize: 11,

            marginBottom: 4,

            textTransform: "uppercase",
          }}
        >
          Wallet
        </div>

        <div
          style={{
            color: "#00E676",

            fontSize: 22,

            fontWeight: 800,
          }}
        >
          KSh {balance.toFixed(2)}
        </div>
      </div>
    </header>
  );
}