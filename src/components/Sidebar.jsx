import React from "react";
import {
  FiHome,
  FiRepeat,
  FiType,
  FiSearch,
  FiTrendingUp,
  FiLink,
  FiUsers,
  FiLayers,
  FiCopy,
  FiEye,
  FiSettings,
} from "react-icons/fi";

const pages = [
  { id: "Dashboard", label: "Dashboard", icon: <FiHome /> },
  { id: "AiRewrite", label: "AI Rewrite", icon: <FiRepeat /> },
  { id: "GrammarFixer", label: "Grammar Fixer", icon: <FiType /> },
  { id: "KeywordResearch", label: "Keyword Research", icon: <FiSearch /> },
  { id: "SeoAnalyzer", label: "SEO Analyzer", icon: <FiTrendingUp /> },
  { id: "BacklinkChecker", label: "Backlink Checker", icon: <FiLink /> },
  { id: "CompetitorAnalysis", label: "Competitor Analysis", icon: <FiUsers /> },
  { id: "ContentGap", label: "Content Gap", icon: <FiLayers /> },
  { id: "PlagiarismChecker", label: "Plagiarism Checker", icon: <FiCopy /> },
  { id: "SERPPreview", label: "SERP Preview", icon: <FiEye /> },
  { id: "Settings", label: "Settings", icon: <FiSettings /> },
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="w-64 bg-[#0F172A] border-r border-white/10 h-full flex flex-col relative overflow-hidden">
      {/* Sidebar Header */}
      <div className="px-6 py-5 text-xl font-bold text-white/90 tracking-wide">
        Tools
      </div>

      {/* Glow highlight bar */}
      <div className="absolute left-0 w-full h-10 pointer-events-none">
        <div
          className="absolute left-0 h-10 w-full bg-indigo-500/20 blur-xl transition-all duration-300"
          style={{
            top:
              80 +
              pages.findIndex((p) => p.id === currentPage) * 42 +
              "px",
          }}
        ></div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-2">
        {pages.map((page, index) => {
          const active = page.id === currentPage;

          return (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`
                flex items-center gap-3 w-full px-4 py-2.5 rounded-lg mb-1
                text-sm font-medium transition-all duration-200
                ${
                  active
                    ? "text-white bg-indigo-600/80 shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }
              `}
              style={{
                position: "relative",
                zIndex: 10,
              }}
            >
              <span className="text-lg">{page.icon}</span>
              {page.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
