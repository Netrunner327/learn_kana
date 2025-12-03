"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";
import * as tf from '@tensorflow/tfjs';
import { kanaLabels } from "../data/kanaLabels";
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

    // Model state
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [isRecognizing, setIsRecognizing] = useState(false);

    // Quiz state - separate from readKana
    const [hiraganaScores, setHiraganaScores] = useState<KanaChar[]>(initialHiragana);
    const [katakanaScores, setKatakanaScores] = useState<KanaChar[]>(initialKatakana);
    const [quizMode, setQuizMode] = useState<'hiragana' | 'katakana' | 'both'>('both');
    const [currentKana, setCurrentKana] = useState<KanaChar | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [debugPreview, setDebugPreview] = useState<string | null>(null);
    const [showModelView, setShowModelView] = useState(false);
    const [topPredictions, setTopPredictions] = useState<{kana: string, confidence: number}[]>([]);
    const [expectedKana, setExpectedKana] = useState<string>('');

    // Load TensorFlow.js model
    useEffect(() => {
        async function loadModel() {
            try {
                console.log('Loading kana recognition model...');
                const loadedModel = await tf.loadLayersModel('/models/kana/model.json');
                setModel(loadedModel);
                setIsModelLoading(false);
                console.log('Model loaded successfully!');
            } catch (error) {
                console.error('Error loading model:', error);
                alert('Failed to load recognition model. Please refresh the page.');
                setIsModelLoading(false);
            }
        }
        loadModel();
    }, []);

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

    // Check drawing with ML model
    const checkDrawing = async () => {
        if (!model || !canvasRef.current || !currentKana) {
            alert('Model not loaded yet. Please wait...');
            return;
        }

        setIsRecognizing(true);

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Create a temporary square canvas for preprocessing
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 64;
            tempCanvas.height = 64;
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            // Fill with white background (important for consistent preprocessing)
            tempCtx.fillStyle = 'white';
            tempCtx.fillRect(0, 0, 64, 64);

            // Get the drawn content from original canvas
            // Find bounding box of drawn content to crop and center it
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
            let hasContent = false;
            
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    const alpha = pixels[i + 3];
                    if (alpha > 0) { // If pixel has been drawn
                        hasContent = true;
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            if (!hasContent) {
                alert('Please draw something first!');
                setIsRecognizing(false);
                return;
            }

            // Add padding
            const padding = 10;
            minX = Math.max(0, minX - padding);
            minY = Math.max(0, minY - padding);
            maxX = Math.min(canvas.width, maxX + padding);
            maxY = Math.min(canvas.height, maxY + padding);

            const cropWidth = maxX - minX;
            const cropHeight = maxY - minY;

            // Calculate scale to fit in 64x64 while maintaining aspect ratio
            const scale = Math.min(54 / cropWidth, 54 / cropHeight); // Leave 5px margin
            const scaledWidth = cropWidth * scale;
            const scaledHeight = cropHeight * scale;

            // Center the drawing
            const offsetX = (64 - scaledWidth) / 2;
            const offsetY = (64 - scaledHeight) / 2;

            // Draw cropped and scaled content
            tempCtx.drawImage(
                canvas,
                minX, minY, cropWidth, cropHeight,
                offsetX, offsetY, scaledWidth, scaledHeight
            );

            // Convert to grayscale tensor
            let tensor = tf.browser.fromPixels(tempCanvas, 1)
                .toFloat()
                .div(255.0) // Normalize to 0-1
                .expandDims(0); // Add batch dimension [1, 64, 64, 1]

            console.log('Tensor shape:', tensor.shape);

            // Run prediction
            const predictions = model.predict(tensor) as tf.Tensor;
            const probabilities = await predictions.data();

            // Get top 3 predictions for debugging
            const topIndices = Array.from(probabilities)
                .map((prob, idx) => ({ prob, idx }))
                .sort((a, b) => b.prob - a.prob)
                .slice(0, 3);

            // Store for display
            setTopPredictions(topIndices.map(({ prob, idx }) => ({
                kana: kanaLabels[idx],
                confidence: prob
            })));
            setExpectedKana(currentKana.kana);

            console.log('Top 3 predictions:');
            topIndices.forEach(({ prob, idx }, i) => {
                console.log(`${i + 1}. ${kanaLabels[idx]} - ${(prob * 100).toFixed(1)}%`);
            });

            // Get top prediction
            const maxIndex = topIndices[0].idx;
            const predictedKana = kanaLabels[maxIndex];
            const confidence = topIndices[0].prob;

            console.log(`Expected: ${currentKana.kana}`);
            
            // Save preprocessed image for debugging (you can see what model sees)
            const preprocessedImage = tempCanvas.toDataURL();
            setDebugPreview(preprocessedImage);

            // More lenient checking: accept if expected is in top 3 with >10% confidence
            let isCorrect = false;
            const expectedInTop3 = topIndices.find(({ idx }) => kanaLabels[idx] === currentKana.kana);
            
            if (predictedKana === currentKana.kana) {
                // Perfect match
                isCorrect = true;
            } else if (expectedInTop3 && expectedInTop3.prob > 0.1) {
                // Close enough - expected is in top 3 with >10% confidence
                console.log(`Close! Expected ${currentKana.kana} was #${topIndices.indexOf(expectedInTop3) + 1} with ${(expectedInTop3.prob * 100).toFixed(1)}%`);
                isCorrect = true; // Accept it as correct
            }
            
            // Update score
            updateScore(isCorrect);

            // Clean up tensors
            tensor.dispose();
            predictions.dispose();

        } catch (error) {
            console.error('Recognition error:', error);
            alert('Recognition failed. Please try again.');
        } finally {
            setIsRecognizing(false);
        }
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
            }, 500);
        } else {
            // Clear canvas on incorrect answer
            setTimeout(() => {
                clearCanvas();
                setFeedback(null);
            }, 500);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--ctp-base)' }}>
            <ThemeToggle />

            {/* Loading Model Indicator */}
            {isModelLoading && (
                <div className="fixed top-20 right-6 z-40 px-4 py-2 rounded-lg font-medium"
                    style={{
                        backgroundColor: 'var(--ctp-yellow)',
                        color: 'var(--ctp-base)'
                    }}
                >
                    Loading model...
                </div>
            )}

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

                            {/* Model View Preview */}
                            {showModelView && (
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-sm font-semibold" style={{ color: 'var(--ctp-subtext1)' }}>
                                            Model's View
                                        </div>
                                        <button
                                            onClick={() => setShowModelView(false)}
                                            className="text-xs px-2 py-1 rounded transition-all hover:opacity-80"
                                            style={{
                                                backgroundColor: 'var(--ctp-surface2)',
                                                color: 'var(--ctp-subtext0)'
                                            }}
                                        >
                                            Hide
                                        </button>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            {debugPreview ? (
                                                <img 
                                                    src={debugPreview} 
                                                    alt="What the model sees" 
                                                    className="rounded-lg shadow-lg"
                                                    style={{
                                                        width: '160px',
                                                        height: '160px',
                                                        imageRendering: 'pixelated',
                                                        border: '3px solid',
                                                        borderColor: 'var(--ctp-surface2)',
                                                        backgroundColor: 'white'
                                                    }}
                                                />
                                            ) : (
                                                <div 
                                                    className="rounded-lg shadow-lg flex items-center justify-center"
                                                    style={{
                                                        width: '160px',
                                                        height: '160px',
                                                        border: '3px dashed',
                                                        borderColor: 'var(--ctp-surface2)',
                                                        backgroundColor: 'var(--ctp-surface0)',
                                                        color: 'var(--ctp-subtext0)'
                                                    }}
                                                >
                                                    <div className="text-center text-xs">
                                                        Draw & Check<br/>to see preview
                                                    </div>
                                                </div>
                                            )}
                                            <div 
                                                className="absolute -bottom-2 -right-2 px-2 py-1 rounded text-xs font-mono"
                                                style={{
                                                    backgroundColor: 'var(--ctp-surface0)',
                                                    color: 'var(--ctp-subtext0)',
                                                    border: '1px solid',
                                                    borderColor: 'var(--ctp-surface2)'
                                                }}
                                            >
                                                64×64
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Predictions Display */}
                                    {topPredictions.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <div className="text-xs font-semibold" style={{ color: 'var(--ctp-subtext0)' }}>
                                                Expected: <span className="text-base font-bold" style={{ color: 'var(--ctp-text)' }}>{expectedKana}</span>
                                            </div>
                                            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--ctp-subtext0)' }}>
                                                Top 3 Predictions:
                                            </div>
                                            {topPredictions.map((pred, idx) => {
                                                const isExpected = pred.kana === expectedKana;
                                                return (
                                                    <div 
                                                        key={idx}
                                                        className="flex items-center justify-between px-3 py-2 rounded"
                                                        style={{
                                                            backgroundColor: isExpected ? 'var(--ctp-green)' : 'var(--ctp-surface1)',
                                                            color: isExpected ? 'var(--ctp-base)' : 'var(--ctp-text)',
                                                            border: '1px solid',
                                                            borderColor: isExpected ? 'var(--ctp-green)' : 'var(--ctp-surface2)'
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-mono" style={{ opacity: 0.7 }}>#{idx + 1}</span>
                                                            <span className="text-lg font-bold">{pred.kana}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div 
                                                                className="h-2 rounded-full"
                                                                style={{
                                                                    width: '60px',
                                                                    backgroundColor: isExpected ? 'var(--ctp-base)' : 'var(--ctp-surface0)',
                                                                    opacity: 0.3
                                                                }}
                                                            >
                                                                <div 
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        width: `${pred.confidence * 100}%`,
                                                                        backgroundColor: isExpected ? 'var(--ctp-base)' : 'var(--ctp-text)'
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-mono font-semibold" style={{ minWidth: '45px', textAlign: 'right' }}>
                                                                {(pred.confidence * 100).toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Show Model View Button (when hidden) */}
                            {!showModelView && (
                                <div className="mb-4 text-center">
                                    <button
                                        onClick={() => setShowModelView(true)}
                                        className="text-sm px-4 py-2 rounded-lg transition-all hover:opacity-80"
                                        style={{
                                            backgroundColor: 'var(--ctp-surface1)',
                                            color: 'var(--ctp-subtext1)',
                                            border: '1px solid',
                                            borderColor: 'var(--ctp-surface2)'
                                        }}
                                    >
                                        👁️ Show Model's View
                                    </button>
                                </div>
                            )}

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
                                    disabled={isRecognizing || isModelLoading}
                                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: 'var(--ctp-green)',
                                        color: 'var(--ctp-base)'
                                    }}
                                >
                                    {isRecognizing ? 'Checking...' : 'Check'}
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