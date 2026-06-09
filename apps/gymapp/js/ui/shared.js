/**
 * UI condivisa: stato, drag-and-drop, toast
 */
var G = window.GymApp;

function S() {
  return G.store.getState();
}

var dndGrip = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>';

function clearDndMarks(container) {
  var items = container.querySelectorAll('.dnd-item');
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove('dnd-dragging', 'dnd-over-before', 'dnd-over-after');
    items[i].style.transform = '';
    items[i].style.zIndex = '';
  }
}

function getDropIndex(clientY, items) {
  for (var i = 0; i < items.length; i++) {
    var r = items[i].getBoundingClientRect();
    if (clientY < r.top + r.height / 2) return i;
  }
  return items.length - 1;
}

function setupListDnD(containerId, onReorder) {
  var container = document.getElementById(containerId);
  if (!container || container._dndReady) return;
  container._dndReady = true;
  var drag = null;

  function getItems() {
    return Array.prototype.slice.call(container.querySelectorAll('.dnd-item'));
  }

  container.addEventListener('pointerdown', function (e) {
    var handle = e.target.closest('.dnd-handle');
    if (!handle || !container.contains(handle)) return;
    var item = handle.closest('.dnd-item');
    if (!item) return;
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    drag = {
      item: item,
      from: parseInt(item.getAttribute('data-idx'), 10),
      pointerId: e.pointerId,
      startY: e.clientY,
      moved: false
    };
    item.classList.add('dnd-dragging');
  });

  container.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (Math.abs(e.clientY - drag.startY) > 4) drag.moved = true;
    if (!drag.moved) return;
    var items = getItems();
    var to = getDropIndex(e.clientY, items);
    drag.to = to;
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('dnd-over-before', 'dnd-over-after');
    }
    var mark = to;
    while (mark < items.length && items[mark] === drag.item) mark++;
    if (mark < items.length) items[mark].classList.add('dnd-over-before');
    else if (items.length) items[items.length - 1].classList.add('dnd-over-after');
    var dy = e.clientY - drag.startY;
    drag.item.style.transform = 'translateY(' + dy + 'px)';
    drag.item.style.zIndex = '10';
  });

  container.addEventListener('pointerup', function (e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    var handle = drag.item.querySelector('.dnd-handle');
    if (handle && handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
    if (drag.moved && drag.to !== undefined && drag.to !== drag.from) {
      onReorder(drag.from, drag.to);
    }
    clearDndMarks(container);
    drag = null;
  });

  container.addEventListener('pointercancel', function (e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    clearDndMarks(container);
    drag = null;
  });
}

function initSortableLists() {
  setupListDnD('lista-schede', function (from, to) {
    G.scheda.reorder(from, to);
    renderSchede();
  });
  setupListDnD('lista-ese', function (from, to) {
    if (!S().schedeAttiva) return;
    G.esercizio.reorder(S().schedeAttiva, from, to);
    renderEse();
  });
}

function mostraToast(msg) {
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('vis');
  clearTimeout(mostraToast._t);
  mostraToast._t = setTimeout(function () { el.classList.remove('vis'); }, 2200);
}
