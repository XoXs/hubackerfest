# Hubackerfest

Statische Helferplanung fuer das Hubackerfest.

## Lokal starten

```bash
cd "project 2"
npm install
npm run dev
```

Die App laeuft dann unter `http://localhost:5173/`.

## Datenquelle

Standardmaessig nutzt die App die lokale Backup-Datei im Projektordner. Dadurch ist keine externe Datenbank noetig.

Neue Eintraege werden im lokalen Modus nur im jeweiligen Browser gespeichert.

## GitHub Pages

Das Repo ist fuer GitHub Pages per GitHub Actions vorbereitet.

Nach dem Push auf `main`:

1. In GitHub das Repository oeffnen
2. `Settings > Pages` aufrufen
3. `Source: GitHub Actions` verwenden

Danach wird die Seite automatisch veroeffentlicht.
