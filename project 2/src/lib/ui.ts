import type { Station } from '../types';

export type StatusTone = 'low' | 'medium' | 'full';

export function getStationVolunteerCount(station: Station) {
  if (station.shifts) {
    return station.shifts.reduce((acc, shift) => acc + shift.volunteers.length, 0);
  }

  return station.volunteers.length;
}

export function getStationCapacity(station: Station) {
  if (station.shifts) {
    return station.shifts.reduce((acc, shift) => acc + shift.maxSpots, 0);
  }

  return station.maxSpots;
}

export function getOccupancyPercentage(current: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((current / max) * 100));
}

export function getRemainingSlots(current: number, max: number) {
  return Math.max(0, max - current);
}

export function getStatusTone(percentage: number): StatusTone {
  if (percentage >= 100) {
    return 'full';
  }

  if (percentage >= 75) {
    return 'medium';
  }

  return 'low';
}

export function getUtilizationLabel(percentage: number) {
  if (percentage >= 100) {
    return 'Voll belegt';
  }

  return null;
}

export function getToneClasses(tone: StatusTone) {
  switch (tone) {
    case 'full':
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-100',
        icon: 'text-rose-500',
        progress: 'bg-rose-500',
        label: 'text-rose-500',
        initial: 'bg-rose-100 text-rose-700',
      };
    case 'medium':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-100',
        icon: 'text-amber-500',
        progress: 'bg-amber-500',
        label: 'text-amber-600',
        initial: 'bg-amber-100 text-amber-700',
      };
    default:
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        icon: 'text-emerald-500',
        progress: 'bg-emerald-500',
        label: 'text-emerald-600',
        initial: 'bg-emerald-100 text-emerald-700',
      };
  }
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function getOverallStats(stations: Station[]) {
  const totalVolunteers = stations.reduce((acc, station) => acc + getStationVolunteerCount(station), 0);
  const totalCapacity = stations.reduce((acc, station) => acc + getStationCapacity(station), 0);
  const utilization = getOccupancyPercentage(totalVolunteers, totalCapacity);

  return {
    totalVolunteers,
    totalCapacity,
    utilization,
  };
}
