// src/components/ProfileMenu.jsx
import { useEffect, useRef } from "react";
import { FiSettings, FiInfo, FiRefreshCw } from "react-icons/fi";

export default function ProfileMenu({
  onClose,
  onOpenSettings,
  onOpenAbout,
  onCheckUpdates,
  version,
}) {
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Close on ESC
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="
        absolute top-14 right-4
        w-56 bg-[#0F141C] border border-[#1e2533]
        rounded-xl shadow-xl py-2 z-50
        animate-fadeIn
      "
      style={{ animation: "fadeIn 0.18s ease-out" }}
    >
      {/* SETTINGS */}
      <button
        onClick={onOpenSettings}
        className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#131922]"
      >
        <FiSettings className="text-gray-300" /> Settings
      </button>

      {/* CHECK FOR UPDATES */}
      <button
        onClick={onCheckUpdates}
        className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#131922]"
      >
        <FiRefreshCw className="text-gray-300" /> Check for Updates
      </button>

      {/* ABOUT */}
      <button
        onClick={onOpenAbout}
        className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#131922]"
      >
        <FiInfo className="text-gray-300" /> About QueryKiln
      </button>

      <div className="border-t border-[#1e2533] mt-2 pt-2 px-4 text-xs text-gray-400">
        Version {version || "0.0.0"}
      </div>
    </div>
  );
}
