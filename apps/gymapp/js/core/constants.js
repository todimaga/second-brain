/**
 * Costanti GymApp (Second Brain)
 */
(function (global) {
  var GymApp = (global.GymApp = global.GymApp || {});

  GymApp.constants = {
    STORAGE_PREFIX: 'brain_gymapp_',
    LEGACY_PREFIX: 'gymlog_',
    STORAGE_KEYS: ['schede', 'storico', 'storicoGrafico', 'nextId', 'timerDur'],
    MESI_NOMI: [
      'GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
      'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'
    ],
    MESI_BREVI: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
    GIORNI_NOMI: ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'],
    STEP_LIMITS: { set: [1, 10], rir: [0, 5] },
    TIMER_PRESETS: [30, 60, 90, 120, 150, 180, 240, 300, 0]
  };
})(window);
