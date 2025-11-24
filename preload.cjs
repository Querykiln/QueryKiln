/**
 * QueryKiln — Preload (Version C: no HMAC)
 * -----------------------------------------
 * Exposes:
 *  - validateLicense
 *  - loadSavedLicense
 *  - clearSavedLicense
 *  - getUsage
 *  - sendSecureRequest (no HMAC, but name unchanged)
 *  - updater
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  /* --------------------------
     Licensing
  --------------------------- */
  validateLicense: (key) => ipcRenderer.invoke("validate-license", key),
  loadSavedLicense: () => ipcRenderer.invoke("load-saved-license"),
  clearSavedLicense: () => ipcRenderer.invoke("clear-saved-license"),

  /* --------------------------
     Usage (Spark limits)
  --------------------------- */
  getUsage: () => ipcRenderer.invoke("get-usage"),

  /* --------------------------
     Worker request
     (no HMAC anymore)
  --------------------------- */
  sendSecureRequest: async (endpoint, payload) => {
    const start = performance.now();
    let result;

    try {
      result = await ipcRenderer.invoke("secure-request", endpoint, payload);
    } catch (err) {
      result = { success: false, error: err.message };
    }

    const end = performance.now();

    window.dispatchEvent(
      new CustomEvent("debug-log", {
        detail: {
          endpoint,
          payload,
          response: result,
          status: result?.error ? "error" : "ok",
          timestamp: new Date().toISOString(),
          duration: Math.round(end - start),
        },
      })
    );

    return result;
  },

  /* --------------------------
     Auto-updater
  --------------------------- */
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  startUpdateDownload: () => ipcRenderer.invoke("start-update-download"),
  quitAndInstall: () => ipcRenderer.invoke("quit-and-install"),

  onUpdateAvailable: (cb) =>
    ipcRenderer.on("update-available", (_, data) => cb(data)),

  onUpdateProgress: (cb) =>
    ipcRenderer.on("update-progress", (_, data) => cb(data)),

  onUpdateDownloaded: (cb) =>
    ipcRenderer.on("update-downloaded", (_, info) => cb(info)),
});
