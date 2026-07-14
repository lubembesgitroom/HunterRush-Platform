"use client";

import BetCard from "./BetCard";

export default function BetSection() {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(340px, 1fr))",
        gap: 20,
        width: "100%",
      }}
    >
      <BetCard title="Bet 1" />

      <BetCard title="Bet 2" />
    </section>
  );
}