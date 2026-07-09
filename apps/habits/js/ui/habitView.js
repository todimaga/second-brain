// ─── habitView.js ─────────────────────────────────────────────────────────────
// Render lista abitudini, check-in, storico e stats globali (v2).

function renderStats() {
  const s = HabitsService.getGlobalStats();
  const el = id => document.getElementById(id);
  const set = (i, v) => { const e = el(i); if (e) e.textContent = v; };
  set('stat-total', s.total);
  set('stat-today', s.completedToday + '/' + s.totalActiveToday);
  set('stat-streak', s.bestStreak);
  set('stat-perfect', s.perfectDays);

  // Progress ring
  const pct = s.totalActiveToday > 0
    ? Math.round((s.completedToday / s.totalActiveToday) * 100)
    : 0;
  const ring = document.getElementById('progress-ring-fill');
  if (ring) {
    const r = 22;
    const circ = 2 * Math.PI * r;
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ * (1 - pct / 100);
  }
  const pctLabel = document.getElementById('progress-pct-label');
  if (pctLabel) pctLabel.textContent = pct + '%';
}

function renderList() {
  const container = document.getElementById('habit-list');
  if (!container) return;

  const habits = HabitsService.getEnrichedHabits(getFilter(), getSortMode());

  if (habits.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <div class="empty-t">Nessuna abitudine</div>
        <div class="empty-s">Aggiungi la tua prima abitudine per iniziare a costruire routine solide.</div>
      </div>`;
    return;
  }

  container.innerHTML = habits.map(h => buildHabitCard(h)).join('');
}

function buildHabitCard(h) {
  const doneClass = h.completedToday ? 'done' : '';
  const inactiveClass = !h.activeToday ? 'inactive' : '';
  const checkIcon = h.completedToday
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    : '';

  const dots = h.last7.map(d =>
    `<div class="day-dot ${d.completed ? 'filled' : ''}" style="${d.completed ? `background:${h.color}` : ''}" title="${formatShortDate(d.key)}"></div>`
  ).join('');

  const streakBadge = h.streak > 0
    ? `<span class="streak-badge" style="border-color:${h.color}22;color:${h.color}">🔥 ${h.streak}</span>`
    : '';

  const typeInfo = HABIT_TYPES.find(t => t.id === (h.type || 'other')) || HABIT_TYPES[HABIT_TYPES.length - 1];

  const freqLabel = h.frequency === 'weekly' && h.activeDays && h.activeDays.length > 0
    ? h.activeDays.map(d => DAYS_SHORT[d]).join(' ')
    : '';

  const inactiveOverlay = !h.activeToday
    ? `<span class="inactive-label">Non prevista oggi</span>`
    : '';

  return `
    <div class="habit-card ${doneClass} ${inactiveClass}" id="hc-${h.id}">
      <button class="check-btn" onclick="toggleHabit('${h.id}')" style="--hcolor:${h.color}" aria-label="Completa ${h.name}" ${!h.activeToday ? 'disabled' : ''}>
        <span class="check-emoji">${h.completedToday ? '' : h.emoji}</span>
        <span class="check-mark">${checkIcon}</span>
      </button>
      <div class="habit-info" onclick="openHabitDetail('${h.id}')">
        <div class="habit-top">
          <span class="habit-name">${h.name}</span>
          ${streakBadge}
          ${inactiveOverlay}
        </div>
        <div class="habit-meta">
          <span class="habit-type-tag">${typeInfo.emoji} ${typeInfo.label}</span>
          ${freqLabel ? `<span class="habit-freq-tag">${freqLabel}</span>` : ''}
        </div>
        <div class="habit-dots">${dots}</div>
        <div class="habit-pct-wrap">
          <div class="habit-pct-bar">
            <div class="habit-pct-fill" style="width:${h.monthPct}%;background:${h.color}"></div>
          </div>
          <span class="habit-pct-lbl">${h.monthPct}% questo mese</span>
        </div>
      </div>
      <button class="habit-del-btn" onclick="confirmDelete('${h.id}', '${h.name.replace(/'/g, "\\'")}')" aria-label="Elimina ${h.name}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>
    </div>`;
}

function toggleHabit(id) {
  const justCompleted = Store.toggleToday(id);
  const card = document.getElementById('hc-' + id);
  if (card && justCompleted) {
    card.classList.add('pop');
    setTimeout(() => card.classList.remove('pop'), 500);
    // Confetti-like particles
    spawnParticles(card);
    showToast('✅ Abitudine completata!');
  } else if (card) {
    showToast('↩️ Check-in annullato');
  }
  renderStats();
  renderList();
}

/** Mini particelle celebrate */
function spawnParticles(card) {
  const rect = card.getBoundingClientRect();
  const phone = document.querySelector('.phone');
  const pr = phone.getBoundingClientRect();
  const colors = ['#f97316','#22d3ee','#a78bfa','#34d399','#fb7185','#fbbf24'];
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left:${rect.left - pr.left + rect.width / 2}px;
      top:${rect.top - pr.top + rect.height / 2}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      --dx:${(Math.random() - 0.5) * 100}px;
      --dy:${-(Math.random() * 80 + 20)}px;
    `;
    phone.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

function confirmDelete(id, name) {
  document.getElementById('del-habit-name').textContent = `"${name}"`;
  document.getElementById('btn-confirm-del').onclick = () => {
    Store.removeHabit(id);
    closeSheet();
    renderStats();
    renderList();
    showToast('🗑️ Abitudine eliminata');
  };
  openSheet('sh-delete');
}

// ── Detail sheet ──────────────────────────────────────────────────────────────
function openHabitDetail(id) {
  const habits = HabitsService.getEnrichedHabits();
  const h = habits.find(x => x.id === id);
  if (!h) return;

  const calDays = HabitsService.getCalendarDays(id, 28);
  const typeInfo = HABIT_TYPES.find(t => t.id === (h.type || 'other')) || HABIT_TYPES[HABIT_TYPES.length - 1];

  // Render heatmap 28 giorni allineato a settimana (Lun–Dom)
  // Calcola padding iniziale: il primo giorno di calDays cade su quale colonna?
  const firstWd = weekdayOf(calDays[0].key); // 0=Lun, 6=Dom
  const paddedCells = Array.from({ length: firstWd }, (_, i) =>
    `<div class="heat-cell" style="opacity:0;pointer-events:none"></div>`
  );
  const dayCells = calDays.map(d => {
    const isToday = d.key === todayKey();
    return `<div class="heat-cell ${d.completed ? 'filled' : ''} ${isToday ? 'today' : ''}"
      style="${d.completed ? `background:${h.color};box-shadow:0 0 6px ${h.color}55` : ''}"
      onclick="toggleCalDay('${id}','${d.key}',this,'${h.color}')"
      title="${formatShortDate(d.key)}"></div>`;
  });
  const heatmapHTML = [...paddedCells, ...dayCells].join('');

  // Note
  const noteHTML = h.note
    ? `<div class="detail-note"><span class="detail-note-icon">💬</span>${h.note}</div>`
    : '';

  // Frequency label
  let freqText = 'Ogni giorno';
  if (h.frequency === 'weekly' && h.activeDays && h.activeDays.length > 0) {
    freqText = h.activeDays.map(d => DAYS_FULL[d]).join(', ');
  }

  document.getElementById('detail-emoji').textContent = h.emoji;
  document.getElementById('detail-name').textContent = h.name;
  document.getElementById('detail-streak').textContent = h.streak;
  document.getElementById('detail-max').textContent = h.maxStreak;
  document.getElementById('detail-total').textContent = h.totalDays;
  document.getElementById('detail-pct').textContent = h.monthPct + '%';
  document.getElementById('detail-type').textContent = typeInfo.emoji + ' ' + typeInfo.label;
  document.getElementById('detail-freq').textContent = '🗓️ ' + freqText;
  document.getElementById('detail-heatmap').innerHTML = heatmapHTML;
  document.getElementById('detail-note-area').innerHTML = noteHTML;

  document.getElementById('btn-edit-habit').onclick = () => {
    closeSheet();
    openEditorSheet(id);
  };
  openSheet('sh-detail');
}

function toggleCalDay(habitId, dateKey, cell, color) {
  const done = Store.toggleDay(habitId, dateKey);
  cell.classList.toggle('filled', done);
  cell.style.background = done ? color : '';
  cell.style.boxShadow = done ? `0 0 6px ${color}55` : '';
  renderStats();
  renderList();
}
