// ─── editorView.js ────────────────────────────────────────────────────────────
// Sheet per aggiungere / modificare un'abitudine (v2 con tipo, frequenza, nota).

let _editingId = null;
let _selectedEmoji = '🎯';
let _selectedColor = ACCENT;
let _selectedType = 'other';
let _selectedFreq = 'daily';
let _selectedDays = [];

function openEditorSheet(editId = null) {
  _editingId = editId;
  _selectedEmoji = '🎯';
  _selectedColor = ACCENT;
  _selectedType = 'other';
  _selectedFreq = 'daily';
  _selectedDays = [];

  const title = document.getElementById('sh-editor-title');
  const nameInput = document.getElementById('ed-name');
  const noteInput = document.getElementById('ed-note');
  const btnSave = document.getElementById('btn-save-habit');

  if (editId) {
    const habit = Store.getHabits().find(h => h.id === editId);
    if (!habit) return;
    title.textContent = 'Modifica Abitudine';
    nameInput.value = habit.name;
    if (noteInput) noteInput.value = habit.note || '';
    _selectedEmoji = habit.emoji;
    _selectedColor = habit.color;
    _selectedType = habit.type || 'other';
    _selectedFreq = habit.frequency || 'daily';
    _selectedDays = [...(habit.activeDays || [])];
    btnSave.textContent = 'Salva Modifiche';
  } else {
    title.textContent = 'Nuova Abitudine';
    nameInput.value = '';
    if (noteInput) noteInput.value = '';
    btnSave.textContent = 'Aggiungi';
  }

  renderTypePicker();
  renderEmojiPicker();
  renderColorPicker();
  renderFreqPicker();
  renderDaysPicker();
  openSheet('sh-editor');
  setTimeout(() => nameInput.focus(), 350);
}

function renderTypePicker() {
  const container = document.getElementById('type-grid');
  if (!container) return;
  container.innerHTML = HABIT_TYPES.map(t => `
    <button type="button" class="type-btn ${t.id === _selectedType ? 'sel' : ''}"
      onclick="selectType('${t.id}')" data-id="${t.id}">
      <span class="type-emoji">${t.emoji}</span>
      <span class="type-label">${t.label}</span>
    </button>
  `).join('');
}

function selectType(id) {
  _selectedType = id;
  renderTypePicker();
}

function renderEmojiPicker() {
  const container = document.getElementById('emoji-grid');
  if (!container) return;
  container.innerHTML = HABIT_EMOJIS.map(e => `
    <button type="button" class="emoji-btn ${e === _selectedEmoji ? 'sel' : ''}"
      onclick="selectEmoji('${e}')">${e}</button>
  `).join('');
}

function selectEmoji(emoji) {
  _selectedEmoji = emoji;
  renderEmojiPicker();
}

function renderColorPicker() {
  const container = document.getElementById('color-grid');
  if (!container) return;
  container.innerHTML = HABIT_COLORS.map(c => `
    <button type="button" class="color-dot ${c === _selectedColor ? 'sel' : ''}"
      style="background:${c}" onclick="selectColor('${c}')">
      ${c === _selectedColor ? '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
    </button>
  `).join('');
}

function selectColor(color) {
  _selectedColor = color;
  renderColorPicker();
}

function renderFreqPicker() {
  const dBtn = document.getElementById('freq-daily');
  const wBtn = document.getElementById('freq-weekly');
  const daysRow = document.getElementById('days-row');
  if (!dBtn || !wBtn) return;
  dBtn.classList.toggle('sel', _selectedFreq === 'daily');
  wBtn.classList.toggle('sel', _selectedFreq === 'weekly');
  if (daysRow) daysRow.style.display = _selectedFreq === 'weekly' ? 'flex' : 'none';
}

function selectFreq(freq) {
  _selectedFreq = freq;
  if (freq === 'daily') _selectedDays = [];
  renderFreqPicker();
  renderDaysPicker();
}

function renderDaysPicker() {
  const container = document.getElementById('days-picker');
  if (!container) return;
  container.innerHTML = DAYS_SHORT.map((d, i) => `
    <button type="button" class="day-pill ${_selectedDays.includes(i) ? 'sel' : ''}"
      onclick="toggleDay(${i})">${d}</button>
  `).join('');
}

function toggleDay(idx) {
  const pos = _selectedDays.indexOf(idx);
  if (pos === -1) _selectedDays.push(idx);
  else _selectedDays.splice(pos, 1);
  renderDaysPicker();
}

function saveHabit() {
  const name = document.getElementById('ed-name').value.trim();
  const noteEl = document.getElementById('ed-note');
  const note = noteEl ? noteEl.value.trim() : '';
  if (!name) { showToast('⚠️ Inserisci un nome'); return; }
  if (_selectedFreq === 'weekly' && _selectedDays.length === 0) {
    showToast('⚠️ Seleziona almeno un giorno'); return;
  }

  const payload = {
    name,
    emoji: _selectedEmoji,
    color: _selectedColor,
    type: _selectedType,
    frequency: _selectedFreq,
    activeDays: _selectedFreq === 'weekly' ? [..._selectedDays].sort() : [],
    note,
  };

  if (_editingId) {
    Store.updateHabit(_editingId, payload);
    showToast('✏️ Abitudine aggiornata');
  } else {
    Store.addHabit(payload);
    showToast('🎉 Abitudine aggiunta!');
  }

  closeSheet();
  renderStats();
  renderList();
}
