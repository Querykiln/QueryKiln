// src/components/UpdateModal.jsx
import React from "react";

export default function UpdateModal({
  open,
  updateAvailable,
  remoteVersion,
  downloadProgress,
  downloaded,
  checking,
  onClose,
  onDownload,
  onInstall,
}) {
  if (!open) return null;

  // Status text
  let message = "";
  if (checking) message = "Checking for updates…";
  else if (updateAvailable && !downloadProgress && !downloaded)
    message = `Update available (v${remoteVersion}). Click “Download Update” to begin.`;
  else if (downloadProgress && !downloaded)
    message = `Downloading update… ${downloadProgress.toFixed(0)}%`;
  else if (downloaded)
    message = "Update downloaded. Ready to install.";
  else message = "Your app is up to date.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0f1a2e] border border-white/10 rounded-xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-4">
          Software Update
        </h2>

        <p className="text-gray-300 mb-6">{message}</p>

        {/* DOWNLOAD PROGRESS BAR */}
        {downloadProgress && !downloaded && (
          <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="h-2 bg-yellow-400 transition-all duration-200"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex justify-end gap-3">

          {/* DOWNLOAD BUTTON */}
          {updateAvailable && !downloadProgress && !downloaded && (
            <button
              onClick={onDownload}
              className="
                px-4 py-2 rounded-lg
                bg-yellow-500 hover:bg-yellow-600
                text-black font-medium transition
              "
            >
              Download Update
            </button>
          )}

          {/* INSTALL BUTTON */}
          {downloaded && (
            <button
              onClick={onInstall}
              className="
                px-4 py-2 rounded-lg
                bg-green-500 hover:bg-green-600
                text-black font-medium transition
              "
            >
              Install & Restart
            </button>
          )}

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg
              bg-white/10 hover:bg-white/20
              text-white font-medium transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
