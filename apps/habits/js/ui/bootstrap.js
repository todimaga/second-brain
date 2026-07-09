// ─── bootstrap.js ─────────────────────────────────────────────────────────────
// Punto di ingresso: inizializza la UI al DOMContentLoaded (v2).

document.addEventListener('DOMContentLoaded', () => {
  // Render iniziale
  renderStats();
  renderList();

  // Chiudi overlay al click
  document.getElementById('overlay').addEventListener('click', closeSheet);

  // Submit form con Enter
  document.getElementById('ed-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveHabit();
  });

  // Inizializza chip filtri
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => setFilter(chip.dataset.type));
  });

  // Inizializza sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => setSortMode(btn.dataset.sort));
  });
});
