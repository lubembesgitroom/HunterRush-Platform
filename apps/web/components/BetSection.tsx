"use client";

import BetCard from "@/components/BetCard";

export default function BetSection() {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0,1fr))",
        gap: 12,
        width: "100%",
      }}
    >
      <BetCard title="Bet 1" panelId={1} />
      <BetCard title="Bet 2" panelId={2} />
    </section>
  );
}