// src/components/AboutModal.jsx
export default function AboutModal({ onClose }) {
  const appVersion = window.api?.appVersion || "0.0.0";

  return (
    <div
      className="
        fixed inset-0 bg-black/60 flex items-center justify-center
        z-[999] animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="
          bg-[#0F141C] border border-[#1e2533]
          rounded-2xl p-8 w-[420px]
          shadow-xl relative
          animate-scaleIn
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flame Icon */}
        <div className="text-center text-5xl mb-4">🔥</div>

        {/* NAME */}
        <h1 className="text-center text-2xl font-semibold mb-2">
          QueryKiln
        </h1>

        {/* VERSION */}
        <p className="text-center text-gray-400 mb-4">
          Version {appVersion}
        </p>

        {/* DESCRIPTION */}
        <p className="text-gray-300 text-sm leading-relaxed text-center mb-6">
          QueryKiln is an AI-powered SEO and content intelligence toolkit,
          built for creators, marketers, and professionals.
        </p>

        {/* BUTTON */}
        <button
          onClick={onClose}
          className="
            w-full py-2 rounded-lg
            bg-blue-600 hover:bg-blue-700
            transition text-white
          "
        >
          Close
        </button>
      </div>
    </div>
  );
}
