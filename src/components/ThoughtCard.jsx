import { useState, useRef } from "react";
import { highlightTags } from "../utils";

const PALETTE = [
  {
    bg: "#FF4D1C",
    text: "#fff",
    pill: "rgba(255,255,255,0.2)",
    pillText: "#fff",
  },
  {
    bg: "#F5C800",
    text: "#1a1a1a",
    pill: "rgba(0,0,0,0.12)",
    pillText: "#4a3b00",
  },
  {
    bg: "#00C897",
    text: "#0a2b22",
    pill: "rgba(0,0,0,0.12)",
    pillText: "#0a2b22",
  },
  {
    bg: "#C77DFF",
    text: "#1a0a2e",
    pill: "rgba(0,0,0,0.12)",
    pillText: "#1a0a2e",
  },
  {
    bg: "#FF85A1",
    text: "#2d0011",
    pill: "rgba(0,0,0,0.1)",
    pillText: "#2d0011",
  },
];

export default function ThoughtCard({ thought, onDelete, onTagClick, isWide }) {
  const [swiped, setSwiped] = useState(false);
  const touchStartX = useRef(null);
  const color = PALETTE[thought.id % PALETTE.length];

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (dx > 60) setSwiped(true); // swipe left → reveal delete
    if (dx < -30) setSwiped(false); // swipe right → hide
    touchStartX.current = null;
  }

  return (
    <div
      style={{ position: "relative", borderRadius: "24px", overflow: "hidden" }}
    >
      {/* Delete layer (revealed on swipe) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#FF3B30",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "24px",
          borderRadius: "24px",
        }}
      >
        <button
          onClick={() => onDelete(thought.id)}
          style={{
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>

      {/* Card */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          background: color.bg,
          color: color.text,
          borderRadius: "24px",
          padding: "20px",
          minHeight: isWide ? "160px" : "180px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          transform: swiped ? "translateX(-88px)" : "translateX(0)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          zIndex: 1,
          cursor: "default",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: "32px",
            height: "3px",
            borderRadius: "2px",
            background: color.pill,
            margin: "0 auto -4px",
          }}
        />

        {/* Text */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isWide ? "17px" : "15px",
            fontWeight: 700,
            lineHeight: 1.35,
            flex: 1,
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{
            __html: highlightTags(thought.text, color.bg),
          }}
        />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {thought.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                style={{
                  background: color.pill,
                  color: color.pillText,
                  border: "none",
                  borderRadius: "12px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: "28px",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <span
            style={{
              fontSize: "11px",
              opacity: 0.45,
              fontWeight: 400,
              flexShrink: 0,
            }}
          >
            {thought.createdAt}
          </span>
        </div>
      </div>
    </div>
  );
}
