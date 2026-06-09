# GymApp — struttura JavaScript

Separazione **dati / logica / UI** (preparazione migrazione React).

```
js/
├── core/
│   ├── constants.js
│   └── utils.js
├── data/
│   ├── seed.js
│   └── store.js
├── services/              # Nessun DOM
│   ├── schedaService.js
│   ├── sessionService.js
│   ├── chartService.js
│   └── calendarService.js
└── ui/                    # Solo DOM ed eventi
    ├── shared.js          # S(), drag-and-drop, toast
    ├── navigation.js      # goTo, tab, sheet, stepper
    ├── schedeView.js
    ├── sessionView.js
    ├── calendarView.js
    ├── chartView.js
    └── bootstrap.js       # init
```

## Ordine script in index.html

1. core → data → services  
2. ui (shared prima, bootstrap ultimo)

## Migrazione React (futuro)

| Oggi | React |
|------|-------|
| `store.js` | Context / Zustand + AsyncStorage |
| `services/*` | hooks o `lib/services/` |
| `ui/*View.js` | componenti `<SchedaList />`, ecc. |
