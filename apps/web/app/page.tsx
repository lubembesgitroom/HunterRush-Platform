import Header from "@/components/layout/Header";

import GameCanvas from "@/components/GameCanvas";
import BetSection from "@/components/BetSection";

import RoundHistory from "@/components/RoundHistory";
import LiveBets from "@/components/LiveBets";
import Statistics from "@/components/Statistics";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#ffffff",
      }}
    >
      {/* Header */}

      <Header />

      {/* Main Content */}

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: 24,

          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Game Canvas */}

        <GameCanvas />

        {/* Betting */}

        <BetSection />

        {/* Dashboard */}

        <section
          style={{
            display: "grid",

            gridTemplateColumns:
              "1fr 1fr 1fr",

            gap: 20,
          }}
        >
          <RoundHistory />

          <LiveBets />

          <Statistics />
        </section>
      </div>
    </main>
  );
}