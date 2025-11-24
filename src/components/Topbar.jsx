// src/components/Topbar.jsx
import { useState } from "react";
import { FiBell } from "react-icons/fi";
import ProfileMenu from "./ProfileMenu";
import AboutModal from "./AboutModal";

export default function Topbar({
  openUpdateModal,
  updateAvailable,
  checking,
  checkForUpdates,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const appVersion = window.api?.appVersion || "0.0.0";

  return (
    <>
      <div className="h-14 flex items-center justify-between px-6 border-b border-[#151A22] bg-[#0B0F17] relative">
        {/* LEFT: Title space reserved by layout – leaving blank for symmetry */}
        <div></div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">

          {/* UPDATE DOT */}
          {updateAvailable && (
            <div
              onClick={openUpdateModal}
              className="relative cursor-pointer"
            >
              <FiBell className="text-blue-400 text-xl animate-pulse" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full"></span>
            </div>
          )}

          {/* AVATAR BUTTON */}
          <button
            className="
              h-9 w-9 rounded-full bg-[#131922]
              border border-[#1e2533]
              flex items-center justify-center
              hover:bg-[#1a2030]
              transition relative
            "
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {/* Flame Icon */}
            <div className="text-blue-400 text-lg">
              🔥
            </div>
          </button>

          {/* PROFILE MENU */}
          {menuOpen && (
            <ProfileMenu
              onClose={() => setMenuOpen(false)}
              onOpenSettings={() => {
                window.__globalSetPage("Settings");
                setMenuOpen(false);
              }}
              onCheckUpdates={() => {
                checkForUpdates();
                setMenuOpen(false);
              }}
              onOpenAbout={() => {
                setAboutOpen(true);
                setMenuOpen(false);
              }}
              version={appVersion}
            />
          )}
        </div>
      </div>

      {/* ABOUT MODAL */}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </>
  );
}
