import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

export default function CommandPalette({ isOpen, close, pages, setCurrentPage }) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setHighlight(0);
      return;
    }

    const handler = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") {
        setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        setHighlight((h) => Math.max(h - 1, 0));
      }
      if (e.key === "Enter") {
        const chosen = filtered[highlight];
        if (chosen) {
          setCurrentPage(chosen.id);
          close();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, highlight]);

  const filtered = pages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0F172A]/80 rounded-2xl shadow-2xl border border-white/10 p-4">
        
        {/* Search Input */}
        <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-white/10 rounded-xl">
          <FiSearch className="text-white/60 text-lg" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white outline-none text-sm"
            placeholder="Search tools..."
          />
        </div>

        {/* Results */}
        <div className="flex flex-col max-h-80 overflow-y-auto">
          {filtered.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentPage(p.id);
                close();
              }}
              className={`
                text-left px-4 py-2 rounded-lg mb-1 transition-all duration-150
                ${
                  i === highlight
                    ? "bg-indigo-600/80 text-white shadow"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }
              `}
            >
              {p.label}
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-gray-400 text-sm px-4 py-4 text-center">
              No matches found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
