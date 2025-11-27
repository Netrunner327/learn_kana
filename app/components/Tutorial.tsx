"use client";

import { useState } from "react";

interface TutorialProps {
  onClose: (dontShowAgain: boolean) => void;
}

export default function Tutorial({ onClose }: TutorialProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4" style={{ backgroundColor: 'var(--ctp-crust)', opacity: 0.95 }}>
      <div className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border" style={{
        backgroundColor: 'var(--ctp-base)',
        borderColor: 'var(--ctp-surface0)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r p-6 rounded-t-2xl" style={{
          backgroundImage: 'linear-gradient(to right, var(--ctp-blue), var(--ctp-mauve))'
        }}>
          <h2 className="text-3xl font-bold text-center" style={{ color: 'var(--ctp-base)' }}>
            Welcome to Learn Kana! 🎌
          </h2>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{
                backgroundColor: 'var(--ctp-blue)',
                color: 'var(--ctp-base)',
                opacity: 0.9
              }}>
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--ctp-text)' }}>
                  Choose Your Learning Mode
                </h3>
                <p style={{ color: 'var(--ctp-subtext0)' }}>
                  Start with <strong style={{ color: 'var(--ctp-blue)' }}>Learn to Read Kana</strong> to practice recognizing Hiragana and Katakana characters. 
                  Then use the  <strong style={{ color: 'var(--ctp-blue)' }}>Learn to Write Kana</strong> section to practice stroke order of Hiragana and Katakana.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{
                backgroundColor: 'var(--ctp-mauve)',
                color: 'var(--ctp-base)',
                opacity: 0.9
              }}>
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--ctp-text)' }}>
                  Practice Makes Perfect
                </h3>
                <p style={{ color: 'var(--ctp-subtext0)' }}>
                  You'll be shown Japanese characters and need to identify their pronunciation. 
                  Take your time and learn at your own pace.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{
                backgroundColor: 'var(--ctp-green)',
                color: 'var(--ctp-base)',
                opacity: 0.9
              }}>
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--ctp-text)' }}>
                  Track Your Progress
                </h3>
                <p style={{ color: 'var(--ctp-subtext0)' }}>
                  Monitor your learning journey and review characters you find challenging. 
                  Consistency is key to mastering Kana!
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="border-l-4 p-4 rounded relative overflow-hidden" style={{
            borderColor: 'var(--ctp-blue)'
          }}>
            <div className="absolute inset-0" style={{
              backgroundColor: 'var(--ctp-blue)',
              opacity: 0.1
            }}></div>
            <p className="text-sm relative z-10" style={{ color: 'var(--ctp-text)' }}>
              <strong>💡 Tip:</strong> Japanese has two phonetic writing systems: 
              <strong style={{ color: 'var(--ctp-blue)' }}> Hiragana</strong> (ひらがな) for native words and 
              <strong style={{ color: 'var(--ctp-mauve)' }}> Katakana</strong> (カタカナ) for foreign words. 
              Master both to read Japanese!
            </p>
          </div>

          {/* Don't Show Again Checkbox */}
          <div className="flex items-center gap-3 pt-4">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--ctp-blue)' }}
            />
            <label
              htmlFor="dontShowAgain"
              className="cursor-pointer select-none"
              style={{ color: 'var(--ctp-subtext0)' }}
            >
              Don't show this tutorial again
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 rounded-b-2xl flex justify-end border-t" style={{
          backgroundColor: 'var(--ctp-mantle)',
          borderColor: 'var(--ctp-surface0)'
        }}>
          <button
            onClick={() => onClose(dontShowAgain)}
            className="px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:opacity-90"
            style={{
              backgroundColor: 'var(--ctp-blue)',
              color: 'var(--ctp-base)'
            }}
          >
            Get Started! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
