// src/pages/SeoTool.jsx
import React, { useState } from "react";
import { jsPDF } from "jspdf";

// --- Utilities ---
const getWordFrequency = (text) => {
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/);

  const freq = {};
  words.forEach((w) => {
    if (!w) return;
    freq[w] = (freq[w] || 0) + 1;
  });
  return freq;
};

const fakePlagiarismCheck = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 25) + 5;
      resolve({
        score,
        message: score > 20 ? "High similarity" : "Low similarity",
      });
    }, 800);
  });
};

export default function SeoTool() {
  const [input, setInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [seoScore, setSeoScore] = useState(null);
  const [readability, setReadability] = useState(null);
  const [wordDensity, setWordDensity] = useState([]);
  const [cloud, setCloud] = useState([]);
  const [plagiarism, setPlagiarism] = useState(null);
  const [loadingPlagiarism, setLoadingPlagiarism] = useState(false);

  // --- Keyword Extraction ---
  const extractKeywords = () => {
    const words = input
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4);

    const freq = {};
    words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((w) => w[0]);

    setKeywords(sorted);
  };

  // --- SEO Score ---
  const generateSeoScore = () => {
    let score = 0;

    if (input.length > 300) score += 20;
    if (keywords.length >= 5) score += 20;
    if (input.includes(".")) score += 20;
    if (input.split(" ").length > 150) score += 20;

    score += Math.min(
      20,
      input.split(/\s+/).filter((w) => w.length > 6).length
    );

    setSeoScore(score);
  };

  // --- Readability ---
  const calculateReadability = () => {
    const words = input.split(/\s+/).length;
    const sentences = input.split(".").length;
    const syllables = input.replace(/[^aeiou]/gi, "").length;

    const score =
      206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

    setReadability(Math.max(0, Math.min(100, Math.floor(score))));
  };

  // --- Word Density ---
  const calculateWordDensity = () => {
    const words = input.toLowerCase().split(/\s+/);
    const total = words.length;

    const freq = {};
    words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));

    const sorted = Object.entries(freq).map(([word, count]) => ({
      word,
      percent: ((count / total) * 100).toFixed(2),
    }));

    setWordDensity(sorted.slice(0, 20));
  };

  // --- Word Cloud ---
  const generateWordCloud = () => {
    const freq = getWordFrequency(input);
    const cloudArray = Object.entries(freq).map(([word, count]) => ({
      word,
      size: 14 + count * 3,
    }));
    setCloud(cloudArray.slice(0, 30));
  };

  // --- Plagiarism ---
  const runPlagiarismCheck = async () => {
    setLoadingPlagiarism(true);
    const result = await fakePlagiarismCheck(input);
    setPlagiarism(result);
    setLoadingPlagiarism(false);
  };

  // --- Export PDF ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("SEO Report", 10, 10);
    doc.text(`Keywords: ${keywords.join(", ")}`, 10, 20);
    doc.text(`SEO Score: ${seoScore}`, 10, 30);
    doc.text(`Readability: ${readability}`, 10, 40);
    doc.text(`Plagiarism: ${plagiarism?.score}%`, 10, 50);
    doc.save("seo-report.pdf");
  };

  return (
    <div className="p-10 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 tracking-tight">
        🚀 SEO Optimization Dashboard
      </h1>

      {/* ==== TEXT INPUT ==== */}
      <textarea
        className="w-full h-52 p-5 rounded-xl bg-white/60 dark:bg-gray-900/50 border border-gray-300/50 dark:border-gray-700 backdrop-blur-xl shadow-lg"
        placeholder="Paste your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* ==== BUTTON GRID ==== */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <button onClick={extractKeywords} className="btn-primary">Keywords</button>
        <button onClick={generateSeoScore} className="btn-primary">SEO Score</button>
        <button onClick={calculateReadability} className="btn-primary">Readability</button>
        <button onClick={calculateWordDensity} className="btn-primary">Word Density</button>
        <button onClick={generateWordCloud} className="btn-primary">Word Cloud</button>

        <button
          onClick={runPlagiarismCheck}
          className="btn-primary bg-red-600 hover:bg-red-700"
        >
          {loadingPlagiarism ? "Checking..." : "Plagiarism"}
        </button>
      </div>

      {/* ==== DASHBOARD GRID ==== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

        {/* Score Card */}
        <div className="dash-tile">
          <p className="tile-label">SEO Score</p>
          <p className="tile-value">{seoScore ?? "—"}</p>
        </div>

        <div className="dash-tile">
          <p className="tile-label">Readability</p>
          <p className="tile-value">{readability ?? "—"}</p>
        </div>

        <div className="dash-tile">
          <p className="tile-label">Keywords</p>
          <p className="tile-value">{keywords.length}</p>
        </div>

        <div className="dash-tile">
          <p className="tile-label">Density Terms</p>
          <p className="tile-value">{wordDensity.length}</p>
        </div>

      </div>

      {/* ==== RESULTS ==== */}
      <div className="mt-10 space-y-10">

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="result-card">
            <h2 className="result-title">Top Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span key={k} className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-medium">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Word Density */}
        {wordDensity.length > 0 && (
          <div className="result-card">
            <h2 className="result-title">Word Density</h2>
            <ul className="space-y-1">
              {wordDensity.map((w) => (
                <li key={w.word} className="text-sm">
                  <span className="font-semibold">{w.word}</span> — {w.percent}%
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Word Cloud */}
        {cloud.length > 0 && (
          <div className="result-card">
            <h2 className="result-title">Word Cloud</h2>
            <div className="flex flex-wrap gap-3">
              {cloud.map((c) => (
                <span
                  key={c.word}
                  style={{ fontSize: c.size }}
                  className="font-bold"
                >
                  {c.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Plagiarism */}
        {plagiarism && (
          <div className="result-card bg-red-100 dark:bg-red-900/40">
            <h2 className="result-title">Plagiarism Check</h2>
            <p className="text-lg font-bold">{plagiarism.score}% similarity</p>
            <p>{plagiarism.message}</p>
          </div>
        )}
      </div>

      {/* Export PDF */}
      <button
        className="mt-10 w-full py-4 rounded-xl bg-gray-900 text-white hover:bg-black shadow-lg transition"
        onClick={exportPDF}
      >
        Export SEO Report as PDF
      </button>
    </div>
  );
}
