"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";

// Kana character type with score tracking
interface KanaChar {
  kana: string;
  romaji: string;
  score: number; // Higher score = better mastery
}

// Hiragana characters with initial scores
const initialHiragana: KanaChar[] = [
  { kana: 'あ', romaji: 'a', score:  0 }, { kana: 'い', romaji: 'i', score: 0 }, { kana: 'う', romaji: 'u', score: 0 }, { kana: 'え', romaji: 'e', score: 0 }, { kana: 'お', romaji: 'o', score: 0 },
  { kana: 'か', romaji: 'ka', score: 0 }, { kana: 'き', romaji: 'ki', score: 0 }, { kana: 'く', romaji: 'ku', score: 0 }, { kana: 'け', romaji: 'ke', score: 0 }, { kana: 'こ', romaji: 'ko', score: 0 },
  { kana: 'さ', romaji: 'sa', score: 0 }, { kana: 'し', romaji: 'shi', score: 0 }, { kana: 'す', romaji: 'su', score: 0 }, { kana: 'せ', romaji: 'se', score: 0 }, { kana: 'そ', romaji: 'so', score: 0 },
  { kana: 'た', romaji: 'ta', score: 0 }, { kana: 'ち', romaji: 'chi', score: 0 }, { kana: 'つ', romaji: 'tsu', score: 0 }, { kana: 'て', romaji: 'te', score: 0 }, { kana: 'と', romaji: 'to', score: 0 },
  { kana: 'な', romaji: 'na', score: 0 }, { kana: 'に', romaji: 'ni', score: 0 }, { kana: 'ぬ', romaji: 'nu', score: 0 }, { kana: 'ね', romaji: 'ne', score: 0 }, { kana: 'の', romaji: 'no', score: 0 },
  { kana: 'は', romaji: 'ha', score: 0 }, { kana: 'ひ', romaji: 'hi', score: 0 }, { kana: 'ふ', romaji: 'fu', score: 0 }, { kana: 'へ', romaji: 'he', score: 0 }, { kana: 'ほ', romaji: 'ho', score: 0 },
  { kana: 'ま', romaji: 'ma', score: 0 }, { kana: 'み', romaji: 'mi', score: 0 }, { kana: 'む', romaji: 'mu', score: 0 }, { kana: 'め', romaji: 'me', score: 0 }, { kana: 'も', romaji: 'mo', score: 0 },
  { kana: 'や', romaji: 'ya', score: 0 }, { kana: 'ゆ', romaji: 'yu', score: 0 }, { kana: 'よ', romaji: 'yo', score: 0 },
  { kana: 'ら', romaji: 'ra', score: 0 }, { kana: 'り', romaji: 'ri', score: 0 }, { kana: 'る', romaji: 'ru', score: 0 }, { kana: 'れ', romaji: 're', score: 0 }, { kana: 'ろ', romaji: 'ro', score: 0 },
  { kana: 'わ', romaji: 'wa', score: 0 }, { kana: 'を', romaji: 'wo', score: 0 }, { kana: 'ん', romaji: 'n', score: 0 },
];

