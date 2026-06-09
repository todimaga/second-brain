# NutriTrack — struttura JavaScript

App **gratuita**: nessuna API a pagamento. Import dalla stringa `PASTO:` generata da Claude (skill).

```
js/
├── core/       constants, utils (parser, date)
├── data/       store (localStorage brain_nutritrack_*)
├── services/   nutritionService
└── ui/         dayView, importView, shared, bootstrap
```

## Flusso utente

1. Foto → Claude (skill nutritrack-food-photo)
2. Copia riga `PASTO: ... | kcal | P | C | G | gruppo`
3. NutriTrack → **Importa pasto** → Incolla appunti → Anteprima → Registra

## Shortcut iOS (opzionale)

URL: `.../nutritrack/index.html?import=` + `encodeURIComponent(rigaPasto)`

## Target

- Allenamento: 2300 kcal · P184 · C247 · G64
- Riposo: 2150 kcal · P172 · C231 · G60
