/**
 * Navigazione schermate, sheet, stepper form
 */

function goTo(id) {
  var screens = document.querySelectorAll('.screen');
  for (var i = 0; i < screens.length; i++) {
    if (screens[i].classList.contains('active')) {
      screens[i].classList.remove('active');
      screens[i].classList.add('out');
      setTimeout(function (s) {
        return function () { s.classList.remove('out'); };
      }(screens[i]), 300);
    }
  }
  var t = document.getElementById(id);
  t.style.transform = 'translateX(32px)';
  t.classList.add('active');
  setTimeout(function () { t.style.transform = ''; }, 10);
}

function switchTab(i) {
  for (var j = 0; j < 3; j++) {
    var t = document.getElementById('tab-' + j);
    t.className = 'titem ' + (j === i ? 'on' : 'off');
  }
  if (i === 0) { goTo('s-schede'); }
  else if (i === 1) { goTo('s-cal'); renderCal(); }
  else if (i === 2) { goTo('s-grafico'); renderEseGrafico(); }
}

function openSheet(id) {
  document.getElementById('overlay').classList.add('vis');
  document.getElementById(id).classList.add('vis');
}

function closeSheet() {
  document.getElementById('overlay').classList.remove('vis');
  var sheets = document.querySelectorAll('.sheet');
  for (var i = 0; i < sheets.length; i++) {
    sheets[i].classList.remove('vis');
  }
}

var stepLimits = { set: [1, 10], rir: [0, 5] };

function stepChange(ctx, key, d) {
  var obj = ctx === 'new' ? S().stepNew : S().stepMod;
  var lim = stepLimits[key];
  obj[key] = Math.min(lim[1], Math.max(lim[0], obj[key] + d));
  var v = document.getElementById(ctx + '-' + key + '-v');
  var l = document.getElementById(ctx + '-' + key + '-lbl');
  if (v) v.textContent = obj[key];
  if (l) l.textContent = key === 'set' ? (obj[key] + ' serie') : (obj[key] + ' rep di riserva');
}
