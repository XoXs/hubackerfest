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

const fileContents = `export const localDatabaseSnapshot = ${JSON.stringify(snapshot, null, 2)} as const;\n`;

writeFileSync(outputPath, fileContents);
console.log(`Wrote ${outputPath}`);
