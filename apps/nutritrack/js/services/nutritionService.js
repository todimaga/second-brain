(function (global) {
  var NutriTrack = (global.NutriTrack = global.NutriTrack || {});
  var C = NutriTrack.constants;
  var U = NutriTrack.utils;
  var store = NutriTrack.store;

  function st() {
    return store.getState();
  }

  NutriTrack.nutrition = {
    getTargets: function () {
      return st().giornoAllenamento ? C.TARGET_TRAINING : C.TARGET_REST;
    },

    setTrainingDay: function (isTraining) {
      st().giornoAllenamento = !!isTraining;
      store.save();
    },

    parseImport: function (text) {
      var line = U.extractPastoLine(text);
      if (!line) return { ok: false, error: 'Nessuna riga PASTO: trovata. Incolla la stringa da Claude.' };

      var re = /^PASTO:\s*(.+?)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(colazione|pranzo|cena|snack)\s*$/i;
      var m = line.match(re);
      if (!m) {
        return { ok: false, error: 'Formato non valido. Atteso: PASTO: nome | kcal | P | C | G | gruppo' };
      }

      var gruppo = m[6].toLowerCase();
      if (C.GRUPPI.indexOf(gruppo) === -1) {
        return { ok: false, error: 'Gruppo pasto non valido. Usa: colazione, pranzo, cena, snack' };
      }

      return {
        ok: true,
        meal: {
          nome: m[1].trim(),
          kcal: parseInt(m[2], 10),
          proteine: parseInt(m[3], 10),
          carboidrati: parseInt(m[4], 10),
          grassi: parseInt(m[5], 10),
          gruppo: gruppo
        }
      };
    },

    addMeal: function (dateKey, meal) {
      var day = store.getDay(dateKey);
      var entry = {
        id: store.allocId(),
        nome: meal.nome,
        kcal: meal.kcal,
        proteine: meal.proteine,
        carboidrati: meal.carboidrati,
        grassi: meal.grassi,
        gruppo: meal.gruppo,
        ts: Date.now()
      };
      day.pasti.push(entry);
      store.save();
      return entry;
    },

    removeMeal: function (dateKey, mealId) {
      var day = store.getDay(dateKey);
      day.pasti = day.pasti.filter(function (p) { return p.id !== mealId; });
      store.save();
    },

    duplicateMeal: function (dateKey, mealId) {
      var day = store.getDay(dateKey);
      var src = null;
      var i;
      for (i = 0; i < day.pasti.length; i++) {
        if (day.pasti[i].id === mealId) { src = day.pasti[i]; break; }
      }
      if (!src) return null;
      return NutriTrack.nutrition.addMeal(dateKey, {
        nome: src.nome,
        kcal: src.kcal,
        proteine: src.proteine,
        carboidrati: src.carboidrati,
        grassi: src.grassi,
        gruppo: src.gruppo
      });
    },

    getDayTotals: function (dateKey) {
      var day = store.getDay(dateKey);
      var tot = { kcal: 0, proteine: 0, carboidrati: 0, grassi: 0 };
      var i, p;
      for (i = 0; i < day.pasti.length; i++) {
        p = day.pasti[i];
        tot.kcal += p.kcal;
        tot.proteine += p.proteine;
        tot.carboidrati += p.carboidrati;
        tot.grassi += p.grassi;
      }
      return tot;
    },

    getMealsSorted: function (dateKey) {
      var day = store.getDay(dateKey);
      var ord = { colazione: 0, pranzo: 1, cena: 2, snack: 3 };
      return day.pasti.slice().sort(function (a, b) {
        var oa = ord[a.gruppo] !== undefined ? ord[a.gruppo] : 9;
        var ob = ord[b.gruppo] !== undefined ? ord[b.gruppo] : 9;
        if (oa !== ob) return oa - ob;
        return a.ts - b.ts;
      });
    },

    addToPreferiti: function (meal) {
      var exists = st().preferiti.some(function (f) {
        return f.nome === meal.nome && f.kcal === meal.kcal && f.gruppo === meal.gruppo;
      });
      if (exists) return false;
      st().preferiti.push({
        id: store.allocId(),
        nome: meal.nome,
        kcal: meal.kcal,
        proteine: meal.proteine,
        carboidrati: meal.carboidrati,
        grassi: meal.grassi,
        gruppo: meal.gruppo
      });
      store.save();
      return true;
    },

    removePreferito: function (id) {
      st().preferiti = st().preferiti.filter(function (f) { return f.id !== id; });
      store.save();
    },

    logFromPreferito: function (dateKey, prefId) {
      var pref = st().preferiti.find(function (f) { return f.id === prefId; });
      if (!pref) return null;
      return NutriTrack.nutrition.addMeal(dateKey, pref);
    }
  };
})(window);
