// src/components/UpdaterPanel.jsx
import React from "react";
import useUpdater from "./useUpdater.js";

export default function UpdaterPanel({ status, onCheck }) {
  const statusMap = {
    idle: "Check for updates",
    checking: "Checking for updates…",
    available: "Update available — downloading…",
    downloading: "Downloading update…",
    downloaded: "Update ready — restart app",
    "not-available": "You're on the latest version",
    error: "Could not check for updates",
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-1">Software Updates</h2>
      <p className="text-sm text-zinc-600 mb-4">
        {statusMap[status] || "Status unknown"}
      </p>

      <button
        onClick={onCheck}
        className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition"
      >
        Check for Updates
      </button>
    </div>
  );
}
