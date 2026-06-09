/**
 * Logica calendario (senza DOM)
 */
(function (global) {
  var GymApp = (global.GymApp = global.GymApp || {});
  var store = GymApp.store;
  var C = GymApp.constants;
  var U = GymApp.utils;

  function st() {
    return store.getState();
  }

  GymApp.calendar = {
    shiftMonth: function (delta) {
      st().calMese += delta;
      if (st().calMese < 0) { st().calMese = 11; st().calAnno--; }
      if (st().calMese > 11) { st().calMese = 0; st().calAnno++; }
    },

    getMonthLabel: function () {
      return C.MESI_NOMI[st().calMese] + ' ' + st().calAnno;
    },

    buildGrid: function () {
      var anno = st().calAnno;
      var mese = st().calMese;
      var primo = new Date(anno, mese, 1);
      var ultG = new Date(anno, mese + 1, 0).getDate();
      var offset = (primo.getDay() + 6) % 7;
      var oggi = new Date();
      var oggiStr = U.dateKey(oggi);
      var cells = [];
      var g, ds, trained, isOggi;

      for (g = 1; g <= ultG; g++) {
        ds = anno + '-' + U.pad(mese + 1) + '-' + U.pad(g);
        trained = !!st().storico[ds];
        isOggi = ds === oggiStr;
        cells.push({ day: g, dateKey: ds, trained: trained, isToday: isOggi });
      }

      return { offset: offset, cells: cells, daysInMonth: ultG, todayKey: oggiStr };
    },

    getMonthStats: function () {
      var anno = st().calAnno;
      var mese = st().calMese;
      var ultG = new Date(anno, mese + 1, 0).getDate();
      var prefix = anno + '-' + U.pad(mese + 1);
      var chiavi = Object.keys(st().storico).filter(function (k) {
        return k.indexOf(prefix) === 0;
      });
      var totS = chiavi.length;
      var totSet = 0;
      var ci, ei, ese;
      for (ci = 0; ci < chiavi.length; ci++) {
        ese = st().storico[chiavi[ci]].esercizi;
        for (ei = 0; ei < ese.length; ei++) totSet += ese[ei].sets.length;
      }
      return {
        sessioni: totS,
        setTotali: totSet,
        giorniTraSessioni: totS > 0 ? Math.round(ultG / totS) : '-'
      };
    },

    getDayEntry: function (dateKey) {
      return st().storico[dateKey] || null;
    },

    formatDayLabel: function (dateKey) {
      var parti = dateKey.split('-');
      var d = new Date(parseInt(parti[0], 10), parseInt(parti[1], 10) - 1, parseInt(parti[2], 10));
      return C.GIORNI_NOMI[d.getDay()] + ' ' + d.getDate() + ' ' + C.MESI_BREVI[d.getMonth()] + ' ' + d.getFullYear();
    }
  };
})(window);
