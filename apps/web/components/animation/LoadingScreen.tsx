"use client";

interface LoadingScreenProps {
  progress: number;
  message: string;
  visible: boolean;
}

const steps = [
  "Connecting...",
  "Loading Assets...",
  "Preparing Arena...",
  "Syncing Game...",
  "Ready",
];

export default function LoadingScreen({
  progress,
  message,
  visible,
}: LoadingScreenProps) {
  if (!visible) return null;

  const activeStepIndex = Math.min(
    steps.length - 1,
    Math.max(
      0,
      Math.floor((progress / 100) * steps.length),
    ),
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, rgba(255,145,0,0.22), transparent 42%), linear-gradient(135deg, #07111d 0%, #101827 45%, #05070b 100%)",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "min(88%, 460px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: "linear-gradient(90deg, #ffb35a 0%, #ffd782 50%, #ff9630 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          HunterRush
        </div>

        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.76)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {steps[activeStepIndex]}
        </div>

        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 999,
            background: "rgba(255,255,255,0.1)",
            overflow: "hidden",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #ff8a00 0%, #ffd166 100%)",
              boxShadow: "0 0 24px rgba(255,172,0,0.5)",
              transition: "width 260ms ease",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
            minHeight: 20,
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
