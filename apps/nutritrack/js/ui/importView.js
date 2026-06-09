var importPreview = null;

function apriImport(testo) {
  importPreview = null;
  document.getElementById('import-text').value = testo || '';
  document.getElementById('import-preview').innerHTML = '<p class="import-hint">Incolla la riga PASTO: da Claude e tocca Anteprima</p>';
  document.getElementById('btn-conferma-import').disabled = true;
  openSheet('sh-import');
  if (!testo) incollaDaAppunti(true);
}

function incollaDaAppunti(silent) {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    if (!silent) mostraToast('Appunti non disponibili');
    return;
  }
  navigator.clipboard.readText().then(function (text) {
    if (!text || !text.trim()) {
      if (!silent) mostraToast('Appunti vuoti');
      return;
    }
    document.getElementById('import-text').value = text;
    anteprimaImport();
  }).catch(function () {
    if (!silent) mostraToast('Permesso appunti negato');
  });
}

function anteprimaImport() {
  var text = document.getElementById('import-text').value;
  var result = N.nutrition.parseImport(text);
  var el = document.getElementById('import-preview');
  var btn = document.getElementById('btn-conferma-import');

  if (!result.ok) {
    importPreview = null;
    btn.disabled = true;
    el.innerHTML = '<div class="import-err">' + escapeHtml(result.error) + '</div>';
    return;
  }

  importPreview = result.meal;
  btn.disabled = false;
  var m = result.meal;
  var C = N.constants;
  el.innerHTML =
    '<div class="import-ok">' +
    '<div class="import-ok-title">' + escapeHtml(m.nome) + '</div>' +
    '<div class="import-ok-gruppo">' + C.GRUPPI_LABEL[m.gruppo] + '</div>' +
    '<div class="import-ok-grid">' +
    '<div><span class="iv">Kcal</span><span class="in">' + m.kcal + '</span></div>' +
    '<div><span class="iv">P</span><span class="in">' + m.proteine + 'g</span></div>' +
    '<div><span class="iv">C</span><span class="in">' + m.carboidrati + 'g</span></div>' +
    '<div><span class="iv">G</span><span class="in">' + m.grassi + 'g</span></div>' +
    '</div></div>';
}

function confermaImport() {
  if (!importPreview) return;
  N.nutrition.addMeal(getActiveDateKey(), importPreview);
  importPreview = null;
  closeSheet();
  renderDay();
  mostraToast('Pasto registrato');
}

function checkUrlImport() {
  var params = new URLSearchParams(window.location.search);
  var raw = params.get('import');
  if (!raw) return;
  try {
    apriImport(decodeURIComponent(raw));
    anteprimaImport();
  } catch (e) { /* ignore */ }
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', window.location.pathname);
  }
}
