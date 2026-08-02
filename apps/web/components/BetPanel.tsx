"use client";

import BetCard from "./BetCard";

import { useGame } from "@/hooks/useGame";

export default function BetPanel() {
  const {
    snapshot,
  } = useGame();

  const phase =
    snapshot?.phase ?? "WAITING";

  const activeBets =
    snapshot?.activeBets ?? [];

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
          gap: 18,
        }}
      >
        <BetCard title="Bet 1" panelId={1} />

        <BetCard title="Bet 2" panelId={2} />
      </div>

      <div
        style={{
          background: "#171717",
          border: "1px solid #2d2d2d",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#fff",
            }}
          >
            Active Bets
          </h3>

          <span
            style={{
              color: "#888",
            }}
          >
            {phase}
          </span>
        </div>

        {activeBets.length === 0 ? (
          <div
            style={{
              color: "#777",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            No active bets.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  align="left"
                  style={{
                    color: "#888",
                    paddingBottom: 12,
                  }}
                >
                  Player
                </th>

                <th
                  align="right"
                  style={{
                    color: "#888",
                    paddingBottom: 12,
                  }}
                >
                  Bet
                </th>

                <th
                  align="center"
                  style={{
                    color: "#888",
                    paddingBottom: 12,
                  }}
                >
                  Status
                </th>

                <th
                  align="right"
                  style={{
                    color: "#888",
                    paddingBottom: 12,
                  }}
                >
                  Auto
                </th>
              </tr>
            </thead>

            <tbody>
              {activeBets.map(
                (bet) => (
                  <tr key={bet.id}>
                    <td
                      style={{
                        padding: "10px 0",
                        color: "#fff",
                      }}
                    >
                      {bet.playerId.slice(
                        0,
                        8,
                      )}
                    </td>

                    <td
                      align="right"
                      style={{
                        color: "#00d26a",
                      }}
                    >
                      KSh{" "}
                      {bet.amount.toFixed(
                        2,
                      )}
                    </td>

                    <td
                      align="center"
                      style={{
                        color: "#ffd54f",
                      }}
                    >
                      {bet.status}
                    </td>

                    <td
                      align="right"
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      {bet.autoCashout
                        ? `${bet.autoCashout.toFixed(
                            2,
                          )}×`
                        : "Manual"}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}