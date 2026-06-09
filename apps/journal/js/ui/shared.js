// ─── shared.js ───────────────────────────────────────────────────────────────
// Utilities UI riutilizzabili: toast, overlay, sheet management.

let _activeSheet = null;

function openSheet(id) {
  closeSheet(false);
  const sheet = document.getElementById(id);
  const overlay = document.getElementById('overlay');
  if (!sheet) return;
  _activeSheet = id;
  overlay.classList.add('vis');
  sheet.classList.add('vis');
}

function closeSheet(clearState = true) {
  const overlay = document.getElementById('overlay');
  overlay.classList.remove('vis');
  if (_activeSheet) {
    const s = document.getElementById(_activeSheet);
    if (s) s.classList.remove('vis');
  }
  if (clearState) _activeSheet = null;
}

let _toastTimer = null;
function showToast(msg, duration = 2200) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('vis');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('vis'), duration);
}
