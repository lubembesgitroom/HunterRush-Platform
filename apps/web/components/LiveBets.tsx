"use client";

import Panel from "@/components/ui/Panel";

import { useGame } from "@/hooks/useGame";

import { theme } from "@/theme/theme";

import { formatCurrency } from "@/utils/formatCurrency";

interface ActiveBet {
  id: string;
  playerId: string;
  amount: number;
  autoCashout: number | null;
  payout: number;
  status: string;
}

export default function LiveBets() {
  const { snapshot } = useGame();

  const bets: ActiveBet[] =
    snapshot?.activeBets ?? [];

  return (
    <Panel title="Live Bets">
      {bets.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <HeaderCell>Player</HeaderCell>
                <HeaderCell>Bet</HeaderCell>
                <HeaderCell>Auto</HeaderCell>
                <HeaderCell>Status</HeaderCell>
              </tr>
            </thead>

            <tbody>
              {bets.map((bet) => (
                <BetRow
                  key={bet.id}
                  bet={bet}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: 20,
        textAlign: "center",
        color: theme.colors.textMuted,
      }}
    >
      No active bets.
    </div>
  );
}

function HeaderCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      style={{
        textAlign: "left",

        padding: "10px 8px",

        color: theme.colors.textMuted,

        fontWeight: 600,

        fontSize: 13,

        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      {children}
    </th>
  );
}

function BetRow({
  bet,
}: {
  bet: ActiveBet;
}) {
  return (
    <tr>
      <BodyCell>
        {shortPlayerId(
          bet.playerId,
        )}
      </BodyCell>

      <BodyCell>
        {formatCurrency(
          bet.amount,
        )}
      </BodyCell>

      <BodyCell>
        {bet.autoCashout
          ? `${bet.autoCashout.toFixed(
              2,
            )}×`
          : "Manual"}
      </BodyCell>

      <BodyCell>
        <StatusBadge
          status={bet.status}
        />
      </BodyCell>
    </tr>
  );
}

function BodyCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td
      style={{
        padding: "12px 8px",

        borderBottom: `1px solid ${theme.colors.border}`,

        fontSize: 14,
      }}
    >
      {children}
    </td>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const colors = getStatusColors(
    status,
  );

  return (
    <span
      style={{
        display: "inline-block",

        minWidth: 72,

        textAlign: "center",

        padding: "4px 10px",

        borderRadius: 999,

        background:
          colors.background,

        color: colors.text,

        border: `1px solid ${colors.border}`,

        fontSize: 12,

        fontWeight: 700,

        textTransform:
          "capitalize",
      }}
    >
      {status}
    </span>
  );
}

function getStatusColors(
  status: string,
) {
  switch (
    status.toLowerCase()
  ) {
    case "pending":
      return {
        background:
          "rgba(255,193,7,.12)",
        border:
          theme.colors.warning,
        text:
          theme.colors.warning,
      };

    case "active":
      return {
        background:
          "rgba(0,200,83,.12)",
        border:
          theme.colors.primary,
        text:
          theme.colors.primary,
      };

    case "cashed_out":
      return {
        background:
          "rgba(33,150,243,.12)",
        border:
          theme.colors.info,
        text:
          theme.colors.info,
      };

    case "lost":
      return {
        background:
          "rgba(244,67,54,.12)",
        border:
          theme.colors.danger,
        text:
          theme.colors.danger,
      };

    default:
      return {
        background:
          theme.colors.surface,
        border:
          theme.colors.border,
        text:
          theme.colors.text,
      };
  }
}

function shortPlayerId(
  id: string,
) {
  if (id.length <= 8) {
    return id;
  }

  return `${id.slice(
    0,
    4,
  )}...${id.slice(-4)}`;
}