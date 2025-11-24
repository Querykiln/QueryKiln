// src/hooks/useUpdater.js
import { useState } from "react";
import { useToast } from "../components/ToastProvider";

export default function useUpdater() {
  const { showToast, updateProgress } = useToast();

  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  // Hold toast ID for progress
  const [progressToastId, setProgressToastId] = useState(null);

  const checkForUpdates = async () => {
    setChecking(true);
    showToast("Checking for updates…", "info");

    const result = await window.api.checkForUpdates();

    if (result?.available) {
      showToast("Update available!", "success");
      setUpdateAvailable(true);
      setRemoteVersion(result.version);
    } else {
      showToast("You are up to date!", "success");
    }

    setChecking(false);
  };

  const startDownload = () => {
    // Create persistent toast
    const id = Date.now();
    setProgressToastId(id);

    showToast("Downloading update…", "info", 999999, 0);

    window.api.startDownload((progress) => {
      updateProgress(id, progress);
    });

    window.api.onDownloadComplete(() => {
      updateProgress(id, 100);
      setDownloaded(true);

      setTimeout(() => {
        showToast("Update ready to install!", "success");
      }, 300);
    });
  };

  const installUpdate = () => {
    showToast("Installing update…", "warning");
    window.api.installUpdate();
  };

  return {
    checking,
    updateAvailable,
    remoteVersion,
    downloaded,
    checkForUpdates,
    startDownload,
    installUpdate,
  };
}
