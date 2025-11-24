// src/components/DarkModeToggle.jsx
import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // Apply theme to <html>
  useEffect(() => {
    const html = document.documentElement;

    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 transition shadow-sm"
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <FiSun className="text-yellow-400 text-xl" />
      ) : (
        <FiMoon className="text-zinc-700 dark:text-zinc-300 text-xl" />
      )}
    </button>
  );
}
