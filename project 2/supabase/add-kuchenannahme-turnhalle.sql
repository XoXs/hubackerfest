insert into public.stations (id, name, description, date, time, max_spots, created_at)
values (
  'kuchenannahme-turnhalle',
  'Kuchenannahme Turnhalle',
  'Annahme/Lagern der Kuchen in der Turnhalle und verladen fürs Fest.',
  'Do 14.5',
  '8:45 - 11:00 Uhr',
  2,
  '2026-04-19 10:00:00+00'
)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  date = excluded.date,
  time = excluded.time,
  max_spots = excluded.max_spots;
