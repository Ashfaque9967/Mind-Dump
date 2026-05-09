import { useEffect, useState } from "react";
import ThoughtCard from "./ThoughtCard";

export default function ThoughtList({
  thoughts,
  allCount,
  onDelete,
  onTagClick,
}) {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth >= 768) {
        setColumns(3); // tablet
      } else {
        setColumns(2); // mobile
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  if (allCount === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🧠</div>

        <p
          style={{
            color: "#333",
            fontSize: "16px",
            fontWeight: 500,
            fontFamily: "var(--font-display)",
          }}
        >
          Your mind is too clean.
        </p>

        <p style={{ color: "#2a2a2a", fontSize: "13px", marginTop: "6px" }}>
          Tap + to dump something.
        </p>
      </div>
    );
  }

  if (thoughts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <p style={{ color: "#333", fontSize: "15px" }}>
          Nothing matches that filter.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "0 16px",
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "12px",
      }}
    >
      {thoughts.map((thought, index) => {
        const isWide = columns === 2 && index % 3 === 0;

        return (
          <div
            key={thought.id}
            style={{
              gridColumn: isWide ? "span 2" : "span 1",
            }}
          >
            <ThoughtCard
              thought={thought}
              onDelete={onDelete}
              onTagClick={onTagClick}
              isWide={isWide}
            />
          </div>
        );
      })}
    </div>
  );
}
