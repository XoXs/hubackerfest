-- Hubackerfest Supabase bootstrap
-- Run this once in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.stations (
  id text primary key,
  name text not null,
  description text,
  date text,
  time text,
  max_spots integer not null,
  created_at timestamptz default now()
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  station_id text not null references public.stations(id) on delete cascade,
  start_time text not null,
  end_time text not null,
  max_spots integer not null,
  created_at timestamptz default now()
);

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  station_id text not null references public.stations(id) on delete cascade,
  shift_id uuid references public.shifts(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

alter table public.stations enable row level security;
alter table public.shifts enable row level security;
alter table public.volunteers enable row level security;

drop policy if exists "Allow public read access on stations" on public.stations;
drop policy if exists "Allow public read access on shifts" on public.shifts;
drop policy if exists "Allow public read access on volunteers" on public.volunteers;
drop policy if exists "Allow public insert access on volunteers" on public.volunteers;

create policy "Allow public read access on stations"
on public.stations
for select
to public
using (true);

create policy "Allow public read access on shifts"
on public.shifts
for select
to public
using (true);

create policy "Allow public read access on volunteers"
on public.volunteers
for select
to public
using (true);

create policy "Allow public insert access on volunteers"
on public.volunteers
for insert
to public
with check (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'stations'
  ) then
    alter publication supabase_realtime add table public.stations;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'shifts'
  ) then
    alter publication supabase_realtime add table public.shifts;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'volunteers'
  ) then
    alter publication supabase_realtime add table public.volunteers;
  end if;
end $$;

truncate table public.volunteers, public.shifts, public.stations restart identity cascade;

insert into public.stations (id, name, description, date, time, max_spots, created_at) values
  ('getraenkeausschank', 'Getränkeausschank', 'Ausgabe von alkoholfreien Getränken und Organisation am Ausschank.', 'Do 29.5', '', 8, '2025-04-12 11:43:54.173029+00'),
  ('kuchenzelt', 'Kuchenzelt', 'Verkauf und Ausgabe von Kuchen und Kaffee.', 'Do 29.5', '', 8, '2025-04-12 11:43:54.173029+00'),
  ('kuechenzelt', 'Küchenzelt', 'Zubereitung und Ausgabe der Speisen.', 'Do 29.5', '', 14, '2025-04-12 11:43:54.173029+00'),
  ('springer', 'Springer/Hüpfburg', 'Flexible Unterstützung an wechselnden Stationen und an der Hüpfburg.', 'Do 29.5', '', 6, '2025-04-12 11:43:54.173029+00'),
  ('spuelzelt', 'Spülzelt', 'Reinigung von Geschirr, Besteck und Küchenutensilien.', 'Do 29.5', '', 8, '2025-04-12 11:43:54.173029+00'),
  ('abbau', 'Abbau', 'Abbau der Festinfrastruktur und gemeinsames Aufräumen nach dem Fest.', 'Fr 30.5', 'ab 13:00 Uhr', 20, '2025-04-12 11:43:54.173029+00'),
  ('ausschankwagen1', 'Bierwagen 1', 'Bier- und Getränkeausgabe am ersten Ausschankwagen.', 'Do 29.5', '', 11, '2025-04-12 11:43:54.173029+00'),
  ('ausschankwagen2', 'Bierwagen 2', 'Bier- und Getränkeausgabe am zweiten Ausschankwagen.', 'Do 29.5', '', 11, '2025-04-12 11:43:54.173029+00'),
  ('elektrik', 'Elektrik', 'Betreuung der Stromversorgung und technische Unterstützung.', 'Di 27.5', '', 2, '2025-04-12 11:43:54.173029+00'),
  ('wasser', 'Wasser', 'Versorgung der Stationen mit Wasser und Kontrolle der Anschlüsse.', 'Di 27.5', '', 2, '2025-04-12 11:43:54.173029+00'),
  ('aufbau', 'Aufbau', 'Aufbauarbeiten rund um Lager und Festgelände.', 'Mi 13.5', '', 18, '2025-04-12 11:43:54.173029+00'),
  ('aufraeumen', 'Aufräumteam', 'Aufräumen des Festgeländes und Abschlussarbeiten am Abend.', 'Do 29.5', 'ab 18:00 Uhr', 6, '2025-04-12 11:43:54.173029+00'),
  ('vorbereitungen', 'Vorbereitungen', 'Letzte Aufbau Arbeiten/ Vorbereitungen vor Festbeginn', 'Do 14.5', 'vor Festbeginn', 4, '2026-04-10 16:30:00+00'),
  ('kuchenannahme-turnhalle', 'Kuchenannahme Turnhalle', 'Annahme/Lagern der Kuchen in der Turnhalle und verladen fürs Fest.', 'Do 14.5', '8:45 - 11:00 Uhr', 2, '2026-04-19 10:00:00+00'),
  ('nachtwache', 'Nachtwache', 'Überwachung des Festgeländes', 'Mi 13.5', 'ab 21:00 Uhr', 4, '2026-04-10 12:00:00+00');

