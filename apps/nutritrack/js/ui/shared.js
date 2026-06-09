var N = window.NutriTrack;

function S() {
  return N.store.getState();
}

function openSheet(id) {
  document.getElementById('overlay').classList.add('vis');
  document.getElementById(id).classList.add('vis');
}

function closeSheet() {
  document.getElementById('overlay').classList.remove('vis');
  var sheets = document.querySelectorAll('.sheet');
  for (var i = 0; i < sheets.length; i++) sheets[i].classList.remove('vis');
}

function mostraToast(msg) {
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('vis');
  clearTimeout(mostraToast._t);
  mostraToast._t = setTimeout(function () { el.classList.remove('vis'); }, 2200);
}

function getActiveDateKey() {
  return window._nutriDateKey || N.utils.dateKey();
}

function setActiveDateKey(key) {
  window._nutriDateKey = key;
}
