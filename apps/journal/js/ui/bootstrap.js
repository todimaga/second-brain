// ─── bootstrap.js ────────────────────────────────────────────────────────────
// Punto di ingresso: inizializza la UI al DOMContentLoaded.
// In React → <App /> root component con useEffect iniziale.

document.addEventListener('DOMContentLoaded', () => {
  // Aggiorna l'orario nella status bar
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0');
  const sbEl = document.getElementById('sb-time');
  if (sbEl) sbEl.textContent = timeStr;

  // Render iniziale
  renderStats();
  renderTagFilters();
  renderList();

  // Chiudi overlay al click
  document.getElementById('overlay').addEventListener('click', closeSheet);
});
