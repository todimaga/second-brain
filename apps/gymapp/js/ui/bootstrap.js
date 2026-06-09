/**
 * Avvio GymApp
 */
(function initGymApp() {
  var loaded = G.store.load();
  initSortableLists();
  renderSchede();
  if (loaded && loaded.timerDur !== undefined) setTimer(loaded.timerDur);
})();
