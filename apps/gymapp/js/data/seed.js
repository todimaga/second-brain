/**
 * Dati demo iniziali (solo se non c'è salvataggio locale)
 */
(function (global) {
  var GymApp = (global.GymApp = global.GymApp || {});

  GymApp.seed = {
    getDefaults: function () {
      return {
        schede: [
          {
            id: 1, nome: 'Push Day', esercizi: [
              { id: 1, nome: 'Panca Piana', set: 4, rep: '6-8', rir: 1, peso: 90 },
              { id: 2, nome: 'Shoulder Press', set: 3, rep: '8-10', rir: 2, peso: 60 },
              { id: 3, nome: 'Alzate Laterali', set: 3, rep: '12-15', rir: 1, peso: 16 },
              { id: 4, nome: 'Tricep Pushdown', set: 3, rep: '10-12', rir: 1, peso: 35 }
            ]
          },
          {
            id: 2, nome: 'Pull Day', esercizi: [
              { id: 5, nome: 'Trazioni', set: 4, rep: '6-8', rir: 1, peso: 0 },
              { id: 6, nome: 'Cable Row', set: 3, rep: '10-12', rir: 2, peso: 70 },
              { id: 7, nome: 'Face Pull', set: 3, rep: '15-20', rir: 2, peso: 20 }
            ]
          },
          {
            id: 3, nome: 'Leg Day', esercizi: [
              { id: 8, nome: 'Squat', set: 4, rep: '5', rir: 1, peso: 120 },
              { id: 9, nome: 'Leg Press', set: 3, rep: '10-12', rir: 2, peso: 180 },
              { id: 10, nome: 'Romanian DL', set: 3, rep: '8-10', rir: 1, peso: 80 }
            ]
          }
        ],
        storico: {
          '2026-05-02': {
            scheda: 'Push Day', esercizi: [
              { nome: 'Panca Piana', sets: [{ rep: 8, peso: 90 }, { rep: 7, peso: 90 }, { rep: 7, peso: 90 }, { rep: 6, peso: 90 }] },
              { nome: 'Shoulder Press', sets: [{ rep: 10, peso: 60 }, { rep: 9, peso: 60 }, { rep: 9, peso: 60 }] },
              { nome: 'Alzate Laterali', sets: [{ rep: 12, peso: 16 }, { rep: 12, peso: 16 }, { rep: 11, peso: 16 }] }
            ]
          },
          '2026-05-05': {
            scheda: 'Pull Day', esercizi: [
              { nome: 'Trazioni', sets: [{ rep: 8, peso: 0 }, { rep: 7, peso: 0 }, { rep: 6, peso: 0 }, { rep: 6, peso: 0 }] },
              { nome: 'Cable Row', sets: [{ rep: 12, peso: 70 }, { rep: 11, peso: 70 }, { rep: 10, peso: 70 }] }
            ]
          },
          '2026-05-08': {
            scheda: 'Leg Day', esercizi: [
              { nome: 'Squat', sets: [{ rep: 5, peso: 115 }, { rep: 5, peso: 115 }, { rep: 4, peso: 115 }, { rep: 4, peso: 115 }] },
              { nome: 'Leg Press', sets: [{ rep: 12, peso: 180 }, { rep: 11, peso: 180 }, { rep: 10, peso: 180 }] },
              { nome: 'Romanian DL', sets: [{ rep: 10, peso: 80 }, { rep: 9, peso: 80 }, { rep: 9, peso: 80 }] }
            ]
          },
          '2026-05-12': {
            scheda: 'Push Day', esercizi: [
              { nome: 'Panca Piana', sets: [{ rep: 8, peso: 92 }, { rep: 8, peso: 92 }, { rep: 7, peso: 92 }, { rep: 6, peso: 92 }] },
              { nome: 'Shoulder Press', sets: [{ rep: 10, peso: 62 }, { rep: 10, peso: 62 }, { rep: 9, peso: 62 }] }
            ]
          },
          '2026-05-15': {
            scheda: 'Pull Day', esercizi: [
              { nome: 'Trazioni', sets: [{ rep: 8, peso: 0 }, { rep: 8, peso: 0 }, { rep: 7, peso: 0 }, { rep: 6, peso: 0 }] },
              { nome: 'Cable Row', sets: [{ rep: 12, peso: 72 }, { rep: 12, peso: 72 }, { rep: 11, peso: 72 }] }
            ]
          },
          '2026-05-19': {
            scheda: 'Leg Day', esercizi: [
              { nome: 'Squat', sets: [{ rep: 5, peso: 117 }, { rep: 5, peso: 117 }, { rep: 5, peso: 117 }, { rep: 4, peso: 117 }] },
              { nome: 'Leg Press', sets: [{ rep: 12, peso: 185 }, { rep: 12, peso: 185 }, { rep: 11, peso: 185 }] }
            ]
          },
          '2026-05-22': {
            scheda: 'Push Day', esercizi: [
              { nome: 'Panca Piana', sets: [{ rep: 8, peso: 95 }, { rep: 7, peso: 95 }, { rep: 7, peso: 95 }, { rep: 6, peso: 95 }] },
              { nome: 'Tricep Pushdown', sets: [{ rep: 12, peso: 40 }, { rep: 12, peso: 40 }, { rep: 11, peso: 40 }] }
            ]
          },
          '2026-04-24': {
            scheda: 'Leg Day', esercizi: [
              { nome: 'Squat', sets: [{ rep: 6, peso: 112 }, { rep: 5, peso: 112 }, { rep: 5, peso: 112 }] },
              { nome: 'Leg Press', sets: [{ rep: 12, peso: 175 }, { rep: 11, peso: 175 }, { rep: 10, peso: 175 }] }
            ]
          },
          '2026-04-28': {
            scheda: 'Pull Day', esercizi: [
              { nome: 'Trazioni', sets: [{ rep: 7, peso: 0 }, { rep: 7, peso: 0 }, { rep: 6, peso: 0 }] },
              { nome: 'Cable Row', sets: [{ rep: 12, peso: 68 }, { rep: 11, peso: 68 }, { rep: 10, peso: 68 }] }
            ]
          }
        },
        storicoGrafico: [
          { data: '08 apr', esercizi: { 'Panca Piana': { peso: 80, set: 4, rep: 8 }, Squat: { peso: 100, set: 4, rep: 6 }, 'Shoulder Press': { peso: 55, set: 3, rep: 10 }, 'Alzate Laterali': { peso: 14, set: 3, rep: 12 }, 'Tricep Pushdown': { peso: 30, set: 3, rep: 12 } } },
          { data: '10 apr', esercizi: { 'Panca Piana': { peso: 80, set: 4, rep: 8 }, Squat: { peso: 100, set: 4, rep: 7 }, 'Shoulder Press': { peso: 55, set: 3, rep: 10 }, 'Alzate Laterali': { peso: 14, set: 3, rep: 13 }, 'Tricep Pushdown': { peso: 32, set: 3, rep: 12 } } },
          { data: '14 apr', esercizi: { 'Panca Piana': { peso: 82, set: 4, rep: 8 }, Squat: { peso: 105, set: 4, rep: 6 }, 'Shoulder Press': { peso: 57, set: 3, rep: 10 }, 'Alzate Laterali': { peso: 14, set: 3, rep: 14 }, 'Tricep Pushdown': { peso: 32, set: 3, rep: 12 } } },
          { data: '18 apr', esercizi: { 'Panca Piana': { peso: 85, set: 4, rep: 7 }, Squat: { peso: 105, set: 4, rep: 8 }, 'Shoulder Press': { peso: 57, set: 3, rep: 11 }, 'Alzate Laterali': { peso: 16, set: 3, rep: 12 }, 'Tricep Pushdown': { peso: 35, set: 3, rep: 12 } } },
          { data: '22 apr', esercizi: { 'Panca Piana': { peso: 85, set: 4, rep: 8 }, Squat: { peso: 110, set: 4, rep: 6 }, 'Shoulder Press': { peso: 60, set: 3, rep: 10 }, 'Alzate Laterali': { peso: 16, set: 3, rep: 13 }, 'Tricep Pushdown': { peso: 35, set: 3, rep: 12 } } },
          { data: '27 apr', esercizi: { 'Panca Piana': { peso: 87, set: 4, rep: 7 }, Squat: { peso: 112, set: 4, rep: 6 }, 'Shoulder Press': { peso: 60, set: 3, rep: 11 }, 'Alzate Laterali': { peso: 16, set: 3, rep: 14 }, 'Tricep Pushdown': { peso: 37, set: 3, rep: 12 } } },
          { data: '04 mag', esercizi: { 'Panca Piana': { peso: 90, set: 4, rep: 7 }, Squat: { peso: 115, set: 4, rep: 6 }, 'Shoulder Press': { peso: 62, set: 3, rep: 10 }, 'Alzate Laterali': { peso: 18, set: 3, rep: 12 }, 'Tricep Pushdown': { peso: 37, set: 3, rep: 12 } } },
          { data: '10 mag', esercizi: { 'Panca Piana': { peso: 90, set: 4, rep: 8 }, Squat: { peso: 117, set: 4, rep: 6 }, 'Shoulder Press': { peso: 62, set: 3, rep: 11 }, 'Alzate Laterali': { peso: 18, set: 3, rep: 13 }, 'Tricep Pushdown': { peso: 40, set: 3, rep: 12 } } }
        ],
        tuttiEsercizi: ['Panca Piana', 'Squat', 'Shoulder Press', 'Alzate Laterali', 'Tricep Pushdown']
      };
    }
  };
})(window);
