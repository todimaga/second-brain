// ─── constants.js ────────────────────────────────────────────────────────────
// Costanti dell'app Abitudini v2.

const HABITS_STORE_KEY = 'habits_v2';

/** Emoji predefinite tra cui scegliere */
const HABIT_EMOJIS = [
  '🏃','💧','📚','🧘','💪','🥗','😴','✍️',
  '🎯','🧠','🚴','🌿','🎵','🧹','💊','☀️',
  '🍎','🛁','🧗','🎨','🏋️','🧃','🚶','🏊',
  '🫁','🧺','🍵','🌙','📖','🎮',
];

/** Colori accent predefiniti per le abitudini */
const HABIT_COLORS = [
  '#f97316', // arancione (default)
  '#22d3ee', // ciano
  '#a78bfa', // viola
  '#34d399', // verde menta
  '#fb7185', // rosa
  '#fbbf24', // giallo ambra
  '#60a5fa', // azzurro
  '#f472b6', // fucsia
  '#e879f9', // purple
  '#2dd4bf', // teal
];

/** Categorie / tipi di abitudine */
const HABIT_TYPES = [
  { id: 'health',   label: 'Salute',        emoji: '❤️' },
  { id: 'mind',     label: 'Mente',         emoji: '🧠' },
  { id: 'fitness',  label: 'Fitness',       emoji: '💪' },
  { id: 'work',     label: 'Produttività',  emoji: '🎯' },
  { id: 'social',   label: 'Sociale',       emoji: '👥' },
  { id: 'creative', label: 'Creatività',    emoji: '🎨' },
  { id: 'other',    label: 'Altro',         emoji: '✨' },
];

/** Giorni settimana (abbreviazioni IT) */
const DAYS_SHORT = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const DAYS_FULL  = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const ACCENT = '#f97316'; // identità visiva Abitudini
