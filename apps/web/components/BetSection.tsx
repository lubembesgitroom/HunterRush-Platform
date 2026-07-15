"use client";

import BetCard from "./BetCard";

export default function BetSection() {
  return (
    <section
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 16,
        alignItems: "start",
      }}
    >
      <BetCard title="Bet" />
    </section>
  );
}
