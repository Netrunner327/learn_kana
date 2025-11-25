"use client";

import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-6 right-6 z-40 flex gap-2 rounded-full p-1 shadow-lg border-2" style={{
      backgroundColor: 'var(--ctp-surface0)',
      borderColor: 'var(--ctp-surface2)'
    }}>
        <button
        onClick={() => setTheme("system")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          theme === "system"
            ? "shadow-md"
            : ""
        }`}
        style={{
          backgroundColor: theme === "system" ? 'var(--ctp-blue)' : 'transparent',
          color: theme === "system" ? 'var(--ctp-base)' : 'var(--ctp-text)',
        }}
        aria-label="System mode"
      >
        💻
      </button>
      
      <button
        onClick={() => setTheme("light")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          theme === "light"
            ? "shadow-md"
            : ""
        }`}
        style={{
          backgroundColor: theme === "light" ? 'var(--ctp-blue)' : 'transparent',
          color: theme === "light" ? 'var(--ctp-base)' : 'var(--ctp-text)',
        }}
        aria-label="Light mode"
      >
        ☀️
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          theme === "dark"
            ? "shadow-md"
            : ""
        }`}
        style={{
          backgroundColor: theme === "dark" ? 'var(--ctp-blue)' : 'transparent',
          color: theme === "dark" ? 'var(--ctp-base)' : 'var(--ctp-text)',
        }}
        aria-label="Dark mode"
      >
        🌙
      </button>
    </div>
  );
}
