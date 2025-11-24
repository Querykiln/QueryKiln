// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import AiRewrite from "./pages/AiRewrite";
import GrammarFixer from "./pages/GrammarFixer";
import KeywordResearch from "./pages/KeywordResearch";
import SeoAnalyzer from "./pages/SeoAnalyzer";
import BacklinkChecker from "./pages/BacklinkChecker";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import ContentGap from "./pages/ContentGap";
import PlagiarismChecker from "./pages/PlagiarismChecker";
import SERPPreview from "./pages/SERPPreview";
import Settings from "./pages/Settings";

// Updater
import UpdateModal from "./components/UpdateModal";
import useUpdater from "./hooks/useUpdater";

// Debug
import { DebugProvider } from "./context/DebugContext";
import DebugPanel from "./components/DebugPanel";

export default function App() {
  // Updater hook
  const {
    updateAvailable,
    remoteVersion,
    downloadProgress,
    downloaded,
    checking,
    checkForUpdates,
    startDownload,
    installUpdate,
  } = useUpdater();

  // Update Modal State
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (updateAvailable) setUpdateModalOpen(true);
  }, [updateAvailable]);

  const openUpdateModal = () => setUpdateModalOpen(true);
  const closeUpdateModal = () => setUpdateModalOpen(false);

  return (
    <DebugProvider>
      {/* Debug Panel */}
      <DebugPanel />

      {/* Floating debug toggle button */}
      <button
        onClick={() => {
          const evt = new CustomEvent("debug-open");
          window.dispatchEvent(evt);
        }}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          padding: "10px 20px",
          background: "#0f0",
          color: "#000",
          zIndex: 999999,
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        DEBUG
      </button>

      {/* App Layout */}
      <Layout
        openUpdateModal={openUpdateModal}
        checkForUpdates={checkForUpdates}
        updateAvailable={updateAvailable}
        checking={checking}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rewrite" element={<AiRewrite />} />
          <Route path="/grammar" element={<GrammarFixer />} />
          <Route path="/keywords" element={<KeywordResearch />} />
          <Route path="/seo" element={<SeoAnalyzer />} />
          <Route path="/backlinks" element={<BacklinkChecker />} />
          <Route path="/competitors" element={<CompetitorAnalysis />} />
          <Route path="/gap" element={<ContentGap />} />
          <Route path="/plagiarism" element={<PlagiarismChecker />} />
          <Route path="/serp" element={<SERPPreview />} />
          <Route path="/settings" element={<Settings />} />

          {/* fallback */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>

      <UpdateModal
        open={updateModalOpen}
        updateAvailable={updateAvailable}
        remoteVersion={remoteVersion}
        downloadProgress={downloadProgress}
        downloaded={downloaded}
        checking={checking}
        onClose={closeUpdateModal}
        onDownload={startDownload}
        onInstall={installUpdate}
      />
    </DebugProvider>
  );
}
