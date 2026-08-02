"use client";

import { useEffect, useMemo, useState } from "react";

import LoadingScreen from "@/components/animation/LoadingScreen";
import { useGame } from "@/hooks/useGame";

type ArenaPhase =
  | "loading"
  | "waiting"
  | "betting"
  | "starting"
  | "running"
  | "crashed"
  | "reveal";

function getArenaPhase(phase: string): ArenaPhase {
  switch (phase) {
    case "WAITING":
      return "waiting";
    case "BETTING":
      return "betting";
    case "RUNNING":
      return "running";
    case "CRASHED":
      return "crashed";
    case "REVEAL":
      return "reveal";
    default:
      return "waiting";
  }
}

export default function GameArena() {
  const { multiplier, snapshot, connected } = useGame();
  const [loadingProgress, setLoadingProgress] = useState(14);
  const [loadingMessage, setLoadingMessage] = useState("Connecting...");
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [phasePulse, setPhasePulse] = useState(0);
  const [envOffset, setEnvOffset] = useState(0);
  const [countdownValue, setCountdownValue] = useState(5);

  const phase = getArenaPhase(snapshot?.phase ?? "WAITING");
  const round = snapshot?.round;
  const playersOnline = snapshot?.playersOnline ?? 0;

  useEffect(() => {
    if (!loadingVisible) return;

    const steps = [
      { progress: 22, message: "Connecting..." },
      { progress: 48, message: "Loading Assets..." },
      { progress: 74, message: "Preparing Arena..." },
      { progress: 92, message: "Syncing Game..." },
      { progress: 100, message: "Ready" },
    ];

    let index = 0;
    const timer = window.setInterval(() => {
      if (index >= steps.length) {
        window.clearInterval(timer);
        setLoadingVisible(false);
        return;
      }

      const step = steps[index];
      if (!step) {
        window.clearInterval(timer);
        setLoadingVisible(false);
        return;
      }

      setLoadingProgress(step.progress);
      setLoadingMessage(step.message);
      index += 1;
    }, 220);

    return () => window.clearInterval(timer);
  }, [loadingVisible]);

  useEffect(() => {
    if (!connected) return;

    if (phase === "betting") {
      setPhasePulse((value) => value + 1);
      setCountdownValue(5);
      setLoadingVisible(false);
    }

    if (phase === "running") {
      setCountdownValue(0);
    }

    if (phase === "crashed" || phase === "reveal") {
      setCountdownValue(0);
    }
  }, [connected, phase]);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      setEnvOffset((value) => value + 0.4);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const sky = useMemo(() => {
    switch (phase) {
      case "betting":
        return "linear-gradient(180deg, #8ed9ff 0%, #2d74b4 45%, #0f2138 100%)";
      case "running":
        return "linear-gradient(180deg, #ffaf5e 0%, #ff5f2a 45%, #130812 100%)";
      case "crashed":
      case "reveal":
        return "linear-gradient(180deg, #2b0c1c 0%, #08080d 45%, #030305 100%)";
      default:
        return "linear-gradient(180deg, #94dfff 0%, #4f90c2 45%, #123a52 100%)";
    }
  }, [phase]);

  const glow = useMemo(() => {
    if (phase === "running") {
      return multiplier >= 10
        ? "rgba(255,94,0,0.56)"
        : multiplier >= 5
          ? "rgba(255,178,46,0.4)"
          : "rgba(255,255,255,0.16)";
    }

    if (phase === "crashed" || phase === "reveal") {
      return "rgba(255,0,0,0.5)";
    }

    return "rgba(255,255,255,0.16)";
  }, [multiplier, phase]);

  const countdownLabel = phase === "betting" ? countdownValue : phase === "waiting" ? "WAIT" : "GO";
  const ringScale = phase === "betting" ? 1.04 + phasePulse * 0.005 : 1;
  const dustOpacity = phase === "running" ? Math.min(0.95, 0.24 + multiplier / 16) : phase === "betting" ? 0.5 : 0.16;
  const crashFlash = phase === "crashed" || phase === "reveal" ? 1 : 0;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 280,
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        background: sky,
        boxShadow: "inset 0 -80px 140px rgba(0,0,0,0.16)",
      }}
    >
      <LoadingScreen
        progress={loadingProgress}
        message={loadingMessage}
        visible={loadingVisible}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 20%, ${glow} 0%, transparent 48%)`,
          transition: "background 280ms ease",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 24,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 18px",
          color: "rgba(255,255,255,0.92)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <span>Round {round ? round.id.slice(0, 8) : "--------"}</span>
        <span>{playersOnline} Players</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "44%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.35) 100%)",
          transform: `translate3d(${envOffset % 100}px, 0, 0)`,
          transition: phase === "running" ? "transform 90ms linear" : "transform 260ms ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 72,
          height: 56,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.28) 0 3px, transparent 4px), radial-gradient(circle at 72% 50%, rgba(255,255,255,0.22) 0 3px, transparent 4px), radial-gradient(circle at 88% 50%, rgba(255,255,255,0.2) 0 2px, transparent 3px)",
          opacity: dustOpacity,
          transform: `translate3d(${envOffset * 0.8}px, 0, 0)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -10,
          right: -10,
          bottom: 56,
          height: 92,
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.25) 0 6px, transparent 7px), radial-gradient(circle at 65% 0%, rgba(255,255,255,0.25) 0 5px, transparent 6px), radial-gradient(circle at 90% 0%, rgba(255,255,255,0.25) 0 4px, transparent 5px)",
          opacity: phase === "running" ? 0.75 : 0.35,
          transform: `translate3d(${envOffset * 0.6}px, 0, 0)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 54,
          width: 138,
          height: 138,
          transform: `translateX(-50%) scale(${phase === "running" ? 1.02 + multiplier / 60 : phase === "betting" ? ringScale : 1})`,
          transition: "transform 180ms ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.13)",
            boxShadow: phase === "running" ? "0 0 24px rgba(255,162,0,0.36)" : "none",
          }}
        />
        <img
          src="/hunter.png"
          alt="Hunter"
          style={{
            width: 104,
            height: 104,
            objectFit: "contain",
            filter: phase === "running" ? "drop-shadow(0 6px 24px rgba(0,0,0,0.3))" : "none",
            transform: phase === "running" ? "translateY(-4px)" : "translateY(0)",
            transition: "transform 160ms ease-out",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 20,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -46,
            padding: "7px 12px",
            borderRadius: 999,
            background: "rgba(7,12,20,0.82)",
            color: phase === "betting" ? "#ffd166" : "#fff",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            boxShadow: "0 6px 24px rgba(0,0,0,0.22)",
            opacity: phase === "betting" || phase === "waiting" ? 1 : 0,
            transform: phase === "betting" ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 220ms ease, transform 220ms ease",
          }}
        >
          {phase === "betting" ? `Countdown ${countdownLabel}` : "Waiting for Next Round"}
        </div>

        <div
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            background: phase === "running" ? "rgba(248,114,0,0.9)" : "rgba(17,24,39,0.72)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: "0.06em",
            boxShadow: phase === "running" ? "0 10px 30px rgba(248,114,0,0.35)" : "none",
            transform: `scale(${phase === "betting" ? 1.04 : 1})`,
            transition: "transform 220ms ease, background 220ms ease",
          }}
        >
          {phase === "running"
            ? `${multiplier.toFixed(2)}×`
            : phase === "crashed" || phase === "reveal"
              ? `${multiplier.toFixed(2)}×`
              : phase === "betting"
                ? "BETTING"
                : "WAITING"}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: phase === "betting" ? 0.6 : 0.2,
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0 1px, transparent 2px)",
          backgroundSize: "16px 16px",
          transition: "opacity 240ms ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(255, 76, 0, ${crashFlash * 0.16})`,
          opacity: crashFlash,
          transition: "opacity 180ms ease",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
