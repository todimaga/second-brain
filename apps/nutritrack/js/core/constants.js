(function (global) {
  var NutriTrack = (global.NutriTrack = global.NutriTrack || {});

  NutriTrack.constants = {
    STORAGE_PREFIX: 'brain_nutritrack_',
    GRUPPI: ['colazione', 'pranzo', 'cena', 'snack'],
    GRUPPI_LABEL: {
      colazione: 'Colazione',
      pranzo: 'Pranzo',
      cena: 'Cena',
      snack: 'Snack'
    },
    TARGET_TRAINING: { kcal: 2300, proteine: 184, carboidrati: 247, grassi: 64 },
    TARGET_REST: { kcal: 2150, proteine: 172, carboidrati: 231, grassi: 60 },
    MACRO_KEYS: [
      { key: 'kcal', label: 'Kcal', unit: '' },
      { key: 'proteine', label: 'Proteine', unit: 'g' },
      { key: 'carboidrati', label: 'Carboidrati', unit: 'g' },
      { key: 'grassi', label: 'Grassi', unit: 'g' }
    ]
  };
})(window);
