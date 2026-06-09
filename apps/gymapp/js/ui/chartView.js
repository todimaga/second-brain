/**
 * Vista grafici progressi
 */

function renderEseGrafico() {
  var el = document.getElementById('lista-ese-g');
  var h = '';
  for (var i = 0; i < S().tuttiEsercizi.length; i++) {
    var nome = S().tuttiEsercizi[i];
    var cnt = G.chart.countSessionsForExercise(nome);
    var sel = nome === S().eseGrafico;
    h += '<div class="ese-opt' + (sel ? ' sel' : '') + '" onclick="selEseGrafico(\'' + nome + '\')">';
    h += '<div><div class="ese-opt-nome">' + nome + '</div><div class="ese-opt-sub">' + cnt + ' sessioni</div></div>';
    if (sel) {
      h += '<div class="ese-opt-chk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
    }
    h += '</div>';
  }
  el.innerHTML = h;
}

function selEseGrafico(nome) {
  S().eseGrafico = nome;
  document.getElementById('g-ese-lbl').textContent = nome;
  closeSheet();
  renderGrafico();
}

function switchMet(m) {
  S().metrica = m;
  var tabs = document.querySelectorAll('.mtab');
  var nomi = ['peso', 'volume', '1rm'];
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].className = 'mtab' + (nomi[i] === m ? ' active' : '');
  }
  if (S().eseGrafico) renderGrafico();
}

function calcolaVal(nome, met) {
  return G.chart.calcolaVal(nome, met);
}

function renderGrafico() {
  if (!S().eseGrafico) return;
  var dati = calcolaVal(S().eseGrafico, S().metrica);
  if (dati.length === 0) return;
  var valori = [];
  for (var i = 0; i < dati.length; i++) valori.push(dati[i].val);
  var minV = valori[0];
  var maxV = valori[0];
  for (var i = 1; i < valori.length; i++) {
    if (valori[i] < minV) minV = valori[i];
    if (valori[i] > maxV) maxV = valori[i];
  }
  var unita = 'kg';
  var metLbl = S().metrica === 'peso' ? 'Peso' : S().metrica === 'volume' ? 'Volume' : '1RM stimato';

  document.getElementById('g-content').style.display = 'block';
  document.getElementById('g-empty').style.display = 'none';
  document.getElementById('g-nome').textContent = S().eseGrafico;
  document.getElementById('g-sub').textContent = metLbl + ' - ' + dati.length + ' sessioni';

  var W = 320;
  var H = 190;
  var pL = 42;
  var pR = 10;
  var pT = 14;
  var pB = 28;
  var cW = W - pL - pR;
  var cH = H - pT - pB;
  var range = maxV - minV || 1;
  function xP(i) { return pL + i * (cW / (dati.length - 1)); }
  function yP(v) { return pT + cH - ((v - minV) / range) * cH; }

  var svgH = '';
  var yVals = [minV, minV + range / 2, maxV];
  for (var i = 0; i < yVals.length; i++) {
    var yy = yP(yVals[i]);
    var yl = S().metrica === 'volume' ? Math.round(yVals[i]) : (Math.round(yVals[i] * 10) / 10);
    svgH += '<line x1="' + pL + '" y1="' + yy + '" x2="' + (W - pR) + '" y2="' + yy + '" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>';
    svgH += '<text font-size="10" fill="rgba(255,255,255,0.3)" font-family="DM Sans,sans-serif" x="' + (pL - 6) + '" y="' + (yy + 4) + '" text-anchor="end">' + yl + '</text>';
  }
  for (var i = 0; i < dati.length; i++) {
    if (i % 2 !== 0 && i !== dati.length - 1) continue;
    svgH += '<text font-size="9" fill="rgba(255,255,255,0.3)" font-family="DM Sans,sans-serif" text-anchor="middle" x="' + xP(i) + '" y="' + (H - 4) + '">' + dati[i].data + '</text>';
  }
  var ap = 'M ' + xP(0) + ',' + yP(dati[0].val);
  var lp = 'M ' + xP(0) + ',' + yP(dati[0].val);
  for (var i = 1; i < dati.length; i++) {
    ap += ' L ' + xP(i) + ',' + yP(dati[i].val);
    lp += ' L ' + xP(i) + ',' + yP(dati[i].val);
  }
  ap += ' L ' + xP(dati.length - 1) + ',' + (H - pB) + ' L ' + xP(0) + ',' + (H - pB) + ' Z';
  svgH += '<path d="' + ap + '" fill="white" opacity="0.08"/>';
  svgH += '<path d="' + lp + '" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
  for (var i = 0; i < dati.length; i++) {
    var dl = dati[i].data + ': ' + dati[i].val + unita;
    svgH += '<circle r="' + (i === dati.length - 1 ? '4' : '3.5') + '" cx="' + xP(i) + '" cy="' + yP(dati[i].val) + '" fill="white" stroke="#0a0a0a" stroke-width="2" style="cursor:pointer" onmouseenter="showTip(event,\'' + dl + '\')" onmouseleave="hideTip()" onclick="showTip(event,\'' + dl + '\')"/>';
  }
  document.getElementById('chart-svg').innerHTML = svgH;

  var chartStats = G.chart.computeStats(valori);
  var dif = chartStats.dif;
  var seg = dif > 0 ? '+' : '';
  var cc = dif > 0 ? 'pos' : dif < 0 ? 'neg' : '';
  document.getElementById('g-stats').innerHTML =
    '<div class="stat-card"><div class="stat-v">' + chartStats.ult + '<span class="stat-u"> ' + unita + '</span></div><div class="stat-l">ULTIMO</div></div>' +
    '<div class="stat-card"><div class="stat-v">' + chartStats.mas + '<span class="stat-u"> ' + unita + '</span></div><div class="stat-l">MAX</div></div>' +
    '<div class="stat-card ' + cc + '"><div class="stat-v">' + seg + dif + '<span class="stat-u"> ' + unita + '</span></div><div class="stat-l">PROGRESSO</div></div>';

  var recenti = dati.slice().reverse().slice(0, 2);
  S().recentiCache = dati.slice().reverse();
  S().unitaCache = unita;
  var eltUlt = document.getElementById('ult-sess');
  var eltLista = document.getElementById('ult-lista');
  eltUlt.style.display = 'block';
  var rh = '';
  for (var i = 0; i < recenti.length; i++) {
    var rd = recenti[i];
    var rp = recenti[i + 1];
    var dh = '';
    if (rp) {
      var rf = parseFloat((rd.val - rp.val).toFixed(1));
      var rs = rf > 0 ? '+' : '';
      var rc = rf > 0 ? 'su' : rf < 0 ? 'giu' : 'par';
      dh = '<span class="sess-delta ' + rc + '">' + (rf !== 0 ? rs + rf : '-') + '</span>';
    } else {
      dh = '<span class="sess-delta par">-</span>';
    }
    var re = G.chart.getExerciseSnapshot(S().eseGrafico, rd.data);
    var rl = re ? re.rep + ' reps' : '-';
    rh += '<div class="sess-row"><span class="sess-data">' + rd.data + '</span><span class="sess-reps">' + rl + '</span><span class="sess-peso">' + rd.val + '<span class="sess-punit"> ' + unita + '</span></span>' + dh + '</div>';
  }
  eltLista.innerHTML = rh;
  document.getElementById('btn-mostra').style.display = S().recentiCache.length > 2 ? 'block' : 'none';
}