insert into public.shifts (id, station_id, start_time, end_time, max_spots, created_at) values
  ('4b3322e0-fab6-460f-9c40-04169ef67d59'::uuid, 'kuechenzelt', '11:00', '15:30', 7, '2025-04-12 11:43:54.173029+00'),
  ('58e107d8-6614-40a7-97ce-8ca53478895c'::uuid, 'kuechenzelt', '15:30', 'Schluss', 7, '2025-04-12 11:43:54.173029+00'),
  ('cb65d098-7b1e-4a65-8cb4-4e34ab37b07e'::uuid, 'getraenkeausschank', '11:00', '15:30', 4, '2025-04-12 11:43:54.173029+00'),
  ('c49e19cd-6ccf-4371-a79d-6d767ea6ea8e'::uuid, 'getraenkeausschank', '15:30', 'Schluss', 4, '2025-04-12 11:43:54.173029+00'),
  ('ff44d30b-d766-4fbd-a9fd-88846c3167d0'::uuid, 'spuelzelt', '11:00', '15:30', 4, '2025-04-12 11:43:54.173029+00'),
  ('b3ab2dff-6c26-4324-a7e6-3c3496f251d4'::uuid, 'spuelzelt', '15:30', 'Schluss', 4, '2025-04-12 11:43:54.173029+00'),
  ('57d544eb-bb92-4e2b-b9c3-806b651a69ca'::uuid, 'kuchenzelt', '11:00', '15:30', 4, '2025-04-12 11:43:54.173029+00'),
  ('18f951e7-4308-4d72-a32d-a73f422ef2e4'::uuid, 'kuchenzelt', '15:30', 'Schluss', 4, '2025-04-12 11:43:54.173029+00'),
  ('b883bccf-ce5b-47f2-9655-8b500b02173a'::uuid, 'springer', '11:00', '15:30', 3, '2025-04-12 11:43:54.173029+00'),
  ('d8f3bb90-20c7-456b-bd6e-143d3a3f5f08'::uuid, 'springer', '15:30', 'Schluss', 3, '2025-04-12 11:43:54.173029+00'),
  ('1b5a5bea-dd69-4050-9299-6d3fcea0f1b3'::uuid, 'ausschankwagen1', '11:00', '15:30', 5, '2025-04-12 11:55:16.297675+00'),
  ('4fc588ca-65ff-4ca4-a085-fef9900e009d'::uuid, 'ausschankwagen1', '15:30', 'Schluss', 5, '2025-04-12 11:55:16.297675+00'),
  ('0c0b1cd1-da29-4418-b3d1-478d8bdc2c94'::uuid, 'ausschankwagen1', '14:30', '18:00', 1, '2025-04-12 11:55:16.297675+00'),
  ('2e3b1160-029a-4fd1-baa1-b4c76fd1e21e'::uuid, 'ausschankwagen2', '11:00', '15:30', 5, '2025-04-12 11:55:16.297675+00'),
  ('3204383b-ca8e-4867-8b6d-91d8f6d44383'::uuid, 'ausschankwagen2', '15:30', 'Schluss', 5, '2025-04-12 11:55:16.297675+00'),
  ('acd4d229-98be-4fe5-9d80-f0b4f362ee87'::uuid, 'ausschankwagen2', '14:30', '18:00', 1, '2025-04-12 11:55:16.297675+00'),
  ('f3211f87-4c9f-4f3d-b6f5-60f8c5ef8f11'::uuid, 'aufbau', '17:00', 'Treffpunkt am Lager', 6, '2026-04-10 16:30:00+00'),
  ('a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'aufbau', '17:30', 'Treffpunkt am Festgelände', 12, '2026-04-10 16:30:00+00');

insert into public.volunteers (id, station_id, shift_id, name, created_at) values
  ('9dbb6db4-31cf-4588-97b5-c9ea6f55c0d4'::uuid, 'ausschankwagen1', '1b5a5bea-dd69-4050-9299-6d3fcea0f1b3'::uuid, 'Andi M.', '2025-04-14 11:57:12.342421+00'),
  ('c3a028a1-c0ff-4b66-bed6-bed314790476'::uuid, 'ausschankwagen1', '1b5a5bea-dd69-4050-9299-6d3fcea0f1b3'::uuid, 'Stefan B.', '2025-04-14 11:59:02.145764+00'),
  ('b31e70d0-5c54-4ab1-a47e-092acc7c02ad'::uuid, 'ausschankwagen1', '1b5a5bea-dd69-4050-9299-6d3fcea0f1b3'::uuid, 'Niko M.', '2025-04-14 11:59:11.086179+00'),
  ('a0c678f1-431a-4a78-aba4-884e7b610343'::uuid, 'ausschankwagen1', '1b5a5bea-dd69-4050-9299-6d3fcea0f1b3'::uuid, 'Steffen M.', '2025-04-14 11:59:14.440378+00'),
  ('517e4fef-fa21-4e0d-8e74-3c80733a72f8'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Andi M.', '2025-04-14 12:04:48.020706+00'),
  ('53b1eeb8-979b-46ec-af50-eb5cb1a0aebc'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Niko M.', '2025-04-14 14:27:38.117915+00'),
  ('da952f90-fdea-4df5-afb5-08aac90118ac'::uuid, 'ausschankwagen1', '1b5a5bea-dd69-4050-9299-6d3fcea0f1b3'::uuid, 'Dennis b', '2025-04-14 16:42:48.857746+00'),
  ('678c9ee5-0212-4a29-aac8-930116e8c996'::uuid, 'kuechenzelt', '4b3322e0-fab6-460f-9c40-04169ef67d59'::uuid, 'Tobi G.', '2025-04-16 20:28:19.058258+00'),
  ('7e600427-f1e0-46d4-a9e3-0e5df5aa2265'::uuid, 'kuechenzelt', '58e107d8-6614-40a7-97ce-8ca53478895c'::uuid, 'Tobi G.', '2025-04-16 20:28:21.841968+00'),
  ('70c89100-8a4e-4c2c-bc82-f0f79946f546'::uuid, 'ausschankwagen2', '3204383b-ca8e-4867-8b6d-91d8f6d44383'::uuid, 'Jürgen S.', '2025-04-16 20:30:34.625171+00'),
  ('c4506c72-2457-4f47-a6f8-51a80664caa6'::uuid, 'ausschankwagen2', '2e3b1160-029a-4fd1-baa1-b4c76fd1e21e'::uuid, 'Christian Kimmig', '2025-04-22 11:35:47.14752+00'),
  ('7ec9aa90-7770-4e7f-822f-a7b6f1b39a07'::uuid, 'kuechenzelt', '4b3322e0-fab6-460f-9c40-04169ef67d59'::uuid, 'Linda Huber', '2025-04-22 13:35:29.056692+00'),
  ('a4f6916e-fd0c-4698-bcb0-9bbddc65ecda'::uuid, 'kuechenzelt', '4b3322e0-fab6-460f-9c40-04169ef67d59'::uuid, 'Elke Huber', '2025-04-22 13:35:34.068023+00'),
  ('2f530b2f-4abc-4b2e-abb9-b59f0652ea97'::uuid, 'ausschankwagen2', '2e3b1160-029a-4fd1-baa1-b4c76fd1e21e'::uuid, 'Daniel H.', '2025-04-22 13:38:52.184187+00'),
  ('67b3312a-423d-415e-9c2a-4352b5dde089'::uuid, 'ausschankwagen2', '2e3b1160-029a-4fd1-baa1-b4c76fd1e21e'::uuid, 'Moni P.', '2025-04-22 14:15:55.635755+00'),
  ('afae476c-d5e2-4e8b-8bc6-f0392b149a64'::uuid, 'ausschankwagen1', '4fc588ca-65ff-4ca4-a085-fef9900e009d'::uuid, 'Pia M.', '2025-04-22 14:25:03.933593+00'),
  ('98e020c0-cfa3-4d2f-8d6c-05c7aed65588'::uuid, 'kuchenzelt', '57d544eb-bb92-4e2b-b9c3-806b651a69ca'::uuid, 'Greta Gaiser', '2025-04-22 14:25:36.219853+00'),
  ('8c5ee188-62d1-48d0-98a5-3df87db8720e'::uuid, 'getraenkeausschank', 'cb65d098-7b1e-4a65-8cb4-4e34ab37b07e'::uuid, 'Pia M.', '2025-04-22 14:27:04.6465+00'),
  ('c7d8052c-70ff-4c6c-af64-4b3075112b2e'::uuid, 'getraenkeausschank', 'cb65d098-7b1e-4a65-8cb4-4e34ab37b07e'::uuid, 'Lena T.', '2025-04-22 14:27:08.864751+00'),
  ('28635303-6c56-4a46-8a4d-4403541d0aef'::uuid, 'kuchenzelt', '57d544eb-bb92-4e2b-b9c3-806b651a69ca'::uuid, 'Sabrina Hodapp', '2025-04-22 14:32:31.95677+00'),
  ('79edd3ac-aacc-4062-a2dc-13f34ab9aac2'::uuid, 'kuchenzelt', '57d544eb-bb92-4e2b-b9c3-806b651a69ca'::uuid, 'Susanne Basler', '2025-04-22 14:34:55.803444+00'),
  ('d519b856-8aee-49f5-bef0-226b0b943088'::uuid, 'spuelzelt', 'ff44d30b-d766-4fbd-a9fd-88846c3167d0'::uuid, 'Helmut', '2025-04-22 15:05:58.718125+00'),
  ('469e242e-d996-470e-b67c-6c420f3a3732'::uuid, 'spuelzelt', 'b3ab2dff-6c26-4324-a7e6-3c3496f251d4'::uuid, 'Helmut', '2025-04-22 15:06:34.663338+00'),
  ('1b0bc9e1-e5af-42a8-a5b0-6bd8c531cd74'::uuid, 'elektrik', NULL, 'Monja', '2025-04-22 15:18:39.115237+00'),
  ('f5937bad-9de1-4a4e-9e44-4673a8787ae7'::uuid, 'elektrik', NULL, 'Christoph', '2025-04-22 15:18:42.941221+00'),
  ('ab5064aa-fc68-48ab-af45-3410c36a9d2e'::uuid, 'ausschankwagen1', '4fc588ca-65ff-4ca4-a085-fef9900e009d'::uuid, 'Monja', '2025-04-22 15:19:37.04684+00'),
  ('a6fdff03-16ef-46da-b4d9-b6a13a74ad9c'::uuid, 'getraenkeausschank', 'cb65d098-7b1e-4a65-8cb4-4e34ab37b07e'::uuid, 'Monja', '2025-04-22 15:20:04.722092+00'),
  ('d813704c-5b40-4fa7-89f8-ae774e024f3d'::uuid, 'kuchenzelt', '57d544eb-bb92-4e2b-b9c3-806b651a69ca'::uuid, 'Antonia Fies', '2025-04-22 15:21:43.45031+00'),
  ('99828260-f4fa-475f-be5a-eb7653b6a487'::uuid, 'getraenkeausschank', 'c49e19cd-6ccf-4371-a79d-6d767ea6ea8e'::uuid, 'Anne O.', '2025-04-22 15:31:19.376943+00'),
  ('87c77ade-854f-4e80-ac49-86947608cf4e'::uuid, 'getraenkeausschank', 'c49e19cd-6ccf-4371-a79d-6d767ea6ea8e'::uuid, 'Marie S.', '2025-04-22 15:31:24.782613+00'),
  ('764efd4b-45df-49b7-98b9-8c12e384ce45'::uuid, 'spuelzelt', 'ff44d30b-d766-4fbd-a9fd-88846c3167d0'::uuid, 'Benni M.', '2025-04-22 15:34:11.548903+00'),
  ('ae22acec-7971-4ee1-bd55-66fe99e9b683'::uuid, 'getraenkeausschank', 'c49e19cd-6ccf-4371-a79d-6d767ea6ea8e'::uuid, 'Teresa O.', '2025-04-22 15:40:59.299392+00'),
  ('f428cf78-e509-4e3e-8133-c20490917b41'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Helena Braun', '2025-04-22 16:05:11.378256+00'),
  ('c5fc4378-7f77-4bdb-8d3d-2791b09d3e09'::uuid, 'kuechenzelt', '4b3322e0-fab6-460f-9c40-04169ef67d59'::uuid, 'Birgit Bentrup', '2025-04-22 16:07:21.314945+00'),
  ('04e0afe7-dd9a-4f1b-893f-295a4c3c1bc2'::uuid, 'ausschankwagen1', '4fc588ca-65ff-4ca4-a085-fef9900e009d'::uuid, 'Anna-Lena H.', '2025-04-22 16:12:39.865227+00'),
  ('e6848a07-c383-4860-b729-ee79202233f0'::uuid, 'kuechenzelt', '4b3322e0-fab6-460f-9c40-04169ef67d59'::uuid, 'Lisa', '2025-04-22 16:17:04.996878+00'),
  ('52229961-75dd-4fdc-b290-4d4716d5c661'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Lea L.', '2025-04-22 16:19:22.56983+00'),
  ('083131df-df72-4484-a3bb-b0cfe88338e7'::uuid, 'springer', NULL, 'Silan Öger', '2025-04-22 16:28:09.8481+00'),
  ('fc371596-1ea7-4246-8a95-cd1de0bf80bb'::uuid, 'springer', NULL, 'Silan Öger', '2025-04-22 16:28:09.85255+00'),
  ('2cec2b5e-cd62-408a-972a-019ebc85c3e8'::uuid, 'springer', NULL, 'Silan Öger', '2025-04-22 16:28:09.864009+00'),
  ('06943a0b-6794-4ba6-bec4-f8be014480c0'::uuid, 'springer', NULL, 'Silan Öger', '2025-04-22 16:28:09.885901+00'),
  ('3f06ea50-cb00-44e0-8ad1-f9f4684caee4'::uuid, 'springer', NULL, 'Silan Öger', '2025-04-22 16:28:09.895789+00'),
  ('df871a9f-6077-4b9a-8316-67fdcd6449dc'::uuid, 'springer', 'd8f3bb90-20c7-456b-bd6e-143d3a3f5f08'::uuid, 'Silan Öger', '2025-04-22 16:28:10.00934+00'),
  ('34b5fcd2-ee30-4c35-8ba3-0142f999dab4'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Celine B.', '2025-04-22 16:30:21.696757+00'),
  ('27682c20-4935-4a17-8145-f164263786fa'::uuid, 'abbau', NULL, 'Christian Männle', '2025-04-22 16:33:25.807932+00'),
  ('dbcd00ee-fa20-43dc-86a5-79d69386f27e'::uuid, 'ausschankwagen1', '4fc588ca-65ff-4ca4-a085-fef9900e009d'::uuid, 'Julia R.', '2025-04-22 16:33:55.147469+00'),
  ('3ed0334f-1c9f-486e-85dd-13d6640aec68'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Kerstin B.', '2025-04-22 16:52:38.020069+00'),
  ('573d4615-b227-4d16-9308-fb0942053304'::uuid, 'spuelzelt', 'b3ab2dff-6c26-4324-a7e6-3c3496f251d4'::uuid, 'Florian Huber', '2025-04-22 17:06:33.578373+00'),
  ('f955867f-c60e-4854-bb8a-b6048858f78c'::uuid, 'spuelzelt', 'ff44d30b-d766-4fbd-a9fd-88846c3167d0'::uuid, 'Florian Huber', '2025-04-22 17:08:46.186162+00'),
  ('7c4fe98a-e82b-4c5d-afb6-7d53954ce97a'::uuid, 'ausschankwagen2', '3204383b-ca8e-4867-8b6d-91d8f6d44383'::uuid, 'Caro R.', '2025-04-22 17:12:51.968113+00'),
  ('b6cdd885-bb70-4ec3-b52b-34a44bedce31'::uuid, 'ausschankwagen2', '3204383b-ca8e-4867-8b6d-91d8f6d44383'::uuid, 'Jessi M.', '2025-04-22 17:12:57.019379+00'),
  ('bc5a78ec-a379-4d92-a797-afb54af528c4'::uuid, 'kuchenzelt', '18f951e7-4308-4d72-a32d-a73f422ef2e4'::uuid, 'Jule Sester', '2025-04-22 18:46:43.963453+00'),
  ('2735f620-028f-4448-92f3-8a9196c9188c'::uuid, 'kuchenzelt', '18f951e7-4308-4d72-a32d-a73f422ef2e4'::uuid, 'Lucy Wußler', '2025-04-22 18:46:47.488742+00'),
  ('2af8e9d1-1724-4384-9b98-b659d471d8de'::uuid, 'kuechenzelt', '4b3322e0-fab6-460f-9c40-04169ef67d59'::uuid, 'Jan Pettke', '2025-04-22 18:54:13.872777+00'),
  ('d9c07d72-13fa-4abd-a95e-37d5e66bce53'::uuid, 'kuechenzelt', '58e107d8-6614-40a7-97ce-8ca53478895c'::uuid, 'Jan Pettke', '2025-04-22 18:54:23.664859+00'),
  ('22ded7cd-fa4c-4f9a-bdc0-190ea4c19572'::uuid, 'kuechenzelt', '58e107d8-6614-40a7-97ce-8ca53478895c'::uuid, 'Roxanne', '2025-04-22 19:17:57.87008+00'),
  ('bc9f3ea1-705a-4826-864d-97996e3031d4'::uuid, 'getraenkeausschank', 'cb65d098-7b1e-4a65-8cb4-4e34ab37b07e'::uuid, 'Lena W.', '2025-04-22 19:22:47.233585+00'),
  ('90701dfc-e68c-4528-b6bb-3f4364f425eb'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Maike H.', '2025-04-22 19:24:43.516358+00'),
  ('ac465f11-fbd3-4578-87c9-63c1c5744943'::uuid, 'kuechenzelt', '58e107d8-6614-40a7-97ce-8ca53478895c'::uuid, 'Sabrina', '2025-04-22 19:32:50.072006+00'),
  ('bbfd4a64-70dc-4303-9852-efc9056e1067'::uuid, 'kuechenzelt', '58e107d8-6614-40a7-97ce-8ca53478895c'::uuid, 'Mia Sauer', '2025-04-22 20:08:36.017478+00'),
  ('7f816db3-62fc-4568-bee3-33850465898d'::uuid, 'kuechenzelt', '58e107d8-6614-40a7-97ce-8ca53478895c'::uuid, 'Benjamin Baumann', '2025-04-23 04:11:08.229057+00'),
  ('a1c3b36f-a880-47f3-8e5e-4c0ba40e2093'::uuid, 'abbau', NULL, 'Benni M.', '2025-04-23 05:20:22.732983+00'),
  ('a7feeea4-938f-455d-9f37-7f9119e78640'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Julia Kreider', '2025-04-23 06:04:44.106005+00'),
  ('3860849e-e32c-42a5-8c09-56277cd5b38c'::uuid, 'getraenkeausschank', 'c49e19cd-6ccf-4371-a79d-6d767ea6ea8e'::uuid, 'Carolin Schindler', '2025-04-23 09:50:26.465951+00'),
  ('d02aad04-5bfc-4158-a034-427399545b99'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Alica Teufel', '2025-04-23 12:24:46.02905+00'),
  ('a52d8b4b-5327-4e55-abb9-0f14e34064ae'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Ann-Kathrin Jüngert', '2025-04-23 16:19:43.651986+00'),
  ('2eb684d8-f73d-450c-8897-d9fb3dcff26e'::uuid, 'abbau', NULL, 'Hedwig Schmälzle', '2025-04-23 18:41:21.959141+00'),
  ('c109c0be-6d5f-4a5a-ac61-b5648fc05799'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Jürgen S.', '2025-04-23 18:44:16.215705+00'),
  ('7927c343-1fae-4160-9d2c-70cc16465766'::uuid, 'kuchenzelt', '18f951e7-4308-4d72-a32d-a73f422ef2e4'::uuid, 'Petra Hollnberger', '2025-04-25 06:01:37.460689+00'),
  ('cfc8dd1a-d243-4e21-9873-7c0f32cc3466'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Stefan B.', '2025-04-25 12:20:44.288735+00'),
  ('fb3bcc09-824b-415d-a1b7-ca4145e13798'::uuid, 'wasser', NULL, 'Fuzzy', '2025-04-25 16:22:41.987074+00'),
  ('8264b1bb-0ebb-47e6-96ca-b21b3de8482d'::uuid, 'kuechenzelt', '4b3322e0-fab6-460f-9c40-04169ef67d59'::uuid, 'Isabelle Leopold', '2025-04-28 05:42:18.988199+00'),
  ('8d72291c-ef50-45d5-98c6-49fd9e140c1e'::uuid, 'ausschankwagen1', '4fc588ca-65ff-4ca4-a085-fef9900e009d'::uuid, 'Anne M.', '2025-04-28 16:53:00.884829+00'),
  ('23b2fabc-ec1e-46ad-af5e-500b6e85dfd7'::uuid, 'spuelzelt', 'ff44d30b-d766-4fbd-a9fd-88846c3167d0'::uuid, 'Manfred', '2025-04-30 17:11:45.730688+00'),
  ('4daafe51-6331-4582-9413-aa77ecae4a1b'::uuid, 'ausschankwagen2', '3204383b-ca8e-4867-8b6d-91d8f6d44383'::uuid, 'Lena T.', '2025-05-02 11:16:00.398402+00'),
  ('ae65bdb5-5948-4549-a6f4-1b320df79f7b'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Helmut M.', '2025-05-05 08:37:31.464184+00'),
  ('51107211-c97f-4f47-a39d-70c5a50aea7e'::uuid, 'abbau', NULL, 'Helmut M.', '2025-05-05 08:38:52.528443+00'),
  ('324de855-a939-431f-99a1-62999c2bcfba'::uuid, 'spuelzelt', 'b3ab2dff-6c26-4324-a7e6-3c3496f251d4'::uuid, 'Männle, Nico', '2025-05-05 12:02:19.931278+00'),
  ('5928bce5-fda8-4d8c-9466-6819af000536'::uuid, 'spuelzelt', 'b3ab2dff-6c26-4324-a7e6-3c3496f251d4'::uuid, 'Knäble, Martin', '2025-05-05 13:52:35.247782+00'),
  ('71e447bc-68ff-4dd6-b345-5edc418ba17b'::uuid, 'abbau', NULL, 'Holger', '2025-05-05 19:34:36.802365+00'),
  ('50649710-667e-498f-ac41-573b52c3f199'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Maria Doll', '2025-05-06 09:35:46.550588+00'),
  ('f080c09b-5bd9-4386-822a-9a62c4ed7a77'::uuid, 'ausschankwagen2', '2e3b1160-029a-4fd1-baa1-b4c76fd1e21e'::uuid, 'Nicole B.', '2025-05-08 05:59:56.919673+00'),
  ('8df200b9-21a7-4bc8-b401-21b0277be947'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Tabea', '2025-05-12 10:02:49.698364+00'),
  ('0c21cd0f-9ec1-4dbc-97d7-6e06a642942e'::uuid, 'kuchenzelt', '18f951e7-4308-4d72-a32d-a73f422ef2e4'::uuid, 'Luise Berger', '2025-05-17 14:52:18.781286+00'),
  ('32a43b4d-1b49-4e95-9414-3942480f5732'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Xenia B.', '2025-05-18 06:06:42.620534+00'),
  ('ccdde302-00e5-462d-a8db-99a8c0f26111'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Anita Rendler', '2025-05-20 06:48:13.658863+00'),
  ('f98ad501-2ccb-48f2-bf58-ebec07ac7eb8'::uuid, 'abbau', NULL, 'Bernhard Kohler', '2025-05-21 15:02:48.549414+00'),
  ('bef75447-401f-46c8-94cd-ccdfff3d21e0'::uuid, 'springer', 'b883bccf-ce5b-47f2-9655-8b500b02173a'::uuid, 'Anja Hoferer, von 13 bis 14 Uhr', '2025-05-22 12:24:34.533432+00'),
  ('27e20b51-2c95-49cd-812b-daa6efb6b11f'::uuid, 'abbau', NULL, 'Gerhard Schmälzle', '2025-05-22 19:33:46.417166+00'),
  ('7ae7715c-efba-41a2-bd92-8551b7918620'::uuid, 'abbau', NULL, 'Fuzzy', '2025-05-23 17:42:21.861112+00'),
  ('11ad8f1e-a112-4f11-a020-eca7304d840e'::uuid, 'aufraeumen', NULL, 'Sudathip Müller', '2025-05-23 17:49:19.857888+00'),
  ('c8a10589-9504-4628-b397-1459170bb216'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Linda Huber', '2025-05-23 17:49:48.729102+00'),
  ('4791731c-27a7-49dc-b5d6-6a04760a26ee'::uuid, 'abbau', NULL, 'Knäble Martin', '2025-05-23 18:29:43.953109+00'),
  ('8528b597-bea7-4bcc-8500-7f7458935d5d'::uuid, 'aufraeumen', NULL, 'Reiner Huber', '2025-05-25 07:08:19.728369+00'),
  ('57f6768c-5948-4977-92a3-c8b619ce2166'::uuid, 'abbau', NULL, 'Wolfgang Fies', '2025-05-25 09:43:58.925104+00'),
  ('c53acb21-bd24-4e7f-8a25-b7aa1dff7350'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Simone Huber', '2025-05-25 19:00:54.78155+00'),
  ('32130682-5179-4245-857d-5e1a6ff43cef'::uuid, 'ausschankwagen2', '3204383b-ca8e-4867-8b6d-91d8f6d44383'::uuid, 'Markus m', '2025-05-29 11:17:07.897652+00'),
  ('95553ea1-2245-4f13-bc80-31d59a850134'::uuid, 'abbau', NULL, 'Sandra wiegele', '2025-05-30 06:23:14.313096+00'),
  ('c08f2495-59ce-4d9c-a0fb-4821ae415729'::uuid, 'aufraeumen', NULL, 'Wolfgang Fies', '2025-05-30 06:50:33.054037+00'),
  ('0083e90d-eb0c-4b0d-99b2-7c9910cb9ed5'::uuid, 'aufbau', 'a8af1ee0-6fd3-42df-a0f5-17d76f5e8d22'::uuid, 'Wolfgang Fies', '2025-05-30 06:50:56.442478+00');
