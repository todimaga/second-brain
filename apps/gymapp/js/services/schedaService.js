/**
 * Logica schede ed esercizi (senza DOM)
 */
(function (global) {
  var GymApp = (global.GymApp = global.GymApp || {});
  var store = GymApp.store;
  var U = GymApp.utils;

  function st() {
    return store.getState();
  }

  GymApp.scheda = {
    getAll: function () {
      return st().schede;
    },

    getById: function (id) {
      return st().schede.find(function (x) { return x.id === id; });
    },

    create: function (nome) {
      var s = { id: store.allocId(), nome: nome, esercizi: [] };
      st().schede.push(s);
      store.syncEsercizi();
      store.save();
      return s;
    },

    remove: function (id) {
      st().schede = st().schede.filter(function (x) { return x.id !== id; });
      store.save();
    },

    reorder: function (from, to) {
      U.moveItem(st().schede, from, to);
      store.save();
    },

    setActive: function (id) {
      st().schedeAttiva = id;
    },

    getActive: function () {
      return st().schede.find(function (x) { return x.id === st().schedeAttiva; });
    }
  };

  GymApp.esercizio = {
    add: function (schedaId, data) {
      var s = GymApp.scheda.getById(schedaId);
      if (!s) return null;
      var e = {
        id: store.allocId(),
        nome: data.nome,
        rep: data.rep,
        set: data.set,
        rir: data.rir,
        peso: data.peso
      };
      s.esercizi.push(e);
      store.syncEsercizi();
      store.save();
      return e;
    },

    update: function (schedaId, esercizioId, data) {
      var s = GymApp.scheda.getById(schedaId);
      if (!s) return false;
      var idx = -1;
      for (var i = 0; i < s.esercizi.length; i++) {
        if (s.esercizi[i].id === esercizioId) { idx = i; break; }
      }
      if (idx === -1) return false;
      var old = s.esercizi[idx];
      s.esercizi[idx] = {
        id: old.id,
        nome: data.nome,
        rep: data.rep,
        set: data.set,
        rir: data.rir,
        peso: data.peso
      };
      store.syncEsercizi();
      store.save();
      return true;
    },

    remove: function (schedaId, esercizioId) {
      var s = GymApp.scheda.getById(schedaId);
      if (!s) return;
      s.esercizi = s.esercizi.filter(function (e) { return e.id !== esercizioId; });
      store.syncEsercizi();
      store.save();
    },

    reorder: function (schedaId, from, to) {
      var s = GymApp.scheda.getById(schedaId);
      if (!s) return;
      U.moveItem(s.esercizi, from, to);
      store.save();
    },

    getById: function (schedaId, esercizioId) {
      var s = GymApp.scheda.getById(schedaId);
      if (!s) return null;
      return s.esercizi.find(function (x) { return x.id === esercizioId; });
    }
  };
})(window);
