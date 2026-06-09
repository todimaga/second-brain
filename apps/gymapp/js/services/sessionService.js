/**
 * Logica sessione allenamento (senza DOM)
 */
(function (global) {
  var GymApp = (global.GymApp = global.GymApp || {});
  var store = GymApp.store;
  var chart = GymApp.chart;
  var U = GymApp.utils;

  function st() {
    return store.getState();
  }

  GymApp.session = {
    start: function (scheda) {
      if (!scheda || scheda.esercizi.length === 0) return null;
      var sessione = {
        scheda: scheda,
        eseIdx: 0,
        setIdx: 0,
        sets: scheda.esercizi.map(function (e) {
          var rep0 = U.parseRepIniziale(e.rep);
          var arr = [];
          for (var i = 0; i < e.set; i++) arr.push({ repE: rep0, peso: e.peso, done: false });
          return arr;
        })
      };
      st().sessione = sessione;
      return sessione;
    },

    get: function () {
      return st().sessione;
    },

    end: function () {
      st().sessione = null;
    },

    buildStoricoEntry: function (sessione) {
      var entry = { scheda: sessione.scheda.nome, esercizi: [] };
      var ei, ese, sets, arr, si;
      for (ei = 0; ei < sessione.scheda.esercizi.length; ei++) {
        ese = sessione.scheda.esercizi[ei];
        sets = [];
        arr = sessione.sets[ei];
        for (si = 0; si < arr.length; si++) {
          if (arr[si].done) sets.push({ rep: arr[si].repE, peso: arr[si].peso });
        }
        if (sets.length > 0) entry.esercizi.push({ nome: ese.nome, sets: sets });
      }
      return entry;
    },

    saveToStorico: function (sessione, dateKey) {
      var entry = this.buildStoricoEntry(sessione);
      if (entry.esercizi.length === 0) {
        return { saved: false, empty: true, entry: entry };
      }
      var ds = dateKey || U.dateKey();
      st().storico[ds] = entry;
      chart.mergeSessionIntoGrafico(ds, entry);
      store.syncEsercizi();
      store.save();
      return { saved: true, empty: false, dateKey: ds, entry: entry };
    }
  };
})(window);
