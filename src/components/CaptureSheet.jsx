import { useEffect, useRef } from "react";

export default function CaptureSheet({
  inputText,
  onChange,
  onSubmit,
  onClose,
  suggestions,
  onSuggestionClick,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Small delay lets the sheet animate in before focusing
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  function handleKey(e) {
    if (e.key === "Enter" && inputText.trim()) {
      onSubmit();
      onClose();
    }
    if (e.key === "Escape") onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1A1A1A",
          borderRadius: "24px 24px 0 0",
          padding: "16px 20px",
          paddingBottom: "max(24px, env(safe-area-inset-bottom))",
          zIndex: 51,
          animation: "slideUp 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "#333",
            margin: "0 auto 16px",
          }}
        />

        {/* Input */}
        <textarea
          ref={inputRef}
          value={inputText}
          onChange={onChange}
          onKeyDown={handleKey}
          placeholder="What's on your mind? Use #tags..."
          rows={3}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: "18px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            lineHeight: 1.4,
            resize: "none",
            letterSpacing: "-0.01em",
          }}
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            {suggestions.map((tag) => (
              <button
                key={tag}
                onClick={() => onSuggestionClick(tag)}
                style={{
                  background: "#2A2A2A",
                  border: "none",
                  borderRadius: "12px",
                  padding: "6px 14px",
                  color: "#FF4D1C",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: "36px",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              color: "#555",
              background: "none",
              border: "none",
              fontSize: "15px",
              cursor: "pointer",
              padding: "8px 0",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit();
              onClose();
            }}
            disabled={!inputText.trim()}
            style={{
              background: inputText.trim() ? "#FF4D1C" : "#2A2A2A",
              color: inputText.trim() ? "#fff" : "#444",
              border: "none",
              borderRadius: "16px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              cursor: inputText.trim() ? "pointer" : "not-allowed",
              transition: "background 0.2s",
              minHeight: "48px",
            }}
          >
            Dump it
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