// Katakana characters with initial scores
const initialKatakana: KanaChar[] = [
  { kana: 'ア', romaji: 'a', score: 0 }, { kana: 'イ', romaji: 'i', score: 0 }, { kana: 'ウ', romaji: 'u', score: 0 }, { kana: 'エ', romaji: 'e', score: 0 }, { kana: 'オ', romaji: 'o', score: 0 },
  { kana: 'カ', romaji: 'ka', score: 0 }, { kana: 'キ', romaji: 'ki', score: 0 }, { kana: 'ク', romaji: 'ku', score: 0 }, { kana: 'ケ', romaji: 'ke', score: 0 }, { kana: 'コ', romaji: 'ko', score: 0 },
  { kana: 'サ', romaji: 'sa', score: 0 }, { kana: 'シ', romaji: 'shi', score: 0 }, { kana: 'ス', romaji: 'su', score: 0 }, { kana: 'セ', romaji: 'se', score: 0 }, { kana: 'ソ', romaji: 'so', score: 0 },
  { kana: 'タ', romaji: 'ta', score: 0 }, { kana: 'チ', romaji: 'chi', score: 0 }, { kana: 'ツ', romaji: 'tsu', score: 0 }, { kana: 'テ', romaji: 'te', score: 0 }, { kana: 'ト', romaji: 'to', score: 0 },
  { kana: 'ナ', romaji: 'na', score: 0 }, { kana: 'ニ', romaji: 'ni', score: 0 }, { kana: 'ヌ', romaji: 'nu', score: 0 }, { kana: 'ネ', romaji: 'ne', score: 0 }, { kana: 'ノ', romaji: 'no', score: 0 },
  { kana: 'ハ', romaji: 'ha', score: 0 }, { kana: 'ヒ', romaji: 'hi', score: 0 }, { kana: 'フ', romaji: 'fu', score: 0 }, { kana: 'ヘ', romaji: 'he', score: 0 }, { kana: 'ホ', romaji: 'ho', score: 0 },
  { kana: 'マ', romaji: 'ma', score: 0 }, { kana: 'ミ', romaji: 'mi', score: 0 }, { kana: 'ム', romaji: 'mu', score: 0 }, { kana: 'メ', romaji: 'me', score: 0 }, { kana: 'モ', romaji: 'mo', score: 0 },
  { kana: 'ヤ', romaji: 'ya', score: 0 }, { kana: 'ユ', romaji: 'yu', score: 0 }, { kana: 'ヨ', romaji: 'yo', score: 0 },
  { kana: 'ラ', romaji: 'ra', score: 0 }, { kana: 'リ', romaji: 'ri', score: 0 }, { kana: 'ル', romaji: 'ru', score: 0 }, { kana: 'レ', romaji: 're', score: 0 }, { kana: 'ロ', romaji: 'ro', score: 0 },
  { kana: 'ワ', romaji: 'wa', score: 0 }, { kana: 'ヲ', romaji: 'wo', score: 0 }, { kana: 'ン', romaji: 'n', score: 0 },
];

