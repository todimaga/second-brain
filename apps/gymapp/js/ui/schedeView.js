/**
 * Vista schede ed esercizi
 */

function renderSchede() {
  var el = document.getElementById('lista-schede');
  if (S().schede.length === 0) {
    el.innerHTML = '<div class="empty-s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/></svg><div class="empty-t">Nessuna scheda</div><div class="empty-sub">Tocca + per creare la tua prima scheda</div></div>';
    return;
  }
  document.getElementById('hint-schede').style.display = S().schede.length > 1 ? 'block' : 'none';
  var h = '';
  for (var i = 0; i < S().schede.length; i++) {
    var s = S().schede[i];
    h += '<div class="scard dnd-item" data-idx="' + i + '" data-id="' + s.id + '">';
    h += '<button type="button" class="dnd-handle" aria-label="Riordina">' + dndGrip + '</button>';
    h += '<div class="scard-main" onclick="apriScheda(' + s.id + ')">';
    h += '<div class="scard-l"><div class="scard-dot"></div><div><div class="scard-nome">' + s.nome + '</div><div class="scard-sub">' + s.esercizi.length + ' esercizi</div></div></div>';
    h += '<div class="scard-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>';
    h += '</div>';
    h += '<button type="button" class="rbtn del" title="Elimina scheda" onclick="elimScheda(event,' + s.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
    h += '</div>';
  }
  el.innerHTML = h;
}

function apriScheda(id) {
  S().schedeAttiva = id;
  var s = S().schede.find(function (x) { return x.id === id; });
  document.getElementById('det-title').textContent = s.nome;
  renderEse();
  goTo('s-dettaglio');
}

function elimScheda(e, id) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  var s = G.scheda.getById(id);
  if (s && confirm('Eliminare "' + s.nome + '"?')) {
    G.scheda.remove(id);
    renderSchede();
  }
}

function creaScheda() {
  var nome = document.getElementById('in-scheda').value.trim();
  if (!nome) return;
  G.scheda.create(nome);
  document.getElementById('in-scheda').value = '';
  renderSchede();
  closeSheet();
}

function renderEse() {
  var s = S().schede.find(function (x) { return x.id === S().schedeAttiva; });
  if (!s) return;
  var el = document.getElementById('lista-ese');
  if (s.esercizi.length === 0) {
    el.innerHTML = '<div class="empty-s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><div class="empty-t">Nessun esercizio</div><div class="empty-sub">Tocca + per aggiungere il primo esercizio</div></div>';
    return;
  }
  document.getElementById('hint-ese').style.display = s.esercizi.length > 1 ? 'block' : 'none';
  var h = '';
  for (var i = 0; i < s.esercizi.length; i++) {
    var e = s.esercizi[i];
    var ph = e.peso > 0 ? ('<span class="pval">' + e.peso + '</span><span class="punit">kg</span>') : '<span class="pval">-</span>';
    h += '<div class="erow dnd-item" data-idx="' + i + '" data-id="' + e.id + '">';
    h += '<button type="button" class="dnd-handle" aria-label="Riordina">' + dndGrip + '</button>';
    h += '<div class="cn"><span class="enome">' + e.nome + '</span></div>';
    h += '<div class="cs"><span class="cval">' + e.set + '</span></div>';
    h += '<div class="cr"><span class="cval" style="font-size:12px">' + e.rep + '</span></div>';
    h += '<div class="cri"><div class="rir-b">' + e.rir + '</div></div>';
    h += '<div class="cp"><div class="pcell">' + ph + '</div></div>';
    h += '<div class="ca"><div class="racts">';
    h += '<button class="rbtn edit" onclick="event.stopPropagation();apriMod(' + e.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>';
    h += '<button class="rbtn del" onclick="event.stopPropagation();elimEse(' + e.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
    h += '</div></div></div>';
  }
  el.innerHTML = h;
}

function aggiungiEse() {
  var nome = document.getElementById('in-ese-nome').value.trim();
  var rep = document.getElementById('in-ese-rep').value.trim();
  var peso = parseFloat(document.getElementById('in-ese-peso').value) || 0;
  if (!nome || !rep) return;
  G.esercizio.add(S().schedeAttiva, {
    nome: nome, rep: rep, set: S().stepNew.set, rir: S().stepNew.rir, peso: peso
  });
  document.getElementById('in-ese-nome').value = '';
  document.getElementById('in-ese-rep').value = '';
  document.getElementById('in-ese-peso').value = '';
  renderEse();
  closeSheet();
}

function elimEse(id) {
  G.esercizio.remove(S().schedeAttiva, id);
  renderEse();
}

function apriMod(id) {
  var s = S().schede.find(function (x) { return x.id === S().schedeAttiva; });
  var e = s.esercizi.find(function (x) { return x.id === id; });
  if (!e) return;
  S().eseInMod = id;
  document.getElementById('mod-nome').value = e.nome;
  document.getElementById('mod-rep').value = e.rep;
  document.getElementById('mod-peso').value = e.peso > 0 ? e.peso : '';
  S().stepMod.set = e.set;
  S().stepMod.rir = e.rir;
  document.getElementById('mod-set-v').textContent = e.set;
  document.getElementById('mod-set-lbl').textContent = e.set + ' serie';
  document.getElementById('mod-rir-v').textContent = e.rir;
  document.getElementById('mod-rir-lbl').textContent = e.rir + ' rep di riserva';
  openSheet('sh-mod-ese');
}

function salvaModEse() {
  var nome = document.getElementById('mod-nome').value.trim();
  var rep = document.getElementById('mod-rep').value.trim();
  var peso = parseFloat(document.getElementById('mod-peso').value) || 0;
  if (!nome || !rep) return;
  G.esercizio.update(S().schedeAttiva, S().eseInMod, {
    nome: nome, rep: rep, set: S().stepMod.set, rir: S().stepMod.rir, peso: peso
  });
  renderEse();
  closeSheet();
}
