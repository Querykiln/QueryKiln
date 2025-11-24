//
// SAFE store.js — works in Vite without Node APIs
// Uses the preload "storage" API exposed with contextBridge
//

export function saveState(key, value) {
  try {
    window.storage?.save(key, value);
  } catch (err) {
    console.error("saveState error:", err);
  }
}

export function loadState(key, fallback = "") {
  try {
    return window.storage?.load(key, fallback) ?? fallback;
  } catch (err) {
    console.error("loadState error:", err);
    return fallback;
  }
}

export function clearState(key) {
  try {
    window.storage?.clear(key);
  } catch (err) {
    console.error("clearState error:", err);
  }
}
