(function (global) {
  var NutriTrack = (global.NutriTrack = global.NutriTrack || {});

  NutriTrack.utils = {
    pad: function (n) {
      return n < 10 ? '0' + n : '' + n;
    },

    dateKey: function (date) {
      var d = date || new Date();
      return d.getFullYear() + '-' + NutriTrack.utils.pad(d.getMonth() + 1) + '-' + NutriTrack.utils.pad(d.getDate());
    },

    formatDateLabel: function (dateKey) {
      var parti = dateKey.split('-');
      var d = new Date(parseInt(parti[0], 10), parseInt(parti[1], 10) - 1, parseInt(parti[2], 10));
      var giorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
      var mesi = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
      return giorni[d.getDay()] + ' ' + d.getDate() + ' ' + mesi[d.getMonth()];
    },

    extractPastoLine: function (text) {
      if (!text) return null;
      var lines = text.replace(/\r/g, '').split('\n');
      var i, t, cleaned;
      for (i = 0; i < lines.length; i++) {
        t = lines[i].trim();
        if (!t) continue;
        cleaned = t.replace(/^`+|`+$/g, '').trim();
        if (/^PASTO:/i.test(cleaned)) return cleaned;
      }
      return null;
    },

    clampPct: function (val, max) {
      if (!max || max <= 0) return 0;
      return Math.min(100, Math.round((val / max) * 100));
    }
  };
})(window);
