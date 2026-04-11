insert into public.stations (id, name, description, date, time, max_spots, created_at)
values
  ('aufbau', 'Aufbau', 'Aufbauarbeiten rund um Lager und Festgelände.', 'Mi 13.5', '', 18, '2026-04-10 16:30:00+00'),
  ('vorbereitungen', 'Vorbereitungen', 'Letzte Aufbau Arbeiten/ Vorbereitungen vor Festbeginn', 'Do 14.5', 'vor Festbeginn', 4, '2026-04-10 16:30:00+00')
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  date = excluded.date,
  time = excluded.time,
  max_spots = excluded.max_spots;

delete from public.shifts
where station_id = 'aufbau';

insert into public.shifts (id, station_id, start_time, end_time, max_spots, created_at)
values
  ('f3211f87-4c9f-4f3d-b6f5-60f8c5ef8f11'::uuid, 'aufbau', '17:00', 'Treffpunkt am Lager', 6, '2026-04-10 16:30:00+00'),
  ('a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'aufbau', '17:30', 'Treffpunkt am Festgelände', 12, '2026-04-10 16:30:00+00');

update public.volunteers
set shift_id = 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid
where station_id = 'aufbau' and shift_id is null;
