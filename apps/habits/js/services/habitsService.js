// ─── habitsService.js ─────────────────────────────────────────────────────────
// Logica di business: streak, stats, progresso. Nessun DOM.

const HabitsService = (() => {

  /** Restituisce i dati arricchiti per ogni abitudine */
  function getEnrichedHabits(filterType = 'all', sortMode = 'default') {
    let habits = Store.getHabits();

    // Filtro per tipo
    if (filterType !== 'all') {
      habits = habits.filter(h => (h.type || 'other') === filterType);
    }

    const enriched = habits.map(h => {
      const completions = Store.getCompletions(h.id);
      const streak = calcStreak(completions, h);
      const maxStreak = calcMaxStreak(completions);
      const completedToday = Store.isCompletedToday(h.id);
      const monthPct = calcMonthPct(completions);
      const recentPct = calcRecentPct(completions, 30);
      const last7 = getLast7Days(h.id, completions);
      const activeToday = isActiveToday(h);
      const activeDaysThisMonth = calcActiveDaysThisMonth(completions);
      return {
        ...h,
        streak, maxStreak,
        completedToday, activeToday,
        monthPct, recentPct,
        last7,
        totalDays: completions.length,
        activeDaysThisMonth,
      };
    });

    // Sorting
    if (sortMode === 'streak') {
      enriched.sort((a, b) => b.streak - a.streak);
    } else if (sortMode === 'name') {
      enriched.sort((a, b) => a.name.localeCompare(b.name, 'it'));
    } else if (sortMode === 'completion') {
      // Completate oggi in fondo, non completate in cima
      enriched.sort((a, b) => {
        if (a.completedToday !== b.completedToday) return a.completedToday ? 1 : -1;
        return (b.order || 0) - (a.order || 0);
      });
    }
    // default: ordine di inserimento (order field)

    return enriched;
  }

  /** Restituisce array di 7 oggetti { key, completed } per gli ultimi 7 giorni */
  function getLast7Days(habitId, completions) {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const key = daysAgoKey(i);
      result.push({ key, completed: completions.includes(key) });
    }
    return result;
  }

  /** Dati per il calendario (ultimi N giorni) */
  function getCalendarDays(habitId, n = 28) {
    const completions = Store.getCompletions(habitId);
    const result = [];
    for (let i = n - 1; i >= 0; i--) {
      const key = daysAgoKey(i);
      result.push({ key, completed: completions.includes(key) });
    }
    return result;
  }

  /** Statistiche globali per l'header */
  function getGlobalStats() {
    const habits = Store.getHabits();
    const total = habits.length;
    const activeHabitsToday = habits.filter(h => isActiveToday(h));
    const completedToday = activeHabitsToday.filter(h => Store.isCompletedToday(h.id)).length;
    const totalActiveToday = activeHabitsToday.length;
    const bestStreak = habits.reduce((max, h) => {
      const s = calcStreak(Store.getCompletions(h.id), h);
      return s > max ? s : max;
    }, 0);
    const perfectDays = habits.length > 0 ? calcPerfectDays(habits) : 0;
    const totalCompletions = habits.reduce((acc, h) => acc + Store.getCompletions(h.id).length, 0);
    return { total, completedToday, totalActiveToday, bestStreak, perfectDays, totalCompletions };
  }

  /** Conta i giorni in cui tutte le abitudini attive sono state completate */
  function calcPerfectDays(habits) {
    if (habits.length === 0) return 0;
    const daySets = habits.map(h => new Set(Store.getCompletions(h.id)));
    const allDays = [...daySets[0]].filter(d => daySets.every(s => s.has(d)));
    return allDays.length;
  }

  return { getEnrichedHabits, getGlobalStats, getCalendarDays };
})();
