"use client";

import { useState } from "react";

import { useGame } from "@/hooks/useGame";
import { formatCurrency } from "@/utils/formatCurrency";

type Tab =
  | "bets"
  | "history"
  | "top";

export default function BottomTabs() {
  const [tab, setTab] =
    useState<Tab>("bets");

  const { snapshot } = useGame();

  const history =
    snapshot?.roundHistory ?? [];

  const bets =
    snapshot?.activeBets ?? [];

  return (
    <div
      style={{
        background: "#181C22",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          background: "#101419",
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        {[
          ["bets", "All Bets"],
          ["history", "History"],
          ["top", "Top"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() =>
              setTab(key as Tab)
            }
            style={{
              flex: 1,
              height: 42,
              border: "none",
              cursor: "pointer",
              background:
                tab === key
                  ? "#2D3748"
                  : "transparent",
              color:
                tab === key
                  ? "#fff"
                  : "#9CA3AF",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "bets" && (
        <div>
          {bets.length === 0 ? (
            <div
              style={{
                color: "#777",
                textAlign: "center",
                padding: 30,
              }}
            >
              No Active Bets
            </div>
          ) : (
            bets.map((bet) => (
              <div
                key={bet.id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  padding: "12px 0",
                  borderBottom:
                    "1px solid #262B33",
                }}
              >
                <span>
                  {bet.playerId}
                </span>

                <strong>
                  {formatCurrency(
                    bet.amount,
                  )}
                </strong>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "history" && (
        <div>
          {history.map((round) => (
            <div
              key={round.id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "12px 0",
                borderBottom:
                  "1px solid #262B33",
              }}
            >
              <span>
                {round.id.slice(0, 8)}
              </span>

              <strong
                style={{
                  color:
                    round.crashPoint >= 10
                      ? "#C084FC"
                      : round.crashPoint >= 2
                      ? "#38BDF8"
                      : "#EF4444",
                }}
              >
                {round.crashPoint.toFixed(
                  2,
                )}
                ×
              </strong>
            </div>
          ))}
        </div>
      )}

      {tab === "top" && (
        <div
          style={{
            color: "#777",
            textAlign: "center",
            padding: 30,
          }}
        >
          Leaderboard Coming Soon
        </div>
      )}
    </div>
  );
}