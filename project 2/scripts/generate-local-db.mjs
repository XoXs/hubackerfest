import { gunzipSync } from 'node:zlib';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const backupPath = resolve(projectRoot, '..', 'db_cluster-15-06-2025@17-20-50.backup (1).gz');
const outputPath = resolve(projectRoot, 'src', 'generated', 'localDatabase.ts');

if (!existsSync(backupPath)) {
  if (existsSync(outputPath)) {
    console.log(`Skipped generation because backup is missing: ${backupPath}`);
    process.exit(0);
  }

  throw new Error(`Backup file not found: ${backupPath}`);
}

const sql = gunzipSync(readFileSync(backupPath)).toString('utf8');

function parseCopySection(tableName) {
  const pattern = new RegExp(
    String.raw`COPY public\.${tableName} \(([^)]+)\) FROM stdin;\n([\s\S]*?)\n\\\.`,
    'm'
  );
  const match = sql.match(pattern);

  if (!match) {
    throw new Error(`COPY section for public.${tableName} not found in backup.`);
  }

  const columns = match[1]
    .split(',')
    .map((column) => column.trim().replace(/^"|"$/g, ''))
    .map((column) => (column === 'time' ? 'time' : column));

  const rows = match[2]
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const values = line.split('\t').map((value) => (value === '\\N' ? null : value));
      return Object.fromEntries(columns.map((column, index) => [column, values[index] ?? null]));
    });

  return rows;
}

const snapshot = {
  stations: parseCopySection('stations'),
  shifts: parseCopySection('shifts'),
  volunteers: parseCopySection('volunteers'),
};

const AUFBAU_LAGER_SHIFT_ID = 'f3211f87-4c9f-4f3d-b6f5-60f8c5ef8f11';
const AUFBAU_FESTGELAENDE_SHIFT_ID = 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22';

const stationOverrides = {
  getraenkeausschank: {
    description: 'Ausgabe von alkoholfreien Getränken und Organisation am Ausschank.',
  },
  kuchenzelt: {
    description: 'Verkauf und Ausgabe von Kuchen und Kaffee.',
  },
  kuechenzelt: {
    description: 'Zubereitung und Ausgabe der Speisen.',
  },
  springer: {
    description: 'Flexible Unterstützung an wechselnden Stationen und an der Hüpfburg.',
  },
  spuelzelt: {
    description: 'Reinigung von Geschirr, Besteck und Küchenutensilien.',
  },
  abbau: {
    description: 'Abbau der Festinfrastruktur und gemeinsames Aufräumen nach dem Fest.',
  },
  ausschankwagen1: {
    description: 'Bier- und Getränkeausgabe am ersten Ausschankwagen.',
  },
  ausschankwagen2: {
    description: 'Bier- und Getränkeausgabe am zweiten Ausschankwagen.',
  },
  elektrik: {
    description: 'Betreuung der Stromversorgung und technische Unterstützung.',
  },
  wasser: {
    description: 'Versorgung der Stationen mit Wasser und Kontrolle der Anschlüsse.',
  },
  aufbau: {
    description: 'Aufbauarbeiten rund um Lager und Festgelände.',
    date: 'Mi 13.5',
    time: '',
    max_spots: '18',
  },
  vorbereitungen: {
    name: 'Vorbereitungen',
    description: 'Letzte Aufbau Arbeiten/ Vorbereitungen vor Festbeginn',
    date: 'Do 14.5',
    time: 'vor Festbeginn',
    max_spots: '4',
    created_at: '2026-04-10 16:30:00+00',
  },
  aufraeumen: {
    description: 'Aufräumen des Festgeländes und Abschlussarbeiten am Abend.',
  },
  nachtwache: {
    name: 'Nachtwache',
    description: 'Überwachung des Festgeländes',
    date: 'Mi 13.5',
    time: 'ab 21:00 Uhr',
    max_spots: '4',
    created_at: '2026-04-10 12:00:00+00',
  },
};

for (const [stationId, override] of Object.entries(stationOverrides)) {
  const existingStation = snapshot.stations.find((entry) => entry.id === stationId);

  if (existingStation) {
    Object.assign(existingStation, override);
  } else {
    snapshot.stations.push({
      id: stationId,
      name: override.name ?? stationId,
      description: override.description ?? null,
      date: override.date ?? '',
      time: override.time ?? '',
      max_spots: override.max_spots ?? '0',
      created_at: override.created_at ?? '2026-04-10 12:00:00+00',
    });
  }
}

snapshot.shifts = snapshot.shifts.filter((shift) => shift.station_id !== 'aufbau');

snapshot.shifts.push(
  {
    id: AUFBAU_LAGER_SHIFT_ID,
    station_id: 'aufbau',
    start_time: '17:00',
    end_time: 'Treffpunkt am Lager',
    max_spots: '6',
    created_at: '2026-04-10 16:30:00+00',
  },
  {
    id: AUFBAU_FESTGELAENDE_SHIFT_ID,
    station_id: 'aufbau',
    start_time: '17:30',
    end_time: 'Treffpunkt am Festgelände',
    max_spots: '12',
    created_at: '2026-04-10 16:30:00+00',
  }
);

for (const volunteer of snapshot.volunteers) {
  if (volunteer.station_id === 'aufbau' && !volunteer.shift_id) {
    volunteer.shift_id = AUFBAU_FESTGELAENDE_SHIFT_ID;
  }
}

const fileContents = `export const localDatabaseSnapshot = ${JSON.stringify(snapshot, null, 2)} as const;\n`;

writeFileSync(outputPath, fileContents);
console.log(`Wrote ${outputPath}`);
