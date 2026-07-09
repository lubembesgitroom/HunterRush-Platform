export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid #1f2937",
        }}
      >
        <h1>HunterRush</h1>

        <span style={{ color: "#22c55e" }}>
          ● Connected
        </span>
      </header>

      {/* Main Area */}
      <section
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "320px 1fr",
        }}
      >
        {/* Betting Panel */}
        <aside
          style={{
            borderRight: "1px solid #1f2937",
            padding: 20,
          }}
        >
          <h2>Bet Panel</h2>

          <p>Bet Slot A</p>

          <p>Bet Slot B</p>

          <p>Auto Cashout</p>
        </aside>

        {/* Game View */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 36,
          }}
        >
          Game Viewport
        </section>
      </section>

      {/* Footer */}
      <footer
        style={{
          height: 45,
          borderTop: "1px solid #1f2937",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        Round #1 • Waiting for next round...
      </footer>
    </main>
  );
}