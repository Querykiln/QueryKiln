// src/components/ActionPalette.jsx
import { useEffect, useState, useRef } from "react";
import {
  FiType,
  FiFeather,
  FiTarget,
  FiSearch,
  FiBarChart2,
  FiTrendingUp,
  FiBookOpen,
  FiLink,
  FiSettings,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";

export default function ActionPalette({
  onClose,
  setCurrentPage,
  runAIAction,
}) {
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // -----------------------------
  // ACTIONS LIST
  // -----------------------------
  const actions = [
    {
      label: "Rewrite selected text",
      icon: <FiFeather />,
      page: "AiRewrite",
      requiresText: true,
      ai: "rewrite",
      shortcut: "R",
    },
    {
      label: "Fix grammar",
      icon: <FiType />,
      page: "GrammarFixer",
      requiresText: true,
      ai: "grammar",
      shortcut: "G",
    },
    {
      label: "Generate keyword ideas",
      icon: <FiSearch />,
      page: "KeywordResearch",
      requiresText: true,
      ai: "keywords",
      shortcut: "K",
    },
    {
      label: "SEO Analyze selected text",
      icon: <FiBarChart2 />,
      page: "SeoAnalyzer",
      requiresText: true,
      ai: "seo",
      shortcut: "A",
    },
    {
      label: "Find backlink ideas",
      icon: <FiLink />,
      page: "BacklinkChecker",
      requiresText: true,
      ai: "backlinks",
      shortcut: "B",
    },
    {
      label: "Competitor analysis",
      icon: <FiTrendingUp />,
      page: "CompetitorAnalysis",
      requiresText: true,
      ai: "competitors",
    },
    {
      label: "Content gap analysis",
      icon: <FiBookOpen />,
      page: "ContentGap",
      requiresText: true,
      ai: "gap",
    },
    {
      label: "Add plag. checker",
      icon: <FiTarget />,
      page: "PlagiarismChecker",
      requiresText: true,
      ai: "plagiarism",
    },
    {
      label: "SERP Preview",
      icon: <FiTrendingUp />,
      page: "SERPPreview",
      requiresText: false,
      ai: null,
    },
    { label: "Open Settings", icon: <FiSettings />, page: "Settings" },
    { label: "About QueryKiln", icon: <FiInfo />, page: "About" },
    {
      label: "Check for Updates",
      icon: <FiRefreshCw />,
      action: "checkUpdates",
    },
  ];

  // -----------------------------
  // FILTERED LIST
  // -----------------------------
  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  // -----------------------------
  // CLOSE ON ESC
  // -----------------------------
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();

      if (e.key === "ArrowDown") {
        setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        setHighlightIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        runAction(filtered[highlightIndex]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [filtered, highlightIndex]);

  // -----------------------------
  // CLICK OUTSIDE TO CLOSE
  // -----------------------------
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 10);
  }, []);

  // -----------------------------
  // RUN ACTION
  // -----------------------------
  async function runAction(action) {
    if (!action) return;

    // Special case: check for updates
    if (action.action === "checkUpdates") {
      window.api.checkForUpdates();
      onClose();
      return;
    }

    // Normal tool actions
    if (action.page) {
      setCurrentPage(action.page);
    }

    // Smart auto-run logic:
    // If tool needs selected text → run AI automatically
    if (action.requiresText) {
      const active = document.activeElement;
      let selectedText = "";

      if (
        active &&
        (active.tagName === "TEXTAREA" || active.tagName === "INPUT")
      ) {
        selectedText = active.value.substring(
          active.selectionStart,
          active.selectionEnd
        );
      }

      if (selectedText.trim().length > 0 && action.ai) {
        runAIAction(action.ai, selectedText);
      }
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div
        ref={panelRef}
        className="
          w-[600px] bg-[#0d1118] border border-[#1f2b3a] rounded-xl
          shadow-2xl shadow-blue-500/30 px-6 py-4
          animate-scaleIn
        "
      >
        {/* SEARCH FIELD */}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like to do?"
          className="
            w-full px-3 py-2 bg-[#11161f] border border-[#1c2533] rounded-lg
            focus:outline-none focus:border-blue-500 text-white mb-3
          "
        />

        {/* ACTION LIST */}
        <div className="max-h-[300px] overflow-y-auto space-y-1">
          {filtered.map((a, idx) => (
            <button
              key={idx}
              onClick={() => runAction(a)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg
                text-left transition
                ${
                  idx === highlightIndex
                    ? "bg-blue-600 text-white"
                    : "bg-[#0F141C] text-gray-300 hover:bg-[#151d28]"
                }
              `}
            >
              <span className="text-xl">{a.icon}</span>
              <span className="flex-1">{a.label}</span>
              {a.shortcut && (
                <span className="text-xs opacity-50">⌘ + {a.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
