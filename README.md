# OpenF1 Svelte Frontend

**🌐 Live Demo:** [openF1-svelte auf GitHub Pages](https://andre.github.io/openF1-svelte/)

Ein modernes Svelte + TypeScript Frontend, das die OpenF1 API nutzt, um einen interaktiven Formel-1-Kalender anzuzeigen.

## Features

- 🏎️ **F1-Kalender**: Alle Rennen nach Datum sortiert anzeigen
- 📅 **Nächstes Rennen**: Das kommende Event wird automatisch ausgeklappt mit detaillierten Informationen
- 🏁 **Strecken-Details**: Umfassende Informationen zu jeder Rennstrecke
- 📱 **Responsive Design**: Optimiert für Desktop und Mobile
- 🔄 **Jahr-Selektor**: Einfacher Wechsel zwischen verschiedenen Saisons
- ⚡ **Schnell & Modern**: Gebaut mit Vite und Svelte

## Technologie-Stack

- **Svelte** - Reaktives Frontend-Framework
- **TypeScript** - Type-sichere Entwicklung
- **Vite** - Schnelles Build-Tool
- **OpenF1 API** - Offizielle F1-Datenquelle
- **CSS Grid/Flexbox** - Modernes responsive Layout

## Installation & Start

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Für Produktion bauen
npm run build
```

## OpenF1 API

Dieses Projekt nutzt die [OpenF1 API](https://openf1.org/) für aktuelle F1-Daten:
- Meeting-Informationen (Rennen, Qualifikation, Training)
- Strecken-Details und Statistiken
- Session-Zeitpläne und -typen

## Projektstruktur

```
src/
├── lib/
│   ├── types.ts          # TypeScript Typen für OpenF1 API
│   ├── openf1-service.ts # API Service-Layer
│   ├── F1Calendar.svelte # Haupt-Kalender-Komponente
│   └── RaceCard.svelte   # Einzelne Renn-Karte
├── App.svelte            # Root-Komponente
└── main.ts              # App-Einstiegspunkt
```

## License

MIT
