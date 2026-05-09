export default function DesktopBlock() {
  return (
    <div
      className="hidden lg:flex min-h-screen flex-col items-center justify-center px-12 text-center"
      style={{ background: "#0D0D0D" }}
    >
      {/* Big animated brain */}
      <div
        style={{
          fontSize: "80px",
          animation: "float 3s ease-in-out infinite",
          display: "inline-block",
        }}
      >
        🧠
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 6vw, 80px)",
          fontWeight: 800,
          lineHeight: 1.1,
          marginTop: "2rem",
          letterSpacing: "-0.03em",
        }}
      >
        Mind dumps
        <br />
        <span style={{ color: "#FF4D1C" }}>happen on the go.</span>
      </h1>

      <p
        style={{
          color: "#555",
          fontSize: "18px",
          marginTop: "1.5rem",
          maxWidth: "420px",
          lineHeight: 1.6,
          fontWeight: 300,
        }}
      >
        MindDump is built for mobile. Open it on your phone and start capturing
        thoughts the moment they hit.
      </p>

      {/* Fake QR placeholder */}
      <div
        style={{
          marginTop: "3rem",
          border: "1.5px solid #2A2A2A",
          borderRadius: "20px",
          padding: "2rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 12px)",
            gap: "4px",
          }}
        >
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: "2px",
                background: [
                  0, 1, 5, 6, 7, 10, 11, 14, 18, 19, 23, 24, 3, 8, 16, 20,
                ].includes(i)
                  ? "#FF4D1C"
                  : "#1A1A1A",
              }}
            />
          ))}
        </div>
        <p
          style={{
            color: "#333",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          OPEN ON MOBILE
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
