import React, { useEffect } from "react";

const Toast = ({ message, type = "error", onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-500 to-emerald-600",
          icon: "✓",
          iconBg: "bg-green-600",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-rose-600",
          icon: "✕",
          iconBg: "bg-red-600",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-500 to-orange-600",
          icon: "⚠",
          iconBg: "bg-amber-600",
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
          icon: "ℹ",
          iconBg: "bg-blue-600",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500 to-slate-600",
          icon: "•",
          iconBg: "bg-gray-600",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slideInRight">
      <div className={`${styles.bg} text-white rounded-2xl shadow-2xl p-4 pr-12 min-w-[300px] max-w-md`}>
        <div className="flex items-start gap-3">
          <div className={`${styles.iconBg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold shadow-lg`}>
            {styles.icon}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-sm font-semibold leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
