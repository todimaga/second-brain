// ─── journalService.js ───────────────────────────────────────────────────────
// Business logic: streak, statistiche, ricerca.
// In React diventerà useMemo / useCallback hooks o un service layer.

const JournalService = (() => {

  /** Filtra le voci per query fulltext su titolo + body */
  function search(entries, query) {
    if (!query || !query.trim()) return entries;
    const q = query.trim().toLowerCase();
    return entries.filter(e =>
      (e.title || '').toLowerCase().includes(q) ||
      (e.body || '').toLowerCase().includes(q) ||
      (e.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  /** Filtra per tag */
  function filterByTag(entries, tag) {
    if (!tag) return entries;
    return entries.filter(e => (e.tags || []).includes(tag));
  }

  /**
   * Calcola lo streak: quanti giorni consecutivi (fino ad oggi)
   * è stata scritta almeno una voce.
   */
  function calcStreak(entries) {
    if (!entries.length) return 0;

    // Raccoglie date uniche (YYYY-MM-DD) ordinate desc
    const days = [...new Set(
      entries.map(e => e.createdAt.slice(0, 10))
    )].sort((a, b) => b.localeCompare(a));

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // Lo streak parte solo se oggi o ieri è stata scritta una voce
    if (days[0] !== todayStr && days[0] !== yesterdayStr) return 0;

    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diff = (prev - curr) / 86400000;
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }

  /** Stats rapide per la header card */
  function getStats(entries) {
    const total = entries.length;
    const streak = calcStreak(entries);
    const moodAvg = total
      ? Math.round(entries.reduce((s, e) => s + (e.mood || 3), 0) / total)
      : null;
    const thisMonth = entries.filter(e =>
      e.createdAt.slice(0, 7) === new Date().toISOString().slice(0, 7)
    ).length;
    return { total, streak, moodAvg, thisMonth };
  }

  return { search, filterByTag, calcStreak, getStats };
})();
