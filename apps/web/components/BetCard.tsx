"use client";

import { useState } from "react";

import { useGame } from "@/hooks/useGame";

import { useHost } from "@/hooks/useHost";
import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import { formatCurrency } from "@/utils/formatCurrency";

interface BetCardProps {
  title: string;
}

const BET_CHIPS = [50, 100, 200, 500, 1000];

const AUTO_PRESETS = [1.2, 1.5, 2, 5, 10];

export default function BetCard({
  title,
}: BetCardProps) {
  const {
    balance,
    snapshot,
    placeBet,
  } = useGame();

  const {
    deposit,
  } = useHost();

  const phase = snapshot?.phase ?? "WAITING";

  const bettingOpen = phase === "BETTING";

  const [amount, setAmount] = useState(100);

  const [autoCashout, setAutoCashout] =
    useState<number>(2);

  function handleBet() {
    if (!bettingOpen) return;

    placeBet(amount, autoCashout);
  }

  return (
    <Panel title={title}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {/* Wallet */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#9CA3AF",
              fontSize: 14,
            }}
          >
            Wallet
          </span>

          <strong
            style={{
              color: "#00E676",
              fontSize: 18,
            }}
          >
            {formatCurrency(balance)}
          </strong>
        </div>
{/* Deposit */}

<Button
  fullWidth
  onClick={deposit}
  style={{
    background: "#2563EB",

    color: "#FFFFFF",

    marginTop: 6,

    marginBottom: 4,
  }}
>
  DEPOSIT
</Button>

        {/* Bet Amount */}

        <div>
          <div
            style={{
              color: "#9CA3AF",
              marginBottom: 8,
              fontSize: 14,
            }}
          >
            Bet Amount
          </div>

          <input
            type="number"
            min={10}
            value={amount}
            disabled={!bettingOpen}
            onChange={(e) =>
              setAmount(Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "1px solid #333",
              background: "#202020",
              color: "#fff",
              fontSize: 16,
            }}
          />
        </div>

        {/* Quick Bet Chips */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3,1fr)",
            gap: 8,
          }}
        >
          {BET_CHIPS.map((chip) => (
            <button
              key={chip}
              disabled={!bettingOpen}
              onClick={() => setAmount(chip)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #333",
                background: "#242424",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {chip}
            </button>
          ))}

          <button
            disabled={!bettingOpen}
            onClick={() =>
              setAmount(Math.floor(balance))
            }
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #00C853",
              background: "#00C853",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            MAX
          </button>
        </div>

        {/* Auto Cash Out */}

        <div>
          <div
            style={{
              color: "#9CA3AF",
              marginBottom: 8,
              fontSize: 14,
            }}
          >
            Auto Cash Out
          </div>

          <input
            type="number"
            step="0.1"
            value={autoCashout}
            disabled={!bettingOpen}
            onChange={(e) =>
              setAutoCashout(
                Number(e.target.value),
              )
            }
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "1px solid #333",
              background: "#202020",
              color: "#fff",
              fontSize: 16,
            }}
          />
        </div>

        {/* Auto Cash Out Presets */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5,1fr)",
            gap: 8,
          }}
        >
          {AUTO_PRESETS.map((value) => (
            <button
              key={value}
              disabled={!bettingOpen}
              onClick={() =>
                setAutoCashout(value)
              }
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #333",
                background: "#242424",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {value}×
            </button>
          ))}
        </div>

        {/* Place Bet */}

        <Button
          fullWidth
          disabled={!bettingOpen}
          onClick={handleBet}
          style={{
            background: bettingOpen
              ? "#00C853"
              : "#555",
            cursor: bettingOpen
              ? "pointer"
              : "not-allowed",
          }}
        >
          {bettingOpen
            ? "PLACE BET"
            : "BETTING CLOSED"}
        </Button>

        {/* Status */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#9CA3AF",
              fontSize: 14,
            }}
          >
            Status
          </span>

          <Badge
            color={
              bettingOpen
                ? "#2196F3"
                : "#757575"
            }
          >
            {phase}
          </Badge>
        </div>
      </div>
    </Panel>
  );
}