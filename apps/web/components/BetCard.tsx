"use client";

import { useEffect, useMemo, useState } from "react";

import { useGame } from "@/hooks/useGame";
import { useDemo } from "@/hooks/useDemo";
import { playSfx } from "@/lib/audio";
import {
  BetMode,
  BetPanelState,
  deriveBetPanelState,
  getButtonLabel,
} from "@/hooks/betPanelState";
import { useBetStore } from "@/store/betStore";

interface BetCardProps {
  title: string;
  panelId: number;
}

const QUICK_BETS = [100, 200, 500, 2000];

export default function BetCard({ panelId }: BetCardProps) {
  const {
    balance: realBalance,
    snapshot,
    placeBet,
    cashout,
    multiplier,
  } = useGame();

  const {
    isDemo,
    demoBalance,
    decreaseDemoBalance,
  } = useDemo();

  const balance = isDemo
    ? demoBalance
    : realBalance;

  const phase = snapshot?.phase ?? "WAITING";
  const bettingOpen = phase === "BETTING";
  const panelBet = useBetStore(
    (state) => state.betsByPanel[panelId] ?? null,
  );

  const [amount, setAmount] =
    useState(100);
  const [autoCashout, setAutoCashout] =
    useState(1.01);
  const [autoCashoutInput, setAutoCashoutInput] =
    useState("1.01");
  const [mode, setMode] = useState<BetMode>(BetMode.MANUAL);
  const [displayPayout, setDisplayPayout] = useState(100);
  const [pulse, setPulse] = useState(false);

  const state = useMemo(
    () =>
      deriveBetPanelState(
        phase,
        panelBet?.status ?? null,
      ),
    [phase, panelBet?.status],
  );

  const hasActiveBet =
    panelBet !== null &&
    (panelBet.status === "ACTIVE" || panelBet.status === "PENDING");

  const canCashout =
    state === BetPanelState.RUNNING && hasActiveBet;

  const canEdit =
    state === BetPanelState.READY ||
    state === BetPanelState.WAITING;
  const buttonLabel = useMemo(() => {
    if (state === BetPanelState.RUNNING && !hasActiveBet) {
      return "WAITING";
    }

    return getButtonLabel(
      state,
      mode,
      multiplier,
      autoCashout,
    );
  }, [state, mode, multiplier, autoCashout, hasActiveBet]);

  useEffect(() => {
    setAutoCashoutInput(autoCashout.toFixed(2));
  }, [autoCashout]);

  useEffect(() => {
    if (!panelBet) return;

    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 220);
    return () => window.clearTimeout(timer);
  }, [panelBet?.status, phase]);

  useEffect(() => {
    const targetPayout = amount * multiplier;
    const startValue = displayPayout;
    const startTime = performance.now();

    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startTime) / 220);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (targetPayout - startValue) * eased;

      setDisplayPayout(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [amount, multiplier]);

  function handlePrimaryAction() {
    if (state === BetPanelState.RUNNING) {
      cashout(panelId);
      playSfx("cashout");
      return;
    }

    if (
      state !== BetPanelState.READY &&
      state !== BetPanelState.WAITING
    ) {
      return;
    }

    if (!bettingOpen) return;

    if (amount <= 0) return;

    if (amount > balance) return;

    if (isDemo) {
      decreaseDemoBalance(amount);
      playSfx("bet");
      return;
    }

    const nextAutoCashout =
      mode === BetMode.AUTO
        ? autoCashout
        : null;

    placeBet(
      amount,
      nextAutoCashout,
      panelId,
    );

    playSfx("bet");
  }

  return (
    <div
      style={{
        background: "#1B1F26",

        borderRadius: 16,

        transform: pulse ? "translateY(-1px) scale(1.01)" : "translateY(0) scale(1)",

        transition: "transform 180ms ease, box-shadow 180ms ease",

        boxShadow: pulse ? "0 0 0 1px rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.22)" : "none",

        padding: 10,

        display: "flex",

        gap: 10,

        alignItems: "stretch",
      }}
    >
      {/* LEFT */}

      <div
        style={{
          flex: 1.2,

          display: "flex",

          flexDirection: "column",

          gap: 8,
        }}
      >
        {/* Bet / Auto */}

        <div
          style={{
            display: "flex",

            background: "#14171C",

            borderRadius: 20,

            padding: 2,
          }}
        >
          <button
            onClick={() => setMode(BetMode.MANUAL)}
            style={{
              flex: 1,

              background:
                mode === BetMode.MANUAL
                  ? "#323741"
                  : "transparent",

              color: "#fff",

              border: "none",

              borderRadius: 18,

              padding: "6px",

              fontWeight: 700,

              fontSize: 12,

              cursor: "pointer",
            }}
          >
            Bet
          </button>

          <button
            onClick={() => setMode(BetMode.AUTO)}
            style={{
              flex: 1,

              background:
                mode === BetMode.AUTO
                  ? "#323741"
                  : "transparent",

              color: "#9EA2AA",

              border: "none",

              fontSize: 12,

              cursor: "pointer",
            }}
          >
            Auto
          </button>
        </div>

        {/* Amount */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            background: "#14171C",

            borderRadius: 8,

            padding: "8px 10px",
          }}
        >
          <button
            disabled={!canEdit}
            onClick={() =>
              setAmount(
                Math.max(
                  10,
                  amount - 10,
                ),
              )
            }
            style={{...buttonStyle, opacity: canEdit ? 1 : 0.4}}
          >
            −
          </button>

          <span
            style={{
              color: "#fff",

              fontWeight: 700,

              fontSize: 18,
            }}
          >
            {amount.toFixed(2)}
          </span>

          <button
            disabled={!canEdit}
            onClick={() =>
              setAmount(
                amount + 10,
              )
            }
            style={{...buttonStyle, opacity: canEdit ? 1 : 0.4}}
          >
            +
          </button>
        </div>

        {/* Quick Bets */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(2,1fr)",

            gap: 6,
          }}
        >
          {QUICK_BETS.map(
            (chip) => (
              <button
                key={chip}
                disabled={!canEdit}
                onClick={() =>
                  setAmount(chip)
                }
                style={{
                  background:
                    "#14171C",

                  border: "none",

                  color: "#9EA2AA",

                  padding: "8px",

                  borderRadius: 8,

                  fontSize: 12,

                  cursor: "pointer",
                }}
              >
                {chip.toLocaleString()}
              </button>
            ),
          )}

          <button
            disabled={!canEdit}
            onClick={() =>
              setAmount(
                Math.floor(
                  balance,
                ),
              )
            }
            style={{
              background:
                "#14171C",

              border: "none",

              color: "#00E676",

              padding: "8px",

              borderRadius: 8,

              fontWeight: 700,

              cursor: "pointer",
            }}
          >
            MAX
          </button>
        </div>

        {mode === BetMode.AUTO && (
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", background:"#14171C", borderRadius:8, padding:"8px 10px", gap:8}}>
            <span style={{color:"#9EA2AA", fontSize:12}}>Auto Cashout</span>
            <div style={{display:"flex", alignItems:"center", gap:8, flex:1, justifyContent:"flex-end"}}>
              <button disabled={!canEdit} onClick={() => setAutoCashout((value) => Math.max(1.01, Number((value - 0.01).toFixed(2))))} style={{...buttonStyle, width:28, height:28, fontSize:14}}>−</button>
              <input
                inputMode="decimal"
                value={autoCashoutInput}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/[^0-9.]/g, "");
                  setAutoCashoutInput(nextValue);

                  const parsed = Number.parseFloat(nextValue);
                  if (!Number.isFinite(parsed)) return;

                  const normalized = Math.min(1000, Math.max(1.01, Number(parsed.toFixed(2))));
                  setAutoCashout(normalized);
                }}
                onBlur={() => {
                  const parsed = Number.parseFloat(autoCashoutInput);
                  if (!Number.isFinite(parsed)) {
                    setAutoCashoutInput(autoCashout.toFixed(2));
                    return;
                  }

                  const normalized = Math.min(1000, Math.max(1.01, Number(parsed.toFixed(2))));
                  setAutoCashout(normalized);
                  setAutoCashoutInput(normalized.toFixed(2));
                }}
                disabled={!canEdit}
                style={{width:74, height:30, borderRadius:8, border:"1px solid rgba(255,255,255,0.12)", background:"#0F1217", color:"#fff", textAlign:"center", fontWeight:700, fontSize:13}}
              />
              <button disabled={!canEdit} onClick={() => setAutoCashout((value) => Math.min(1000, Number((value + 0.01).toFixed(2))))} style={{...buttonStyle, width:28, height:28, fontSize:14}}>+</button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT */}

      <button
        disabled={
          !bettingOpen && state !== BetPanelState.RUNNING
            ? true
            : state === BetPanelState.BET_PLACED || state === BetPanelState.CASHED_OUT || state === BetPanelState.LOST || (state === BetPanelState.RUNNING && !hasActiveBet)
        }
        onClick={handlePrimaryAction}
        style={{
          flex: 1,

          background:
            state === BetPanelState.RUNNING && hasActiveBet
              ? "#ff8a00"
              : state === BetPanelState.BET_PLACED
                ? "#5b4d00"
                : state === BetPanelState.CASHED_OUT || state === BetPanelState.LOST
                  ? "#5a2f2f"
                  : bettingOpen
                    ? "#19B300"
                    : "#3D3D3D",

          border: "none",

          borderRadius: 12,

          color: "#fff",

          fontWeight: 700,

          fontSize: 24,

          cursor:
            state === BetPanelState.BET_PLACED || state === BetPanelState.CASHED_OUT || state === BetPanelState.LOST || (state === BetPanelState.RUNNING && !hasActiveBet)
              ? "default"
              : bettingOpen || (state === BetPanelState.RUNNING && hasActiveBet)
                ? "pointer"
                : "default",

          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          minHeight: 145,
          transition: "background 160ms ease",
        }}
      >
        <div>{buttonLabel}</div>

        <div
          style={{
            fontSize: 18,

            marginTop: 6,
          }}
        >
          {state === BetPanelState.READY || state === BetPanelState.WAITING
            ? `${amount.toFixed(2)} KES`
            : state === BetPanelState.BET_PLACED
              ? "BET ACCEPTED"
              : state === BetPanelState.RUNNING
                ? `KES ${displayPayout.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`
                : state === BetPanelState.CASHED_OUT
                  ? "✓ CASHED OUT"
                  : "YOU LOST"}
        </div>
      </button>
    </div>
  );
}

const buttonStyle = {
  width: 34,

  height: 34,

  borderRadius: 17,

  border: "none",

  background: "#2B313C",

  color: "#fff",

  fontWeight: 700,

  cursor: "pointer",

  fontSize: 18,
};