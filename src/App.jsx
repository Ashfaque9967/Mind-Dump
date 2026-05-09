import { useState, useEffect } from "react";
import { extractTags, downloadFile } from "./utils";
import Header from "./components/Header";
import ThoughtList from "./components/ThoughtList";
import FAB from "./components/FAB";
import CaptureSheet from "./components/CaptureSheet";
import DesktopBlock from "./components/DesktopBlock";

function App() {
  function loadThoughts() {
    const saved = localStorage.getItem("minddump-thoughts");
    return saved ? JSON.parse(saved) : [];
  }

  const [thoughts, setThoughts] = useState(loadThoughts);
  const [inputText, setInputText] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    localStorage.setItem("minddump-thoughts", JSON.stringify(thoughts));
  }, [thoughts]);

  function getAllTags() {
    return [...new Set(thoughts.flatMap((t) => t.tags))];
  }

  function getSuggestions() {
    const words = inputText.split(" ");
    const last = words[words.length - 1];
    if (!last.startsWith("#") || last.length < 2) return [];
    return getAllTags().filter(
      (t) => t.startsWith(last.toLowerCase()) && t !== last.toLowerCase(),
    );
  }

  function getFiltered() {
    return thoughts.filter((t) => {
      const matchSearch =
        !searchText || t.text.toLowerCase().includes(searchText.toLowerCase());
      const matchTag = !activeTag || t.tags.includes(activeTag);
      return matchSearch && matchTag;
    });
  }

  function submitThought() {
    if (!inputText.trim()) return;
    setThoughts((prev) => [
      {
        id: Date.now(),
        text: inputText.trim(),
        tags: extractTags(inputText),
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);
    setInputText("");
  }

  function applySuggestion(tag) {
    const words = inputText.split(" ");
    words[words.length - 1] = tag;
    setInputText(words.join(" ") + " ");
  }

  function exportMd() {
    const lines = thoughts.map(
      (t) =>
        `- ${t.text}\n  *${t.createdAt}*${t.tags.length ? " · " + t.tags.join(" ") : ""}`,
    );
    downloadFile(
      `# 🧠 MindDump\n\n${lines.join("\n\n")}`,
      "minddump.md",
      "text/markdown",
    );
  }

  function exportJson() {
    downloadFile(
      JSON.stringify(thoughts, null, 2),
      "minddump.json",
      "application/json",
    );
  }

  return (
    <>
      {/* Desktop wall — hidden on mobile/tablet */}
      <DesktopBlock />

      {/* Mobile & tablet app — hidden on desktop */}
      <div
        className="lg:hidden"
        style={{ minHeight: "100dvh", background: "#0D0D0D" }}
      >
        <Header
          count={thoughts.length}
          allTags={getAllTags()}
          activeTag={activeTag}
          onToggleTag={(tag) =>
            setActiveTag((prev) => (prev === tag ? null : tag))
          }
          onSearchChange={setSearchText}
          onExportMd={exportMd}
          onExportJson={exportJson}
        />

        {/* Scrollable thought area with FAB clearance */}
        <div className="mb-safe" style={{ paddingBottom: "100px" }}>
          <ThoughtList
            thoughts={getFiltered()}
            allCount={thoughts.length}
            onDelete={(id) =>
              setThoughts((prev) => prev.filter((t) => t.id !== id))
            }
            onTagClick={(tag) =>
              setActiveTag((prev) => (prev === tag ? null : tag))
            }
          />
        </div>

        {/* Bottom sheet capture */}
        {sheetOpen && (
          <CaptureSheet
            inputText={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onSubmit={submitThought}
            onClose={() => setSheetOpen(false)}
            suggestions={getSuggestions()}
            onSuggestionClick={applySuggestion}
          />
        )}

        {/* Floating action button */}
        <FAB onClick={() => setSheetOpen(true)} />
      </div>
    </>
  );
}

export default App;
