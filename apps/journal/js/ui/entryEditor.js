// ─── entryEditor.js ──────────────────────────────────────────────────────────
// Sheet per creare / modificare una voce.
// In React → <EntryEditorSheet /> component.

let _editingId = null;    // null = nuova voce
let _editorPhoto = null;  // data URL temporaneo durante editing

function openEditorSheet(existing = null) {
  _editingId = existing ? existing.id : null;
  _editorPhoto = existing ? existing.photo : null;

  // Titolo sheet
  document.getElementById('sh-editor-title').textContent =
    existing ? 'Modifica voce' : 'Nuova voce';

  // Popola campi
  document.getElementById('ed-title').value = existing ? (existing.title || '') : '';
  document.getElementById('ed-body').value = existing ? (existing.body || '') : '';

  // Mood
  const moodVal = existing ? existing.mood : 3;
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.mood) === moodVal);
  });

  // Tag
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.classList.toggle('active', existing ? (existing.tags || []).includes(btn.dataset.tag) : false);
  });

  // Foto preview
  renderPhotoPreview(_editorPhoto);

  // Bottone elimina: visibile solo in edit
  const delBtn = document.getElementById('btn-delete');
  delBtn.style.display = existing ? 'block' : 'none';

  openSheet('sh-editor');
}

function renderPhotoPreview(dataUrl) {
  const container = document.getElementById('photo-preview');
  if (dataUrl) {
    container.innerHTML = `
      <div class="photo-prev-wrap">
        <img src="${dataUrl}" class="photo-prev-img" alt="Foto ricordo"/>
        <button class="photo-prev-remove" onclick="removeEditorPhoto()" title="Rimuovi foto">✕</button>
      </div>`;
  } else {
    container.innerHTML = `
      <label class="photo-upload-btn" for="photo-input">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span>Aggiungi foto ricordo</span>
      </label>
      <input type="file" id="photo-input" accept="image/*" style="display:none" onchange="handlePhotoInput(this)">`;
  }
}

async function handlePhotoInput(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    // Resize: max 800px lato lungo, qualità 0.82 — mantiene le dimensioni leggere per localStorage
    const dataUrl = await resizeImage(file, 800, 0.82);
    _editorPhoto = dataUrl;
    renderPhotoPreview(dataUrl);
  } catch (err) {
    showToast('Errore caricamento foto');
  }
}

function removeEditorPhoto() {
  _editorPhoto = null;
  renderPhotoPreview(null);
}

/**
 * Ridimensiona un'immagine via Canvas prima di salvarla come base64.
 * Mantiene l'aspect ratio; se l'immagine è già più piccola non la ingrandisce.
 */
function resizeImage(file, maxSide, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getEditorMood() {
  const active = document.querySelector('.mood-btn.active');
  return active ? parseInt(active.dataset.mood) : 3;
}

function getEditorTags() {
  return [...document.querySelectorAll('.tag-btn.active')].map(b => b.dataset.tag);
}

function toggleMood(btn) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleTag(btn) {
  btn.classList.toggle('active');
}

function saveEntry() {
  const title = document.getElementById('ed-title').value.trim();
  const body = document.getElementById('ed-body').value.trim();
  const mood = getEditorMood();
  const tags = getEditorTags();

  if (!body && !title && !_editorPhoto) {
    showToast('Scrivi almeno qualcosa ✏️');
    return;
  }

  if (_editingId) {
    Store.update(_editingId, { title, body, mood, tags, photo: _editorPhoto });
    showToast('Voce aggiornata ✓');
  } else {
    Store.create({ title, body, mood, tags, photo: _editorPhoto });
    showToast('Voce salvata ✓');
  }

  closeSheet();
  renderStats();
  renderList();
}

function deleteEntry() {
  if (!_editingId) return;
  Store.remove(_editingId);
  showToast('Voce eliminata');
  closeSheet();
  renderStats();
  renderList();
}
