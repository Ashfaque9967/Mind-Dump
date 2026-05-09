export default function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Add thought"
      style={{
        position: "fixed",
        bottom: "max(28px, env(safe-area-inset-bottom, 28px))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        background: "#fff",
        color: "#0D0D0D",
        fontSize: "28px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.6)",
        zIndex: 40,
        transition: "transform 0.15s ease",
        WebkitTapHighlightColor: "transparent",
      }}
      onTouchStart={(e) =>
        (e.currentTarget.style.transform = "translateX(-50%) scale(0.92)")
      }
      onTouchEnd={(e) =>
        (e.currentTarget.style.transform = "translateX(-50%) scale(1)")
      }
    >
      +
    </button>
  );
}
