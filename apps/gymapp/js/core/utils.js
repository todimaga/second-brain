/**
 * Utility pure (nessun DOM)
 */
(function (global) {
  var GymApp = (global.GymApp = global.GymApp || {});

  GymApp.utils = {
    pad: function (n) {
      return n < 10 ? '0' + n : '' + n;
    },

    moveItem: function (arr, from, to) {
      if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return;
      var item = arr.splice(from, 1)[0];
      arr.splice(to, 0, item);
    },

    dateKey: function (date) {
      var d = date || new Date();
      return d.getFullYear() + '-' + GymApp.utils.pad(d.getMonth() + 1) + '-' + GymApp.utils.pad(d.getDate());
    },

    parseRepIniziale: function (rep) {
      return parseInt(rep, 10) || parseInt(String(rep).split('-')[0], 10) || 8;
    }
  };
})(window);
