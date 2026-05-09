import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function Header({
  count,
  allTags,
  activeTag,
  onToggleTag,
  onSearchChange,
  onExportMd,
  onExportJson,
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div
      style={{
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "20px",
        paddingTop: "max(48px, env(safe-area-inset-top, 48px))",
      }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 14vw, 44px)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: "#fff",
            marginBottom: "16px",
          }}
        >
          Mind
          <br />
          Dumps
        </h1>

        <div className="flex gap-2 mt-2">
          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen((s) => !s)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: searchOpen ? "#fff" : "var(--surface)",
              border: "1.5px solid var(--border)",
              color: searchOpen ? "#0D0D0D" : "#888",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Search"
          >
            <MagnifyingGlassIcon size={20} />
          </button>

          {/* Export */}
          <button
            onClick={onExportMd}
            disabled={count === 0}
            style={{
              height: 44,
              padding: "0 14px",
              borderRadius: "22px",
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              color: "#555",
              fontSize: "12px",
              fontWeight: 500,
              cursor: count === 0 ? "not-allowed" : "pointer",
              opacity: count === 0 ? 0.3 : 1,
            }}
          >
            Export
          </button>
        </div>
      </div>

      {/* Search bar — slides in */}
      {searchOpen && (
        <input
          autoFocus
          type="text"
          placeholder="Search thoughts..."
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: "100%",
            marginTop: "16px",
            marginBottom: "16px",
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "14px",
            padding: "12px 16px",
            color: "#fff",
            fontSize: "15px",
            outline: "none",
            fontFamily: "var(--font-body)",
          }}
        />
      )}

      {/* Filter pills */}
      {allTags.length > 0 && (
        <div
          className="flex gap-2 mt-4 hide-scroll"
          style={{ overflowX: "auto" }}
        >
          <button
            onClick={() => onToggleTag(null)}
            style={{
              height: 36,
              padding: "0 16px",
              borderRadius: "12px",
              flexShrink: 0,
              background: activeTag === null ? "#fff" : "transparent",
              border: "1.5px solid",
              borderColor: activeTag === null ? "#fff" : "var(--border)",
              color: activeTag === null ? "#0D0D0D" : "#555",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            All
            <span
              style={{
                background: activeTag === null ? "#0D0D0D" : "var(--border)",
                color: activeTag === null ? "#fff" : "#666",
                borderRadius: "10px",
                padding: "1px 7px",
                fontSize: "11px",
              }}
            >
              {count}
            </span>
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: "12px",
                flexShrink: 0,
                background: activeTag === tag ? "#fff" : "transparent",
                border: "1.5px solid",
                borderColor: activeTag === tag ? "#fff" : "var(--border)",
                color: activeTag === tag ? "#0D0D0D" : "#555",
                fontSize: "14px",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
