/**
 * Vista sessione allenamento + timer
 */

function avviaSessione() {
  var s = G.scheda.getById(S().schedeAttiva);
  if (!G.session.start(s)) return;
  goTo('s-sessione');
  renderSess();
}

function renderSess() {
  if (!S().sessione) return;
  var e = S().sessione.scheda.esercizi[S().sessione.eseIdx];
  var si = S().sessione.setIdx;
  document.getElementById('sess-nome').textContent = e.nome;
  document.getElementById('sess-prog').textContent = (S().sessione.eseIdx + 1) + ' / ' + S().sessione.scheda.esercizi.length;
  document.getElementById('p-repp').textContent = e.rep;
  document.getElementById('p-rir').textContent = e.rir;
  var sc = S().sessione.sets[S().sessione.eseIdx][si];
  document.getElementById('p-repe').textContent = sc.repE;
  document.getElementById('p-peso').textContent = sc.peso % 1 === 0 ? sc.peso : sc.peso.toFixed(1);
  var h = '';
  for (var i = 0; i < e.set; i++) {
    var cls = 'stab';
    if (i === si) cls += ' active';
    else if (S().sessione.sets[S().sessione.eseIdx][i].done) cls += ' done';
    h += '<div class="' + cls + '" onclick="selSet(' + i + ')">Set ' + (i + 1) + '</div>';
  }
  document.getElementById('set-tabs').innerHTML = h;
  var btn = document.getElementById('btn-setdone');
  if (sc.done) {
    btn.className = 'btn-setdone done';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Completato';
  } else {
    btn.className = 'btn-setdone';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Set Completato';
  }
  document.getElementById('btn-prev').disabled = S().sessione.eseIdx === 0;
  document.getElementById('btn-next').disabled = S().sessione.eseIdx === S().sessione.scheda.esercizi.length - 1;
}

function selSet(i) {
  S().sessione.setIdx = i;
  renderSess();
}

function cambiaSet(campo, d) {
  if (!S().sessione) return;
  var sc = S().sessione.sets[S().sessione.eseIdx][S().sessione.setIdx];
  if (campo === 'repE') {
    sc.repE = Math.max(1, sc.repE + d);
    document.getElementById('p-repe').textContent = sc.repE;
  } else {
    sc.peso = Math.max(0, parseFloat((sc.peso + d).toFixed(1)));
    document.getElementById('p-peso').textContent = sc.peso % 1 === 0 ? sc.peso : sc.peso.toFixed(1);
  }
}

function completaSet() {
  if (!S().sessione) return;
  var sc = S().sessione.sets[S().sessione.eseIdx][S().sessione.setIdx];
  sc.done = !sc.done;
  if (sc.done) {
    avviaTimer();
    var e = S().sessione.scheda.esercizi[S().sessione.eseIdx];
    if (S().sessione.setIdx < e.set - 1) {
      var ni = S().sessione.setIdx + 1;
      setTimeout(function () { S().sessione.setIdx = ni; renderSess(); }, 300);
      return;
    }
  } else {
    stopTimer();
  }
  renderSess();
}

function navEse(d) {
  if (!S().sessione) return;
  var ni = S().sessione.eseIdx + d;
  if (ni < 0 || ni >= S().sessione.scheda.esercizi.length) return;
  S().sessione.eseIdx = ni;
  S().sessione.setIdx = 0;
  stopTimer();
  resetTimer();
  renderSess();
}

function chiudiSess() {
  stopTimer();
  goTo('s-dettaglio');
}

function fineSessione() {
  if (!S().sessione) return;
  stopTimer();
  var result = G.session.saveToStorico(S().sessione);
  if (result.empty) {
    if (!confirm('Nessun set completato. Chiudere senza salvare?')) return;
    chiudiSess();
    return;
  }
  G.session.end();
  mostraToast('Sessione salvata');
  chiudiSess();
  if (document.getElementById('s-cal').classList.contains('active')) renderCal();
  if (S().eseGrafico) renderGrafico();
}

function avviaTimer() {
  if (S().timerDur === 0) return;
  stopTimer();
  S().timerSec = S().timerDur;
  S().timerOn = true;
  updateTimerDisp();
  S().timerInt = setInterval(function () {
    S().timerSec = Math.max(0, S().timerSec - 1);
    updateTimerDisp();
    if (S().timerSec === 0) stopTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(S().timerInt);
  S().timerOn = false;
}

function resetTimer() {
  S().timerSec = S().timerDur;
  updateTimerDisp();
}

function updateTimerDisp() {
  var el = document.getElementById('timer-disp');
  if (!el) return;
  if (S().timerDur === 0) {
    el.textContent = 'Off';
    el.className = 'timer-val idle';
    return;
  }
  var m = Math.floor(S().timerSec / 60);
  var s = S().timerSec % 60;
  var mm = m < 10 ? '0' + m : '' + m;
  var ss = s < 10 ? '0' + s : '' + s;
  el.textContent = mm + ':' + ss;
  el.className = S().timerOn ? (S().timerSec <= 10 ? 'timer-val warn' : 'timer-val') : 'timer-val idle';
}

function setTimer(s) {
  S().timerDur = s;
  S().timerSec = s;
  stopTimer();
  updateTimerDisp();
  var btns = document.querySelectorAll('.tpbtn');
  var vals = G.constants.TIMER_PRESETS;
  for (var i = 0; i < btns.length; i++) {
    btns[i].className = 'tpbtn' + (vals[i] === s ? ' sel' : '');
  }
  G.store.save();
}
