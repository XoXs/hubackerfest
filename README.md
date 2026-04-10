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

Die produktive Version nutzt Supabase als gemeinsame Datenbank. Neue Eintraege werden dort gespeichert und ueber Realtime an alle offenen Browser verteilt.

Falls du lokal ohne Supabase testen willst, kannst du `VITE_DATA_SOURCE=local` setzen. Dann wird nur der Snapshot aus dem Projekt verwendet.

## GitHub Pages

Das Repo ist fuer GitHub Pages per GitHub Actions vorbereitet.

Nach dem Push auf `main`:

1. In GitHub das Repository oeffnen
2. `Settings > Pages` aufrufen
3. `Source: GitHub Actions` verwenden

Danach wird die Seite automatisch veroeffentlicht.

## Supabase einrichten

1. In Supabase ein neues Projekt erstellen
2. Den Inhalt von [project 2/supabase/bootstrap.sql](/Users/Andi/Documents/TVL/Hubackerfest/project%202/supabase/bootstrap.sql) im SQL Editor ausfuehren
3. Lokal in `project 2/.env` setzen:
   - `VITE_DATA_SOURCE=supabase`
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
4. Auf GitHub im Repo `Settings > Secrets and variables > Actions` anlegen:
   - Variable `VITE_DATA_SOURCE` = `supabase`
   - Variable `VITE_SUPABASE_URL` = deine Supabase-URL
   - Secret `VITE_SUPABASE_ANON_KEY` = dein Publishable/Anon Key

Wichtig: Die aktuelle App erlaubt oeffentliches Lesen und Eintragen, aber kein Loeschen aus der UI. Eintraege kannst du als Admin direkt im Supabase-Dashboard entfernen.
