// ─── constants.js ───────────────────────────────────────────────────────────
// Tutte le costanti dell'app Journal. Facile da portare in React come enum/config.

const JOURNAL_STORE_KEY = 'journal_entries_v1';

const MOOD_LEVELS = [
  { value: 1, emoji: '😔', label: 'Giù' },
  { value: 2, emoji: '😐', label: 'Neutro' },
  { value: 3, emoji: '🙂', label: 'Bene' },
  { value: 4, emoji: '😄', label: 'Ottimo' },
  { value: 5, emoji: '🔥', label: 'Fantastico' },
];

const TAGS = [
  'Lavoro', 'Salute', 'Gym', 'Idee', 'Vita', 'Riflessioni', 'Viaggi', 'Obiettivi'
];

const ACCENT = '#a78bfa'; // viola — identità visiva Journal
