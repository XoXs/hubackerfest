import { localDatabaseSnapshot } from '../generated/localDatabase';
import { hasSupabaseConfig, supabase } from './supabase';
import type { Station } from '../types';

type StationRow = {
  id: string;
  name: string;
  description: string | null;
  date: string;
  time: string;
  max_spots: number;
  created_at: string;
};

type ShiftRow = {
  id: string;
  station_id: string;
  start_time: string;
  end_time: string;
  max_spots: number;
  created_at: string;
};

type VolunteerRow = {
  id: string;
  station_id: string;
  shift_id: string | null;
  name: string;
  created_at: string;
};

type VolunteerInput = {
  stationId: string;
  shiftId?: string | null;
  name: string;
};

const stationOrder = [
  'elektrik',
  'wasser',
  'aufbau',
  'vorbereitungen',
  'nachtwache',
  'kuechenzelt',
  'getraenkeausschank',
  'spuelzelt',
  'kuchenzelt',
  'ausschankwagen1',
  'ausschankwagen2',
  'springer',
  'aufraeumen',
  'abbau',
] as const;

const configuredDataSource = import.meta.env.VITE_DATA_SOURCE?.toLowerCase();
const useLocalData = configuredDataSource === 'local';
const useSupabase = !useLocalData && hasSupabaseConfig;

export const dataSourceLabel = useSupabase ? 'Supabase' : 'Lokale Datenbank';
export const dataSourceNote = useSupabase
  ? 'Gemeinsame Live-Daten aus Supabase. Neue Einträge sind für alle sofort sichtbar.'
  : 'Lokaler Fallback aus dem Projekt-Backup. Änderungen werden nicht gemeinsam synchronisiert.';

function buildStations(
  stationsData: StationRow[],
  shiftsData: ShiftRow[],
  volunteersData: VolunteerRow[]
): Station[] {
  const stationsMap = new Map(stationsData.map((station) => [station.id, station]));

  return stationOrder
    .map((stationId) => {
      const station = stationsMap.get(stationId);
      if (!station) {
        return null;
      }

      let stationShifts = shiftsData
        .filter((shift) => shift.station_id === station.id)
        .map((shift) => ({
          id: shift.id,
          start: shift.start_time,
          end: shift.end_time,
          maxSpots: shift.max_spots,
          volunteers: volunteersData
            .filter((volunteer) => volunteer.shift_id === shift.id)
            .map((volunteer) => volunteer.name),
        }));

      if (station.id === 'ausschankwagen1' || station.id === 'ausschankwagen2') {
        stationShifts = stationShifts.sort((left, right) => {
          if (left.start === '14:30') {
            return 1;
          }

          if (right.start === '14:30') {
            return -1;
          }

          return left.start.localeCompare(right.start);
        });
      }

      return {
        id: station.id,
        name: station.name,
        description: station.description ?? undefined,
        date: station.date,
        time: station.time,
        maxSpots: station.max_spots,
        shifts: stationShifts.length > 0 ? stationShifts : undefined,
        volunteers: volunteersData
          .filter((volunteer) => volunteer.station_id === station.id && !volunteer.shift_id)
          .map((volunteer) => volunteer.name),
      };
    })
    .filter((station): station is Station => station !== null);
}

function getLocalSnapshot() {
  return {
    stations: localDatabaseSnapshot.stations.map((station) => ({
      ...station,
      max_spots: Number(station.max_spots),
    })) as StationRow[],
    shifts: localDatabaseSnapshot.shifts.map((shift) => ({
      ...shift,
      max_spots: Number(shift.max_spots),
    })) as ShiftRow[],
    volunteers: localDatabaseSnapshot.volunteers.map((volunteer) => ({ ...volunteer })) as VolunteerRow[],
  };
}

export async function fetchStations(): Promise<Station[]> {
  if (!supabase) {
    if (!useLocalData) {
      throw new Error('Supabase ist nicht konfiguriert. Setze VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY.');
    }

    const snapshot = getLocalSnapshot();
    return buildStations(snapshot.stations, snapshot.shifts, snapshot.volunteers);
  }

  const [{ data: stationsData, error: stationsError }, { data: shiftsData, error: shiftsError }, { data: volunteersData, error: volunteersError }] =
    await Promise.all([
      supabase.from('stations').select('*'),
      supabase.from('shifts').select('*').order('start_time'),
      supabase.from('volunteers').select('*'),
    ]);

  if (stationsError) {
    throw stationsError;
  }

  if (shiftsError) {
    throw shiftsError;
  }

  if (volunteersError) {
    throw volunteersError;
  }

  return buildStations(stationsData as StationRow[], shiftsData as ShiftRow[], volunteersData as VolunteerRow[]);
}

export async function addVolunteer({ stationId, shiftId = null, name }: VolunteerInput) {
  if (!supabase) {
    throw new Error('Supabase ist nicht konfiguriert. Einträge können nicht gemeinsam gespeichert werden.');
  }

  const { error } = await supabase.from('volunteers').insert([
    {
      station_id: stationId,
      shift_id: shiftId,
      name,
    },
  ]);

  if (error) {
    throw error;
  }
}

export function subscribeToDataChanges(onChange: () => void) {
  if (!supabase) {
    return () => undefined;
  }

  const channel = supabase
    .channel('hubackerfest-live-data')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stations' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shifts' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'volunteers' }, onChange)
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
