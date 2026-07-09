// ─── store.js ─────────────────────────────────────────────────────────────────
// Strato dati puro: CRUD su localStorage.
// Struttura salvata:
// {
//   habits: [ { id, name, emoji, color, type, frequency, activeDays, note, createdAt } ],
//   completions: { [habitId]: ["2026-06-17", "2026-06-16", ...] }
// }

const Store = (() => {
  function load() {
    try {
      // Supporto migrazione da v1
      const rawV1 = localStorage.getItem('habits_v1');
      const rawV2 = localStorage.getItem(HABITS_STORE_KEY);
      if (!rawV2 && rawV1) {
        const old = JSON.parse(rawV1);
        // Migra: aggiungi campi mancanti
        const migrated = {
          habits: (old.habits || []).map(h => ({
            ...h,
            type: h.type || 'other',
            frequency: h.frequency || 'daily',
            activeDays: h.activeDays || [],
            note: h.note || '',
          })),
          completions: old.completions || {},
        };
        localStorage.setItem(HABITS_STORE_KEY, JSON.stringify(migrated));
        return migrated;
      }
      const data = rawV2 ? JSON.parse(rawV2) : {};
      return {
        habits: data.habits || [],
        completions: data.completions || {},
      };
    } catch {
      return { habits: [], completions: {} };
    }
  }

  function save(data) {
    localStorage.setItem(HABITS_STORE_KEY, JSON.stringify(data));
  }

  // ── Habits CRUD ──────────────────────────────────────────────────────────

  function getHabits() {
    return load().habits;
  }

  function addHabit({ name, emoji, color, type, frequency, activeDays, note }) {
    const data = load();
    const habit = {
      id: generateId(),
      name: name.trim(),
      emoji: emoji || '🎯',
      color: color || ACCENT,
      type: type || 'other',
      frequency: frequency || 'daily',
      activeDays: activeDays || [],
      note: (note || '').trim(),
      createdAt: todayKey(),
      order: data.habits.length,
    };
    data.habits.push(habit);
    save(data);
    return habit;
  }

  function updateHabit(id, patch) {
    const data = load();
    const idx = data.habits.findIndex(h => h.id === id);
    if (idx === -1) return null;
    data.habits[idx] = { ...data.habits[idx], ...patch };
    save(data);
    return data.habits[idx];
  }

  function removeHabit(id) {
    const data = load();
    data.habits = data.habits.filter(h => h.id !== id);
    delete data.completions[id];
    save(data);
  }

  function reorderHabits(orderedIds) {
    const data = load();
    const map = Object.fromEntries(data.habits.map(h => [h.id, h]));
    data.habits = orderedIds.map(id => map[id]).filter(Boolean);
    save(data);
  }

  // ── Completions ───────────────────────────────────────────────────────────

  function getCompletions(habitId) {
    return load().completions[habitId] || [];
  }

  function isCompletedToday(habitId) {
    const today = todayKey();
    return getCompletions(habitId).includes(today);
  }

  function toggleToday(habitId) {
    const data = load();
    const today = todayKey();
    const list = data.completions[habitId] || [];
    const idx = list.indexOf(today);
    if (idx === -1) {
      list.push(today);
    } else {
      list.splice(idx, 1);
    }
    data.completions[habitId] = list;
    save(data);
    return idx === -1; // true = appena completato, false = de-completato
  }

  function toggleDay(habitId, dateKey) {
    const data = load();
    const list = data.completions[habitId] || [];
    const idx = list.indexOf(dateKey);
    if (idx === -1) {
      list.push(dateKey);
    } else {
      list.splice(idx, 1);
    }
    data.completions[habitId] = list;
    save(data);
    return idx === -1;
  }

  return {
    getHabits, addHabit, updateHabit, removeHabit, reorderHabits,
    getCompletions, isCompletedToday, toggleToday, toggleDay,
  };
})();