// For display purposes (with empty placeholders)
const hiraganaDisplay = [
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

const katakanaDisplay = [
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

export default function ReadKana() {
  const router = useRouter();
  const [showKanaList, setShowKanaList] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasDecreasedScore = useRef(false);
  
  // Quiz state
  const [hiraganaScores, setHiraganaScores] = useState<KanaChar[]>(initialHiragana);
  const [katakanaScores, setKatakanaScores] = useState<KanaChar[]>(initialKatakana);
  const [quizMode, setQuizMode] = useState<'hiragana' | 'katakana' | 'both'>('both');
  const [currentKana, setCurrentKana] = useState<KanaChar | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load scores from localStorage on mount
  useEffect(() => {
    const savedHiragana = localStorage.getItem('hiraganaScores');
    const savedKatakana = localStorage.getItem('katakanaScores');
    
    if (savedHiragana) {
      setHiraganaScores(JSON.parse(savedHiragana));
    }
    if (savedKatakana) {
      setKatakanaScores(JSON.parse(savedKatakana));
    }
  }, []);

  // Save scores to localStorage when they change
  useEffect(() => {
    localStorage.setItem('hiraganaScores', JSON.stringify(hiraganaScores));
  }, [hiraganaScores]);

  useEffect(() => {
    localStorage.setItem('katakanaScores', JSON.stringify(katakanaScores));
  }, [katakanaScores]);

  // Weighted random selection - lower scores appear more often
  const selectWeightedKana = (kanaArray: KanaChar[]): KanaChar => {
    const maxScore = Math.max(...kanaArray.map(k => k.score));
    const baseWeight = 1;
    
    // Calculate weights (inverse of score)
    const weights = kanaArray.map(k => maxScore - k.score + baseWeight);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    // Random selection based on weights
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
    setUserInput('');
    setFeedback(null);
    hasDecreasedScore.current = false; // Reset penalty flag
    
    let selectedKana: KanaChar;
    
    if (quizMode === 'hiragana') {
      selectedKana = selectWeightedKana(hiraganaScores);
    } else if (quizMode === 'katakana') {
      selectedKana = selectWeightedKana(katakanaScores);
    } else {
      // Both: randomly choose between hiragana and katakana
      const useHiragana = Math.random() < 0.5;
      selectedKana = useHiragana 
        ? selectWeightedKana(hiraganaScores)
        : selectWeightedKana(katakanaScores);
    }
    
    setCurrentKana(selectedKana);
    
    // Refocus input field after state updates
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Check answer and update scores instantly
  useEffect(() => {
    if (!currentKana || !userInput.trim()) {
      setFeedback(null);
      return;
    }
    
    const userAnswer = userInput.trim().toLowerCase();
    const correctAnswer = currentKana.romaji.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    // Update score function
    const updateScores = (scores: KanaChar[], scoreChange: number): KanaChar[] => {
      return scores.map(k => {
        if (k.kana === currentKana.kana && k.romaji === currentKana.romaji) {
          return {
            ...k,
            score: Math.max(0, Math.min(100, k.score + scoreChange))
          };
        }
        return k;
      });
    };
    
    // Determine which array to update
    const isHiragana = hiraganaScores.some(k => k.kana === currentKana.kana);
    
    if (isCorrect) {
      setFeedback('correct');
      
      if (isHiragana) {
        setHiraganaScores(prev => updateScores(prev, 1));
      } else {
        setKatakanaScores(prev => updateScores(prev, 1));
      }
      
      // Move to next question after showing feedback
      setTimeout(() => {
        nextQuestion();
      }, 500);
    } else {
      // Check if input doesn't match the beginning of correct answer (wrong path)
      if (!correctAnswer.startsWith(userAnswer)) {
        setFeedback('incorrect');
        
        // Only decrease score once per question
        if (!hasDecreasedScore.current) {
          hasDecreasedScore.current = true;
          if (isHiragana) {
            setHiraganaScores(prev => updateScores(prev, -1));
          } else {
            setKatakanaScores(prev => updateScores(prev, -1));
          }
        }
      } else {
        // Still typing, reset feedback
        setFeedback(null);
      }
    }
  }, [userInput, currentKana]);

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
    localStorage.removeItem('hiraganaScores');
    localStorage.removeItem('katakanaScores');
    setShowResetConfirm(false);
    nextQuestion();
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
        ← Back to Home
      </button>

      <main className="container mx-auto px-2 py-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--ctp-text)' }}>
            かなをよむ
          </h1>
          <p className="text-xl" style={{ color: 'var(--ctp-subtext0)' }}>
            Learn to Read Kana
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
          <div className="max-w-md mx-auto mb-12">
            <div className="p-8 rounded-2xl text-center" style={{
              backgroundColor: 'var(--ctp-surface0)',
              border: '3px solid',
              borderColor: feedback === 'correct' ? 'var(--ctp-green)' : 
                          feedback === 'incorrect' ? 'var(--ctp-red)' : 
                          'var(--ctp-surface2)'
            }}>
              {/* Large Kana Display */}
              <div className="text-8xl font-bold mb-6" style={{ color: 'var(--ctp-text)' }}>
                {currentKana.kana}
              </div>

              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type romaji..."
                className="w-full px-4 py-3 rounded-lg text-center text-xl font-semibold mb-4 outline-none"
                style={{
                  backgroundColor: 'var(--ctp-base)',
                  color: 'var(--ctp-text)',
                  border: '2px solid',
                  borderColor: 'var(--ctp-surface2)'
                }}
                autoFocus
              />

              {/* Feedback Display - Fixed Height */}
              <div className="mb-4" style={{ minHeight: '4.5rem' }}>
                {feedback === 'correct' && (
                  <div className="text-xl font-bold" style={{ color: 'var(--ctp-green)' }}>
                    ✓ Correct!
                  </div>
                )}
                {feedback === 'incorrect' && (
                  <div>
                    <div className="text-xl font-bold mb-2" style={{ color: 'var(--ctp-red)' }}>
                      ✗ Wrong!
                    </div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--ctp-text)' }}>
                      {currentKana.romaji}
                    </div>
                  </div>
                )}
              </div>

              {/* Score Display */}
              <div className="mt-6 text-sm" style={{ color: 'var(--ctp-subtext0)' }}>
                Score: {currentKana.score}/100
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
                Are you sure you want to reset all scores to 0? This action cannot be undone.
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
                              width: `${score}%`,
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
                              width: `${score}%`,
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
