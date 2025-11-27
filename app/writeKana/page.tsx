"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";
import { 
  KanaChar, 
  initialHiragana, 
  initialKatakana, 
  hiraganaDisplay, 
  katakanaDisplay 
} from "../data/kana";

export default function WriteKana() {
  const router = useRouter();
  const [showKanaList, setShowKanaList] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Quiz state - separate from readKana
  const [hiraganaScores, setHiraganaScores] = useState<KanaChar[]>(initialHiragana);
  const [katakanaScores, setKatakanaScores] = useState<KanaChar[]>(initialKatakana);
  const [quizMode, setQuizMode] = useState<'hiragana' | 'katakana' | 'both'>('both');
  const [currentKana, setCurrentKana] = useState<KanaChar | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load scores from localStorage (separate keys for write mode)
  useEffect(() => {
    const savedHiragana = localStorage.getItem('writeHiraganaScores');
    const savedKatakana = localStorage.getItem('writeKatakanaScores');
    
    if (savedHiragana) {
      setHiraganaScores(JSON.parse(savedHiragana));
    }
    if (savedKatakana) {
      setKatakanaScores(JSON.parse(savedKatakana));
    }
  }, []);

  // Save scores to localStorage
  useEffect(() => {
    localStorage.setItem('writeHiraganaScores', JSON.stringify(hiraganaScores));
  }, [hiraganaScores]);

  useEffect(() => {
    localStorage.setItem('writeKatakanaScores', JSON.stringify(katakanaScores));
  }, [katakanaScores]);

  // Weighted random selection - lower scores appear more often
  const selectWeightedKana = (kanaArray: KanaChar[]): KanaChar => {
    const maxScore = Math.max(...kanaArray.map(k => k.score));
    const baseWeight = 1;
    
    const weights = kanaArray.map(k => maxScore - k.score + baseWeight);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    let random = Math.random() * totalWeight;
    for (let i = 0; i < kanaArray.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return kanaArray[i];
      }
    }
    
    return kanaArray[0];
  };

  // Start new quiz question
  const nextQuestion = () => {
    setFeedback(null);
    clearCanvas();
    
    let selectedKana: KanaChar;
    
    if (quizMode === 'hiragana') {
      selectedKana = selectWeightedKana(hiraganaScores);
    } else if (quizMode === 'katakana') {
      selectedKana = selectWeightedKana(katakanaScores);
    } else {
      const useHiragana = Math.random() < 0.5;
      selectedKana = useHiragana 
        ? selectWeightedKana(hiraganaScores)
        : selectWeightedKana(katakanaScores);
    }
    
    setCurrentKana(selectedKana);
  };

  // Initialize first question
  useEffect(() => {
    if (currentKana === null) {
      nextQuestion();
    }
  }, [hiraganaScores, katakanaScores]);

  // Reset all scores
  const resetScores = () => {
    setHiraganaScores(initialHiragana);
    setKatakanaScores(initialKatakana);
    localStorage.removeItem('writeHiraganaScores');
    localStorage.removeItem('writeKatakanaScores');
    setShowResetConfirm(false);
    nextQuestion();
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.clientY - rect.top;

    ctx.lineTo(x, y);
    // Get the computed color from CSS variable
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--ctp-text').trim();
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Check drawing (placeholder - no recognition yet)
  const checkDrawing = () => {
    // TODO: Add handwriting recognition here
    // For now, just show a message
    alert('Handwriting recognition not yet implemented!\n\nClick "Skip" to practice more characters.');
  };

  // Skip to next question
  const skipQuestion = () => {
    nextQuestion();
  };

  // Update scores
  const updateScore = (correct: boolean) => {
    if (!currentKana) return;

    const scoreChange = correct ? 1 : -1;
    const isHiragana = hiraganaScores.some(k => k.kana === currentKana.kana);

    const updateScores = (scores: KanaChar[]): KanaChar[] => {
      return scores.map(k => {
        if (k.kana === currentKana.kana && k.romaji === currentKana.romaji) {
          return {
            ...k,
            score: Math.max(0, Math.min(10, k.score + scoreChange))
          };
        }
        return k;
      });
    };

    if (isHiragana) {
      setHiraganaScores(updateScores);
    } else {
      setKatakanaScores(updateScores);
    }

    setFeedback(correct ? 'correct' : 'incorrect');
    
    if (correct) {
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    }
  };

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
        ← Home
      </button>

      <main className="container mx-auto px-2 py-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--ctp-text)' }}>
            かなをかく
          </h1>
          <p className="text-xl" style={{ color: 'var(--ctp-subtext0)' }}>
            Learn to Write Kana
          </p>
        </div>

        {/* Quiz Mode Selector */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setQuizMode('both')}
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{
              backgroundColor: quizMode === 'both' ? 'var(--ctp-green)' : 'var(--ctp-surface0)',
              color: quizMode === 'both' ? 'var(--ctp-base)' : 'var(--ctp-text)',
              border: '3px solid',
              borderColor: quizMode === 'both' ? 'var(--ctp-green)' : 'var(--ctp-surface2)',
              boxShadow: quizMode === 'both' ? '0 4px 12px rgba(64, 160, 43, 0.3)' : 'none'
            }}
          >
            <div>両方</div>
            <div className="text-sm font-normal" style={{ opacity: 0.8 }}>Both</div>
          </button>
          <button
            onClick={() => setQuizMode('hiragana')}
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{
              backgroundColor: quizMode === 'hiragana' ? 'var(--ctp-blue)' : 'var(--ctp-surface0)',
              color: quizMode === 'hiragana' ? 'var(--ctp-base)' : 'var(--ctp-text)',
              border: '3px solid',
              borderColor: quizMode === 'hiragana' ? 'var(--ctp-blue)' : 'var(--ctp-surface2)',
              boxShadow: quizMode === 'hiragana' ? '0 4px 12px rgba(30, 102, 245, 0.3)' : 'none'
            }}
          >
            <div>ひらがな</div>
            <div className="text-sm font-normal" style={{ opacity: 0.8 }}>Hiragana</div>
          </button>
          <button
            onClick={() => setQuizMode('katakana')}
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{
              backgroundColor: quizMode === 'katakana' ? 'var(--ctp-mauve)' : 'var(--ctp-surface0)',
              color: quizMode === 'katakana' ? 'var(--ctp-base)' : 'var(--ctp-text)',
              border: '3px solid',
              borderColor: quizMode === 'katakana' ? 'var(--ctp-mauve)' : 'var(--ctp-surface2)',
              boxShadow: quizMode === 'katakana' ? '0 4px 12px rgba(198, 160, 246, 0.3)' : 'none'
            }}
          >
            <div>カタカナ</div>
            <div className="text-sm font-normal" style={{ opacity: 0.8 }}>Katakana</div>
          </button>
        </div>

        {/* Quiz Card */}
        {currentKana && (
          <div className="max-w-1xl mx-auto mb-12">
            <div className="p-8 rounded-2xl text-center" style={{
              backgroundColor: 'var(--ctp-surface0)',
              border: '3px solid',
              borderColor: feedback === 'correct' ? 'var(--ctp-green)' : 
                          feedback === 'incorrect' ? 'var(--ctp-red)' : 
                          'var(--ctp-surface2)'
            }}>
              {/* Script Type Indicator */}
              <div className="mb-4">
                <div 
                  className="inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: hiraganaScores.some(k => k.kana === currentKana.kana) 
                      ? 'var(--ctp-blue)' 
                      : 'var(--ctp-mauve)',
                    color: 'var(--ctp-base)'
                  }}
                >
                  {hiraganaScores.some(k => k.kana === currentKana.kana) 
                    ? 'ひらがな (Hiragana)' 
                    : 'カタカナ (Katakana)'}
                </div>
              </div>

              {/* Romaji Display with Hover for Hint */}
              <div 
                className="text-6xl font-bold mb-6 relative inline-block cursor-help"
                style={{ color: 'var(--ctp-text)' }}
                onMouseEnter={() => setShowHint(true)}
                onMouseLeave={() => setShowHint(false)}
              >
                {currentKana.romaji}
                
                {/* Tooltip on hover */}
                {showHint && (
                  <div 
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg whitespace-nowrap text-5xl font-semibold"
                    style={{
                      backgroundColor: 'var(--ctp-blue)',
                      color: 'var(--ctp-base)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {currentKana.kana}
                  </div>
                )}
              </div>

              {/* Canvas for Drawing */}
              <div className="mb-4 flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="border-4 rounded-lg cursor-crosshair touch-none"
                  style={{ 
                    borderColor: 'var(--ctp-blue)',
                    backgroundColor: 'var(--ctp-base)'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={clearCanvas}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--ctp-surface2)',
                    color: 'var(--ctp-text)',
                    border: '2px solid',
                    borderColor: 'var(--ctp-overlay0)'
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={checkDrawing}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--ctp-green)',
                    color: 'var(--ctp-base)'
                  }}
                >
                  Check
                </button>
                <button
                  onClick={skipQuestion}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--ctp-yellow)',
                    color: 'var(--ctp-base)'
                  }}
                >
                  Skip
                </button>
              </div>

              {/* Feedback Display */}
              <div className="mb-4" style={{ minHeight: '4.5rem' }}>
                {feedback === 'correct' && (
                  <div className="text-xl font-bold" style={{ color: 'var(--ctp-green)' }}>
                    ✓ Correct!
                  </div>
                )}
                {feedback === 'incorrect' && (
                  <div>
                    <div className="text-xl font-bold mb-2" style={{ color: 'var(--ctp-red)' }}>
                      ✗ Try Again!
                    </div>
                  </div>
                )}
              </div>

              {/* Score Display */}
              <div className="mt-6 text-sm" style={{ color: 'var(--ctp-subtext0)' }}>
                Score: {currentKana.score}/10
              </div>
            </div>
          </div>
        )}

        {/* Reset Score Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--ctp-surface0)',
              color: 'var(--ctp-red)',
              border: '2px solid',
              borderColor: 'var(--ctp-red)'
            }}
          >
            Reset All Scores
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div 
              className="p-8 rounded-2xl max-w-md mx-4"
              style={{
                backgroundColor: 'var(--ctp-base)',
                border: '2px solid',
                borderColor: 'var(--ctp-red)'
              }}
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ctp-text)' }}>
                Reset All Scores?
              </h2>
              <p className="mb-6" style={{ color: 'var(--ctp-subtext0)' }}>
                Are you sure you want to reset all writing scores to 0? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--ctp-surface0)',
                    color: 'var(--ctp-text)',
                    border: '2px solid',
                    borderColor: 'var(--ctp-surface2)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={resetScores}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--ctp-red)',
                    color: 'var(--ctp-base)'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

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
        <div 
          className="transition-all duration-500 ease-in-out"
          style={{
            maxHeight: showKanaList ? '2000px' : '0',
            opacity: showKanaList ? 1 : 0,
            overflow: showKanaList ? 'visible' : 'hidden'
          }}
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-full mx-auto px-4">
            {/* Hiragana */}
            <div className="p-6 rounded-2xl overflow-hidden" style={{
              backgroundColor: 'var(--ctp-surface0)',
              border: '2px solid',
              borderColor: 'var(--ctp-blue)'
            }}>
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--ctp-blue)' }}>
                ひらがな (Hiragana)
              </h2>
              <div className="overflow-x-auto overflow-y-hidden pb-2" style={{ maxWidth: '100%' }}>
                <div className="grid grid-rows-5 grid-flow-col gap-2 w-max">
                  {hiraganaDisplay.map((char: { kana: string; romaji: string }, index: number) => {
                    const scoreData = hiraganaScores.find(k => k.kana === char.kana && k.romaji === char.romaji);
                    const score = scoreData?.score || 0;
                    return char.kana ? (
                      <div
                        key={`${index}-${score}`}
                        className="rounded-lg text-center transition-all hover:scale-105"
                        style={{
                          backgroundColor: 'var(--ctp-base)',
                          border: '1px solid',
                          borderColor: 'var(--ctp-surface2)',
                          width: '60px',
                          height: '70px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '8px 8px 4px 8px'
                        }}
                      >
                        <div>
                          <div className="text-2xl mb-0.5" style={{ color: 'var(--ctp-text)' }}>
                            {char.kana}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--ctp-subtext0)' }}>
                            {char.romaji}
                          </div>
                        </div>
                        <div 
                          className="w-full rounded-full overflow-hidden"
                          style={{ 
                            height: '4px', 
                            backgroundColor: 'var(--ctp-surface1)'
                          }}
                        >
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${score * 10}%`,
                              backgroundColor: 'var(--ctp-blue)',
                              transition: 'width 0.3s ease'
                            }} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div key={index} style={{ width: '60px', height: '70px' }} />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Katakana */}
            <div className="p-6 rounded-2xl overflow-hidden" style={{
              backgroundColor: 'var(--ctp-surface0)',
              border: '2px solid',
              borderColor: 'var(--ctp-mauve)'
            }}>
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--ctp-mauve)' }}>
                カタカナ (Katakana)
              </h2>
              <div className="overflow-x-auto overflow-y-hidden pb-2" style={{ maxWidth: '100%' }}>
                <div className="grid grid-rows-5 grid-flow-col gap-2 w-max">
                  {katakanaDisplay.map((char: { kana: string; romaji: string }, index: number) => {
                    const scoreData = katakanaScores.find(k => k.kana === char.kana && k.romaji === char.romaji);
                    const score = scoreData?.score || 0;
                    return char.kana ? (
                      <div
                        key={`${index}-${score}`}
                        className="rounded-lg text-center transition-all hover:scale-105"
                        style={{
                          backgroundColor: 'var(--ctp-base)',
                          border: '1px solid',
                          borderColor: 'var(--ctp-surface2)',
                          width: '60px',
                          height: '70px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '8px 8px 4px 8px'
                        }}
                      >
                        <div>
                          <div className="text-2xl mb-0.5" style={{ color: 'var(--ctp-text)' }}>
                            {char.kana}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--ctp-subtext0)' }}>
                            {char.romaji}
                          </div>
                        </div>
                        <div 
                          className="w-full rounded-full overflow-hidden"
                          style={{ 
                            height: '4px', 
                            backgroundColor: 'var(--ctp-surface1)'
                          }}
                        >
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${score * 10}%`,
                              backgroundColor: 'var(--ctp-mauve)',
                              transition: 'width 0.3s ease'
                            }} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div key={index} style={{ width: '60px', height: '70px' }} />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}