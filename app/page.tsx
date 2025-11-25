"use client";

import { useState, useEffect } from "react";
import Tutorial from "./components/Tutorial";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the tutorial before
    const tutorialDismissed = localStorage.getItem("tutorialDismissed");
    if (!tutorialDismissed) {
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem("tutorialDismissed", "true");
    }
    setShowTutorial(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'var(--ctp-base)' }}>
      <ThemeToggle />
      {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
      
      <main className="flex flex-col items-center justify-center gap-12 px-8 py-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold" style={{ color: 'var(--ctp-text)' }}>
            かな を まなぶ
          </h1>
          <p className="text-2xl" style={{ color: 'var(--ctp-subtext0)' }}>
            Learn Kana
          </p>
          <p className="text-sm max-w-md" style={{ color: 'var(--ctp-subtext1)' }}>
            Master Japanese Hiragana and Katakana characters through interactive exercises
          </p>
        </div>

        {/* Main Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Learn to Read Kana - Active */}
          <button
            onClick={() => {
              // TODO: Navigate to reading practice
              alert("Reading practice coming soon!");
            }}
            className="group relative overflow-hidden rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2"
            style={{
              backgroundColor: 'var(--ctp-surface0)',
              borderColor: 'var(--ctp-blue)'
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50 group-hover:opacity-70 transition-opacity" style={{ backgroundColor: 'var(--ctp-blue)', opacity: 0.2 }} />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="text-6xl">📖</div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--ctp-text)' }}>
                Learn to Read Kana
              </h2>
              <p className="text-center" style={{ color: 'var(--ctp-subtext0)' }}>
                Practice recognizing Hiragana and Katakana characters
              </p>
              <div className="mt-4 px-6 py-2 rounded-full font-semibold group-hover:opacity-90 transition-all" style={{
                backgroundColor: 'var(--ctp-blue)',
                color: 'var(--ctp-base)'
              }}>
                Start Learning
              </div>
            </div>
          </button>

          {/* Learn to Write Kana - Disabled */}
          <div className="group relative overflow-hidden rounded-2xl p-8 shadow-lg border-2 opacity-60 cursor-not-allowed" style={{
            backgroundColor: 'var(--ctp-surface1)',
            borderColor: 'var(--ctp-surface2)'
          }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50" style={{ backgroundColor: 'var(--ctp-overlay0)', opacity: 0.2 }} />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="text-6xl grayscale">✍️</div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--ctp-overlay1)' }}>
                Learn to Write Kana
              </h2>
              <p className="text-center" style={{ color: 'var(--ctp-overlay0)' }}>
                Practice writing Japanese characters with stroke order
              </p>
              <div className="mt-4 px-6 py-2 rounded-full font-semibold" style={{
                backgroundColor: 'var(--ctp-surface2)',
                color: 'var(--ctp-overlay0)'
              }}>
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Show Tutorial Button */}
        <button
          onClick={() => setShowTutorial(true)}
          className="text-sm underline transition-colors hover:opacity-80"
          style={{ color: 'var(--ctp-blue)' }}
        >
          Show Tutorial Again
        </button>
      </main>
    </div>
  );
}
