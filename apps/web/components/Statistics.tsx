"use client";

import Panel from "@/components/ui/Panel";

import { useGame } from "@/hooks/useGame";

import { theme } from "@/theme/theme";

import {
  formatCurrency,
  formatMultiplier,
  formatPlayers,
  formatCount,
} from "@/utils/formatCurrency";

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({
  label,
  value,
}: StatRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <span
        style={{
          color: theme.colors.textMuted,
          fontSize: 14,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: theme.colors.text,
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function Statistics() {
  const { snapshot } = useGame();

  const playersOnline =
    snapshot?.playersOnline ?? 0;

  const multiplier =
    snapshot?.multiplier ?? 1;

  const totalWagered =
    snapshot?.totalWagered ?? 0;

  const phase =
    snapshot?.phase ?? "WAITING";

  const currentRound =
    snapshot?.round?.id ?? "—";

  /*
   * ----------------------------------------------------------------
   * Development-only simulated metrics.
   * Replace these with real analytics in production.
   * ----------------------------------------------------------------
   */

  const watchingNow =
    1800 + playersOnline * 12;

  const roundsToday =
    145000 +
    (Math.floor(Date.now() / 60000) % 5000);

  return (
    <Panel title="Statistics">
      <StatRow
        label="Players Online"
        value={formatPlayers(
          playersOnline,
        )}
      />

      <StatRow
        label="Watching Now"
        value={formatCount(
          watchingNow,
        )}
      />

      <StatRow
        label="Rounds Today"
        value={formatCount(
          roundsToday,
        )}
      />

      <StatRow
        label="Current Multiplier"
        value={formatMultiplier(
          multiplier,
        )}
      />

      <StatRow
        label="Total Wagered"
        value={formatCurrency(
          totalWagered,
        )}
      />

      <StatRow
        label="Game Phase"
        value={phase}
      />

      <StatRow
        label="Current Round"
        value={currentRound}
      />
    </Panel>
  );
}