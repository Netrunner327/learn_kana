// Kana character type with score tracking
export interface KanaChar {
  kana: string;
  romaji: string;
  score: number;
}

// Hiragana characters with initial scores
export const initialHiragana: KanaChar[] = [
  { kana: 'あ', romaji: 'a', score: 0 }, { kana: 'い', romaji: 'i', score: 0 }, { kana: 'う', romaji: 'u', score: 0 }, { kana: 'え', romaji: 'e', score: 0 }, { kana: 'お', romaji: 'o', score: 0 },
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
export const initialKatakana: KanaChar[] = [
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

// Display arrays with empty placeholders for grid layout
export const hiraganaDisplay = [
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

export const katakanaDisplay = [
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