"use client";

import { useState } from "react";

import { useGame } from "@/hooks/useGame";
import { useDemo } from "@/hooks/useDemo";
import { useHost } from "@/hooks/useHost";

import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import { formatCurrency } from "@/utils/formatCurrency";
import { useBetStore } from "@/store/betStore";

interface BetCardProps {
  title: string;
}

const BET_CHIPS = [
  50,
  100,
  200,
  500,
  1000,
];

const AUTO_PRESETS = [
  1.2,
  1.5,
  2,
  5,
  10,
];

export default function BetCard({
  title,
}: BetCardProps) {
  const {
  balance: realBalance,
  snapshot,
  placeBet,
  cashout,
} = useGame();

  const {
    isDemo,
    demoBalance,
    decreaseDemoBalance,
  } = useDemo();

  const { deposit } = useHost();
  const { activeBet } = useBetStore();

  const balance = isDemo
    ? demoBalance
    : realBalance;

  const phase =
    snapshot?.phase ??
    "WAITING";

  const bettingOpen =
    phase === "BETTING";
  const hasActiveBet =
  activeBet &&
  (activeBet.status === "ACTIVE" ||
    activeBet.status === "PENDING");

const canCashout =
  activeBet?.status === "ACTIVE";

  const [amount, setAmount] =
    useState(100);

  const [autoCashout, setAutoCashout] =
  useState<number | null>(null);

  function handleBet() {
  if (!bettingOpen) return;

  if (amount <= 0) return;

  if (amount > balance) return;

  if (isDemo) {
    decreaseDemoBalance(amount);

    placeBet(
      amount,
      autoCashout > 1
        ? autoCashout
        : null,
    );

    return;
  }

  placeBet(
    amount,
    autoCashout > 1
      ? autoCashout
      : null,
  );
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
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                textTransform:
                  "uppercase",
                letterSpacing:
                  ".08em",
              }}
            >
              Wallet
            </div>

            <div
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {formatCurrency(
                balance,
              )}
            </div>
          </div>

          <Badge
            color={
              isDemo
                ? "#7C3AED"
                : "#2563EB"
            }
          >
            {isDemo
              ? "DEMO"
              : "REAL"}
          </Badge>
        </div>

        {!isDemo && (
          <Button
            fullWidth
            onClick={deposit}
          >
            Deposit
          </Button>
        )}

        <div>
          <div
            style={{
              color: "#9CA3AF",
              marginBottom: 8,
              fontSize: 12,
              textTransform:
                "uppercase",
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
              setAmount(
                Number(
                  e.target.value,
                ),
              )
            }
            style={{
              width: "100%",
              padding: 14,
              background:
                "#181818",
              color: "#FFFFFF",
              border:
                "1px solid #2A2A2A",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3,1fr)",
            gap: 8,
          }}
        >
          {BET_CHIPS.map(
            (chip) => (
              <Button
                key={chip}
                disabled={
                  !bettingOpen
                }
                onClick={() =>
                  setAmount(
                    chip,
                  )
                }
              >
                {chip}
              </Button>
            ),
          )}

          <Button
  fullWidth
  disabled={!bettingOpen || !!hasActiveBet}
  onClick={handleBet}
>
  {hasActiveBet
    ? "BET PLACED"
    : bettingOpen
      ? isDemo
        ? "PLACE DEMO BET"
        : "PLACE BET"
      : "BETTING CLOSED"}
</Button>
          {activeBet && (
  <Panel>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Stake</span>

        <strong>
          {formatCurrency(activeBet.wager)}
        </strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Status</span>

        <Badge color="#22C55E">
          {activeBet.status}
        </Badge>
      </div>

      {activeBet.status === "ACTIVE" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Current</span>

          <strong>
            {snapshot?.multiplier.toFixed(2)}×
          </strong>
        </div>
      )}

      {activeBet.status === "CASHED_OUT" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Payout</span>

          <strong
            style={{
              color: "#22C55E",
            }}
          >
            {formatCurrency(activeBet.payout)}
          </strong>
        </div>
      )}

      {canCashout && (
        <Button
          fullWidth
          onClick={cashout}
        >
          CASH OUT
        </Button>
      )}
    </div>
  </Panel>
)}

        <div>
  <div
    style={{
      color: "#9CA3AF",
      marginBottom: 8,
      fontSize: 12,
      textTransform: "uppercase",
    }}
  >
    Auto Cash Out
  </div>

  <input
    type="number"
    min={1.01}
    step="0.1"
    placeholder="OFF"
    value={autoCashout ?? ""}
    disabled={!bettingOpen}
    onChange={(e) => {
      const value = e.target.value;

      if (value === "") {
        setAutoCashout(null);
      } else {
        setAutoCashout(Number(value));
      }
    }}
    style={{
      width: "100%",
      padding: 14,
      background: "#181818",
      color: "#FFFFFF",
      border: "1px solid #2A2A2A",
      outline: "none",
    }}
  />
</div>

          <input
            type="number"
            step="0.1"
            value={autoCashout}
            disabled={!bettingOpen}
            onChange={(e) =>
              setAutoCashout(
                Number(
                  e.target.value,
                ),
              )
            }
            style={{
              width: "100%",
              padding: 14,
              background:
                "#181818",
              color: "#FFFFFF",
              border:
                "1px solid #2A2A2A",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5,1fr)",
            gap: 8,
          }}
        >
          {AUTO_PRESETS.map(
            (value) => (
              <Button
                key={value}
                disabled={
                  !bettingOpen
                }
                onClick={() =>
                  setAutoCashout(
                    value,
                  )
                }
              >
                {value}×
              </Button>
            ),
          )}
        </div>

        <Button
          fullWidth
          disabled={!bettingOpen}
          onClick={handleBet}
        >
          <Button
  disabled={!bettingOpen}
  onClick={() => setAutoCashout(null)}
>
  OFF
</Button>
          {bettingOpen
            ? isDemo
              ? "PLACE DEMO BET"
              : "PLACE BET"
            : "BETTING CLOSED"}
        </Button>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
          }}
        >
          <span
            style={{
              color:
                "#9CA3AF",
            }}
          >
            Status
          </span>

          <Badge
            color={
              bettingOpen
                ? "#2563EB"
                : "#6B7280"
            }
          >
            {phase}
          </Badge>
        </div>
      </div>
    </Panel>
  );
}
