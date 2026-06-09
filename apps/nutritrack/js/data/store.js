(function (global) {
  var NutriTrack = (global.NutriTrack = global.NutriTrack || {});
  var C = NutriTrack.constants;
  var U = NutriTrack.utils;

  var state = {
    giornoAllenamento: false,
    log: {},
    preferiti: [],
    nextId: 1
  };

  NutriTrack.store = {
    getState: function () {
      return state;
    },

    allocId: function () {
      return state.nextId++;
    },

    getDay: function (dateKey) {
      if (!state.log[dateKey]) {
        state.log[dateKey] = { pasti: [] };
      }
      return state.log[dateKey];
    },

    save: function () {
      try {
        localStorage.setItem(C.STORAGE_PREFIX + 'log', JSON.stringify(state.log));
        localStorage.setItem(C.STORAGE_PREFIX + 'preferiti', JSON.stringify(state.preferiti));
        localStorage.setItem(C.STORAGE_PREFIX + 'settings', JSON.stringify({
          giornoAllenamento: state.giornoAllenamento
        }));
        localStorage.setItem(C.STORAGE_PREFIX + 'nextId', String(state.nextId));
      } catch (err) {
        console.warn('NutriTrack: salvataggio non riuscito', err);
      }
    },

    load: function () {
      try {
        var log = localStorage.getItem(C.STORAGE_PREFIX + 'log');
        var pref = localStorage.getItem(C.STORAGE_PREFIX + 'preferiti');
        var set = localStorage.getItem(C.STORAGE_PREFIX + 'settings');
        var nid = localStorage.getItem(C.STORAGE_PREFIX + 'nextId');
        if (log) state.log = JSON.parse(log);
        if (pref) state.preferiti = JSON.parse(pref);
        if (set) {
          var s = JSON.parse(set);
          if (typeof s.giornoAllenamento === 'boolean') state.giornoAllenamento = s.giornoAllenamento;
        }
        if (nid) state.nextId = parseInt(nid, 10) || state.nextId;
      } catch (err) {
        console.warn('NutriTrack: caricamento non riuscito', err);
      }
    }
  };
})(window);
