/**
 * Stato applicazione + persistenza localStorage
 */
(function (global) {
  var GymApp = (global.GymApp = global.GymApp || {});
  var C = GymApp.constants;
  var seed = GymApp.seed.getDefaults();

  var state = {
    schede: seed.schede,
    storico: seed.storico,
    storicoGrafico: seed.storicoGrafico,
    tuttiEsercizi: seed.tuttiEsercizi.slice(),
    schedeAttiva: null,
    sessione: null,
    eseInMod: null,
    stepNew: { set: 3, rir: 1 },
    stepMod: { set: 3, rir: 1 },
    timerDur: 120,
    timerSec: 120,
    timerInt: null,
    timerOn: false,
    eseGrafico: null,
    metrica: 'peso',
    calAnno: 2026,
    calMese: 4,
    nextId: 200,
    recentiCache: [],
    unitaCache: ''
  };

  GymApp.store = {
    getState: function () {
      return state;
    },

    allocId: function () {
      return state.nextId++;
    },

    syncEsercizi: function () {
      var map = {};
      var i, j, k, keys, ese;
      for (i = 0; i < state.schede.length; i++) {
        for (j = 0; j < state.schede[i].esercizi.length; j++) {
          map[state.schede[i].esercizi[j].nome] = true;
        }
      }
      keys = Object.keys(state.storico);
      for (k = 0; k < keys.length; k++) {
        ese = state.storico[keys[k]].esercizi;
        for (j = 0; j < ese.length; j++) map[ese[j].nome] = true;
      }
      state.tuttiEsercizi = Object.keys(map).sort();
    },

    migrateLegacy: function () {
      var keys = C.STORAGE_KEYS;
      for (var i = 0; i < keys.length; i++) {
        var nuovo = C.STORAGE_PREFIX + keys[i];
        var vecchio = C.LEGACY_PREFIX + keys[i];
        if (!localStorage.getItem(nuovo) && localStorage.getItem(vecchio)) {
          localStorage.setItem(nuovo, localStorage.getItem(vecchio));
        }
      }
    },

    save: function () {
      try {
        localStorage.setItem(C.STORAGE_PREFIX + 'schede', JSON.stringify(state.schede));
        localStorage.setItem(C.STORAGE_PREFIX + 'storico', JSON.stringify(state.storico));
        localStorage.setItem(C.STORAGE_PREFIX + 'storicoGrafico', JSON.stringify(state.storicoGrafico));
        localStorage.setItem(C.STORAGE_PREFIX + 'nextId', String(state.nextId));
        localStorage.setItem(C.STORAGE_PREFIX + 'timerDur', String(state.timerDur));
      } catch (err) {
        console.warn('Salvataggio non riuscito', err);
      }
    },

    load: function () {
      try {
        this.migrateLegacy();
        var s = localStorage.getItem(C.STORAGE_PREFIX + 'schede');
        var h = localStorage.getItem(C.STORAGE_PREFIX + 'storico');
        var g = localStorage.getItem(C.STORAGE_PREFIX + 'storicoGrafico');
        var nid = localStorage.getItem(C.STORAGE_PREFIX + 'nextId');
        var td = localStorage.getItem(C.STORAGE_PREFIX + 'timerDur');
        if (s) state.schede = JSON.parse(s);
        if (h) state.storico = JSON.parse(h);
        if (g) state.storicoGrafico = JSON.parse(g);
        if (nid) state.nextId = parseInt(nid, 10) || state.nextId;
        if (td !== null) {
          state.timerDur = parseInt(td, 10);
          state.timerSec = state.timerDur;
        }
        this.syncEsercizi();
        return { timerDur: state.timerDur };
      } catch (err) {
        console.warn('Caricamento non riuscito', err);
        return { timerDur: state.timerDur };
      }
    }
  };
})(window);
