import { useState } from "react";
import { extractTags, highlightTags } from "./utils";

function App() {
  const [inputText, setInputText] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

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

  function handleInputChange(e) {
    setInputText(e.target.value);
    setShowSuggest(true);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && inputText.trim() !== "") {
      addThought();
      setShowSuggest(false);
    }
    if (e.key === "Escape") setShowSuggest(false);
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

  const suggestions = getSuggestions();
  const allTags = getAllTags();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-1">🧠 MindDump</h1>
        <p className="text-gray-400 text-sm mb-6">
          Press Enter to save · Use #tags to organize
        </p>

        {/* Input area with suggestion dropdown */}
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind? Use #tags"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 text-base"
          />

          {/* Tag suggestions dropdown */}
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

        {/* Tag cloud — only shows once you have tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Count */}
        <p className="text-gray-500 text-xs mt-4 mb-4">
          {thoughts.length} thought{thoughts.length !== 1 ? "s" : ""} captured
        </p>

        {/* Thoughts list */}
        <div className="flex flex-col gap-3">
          {thoughts.map((thought) => (
            <div
              key={thought.id}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 group"
            >
              {/* Text with highlighted tags */}
              <p
                className="text-white text-sm"
                dangerouslySetInnerHTML={{
                  __html: highlightTags(thought.text),
                }}
              />

              <div className="flex items-center justify-between mt-2">
                {/* Tags as pills */}
                <div className="flex gap-1 flex-wrap">
                  {thought.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-700 text-gray-300 rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Time + delete */}
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