function showTip(e, t) {
  var el = document.getElementById('chart-tip');
  el.textContent = t;
  el.className = 'chart-tooltip vis';
  var w = el.parentElement.getBoundingClientRect();
  var d = e.target.getBoundingClientRect();
  el.style.left = Math.min(d.left - w.left - 20, w.width - 120) + 'px';
  el.style.top = (d.top - w.top - 36) + 'px';
}

function hideTip() {
  document.getElementById('chart-tip').className = 'chart-tooltip';
}

function apriTutteSess() {
  document.getElementById('sh-tutte-title').textContent = S().eseGrafico || '';
  var h = '';
  for (var i = 0; i < S().recentiCache.length; i++) {
    var rd = S().recentiCache[i];
    var rp = S().recentiCache[i + 1];
    var dh = '';
    if (rp) {
      var rf = parseFloat((rd.val - rp.val).toFixed(1));
      var rs = rf > 0 ? '+' : '';
      var rc = rf > 0 ? 'su' : rf < 0 ? 'giu' : 'par';
      dh = '<span class="sess-delta ' + rc + '">' + (rf !== 0 ? rs + rf : '-') + '</span>';
    } else {
      dh = '<span class="sess-delta par">-</span>';
    }
    var re = G.chart.getExerciseSnapshot(S().eseGrafico, rd.data);
    var rl = re ? re.rep + ' reps' : '-';
    h += '<div class="sess-row" style="padding:12px 4px"><span class="sess-data">' + rd.data + '</span><span class="sess-reps">' + rl + '</span><span class="sess-peso">' + rd.val + '<span class="sess-punit"> ' + S().unitaCache + '</span></span>' + dh + '</div>';
  }
  document.getElementById('sh-tutte-lista').innerHTML = h;
  openSheet('sh-tutte-sess');
}
