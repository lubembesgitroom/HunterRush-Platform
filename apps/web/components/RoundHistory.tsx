"use client";

import { useGame } from "@/hooks/useGame";

import Panel from "@/components/ui/Panel";

import { theme } from "@/theme/theme";

import { formatMultiplier } from "@/utils/formatCurrency";

interface HistoryRound {
  id?: string;
  crashPoint?: number;
}

export default function RoundHistory() {
  const { snapshot } = useGame();

  const history: HistoryRound[] =
    snapshot?.roundHistory ?? [];

  const rounds = [...history]
    .reverse()
    .slice(0, 20);

  return (
    <Panel title="Round History">
      {rounds.length === 0 ? (
        <div
          style={{
            color: theme.colors.textMuted,
            textAlign: "center",
            padding: 20,
          }}
        >
          No completed rounds yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(72px, 1fr))",
            gap: 12,
          }}
        >
          {rounds.map((round, index) => (
            <HistoryChip
              key={round.id ?? index}
              multiplier={round.crashPoint ?? 1}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}

interface HistoryChipProps {
  multiplier: number;
}

function HistoryChip({
  multiplier,
}: HistoryChipProps) {
  const colors = getChipColors(multiplier);

  return (
    <div
      style={{
        background: colors.background,

        color: colors.text,

        border: `1px solid ${colors.border}`,

        borderRadius: theme.radius.md,

        padding: "10px 0",

        textAlign: "center",

        fontWeight: 700,

        fontSize: 14,

        transition: "all .2s ease",

        userSelect: "none",
      }}
    >
      {formatMultiplier(multiplier)}
    </div>
  );
}

function getChipColors(
  multiplier: number,
) {
  if (multiplier < 2) {
    return {
      background: "rgba(244,67,54,.12)",
      border: theme.colors.danger,
      text: theme.colors.danger,
    };
  }

  if (multiplier < 10) {
    return {
      background: "rgba(0,200,83,.12)",
      border: theme.colors.primary,
      text: theme.colors.primary,
    };
  }

  return {
    background: "rgba(156,39,176,.12)",
    border: "#9C27B0",
    text: "#CE93D8",
  };
}