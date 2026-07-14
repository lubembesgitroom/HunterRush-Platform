"use client";

import { useGame } from "@/hooks/useGame";

import { theme } from "@/theme/theme";
import { layout } from "@/theme/layout";

import Badge from "@/components/ui/Badge";

export default function Header() {
  const {
    connected,
    balance,
    snapshot,
  } = useGame();

  const playersOnline =
    snapshot?.playersOnline ?? 0;

  const roundId = snapshot?.round?.id
    ? snapshot.round.id.slice(0, 8)
    : "--------";

  const phase =
    snapshot?.phase ?? "WAITING";

  const phaseColor = {
    WAITING: theme.colors.textMuted,
    BETTING: theme.colors.info,
    RUNNING: theme.colors.primary,
    CRASHED: theme.colors.danger,
    REVEAL: theme.colors.warning,
  }[phase] ?? theme.colors.textMuted;

  return (
    <header
      style={{
        height: layout.headerHeight,

        background: theme.colors.surface,

        borderBottom: `1px solid ${theme.colors.border}`,

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        padding: `0 ${theme.spacing.xl}px`,

        boxShadow: theme.shadow.card,
      }}
    >
      {/* Logo */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,

            borderRadius: theme.radius.md,

            background: theme.colors.primary,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            color: "#fff",

            fontWeight: 900,

            fontSize: 20,

            boxShadow: theme.shadow.glow,
          }}
        >
          H
        </div>

        <div>
          <div
            style={{
              color: theme.colors.text,

              fontSize: 22,

              fontWeight: 800,
            }}
          >
            HunterRush
          </div>

          <div
            style={{
              color: theme.colors.textMuted,

              fontSize: 12,
            }}
          >
            Real-Time Crash Game
          </div>
        </div>
      </div>

      {/* Center */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.lg,
        }}
      >
        <Badge
          color={
            connected
              ? theme.colors.primary
              : theme.colors.danger
          }
        >
          {connected
            ? "ONLINE"
            : "OFFLINE"}
        </Badge>

        <Badge color={phaseColor}>
          {phase}
        </Badge>
      </div>

      {/* Right */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.xl,
        }}
      >
        <Info
          label="Players"
          value={playersOnline.toString()}
        />

        <Info
          label="Round"
          value={roundId}
        />

        <Info
          label="Wallet"
          value={`KSh ${balance.toFixed(2)}`}
          highlight
        />
      </div>
    </header>
  );
}

interface InfoProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function Info({
  label,
  value,
  highlight = false,
}: InfoProps) {
  return (
    <div
      style={{
        textAlign: "right",
      }}
    >
      <div
        style={{
          fontSize: 11,

          color: theme.colors.textMuted,

          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: 700,

          color: highlight
            ? theme.colors.primary
            : theme.colors.text,

          fontSize: 15,
        }}
      >
        {value}
      </div>
    </div>
  );
}