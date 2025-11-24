// src/components/ActionBar.jsx
import React from "react";

export default function ActionBar({ actions = [] }) {
  return (
    <div className="flex items-center gap-3 flex-wrap mt-4">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={action.onClick}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm
            transition-all border bg-[#111722] border-[#232937]
            hover:bg-[#1b2333] hover:border-[#334155]
            active:scale-[0.98] text-white
            ${action.variant === "primary" ? "bg-blue-600 border-blue-500 hover:bg-blue-700" : ""}
          `}
        >
          {action.icon && <action.icon size={14} className="opacity-80" />}
          {action.label}
        </button>
      ))}
    </div>
  );
}
