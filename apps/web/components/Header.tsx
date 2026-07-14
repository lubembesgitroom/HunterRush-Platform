"use client";

import { useGame } from "@/hooks/useGame";
import { formatCurrency } from "@/lib/formatCurrency";

export default function Header() {
  const {
    connected,
    balance,
    player,
  } = useGame();

  return (
    <header className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}

      <div>

        <h1 className="text-5xl font-black tracking-tight text-white">
          HunterRush
        </h1>

        <p className="mt-2 text-lg text-zinc-400">
          Real-Time Multiplayer Crash Game
        </p>

      </div>

      {/* Right */}

      <div className="flex flex-wrap items-center gap-4">

        {/* Connection */}

        <div className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-3">

          <span
            className={`h-3 w-3 rounded-full ${
              connected
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <span className="font-medium">
            {connected
              ? "Connected"
              : "Disconnected"}
          </span>

        </div>

        {/* Wallet */}

        <div className="rounded-xl bg-zinc-800 px-5 py-3">

          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Wallet
          </p>

          <h2 className="text-xl font-bold text-emerald-400">
            {formatCurrency(balance)}
          </h2>

        </div>

        {/* Player */}

        <div className="rounded-xl bg-zinc-800 px-5 py-3">

          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Player
          </p>

          <h2 className="font-semibold text-white">
            {player?.username ?? "Guest"}
          </h2>

        </div>

      </div>

    </header>
  );
}