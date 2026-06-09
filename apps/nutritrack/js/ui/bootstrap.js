(function initNutriTrack() {
  N.store.load();
  setActiveDateKey(N.utils.dateKey());
  renderDay();
  renderPreferiti();
  checkUrlImport();
})();
