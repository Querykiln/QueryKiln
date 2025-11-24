// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

// Custom toast context (for window.__toast helpers)
import { ToastProvider, useToast } from "./components/ToastProvider.jsx";

// react-hot-toast (for all toast.* used in pages)
import { Toaster } from "react-hot-toast";

function ToastInitializer() {
  const { showToast } = useToast();

  if (!window.__toast) {
    window.__toast = {
      show: (msg, type = "info") => showToast(msg, type),
      success: (msg) => showToast(msg, "success"),
      error: (msg) => showToast(msg, "error"),
      warning: (msg) => showToast(msg, "warning"),
      info: (msg) => showToast(msg, "info"),
    };

    window.toast = (msg, type = "info") => showToast(msg, type);

    console.log("%cToast helpers ready!", "color: #4ade80; font-weight: bold;");
  }

  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    {/* The missing React Router wrapper! */}
    <HashRouter>

      <ToastProvider>
        <ToastInitializer />

        <App />

        <Toaster
          position="top-right"
          containerClassName="toaster"
        />
      </ToastProvider>

    </HashRouter>
  </React.StrictMode>
);
