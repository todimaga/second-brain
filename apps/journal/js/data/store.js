// ─── store.js ────────────────────────────────────────────────────────────────
// Strato dati puro: CRUD su localStorage.
// In React diventerà un custom hook useJournalStore() o un context/reducer.

const Store = (() => {
  function load() {
    try {
      return JSON.parse(localStorage.getItem(JOURNAL_STORE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save(entries) {
    localStorage.setItem(JOURNAL_STORE_KEY, JSON.stringify(entries));
  }

  function getAll() {
    return load().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function getById(id) {
    return load().find(e => e.id === id) || null;
  }

  function create({ title, body, mood, tags, photo }) {
    const entries = load();
    const entry = {
      id: generateId(),
      title: title || '',
      body: body || '',
      mood: mood || 3,
      tags: tags || [],
      photo: photo || null,   // data URL o null
      createdAt: todayISO(),
      updatedAt: todayISO(),
    };
    entries.unshift(entry);
    save(entries);
    return entry;
  }

  function update(id, patch) {
    const entries = load();
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    entries[idx] = { ...entries[idx], ...patch, updatedAt: todayISO() };
    save(entries);
    return entries[idx];
  }

  function remove(id) {
    const entries = load().filter(e => e.id !== id);
    save(entries);
  }

  return { getAll, getById, create, update, remove };
})();
