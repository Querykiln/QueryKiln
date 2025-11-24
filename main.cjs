/**
 * QueryKiln — Electron Main (Version C: No HMAC)
 * ------------------------------------------------
 * - License validation via Cloudflare Worker
 * - Tier + usage fetching
 * - Simple worker request handling
 * - Auto updater
 */

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const Store = require("electron-store");

/* --------------------------------------------------
   CONFIG
-------------------------------------------------- */

// Cloudflare Worker root URL
const WORKER_URL = "https://querykiln-api.gerkinonfire.workers.dev";

// Store license
const licenseStore = new Store({
  name: "querykiln-license",
  defaults: { licenseData: null },
});

// Store misc settings (not heavily used but harmless)
const keyStore = new Store({
  name: "querykiln-store",
  defaults: { apiKey: null },
});

/* --------------------------------------------------
   WINDOW CREATION
-------------------------------------------------- */

let win = null;
const DEV_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (DEV_URL) {
    setTimeout(() => {
      win.loadURL(DEV_URL);
      win.show();
    }, 400);
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
    win.show();
  }
}

app.whenReady().then(() => {
  createWindow();
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 1200);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* --------------------------------------------------
   LICENSE VALIDATION (no HMAC)
-------------------------------------------------- */

async function verifyLicenseViaWorker(key) {
  try {
    const res = await fetch(`${WORKER_URL}/verify-license`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-license": key,
      },
      body: JSON.stringify({ license_key: key }),
    });

    const txt = await res.text();
    try {
      return JSON.parse(txt);
    } catch {
      return { valid: false, error: "Invalid JSON from Worker" };
    }
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

ipcMain.handle("validate-license", async (_, key) => {
  if (!key) return { success: false, message: "No license provided" };

  const trimmed = key.trim();

  // Developer mode
  if (trimmed === "D3V-K3Y-1313") {
    const dev = {
      success: true,
      dev: true,
      tier: "Kiln Forge",
      mode: "dev",
      message: "Developer license activated",
      licenseKey: { key: trimmed },
    };
    licenseStore.set("licenseData", dev);
    return dev;
  }

  const result = await verifyLicenseViaWorker(trimmed);

  if (!result.valid) {
    return {
      success: false,
      message: result.error || "Invalid license",
    };
  }

  const payload = {
    success: true,
    message: "License activated",
    tier: result.tier,
    variant_id: result.variant_id,
    mode: result.status,
    renews_at: result.renews_at,
    licenseKey: { key: trimmed },
  };

  licenseStore.set("licenseData", payload);
  return payload;
});

ipcMain.handle("load-saved-license", () => {
  return licenseStore.get("licenseData", null);
});

ipcMain.handle("clear-saved-license", () => {
  licenseStore.set("licenseData", null);
  return { success: true };
});

/* --------------------------------------------------
   USAGE FETCHING (Spark daily limits)
-------------------------------------------------- */

ipcMain.handle("get-usage", async () => {
  const saved = licenseStore.get("licenseData");
  if (!saved || !saved.licenseKey) return { error: "No license loaded" };

  const key = saved.licenseKey.key;

  try {
    const res = await fetch(`${WORKER_URL}/usage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-license": key,
      },
      body: "{}",
    });
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
});

/* --------------------------------------------------
   WORKER REQUEST (no HMAC)
-------------------------------------------------- */

ipcMain.handle("secure-request", async (_, endpoint, payload) => {
  const saved = licenseStore.get("licenseData");
  if (!saved || !saved.licenseKey)
    return { success: false, error: "No license loaded" };

  const licenseKey = saved.licenseKey.key;

  try {
    const res = await fetch(`${WORKER_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-license": licenseKey,
      },
      body: JSON.stringify(payload || {}),
    });

    const txt = await res.text();
    try {
      return JSON.parse(txt);
    } catch {
      return { success: false, error: "Invalid JSON from Worker", raw: txt };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
});

/* --------------------------------------------------
   AUTO-UPDATER
-------------------------------------------------- */

autoUpdater.autoDownload = false;

ipcMain.handle("check-for-updates", async () => {
  try {
    const r = await autoUpdater.checkForUpdates();
    return { success: true, version: r?.updateInfo?.version || null };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle("start-update-download", () => {
  autoUpdater.downloadUpdate();
  return { success: true };
});

ipcMain.handle("quit-and-install", () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on("update-available", (info) =>
  win?.webContents.send("update-available", info)
);
autoUpdater.on("download-progress", (data) =>
  win?.webContents.send("update-progress", data)
);
autoUpdater.on("update-downloaded", (info) =>
  win?.webContents.send("update-downloaded", info)
);
