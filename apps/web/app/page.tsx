import Header from "@/components/layout/Header";

import GameCanvas from "@/components/GameCanvas";
import BetSection from "@/components/BetSection";
import RoundHistoryStrip from "@/components/RoundHistoryStrip";
import RoundHistory from "@/components/RoundHistory";
import LiveBets from "@/components/LiveBets";
import Statistics from "@/components/Statistics";

export default function Home() {
  return (
    <main
      style={{
        width: "100%",
        maxWidth: 1500,
        margin: "0 auto",
        padding: 10,

        display: "flex",
        flexDirection: "column",
        gap: 10,

        background: "#16202c",
        minHeight: "100vh",

        fontFamily:
          'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',

        color: "#ffffff",

        boxSizing: "border-box",
      }}
    >
      {/* Header */}

      <Header />

      {/* Main Content */}

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px",

          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <RoundHistoryStrip />

        <GameCanvas />

        <BetSection />

        {/* Dashboard */}

        <section
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: 8,
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
