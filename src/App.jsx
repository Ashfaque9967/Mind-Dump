import { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [thoughts, setThoughts] = useState([]);

  function handleInputChange(event) {
    setInputText(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && inputText.trim() !== "") {
      addThought();
    }
  }

  function addThought() {
    const newThought = {
      id: Date.now(),
      text: inputText.trim(),
      createdAt: new Date().toLocaleTimeString(),
    };

    setThoughts([newThought, ...thoughts]);

    setInputText("");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-1">🧠 MindDump</h1>
        <p className="text-gray-400 text-sm mb-6">
          Press Enter to save a thought
        </p>

        {/* Input box */}
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? Use #tags"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 text-base"
        />

        {/* Thought count */}
        <p className="text-gray-500 text-xs mt-3 mb-4">
          {thoughts.length} thought{thoughts.length !== 1 ? "s" : ""} captured
        </p>

        {/* List of thoughts */}
        <div className="flex flex-col gap-3">
          {thoughts.map((thought) => (
            <div
              key={thought.id}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
            >
              <p className="text-white text-sm">{thought.text}</p>
              <p className="text-gray-500 text-xs mt-1">{thought.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
