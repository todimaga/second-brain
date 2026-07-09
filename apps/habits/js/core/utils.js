// ─── utils.js ─────────────────────────────────────────────────────────────────

/** Genera un ID univoco */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Restituisce la data odierna come stringa YYYY-MM-DD */
function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/** Restituisce la stringa YYYY-MM-DD per N giorni fa */
function daysAgoKey(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/** Restituisce il numero del giorno della settimana (0=Lun, 6=Dom) per una data YYYY-MM-DD */
function weekdayOf(key) {
  const d = new Date(key + 'T12:00:00');
  return (d.getDay() + 6) % 7; // 0=Lun, 6=Dom
}

/** Oggi è attivo per questa abitudine? (frequenza: daily o days-of-week) */
function isActiveToday(habit) {
  if (!habit.frequency || habit.frequency === 'daily') return true;
  const todayWd = weekdayOf(todayKey());
  return (habit.activeDays || []).includes(todayWd);
}

/**
 * Calcola la streak attuale dato un array di date YYYY-MM-DD completate.
 * La streak conta solo i giorni consecutivi a ritroso da oggi (o ieri).
 */
function calcStreak(dates, habit) {
  if (!dates || dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = todayKey();
  const yesterday = daysAgoKey(1);

  // Se l'abitudine è a giorni specifici, costruiamo la catena solo sui giorni attivi
  if (habit && habit.frequency === 'weekly' && habit.activeDays && habit.activeDays.length > 0) {
    return calcWeeklyStreak(sorted, habit.activeDays);
  }

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const expected = daysAgoKey(i + (sorted[0] === yesterday ? 1 : 0));
    if (sorted[i] === expected) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** Streak per abitudini con frequenza settimanale */
function calcWeeklyStreak(sortedDates, activeDays) {
  if (!sortedDates.length) return 0;
  const today = todayKey();
  const setDates = new Set(sortedDates);
  let streak = 0;
  let d = new Date();
  // Vai indietro giorno per giorno
  for (let i = 0; i < 365; i++) {
    const key = d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
    const wd = (d.getDay() + 6) % 7;
    if (activeDays.includes(wd)) {
      if (setDates.has(key)) {
        streak++;
      } else if (key !== today) {
        break; // giorno attivo mancante
      }
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/**
 * Calcola la streak massima storica dato un array di date YYYY-MM-DD.
 */
function calcMaxStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort();
  let max = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr - prev) / 86400000;
    if (diff === 1) {
      cur++;
      if (cur > max) max = cur;
    } else {
      cur = 1;
    }
  }
  return max;
}

/** Formatta una data YYYY-MM-DD in "Lun 17" */
function formatShortDate(key) {
  const d = new Date(key + 'T12:00:00');
  return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' });
}

/** Percentuale completamento mese corrente per un'abitudine */
function calcMonthPct(dates) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${y}-${m}-`;
  const dayOfMonth = now.getDate();
  const completedThisMonth = dates.filter(d => d.startsWith(prefix)).length;
  return Math.round((completedThisMonth / dayOfMonth) * 100);
}

/** Percentuale di completamento degli ultimi N giorni */
function calcRecentPct(dates, n = 30) {
  const keys = new Set();
  for (let i = 0; i < n; i++) keys.add(daysAgoKey(i));
  const done = dates.filter(d => keys.has(d)).length;
  return Math.round((done / n) * 100);
}

/** Restituisce il numero di giorni con almeno 1 completamento nell'ultimo mese */
function calcActiveDaysThisMonth(dates) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${y}-${m}-`;
  return dates.filter(d => d.startsWith(prefix)).length;
}
