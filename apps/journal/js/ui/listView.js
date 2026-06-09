// ─── listView.js ─────────────────────────────────────────────────────────────
// Render della lista voci e della stats card in cima.
// In React → <EntryList />, <StatsCard />, <SearchBar /> components.

let _currentQuery = '';
let _currentTag = null;

function renderStats() {
  const all = Store.getAll();
  const stats = JournalService.getStats(all);
  const moodObj = MOOD_LEVELS.find(m => m.value === stats.moodAvg);

  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-month').textContent = stats.thisMonth;
  document.getElementById('stat-streak').textContent = stats.streak;
  document.getElementById('stat-mood').textContent = moodObj ? moodObj.emoji : '—';
}

function renderTagFilters() {
  const container = document.getElementById('tag-filter-row');
  container.innerHTML = '';

  // "Tutti"
  const all = document.createElement('button');
  all.className = 'tag-filter-btn' + (!_currentTag ? ' active' : '');
  all.textContent = 'Tutti';
  all.onclick = () => { _currentTag = null; renderTagFilters(); renderList(); };
  container.appendChild(all);

  TAGS.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-filter-btn' + (_currentTag === tag ? ' active' : '');
    btn.textContent = tag;
    btn.onclick = () => { _currentTag = tag; renderTagFilters(); renderList(); };
    container.appendChild(btn);
  });
}

function renderList() {
  const container = document.getElementById('entry-list');
  let entries = Store.getAll();
  entries = JournalService.search(entries, _currentQuery);
  if (_currentTag) entries = JournalService.filterByTag(entries, _currentTag);

  if (!entries.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📓</div>
        <div class="empty-t">${_currentQuery || _currentTag ? 'Nessun risultato' : 'Il tuo diario è vuoto'}</div>
        <div class="empty-s">${_currentQuery || _currentTag ? 'Prova con un\'altra ricerca o rimuovi il filtro.' : 'Scrivi la tua prima voce e inizia a raccontare la tua storia.'}</div>
      </div>`;
    return;
  }

  container.innerHTML = entries.map(e => renderEntryCard(e)).join('');
}

function renderEntryCard(e) {
  const moodObj = MOOD_LEVELS.find(m => m.value === e.mood) || MOOD_LEVELS[2];
  const tagsHtml = (e.tags || []).map(t =>
    `<span class="entry-tag">${t}</span>`
  ).join('');
  const photoHtml = e.photo
    ? `<div class="entry-photo" style="background-image:url('${e.photo}')"></div>`
    : '';

  return `
    <div class="entry-card" onclick="openEntry('${e.id}')">
      ${photoHtml}
      <div class="entry-body-wrap">
        <div class="entry-top">
          <span class="entry-mood">${moodObj.emoji}</span>
          <span class="entry-date">${formatTimeAgo(e.createdAt)}</span>
        </div>
        ${e.title ? `<div class="entry-title">${e.title}</div>` : ''}
        <div class="entry-snippet">${truncate(e.body, 90)}</div>
        ${tagsHtml ? `<div class="entry-tags">${tagsHtml}</div>` : ''}
      </div>
    </div>`;
}

function openEntry(id) {
  const entry = Store.getById(id);
  if (!entry) return;
  openEditorSheet(entry);
}

function onSearch(val) {
  _currentQuery = val;
  renderList();
}
