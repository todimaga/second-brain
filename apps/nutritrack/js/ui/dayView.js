function renderDay() {
  var dateKey = getActiveDateKey();
  var targets = N.nutrition.getTargets();
  var tot = N.nutrition.getDayTotals(dateKey);
  var meals = N.nutrition.getMealsSorted(dateKey);
  var C = N.constants;

  document.getElementById('day-lbl').textContent = N.utils.formatDateLabel(dateKey);
  document.getElementById('toggle-train').className = 'tgl-btn' + (S().giornoAllenamento ? ' on' : '');
  document.getElementById('toggle-rest').className = 'tgl-btn' + (!S().giornoAllenamento ? ' on' : '');
  document.getElementById('target-lbl').textContent = S().giornoAllenamento ? 'Allenamento · 2300 kcal' : 'Riposo · 2150 kcal';

  var macroHtml = '';
  var i, m, pct, val, max;
  for (i = 0; i < C.MACRO_KEYS.length; i++) {
    m = C.MACRO_KEYS[i];
    val = tot[m.key];
    max = targets[m.key];
    pct = N.utils.clampPct(val, max);
    macroHtml += '<div class="macro-row">';
    macroHtml += '<div class="macro-hdr"><span>' + m.label + '</span><span>' + val + (m.unit ? m.unit : '') + ' / ' + max + (m.unit ? m.unit : '') + '</span></div>';
    macroHtml += '<div class="macro-bar"><div class="macro-fill" style="width:' + pct + '%"></div></div>';
    macroHtml += '</div>';
  }
  document.getElementById('macro-bars').innerHTML = macroHtml;

  var kcalPct = N.utils.clampPct(tot.kcal, targets.kcal);
  document.getElementById('kcal-big').textContent = tot.kcal;
  document.getElementById('kcal-target').textContent = '/ ' + targets.kcal;
  document.getElementById('kcal-ring').style.setProperty('--pct', kcalPct);

  var list = document.getElementById('lista-pasti');
  if (meals.length === 0) {
    list.innerHTML = '<div class="empty-s"><div class="empty-t">Nessun pasto oggi</div><div class="empty-sub">Importa da Claude o aggiungi dai preferiti</div></div>';
    return;
  }

  var h = '';
  for (i = 0; i < meals.length; i++) {
    var p = meals[i];
    h += '<div class="mcard">';
    h += '<div class="mcard-main">';
    h += '<div class="mcard-gruppo">' + C.GRUPPI_LABEL[p.gruppo] + '</div>';
    h += '<div class="mcard-nome">' + escapeHtml(p.nome) + '</div>';
    h += '<div class="mcard-macros">' + p.kcal + ' kcal · P' + p.proteine + ' C' + p.carboidrati + ' G' + p.grassi + '</div>';
    h += '</div>';
    h += '<div class="mcard-acts">';
    h += '<button type="button" class="ibtn" title="Duplica" onclick="duplicaPasto(' + p.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>';
    h += '<button type="button" class="ibtn" title="Preferito" onclick="salvaPreferito(' + p.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>';
    h += '<button type="button" class="ibtn del" title="Elimina" onclick="eliminaPasto(' + p.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
    h += '</div></div>';
  }
  list.innerHTML = h;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function setTrainingDay(isTraining) {
  N.nutrition.setTrainingDay(isTraining);
  renderDay();
}

function eliminaPasto(id) {
  if (!confirm('Eliminare questo pasto?')) return;
  N.nutrition.removeMeal(getActiveDateKey(), id);
  renderDay();
  mostraToast('Pasto eliminato');
}

function duplicaPasto(id) {
  N.nutrition.duplicateMeal(getActiveDateKey(), id);
  renderDay();
  mostraToast('Pasto duplicato');
}

function salvaPreferito(id) {
  var meals = N.nutrition.getMealsSorted(getActiveDateKey());
  var meal = null;
  for (var i = 0; i < meals.length; i++) {
    if (meals[i].id === id) { meal = meals[i]; break; }
  }
  if (!meal) return;
  if (N.nutrition.addToPreferiti(meal)) {
    mostraToast('Aggiunto ai preferiti');
    renderPreferiti();
  } else {
    mostraToast('Già nei preferiti');
  }
}

function renderPreferiti() {
  var el = document.getElementById('lista-pref');
  var prefs = S().preferiti;
  if (prefs.length === 0) {
    el.innerHTML = '<p class="pref-empty">Nessun preferito. Salva un pasto dalla lista con la stella.</p>';
    return;
  }
  var h = '';
  for (var i = 0; i < prefs.length; i++) {
    var f = prefs[i];
    h += '<div class="pref-row">';
    h += '<div class="pref-info"><div class="pref-nome">' + escapeHtml(f.nome) + '</div>';
    h += '<div class="pref-sub">' + f.kcal + ' kcal · ' + N.constants.GRUPPI_LABEL[f.gruppo] + '</div></div>';
    h += '<button type="button" class="bconfirm sm" onclick="logPreferito(' + f.id + ')">+ Oggi</button>';
    h += '<button type="button" class="ibtn del" onclick="eliminaPreferito(' + f.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
    h += '</div>';
  }
  el.innerHTML = h;
}

function logPreferito(id) {
  N.nutrition.logFromPreferito(getActiveDateKey(), id);
  closeSheet();
  renderDay();
  mostraToast('Pasto aggiunto');
}

function eliminaPreferito(id) {
  N.nutrition.removePreferito(id);
  renderPreferiti();
}
