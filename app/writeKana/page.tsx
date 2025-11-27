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


export default function WriteKanaPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(-ctp-base)' }}>

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



        </div>
    );
}