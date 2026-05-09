import { useState, useEffect, useRef } from "react"; // add useRef
import { extractTags, highlightTags } from "./utils";

function App() {
  function loadThoughts() {
    const saved = localStorage.getItem("minddump-thoughts");
    if (saved) return JSON.parse(saved);
    return [];
  }

  const [inputText, setInputText] = useState("");
  const [thoughts, setThoughts] = useState(loadThoughts);
  const [showSuggest, setShowSuggest] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [focusMode, setFocusMode] = useState(false); 
  const inputRef = useRef(null); 

  useEffect(() => {
    localStorage.setItem("minddump-thoughts", JSON.stringify(thoughts));
  }, [thoughts]);

  useEffect(() => {
    function handleGlobalKey(e) {
      if (e.key === "Escape") {
        setFocusMode(false);
        setShowSuggest(false);
        return;
      }
      if (e.key === "f" && e.target.tagName !== "INPUT") {
        setFocusMode(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey); // cleanup
  }, []); 

  function getAllTags() {
    const all = thoughts.flatMap((t) => t.tags);
    return [...new Set(all)];
  }

  function getSuggestions() {
    const words = inputText.split(" ");
    const lastWord = words[words.length - 1];
    if (!lastWord.startsWith("#") || lastWord.length < 2) return [];
    return getAllTags().filter(
      (tag) =>
        tag.startsWith(lastWord.toLowerCase()) &&
        tag !== lastWord.toLowerCase(),
    );
  }

  function getFilteredThoughts() {
    return thoughts.filter((thought) => {
      const matchesSearch =
        searchText === "" ||
        thought.text.toLowerCase().includes(searchText.toLowerCase());
      const matchesTag = activeTag === null || thought.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }

  function handleInputChange(e) {
    setInputText(e.target.value);
    setShowSuggest(true);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && inputText.trim() !== "") {
      addThought();
      setShowSuggest(false);
    }
    if (e.key === "Escape") {
      setShowSuggest(false);
    }
  }

  function applySuggestion(tag) {
    const words = inputText.split(" ");
    words[words.length - 1] = tag;
    setInputText(words.join(" ") + " ");
    setShowSuggest(false);
  }

  function addThought() {
    const newThought = {
      id: Date.now(),
      text: inputText.trim(),
      tags: extractTags(inputText),
      createdAt: new Date().toLocaleTimeString(),
    };
    setThoughts([newThought, ...thoughts]);
    setInputText("");
  }

  function deleteThought(id) {
    setThoughts(thoughts.filter((t) => t.id !== id));
  }

  function toggleTag(tag) {
    setActiveTag((prev) => (prev === tag ? null : tag));
  }

  // --- Export functions ---

  function exportMarkdown() {
    const lines = thoughts.map(
      (t) =>
        `- ${t.text}\n  *${t.createdAt}*${t.tags.length ? " · " + t.tags.join(" ") : ""}`,
    );
    const content = `# 🧠 MindDump Export\n\n${lines.join("\n\n")}`;
    downloadFile(content, "minddump.md", "text/markdown");
  }

  function exportJSON() {
    const content = JSON.stringify(thoughts, null, 2); 
    downloadFile(content, "minddump.json", "application/json");
  }

  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type }); 
    const url = URL.createObjectURL(blob); 
    const a = document.createElement("a"); 
    a.href = url;
    a.download = filename;
    a.click(); 
    URL.revokeObjectURL(url); 
  }

  const suggestions = getSuggestions();
  const allTags = getAllTags();
  const filteredThoughts = getFilteredThoughts();

  // ---- FOCUS MODE UI ----
  if (focusMode) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              className="w-full bg-transparent border-b border-gray-700 focus:border-blue-500 outline-none text-white text-xl py-3 placeholder-gray-700 transition-colors"
            />
            {showSuggest && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden z-10">
                {suggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => applySuggestion(tag)}
                    className="w-full text-left px-4 py-2 text-blue-400 hover:bg-gray-800 text-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-700 text-xs mt-4 text-center">
            Press Esc to exit focus mode
          </p>
        </div>
      </div>
    );
  }

  // ---- NORMAL UI ----
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold">🧠 MindDump</h1>

          {/* Export buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportMarkdown}
              disabled={thoughts.length === 0}
              className="text-xs border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Export .md
            </button>
            <button
              onClick={exportJSON}
              disabled={thoughts.length === 0}
              className="text-xs border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Export .json
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Press Enter to save ·{" "}
          <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300 text-xs">
            F
          </kbd>{" "}
          for focus mode
        </p>

        {/* Capture input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind? Use #tags"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 text-base"
          />
          {showSuggest && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden z-10">
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => applySuggestion(tag)}
                  className="w-full text-left px-4 py-2 text-blue-400 hover:bg-gray-700 text-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search thoughts..."
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white placeholder-gray-600 outline-none focus:border-gray-600 text-sm mt-3"
        />

        {/* Tag cloud */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                  activeTag === tag
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                }`}
              >
                {tag}
              </button>
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="rounded-full px-3 py-1 text-xs border border-gray-700 text-gray-400 hover:text-white"
              >
                clear ✕
              </button>
            )}
          </div>
        )}

        {/* Count */}
        <p className="text-gray-500 text-xs mt-4 mb-4">
          {filteredThoughts.length} of {thoughts.length} thought
          {thoughts.length !== 1 ? "s" : ""}
          {activeTag && <span className="text-blue-400"> · {activeTag}</span>}
          {searchText && (
            <span className="text-yellow-400"> · "{searchText}"</span>
          )}
        </p>

        {/* Thoughts list */}
        <div className="flex flex-col gap-3">
          {filteredThoughts.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-8">
              No thoughts match your filter.
            </p>
          )}
          {filteredThoughts.map((thought) => (
            <div
              key={thought.id}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 group"
            >
              <p
                className="text-white text-sm"
                dangerouslySetInnerHTML={{
                  __html: highlightTags(thought.text),
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-1 flex-wrap">
                  {thought.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="text-xs bg-gray-700 text-gray-300 rounded-full px-2 py-0.5 hover:text-blue-400"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs">
                    {thought.createdAt}
                  </span>
                  <button
                    onClick={() => deleteThought(thought.id)}
                    className="text-gray-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
