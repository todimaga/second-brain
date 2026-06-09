/**
 * Vista calendario allenamenti
 */

function cambiaMese(d) {
  G.calendar.shiftMonth(d);
  renderCal();
}

function renderCal() {
  document.getElementById('cal-lbl').textContent = G.calendar.getMonthLabel();
  var grid = G.calendar.buildGrid();
  var stats = G.calendar.getMonthStats();
  var h = '';
  var i, cell, ds, cls, oc;

  for (i = 0; i < grid.offset; i++) h += '<div class="cal-cell empty"></div>';
  for (i = 0; i < grid.cells.length; i++) {
    cell = grid.cells[i];
    ds = cell.dateKey;
    cls = 'cal-cell' + (cell.trained ? ' trained' : '') + (cell.isToday ? ' today' : '');
    oc = cell.trained ? 'onclick="apriGiorno(\'' + ds + '\')"' : '';
    h += '<div class="' + cls + '" ' + oc + '>';
    h += '<span class="cal-n">' + cell.day + '</span>';
    if (cell.trained) h += '<div class="cal-dot"></div>';
    h += '</div>';
  }
  document.getElementById('cal-grid').innerHTML = h;
  document.getElementById('cal-stats').innerHTML =
    '<div class="stat-card"><div class="stat-v">' + stats.sessioni + '</div><div class="stat-l">SESSIONI</div></div>' +
    '<div class="stat-card"><div class="stat-v">' + stats.setTotali + '</div><div class="stat-l">SET TOTALI</div></div>' +
    '<div class="stat-card"><div class="stat-v">' + stats.giorniTraSessioni + '</div><div class="stat-l">GG TRA SESS.</div></div>';
}

function apriGiorno(ds) {
  var a = G.calendar.getDayEntry(ds);
  if (!a) return;
  var dataLbl = G.calendar.formatDayLabel(ds);
  var h = '<div class="det-data">' + dataLbl + '</div>';
  h += '<div class="det-scheda">' + a.scheda + '</div>';
  for (var i = 0; i < a.esercizi.length; i++) {
    if (i > 0) h += '<div class="ese-div"></div>';
    var e = a.esercizi[i];
    h += '<div><div class="det-ese-nome">' + e.nome + '</div>';
    for (var si = 0; si < e.sets.length; si++) {
      var sv = e.sets[si];
      h += '<div class="det-set-row">';
      h += '<span class="det-set-num">SET ' + (si + 1) + '</span>';
      h += '<span class="det-set-val">' + sv.rep + ' reps</span>';
      h += '<span class="det-set-peso">' + (sv.peso > 0 ? sv.peso : 'BW');
      if (sv.peso > 0) h += '<span class="det-set-unit">kg</span>';
      h += '</span></div>';
    }
    h += '</div>';
  }
  document.getElementById('sh-det-content').innerHTML = h;
  openSheet('sh-det-giorno');
}
