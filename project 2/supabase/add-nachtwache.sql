insert into public.stations (id, name, description, date, time, max_spots)
values (
  'nachtwache',
  'Nachtwache',
  'Überwachung des Festgeländes',
  'Mi 13.5',
  'ab 21:00 Uhr',
  4
)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  date = excluded.date,
  time = excluded.time,
  max_spots = excluded.max_spots;
