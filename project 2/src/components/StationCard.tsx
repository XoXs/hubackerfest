import type React from 'react';
import { ChevronDown, ChevronUp, Clock, Users } from 'lucide-react';
import type { Station } from '../types';
import {
  getOccupancyPercentage,
  getRemainingSlots,
  getStationCapacity,
  getStationVolunteerCount,
  getStatusTone,
  getToneClasses,
  getUtilizationLabel,
} from '../lib/ui';
import { ShiftBlock } from './ShiftBlock';
import { SignupForm } from './SignupForm';
import { VolunteerList } from './VolunteerList';

type StationCardProps = {
  station: Station;
  expanded: boolean;
  stationInputValue: string;
  shiftInputValues: Record<number, string>;
  onToggle: () => void;
  onStationInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStationSubmit: (event: React.FormEvent) => void;
  onShiftInputChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  onShiftSubmit: (index: number, event: React.FormEvent) => void;
};

export function StationCard({
  station,
  expanded,
  stationInputValue,
  shiftInputValues,
  onToggle,
  onStationInputChange,
  onStationSubmit,
  onShiftInputChange,
  onShiftSubmit,
}: StationCardProps) {
  const volunteerCount = getStationVolunteerCount(station);
  const maxSpots = getStationCapacity(station);
  const percentage = getOccupancyPercentage(volunteerCount, maxSpots);
  const remaining = getRemainingSlots(volunteerCount, maxSpots);
  const tone = getStatusTone(percentage);
  const toneClasses = getToneClasses(tone);
  const utilizationLabel = getUtilizationLabel(percentage);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 transition-colors hover:text-emerald-600">{station.name}</h3>
            {station.date && (
              <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {station.date}
              </span>
            )}
          </div>
        </div>

        <div className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold ${toneClasses.badge}`}>
          <Users className={`h-4 w-4 ${toneClasses.icon}`} />
          <span>
            {volunteerCount}/{maxSpots}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </button>

      <div className="relative mt-5 space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full transition-all duration-500 ${toneClasses.progress}`} style={{ width: `${percentage}%` }} />
        </div>
        <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span>{remaining > 0 ? `Noch ${remaining} Plätze frei` : 'Keine Plätze frei'}</span>
          {utilizationLabel ? <span className={toneClasses.label}>{utilizationLabel}</span> : <span />}
        </div>
      </div>

      {expanded && (
        <div className="relative mt-6 space-y-5 border-t border-slate-100 pt-5">
          {(station.description || station.time) && (
            <div className="rounded-xl border border-amber-100/70 bg-amber-50/50 p-4">
              {station.description && (
                <p className="mb-3 text-sm font-medium text-slate-700">{station.description}</p>
              )}
              {station.time && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>{station.time}</span>
                </div>
              )}
            </div>
          )}

          {station.shifts ? (
            <div className="space-y-4">
              {station.shifts.map((shift, index) => (
                <ShiftBlock
                  key={shift.id}
                  shift={shift}
                  index={index}
                  inputValue={shiftInputValues[index] ?? ''}
                  onInputChange={(event) => onShiftInputChange(index, event)}
                  onSubmit={(event) => onShiftSubmit(index, event)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <VolunteerList volunteers={station.volunteers} tone={tone} />
              {station.volunteers.length < station.maxSpots && (
                <SignupForm value={stationInputValue} onChange={onStationInputChange} onSubmit={onStationSubmit} />
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
