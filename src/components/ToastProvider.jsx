// src/components/ToastProvider.jsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import {
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiXCircle,
} from "react-icons/fi";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // NEW: showToast can accept a progress value
  const showToast = useCallback(
    (message, type = "info", duration = 3500, progress = null) => {
      const id = Date.now();

      setToasts((prev) => [
        ...prev,
        { id, message, type, progress, visible: true },
      ]);

      if (!progress) {
        // Timed dismissal for simple toasts
        setTimeout(() => {
          setToasts((prev) =>
            prev.map((t) =>
              t.id === id ? { ...t, visible: false } : t
            )
          );

          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, 300);
        }, duration);
      }
    },
    []
  );

  // NEW: update progress dynamically
  const updateProgress = useCallback((id, value) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, progress: value } : t
      )
    );
  }, []);

  const iconFor = (type) => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-300 text-lg" />;
      case "error":
        return <FiXCircle className="text-red-300 text-lg" />;
      case "warning":
        return <FiAlertTriangle className="text-yellow-300 text-lg" />;
      default:
        return <FiInfo className="text-blue-300 text-lg" />;
    }
  };

  const bgFor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600/80";
      case "error":
        return "bg-red-600/80";
      case "warning":
        return "bg-yellow-500/80 text-black";
      default:
        return "bg-white/10";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, updateProgress }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex flex-col gap-2 px-4 py-3 rounded-xl shadow-xl
              backdrop-blur-xl border border-white/10 text-sm font-medium
              transform transition-all duration-300 w-80
              ${bgFor(toast.type)}
              ${toast.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"}
            `}
          >
            <div className="flex items-center gap-3">
              {iconFor(toast.type)}
              <span>{toast.message}</span>
            </div>

            {/* PROGRESS BAR */}
            {toast.progress !== null && (
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all duration-150"
                  style={{ width: `${toast.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
