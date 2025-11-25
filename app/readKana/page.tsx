"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";

// Hiragana characters
const hiragana = [
  { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
  { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
  { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
  { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
  { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
  { kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' },
  { kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' },
  { kana: 'や', romaji: 'ya' }, { kana: '', romaji: '' }, { kana: 'ゆ', romaji: 'yu' }, { kana: '', romaji: '' }, { kana: 'よ', romaji: 'yo' },
  { kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' },
  { kana: 'わ', romaji: 'wa' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: 'を', romaji: 'wo' },
  { kana: 'ん', romaji: 'n' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' },
];

// Katakana characters
const katakana = [
  { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' },
  { kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' },
  { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' },
  { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' },
  { kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' },
  { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' },
  { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' },
  { kana: 'ヤ', romaji: 'ya' }, { kana: '', romaji: '' }, { kana: 'ユ', romaji: 'yu' }, { kana: '', romaji: '' }, { kana: 'ヨ', romaji: 'yo' },
  { kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' },
  { kana: 'ワ', romaji: 'wa' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: 'ヲ', romaji: 'wo' },
  { kana: 'ン', romaji: 'n' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' },
];

export default function ReadKanaPage() {
  const router = useRouter();
  const [showKanaList, setShowKanaList] = useState(true);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ctp-base)' }}>
      <ThemeToggle />
      
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-6 left-6 z-40 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
        style={{
          backgroundColor: 'var(--ctp-surface0)',
          color: 'var(--ctp-text)',
          border: '2px solid',
          borderColor: 'var(--ctp-surface2)'
        }}
      >
        ← Back to Home
      </button>

      <main className="container mx-auto px-8 py-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--ctp-text)' }}>
            かなをよむ
          </h1>
          <p className="text-xl" style={{ color: 'var(--ctp-subtext0)' }}>
            Learn to Read Kana
          </p>
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowKanaList(!showKanaList)}
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--ctp-blue)',
              color: 'var(--ctp-base)'
            }}
          >
            {showKanaList ? '📖 Hide Kana Chart' : '📖 Show Kana Chart'}
          </button>
        </div>

        {/* Kana Lists */}
        {showKanaList && (
          <div className="space-y-12 max-w-6xl mx-auto">
            {/* Hiragana */}
            <div className="p-6 rounded-2xl" style={{
              backgroundColor: 'var(--ctp-surface0)',
              border: '2px solid',
              borderColor: 'var(--ctp-blue)'
            }}>
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--ctp-blue)' }}>
                ひらがな (Hiragana)
              </h2>
              <div className="grid grid-rows-5 grid-flow-col gap-2 justify-center">
                {hiragana.map((char, index) => (
                  char.kana ? (
                    <div
                      key={index}
                      className="p-3 rounded-lg text-center transition-all hover:scale-105"
                      style={{
                        backgroundColor: 'var(--ctp-base)',
                        border: '1px solid',
                        borderColor: 'var(--ctp-surface2)',
                        minWidth: '60px'
                      }}
                    >
                      <div className="text-2xl mb-0.5" style={{ color: 'var(--ctp-text)' }}>
                        {char.kana}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--ctp-subtext0)' }}>
                        {char.romaji}
                      </div>
                    </div>
                  ) : (
                    <div key={index} style={{ minWidth: '60px' }} />
                  )
                ))}
              </div>
            </div>

            {/* Katakana */}
            <div className="p-6 rounded-2xl" style={{
              backgroundColor: 'var(--ctp-surface0)',
              border: '2px solid',
              borderColor: 'var(--ctp-mauve)'
            }}>
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--ctp-mauve)' }}>
                カタカナ (Katakana)
              </h2>
              <div className="grid grid-rows-5 grid-flow-col gap-2 justify-center">
                {katakana.map((char, index) => (
                  char.kana ? (
                    <div
                      key={index}
                      className="p-3 rounded-lg text-center transition-all hover:scale-105"
                      style={{
                        backgroundColor: 'var(--ctp-base)',
                        border: '1px solid',
                        borderColor: 'var(--ctp-surface2)',
                        minWidth: '60px'
                      }}
                    >
                      <div className="text-2xl mb-0.5" style={{ color: 'var(--ctp-text)' }}>
                        {char.kana}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--ctp-subtext0)' }}>
                        {char.romaji}
                      </div>
                    </div>
                  ) : (
                    <div key={index} style={{ minWidth: '60px' }} />
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
