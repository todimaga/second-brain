/**
 * Logica grafici e metriche (senza DOM)
 */
(function (global) {
  var GymApp = (global.GymApp = global.GymApp || {});
  var store = GymApp.store;
  var C = GymApp.constants;

  function st() {
    return store.getState();
  }

  GymApp.chart = {
    calcolaVal: function (nome, met) {
      var res = [];
      var i, e, v;
      for (i = 0; i < st().storicoGrafico.length; i++) {
        e = st().storicoGrafico[i].esercizi[nome];
        if (!e) continue;
        if (met === 'peso') v = e.peso;
        else if (met === 'volume') v = e.set * e.rep * e.peso;
        else v = Math.round(e.peso * (1 + e.rep / 30));
        res.push({ data: st().storicoGrafico[i].data, val: v });
      }
      return res;
    },

    mergeSessionIntoGrafico: function (dateKey, entry) {
      var parti = dateKey.split('-');
      var d = new Date(parseInt(parti[0], 10), parseInt(parti[1], 10) - 1, parseInt(parti[2], 10));
      var lbl = d.getDate() + ' ' + C.MESI_BREVI[d.getMonth()];
      var snap = {};
      var i, s, e, maxP, totRep, nSet, avgRep, idx, j;

      for (i = 0; i < entry.esercizi.length; i++) {
        e = entry.esercizi[i];
        maxP = 0;
        totRep = 0;
        nSet = e.sets.length;
        for (s = 0; s < e.sets.length; s++) {
          if (e.sets[s].peso > maxP) maxP = e.sets[s].peso;
          totRep += e.sets[s].rep;
        }
        avgRep = nSet > 0 ? Math.round(totRep / nSet) : 0;
        snap[e.nome] = { peso: maxP, set: nSet, rep: avgRep };
      }

      idx = -1;
      for (j = 0; j < st().storicoGrafico.length; j++) {
        if (st().storicoGrafico[j].data === lbl) { idx = j; break; }
      }
      if (idx >= 0) {
        st().storicoGrafico[idx].esercizi = Object.assign({}, st().storicoGrafico[idx].esercizi, snap);
      } else {
        st().storicoGrafico.push({ data: lbl, esercizi: snap });
      }
    },

    countSessionsForExercise: function (nome) {
      var cnt = 0;
      var j;
      for (j = 0; j < st().storicoGrafico.length; j++) {
        if (st().storicoGrafico[j].esercizi[nome]) cnt++;
      }
      return cnt;
    },

    getExerciseSnapshot: function (nome, dataLabel) {
      var j;
      for (j = 0; j < st().storicoGrafico.length; j++) {
        if (st().storicoGrafico[j].data === dataLabel) {
          return st().storicoGrafico[j].esercizi[nome] || null;
        }
      }
      return null;
    },

    computeStats: function (valori) {
      var ult = valori[valori.length - 1];
      var mas = valori[0];
      var i;
      for (i = 1; i < valori.length; i++) {
        if (valori[i] > mas) mas = valori[i];
      }
      var dif = parseFloat((ult - valori[0]).toFixed(1));
      return { ult: ult, mas: mas, dif: dif };
    }
  };
})(window);
