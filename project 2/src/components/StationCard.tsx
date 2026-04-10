import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
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
  const [activeShiftIndex, setActiveShiftIndex] = useState(0);
  const activeShift = useMemo(() => station.shifts?.[activeShiftIndex] ?? null, [activeShiftIndex, station.shifts]);
  const volunteerCount = getStationVolunteerCount(station);
  const maxSpots = getStationCapacity(station);
  const percentage = getOccupancyPercentage(volunteerCount, maxSpots);
  const remaining = getRemainingSlots(volunteerCount, maxSpots);
  const tone = getStatusTone(percentage);
  const toneClasses = getToneClasses(tone);
  const utilizationLabel = getUtilizationLabel(percentage);
  const currentVolunteerCount = activeShift ? activeShift.volunteers.length : volunteerCount;
  const currentMaxSpots = activeShift ? activeShift.maxSpots : maxSpots;
  const currentPercentage = activeShift
    ? getOccupancyPercentage(currentVolunteerCount, currentMaxSpots)
    : percentage;
  const currentRemaining = activeShift
    ? getRemainingSlots(currentVolunteerCount, currentMaxSpots)
    : remaining;
  const currentTone = activeShift ? getStatusTone(currentPercentage) : tone;
  const currentToneClasses = getToneClasses(currentTone);
  const currentUtilizationLabel = getUtilizationLabel(currentPercentage);

  useEffect(() => {
    if (!station.shifts || station.shifts.length === 0) {
      return;
    }

    if (activeShiftIndex >= station.shifts.length) {
      setActiveShiftIndex(0);
    }
  }, [activeShiftIndex, station.shifts]);

  const getShiftLabel = (index: number, start: string) => {
    if (start === '14:30') {
      return 'Springer';
    }

    return `Schicht ${index + 1}`;
  };

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

        <div className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold ${currentToneClasses.badge}`}>
          <Users className={`h-4 w-4 ${currentToneClasses.icon}`} />
          <span>
            {currentVolunteerCount}/{currentMaxSpots}
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
            activeShift && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-1">
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {station.shifts.map((shift, index) => {
                      const isActive = index === activeShiftIndex;
                      const shiftVolunteerCount = shift.volunteers.length;
                      const shiftPercentage = getOccupancyPercentage(shiftVolunteerCount, shift.maxSpots);
                      const shiftTone = getStatusTone(shiftPercentage);
                      const shiftToneClasses = getToneClasses(shiftTone);
                      const shiftRemaining = getRemainingSlots(shiftVolunteerCount, shift.maxSpots);

                      return (
                        <button
                          key={shift.id}
                          type="button"
                          onClick={() => setActiveShiftIndex(index)}
                          className={[
                            'rounded-xl px-4 py-3 text-left text-sm font-bold transition',
                            isActive
                              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                              : 'text-slate-500 hover:bg-white/70 hover:text-slate-700',
                          ].join(' ')}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span>{getShiftLabel(index, shift.start)} ({shift.start}-{shift.end})</span>
                            <span className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${shiftRemaining > 0 ? shiftToneClasses.progress : 'bg-rose-500'}`} />
                              <span className="text-xs font-bold tabular-nums text-slate-500">
                                {shiftVolunteerCount}/{shift.maxSpots}
                              </span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${currentToneClasses.progress}`}
                      style={{ width: `${currentPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span>
                      {currentRemaining > 0
                        ? `Noch ${currentRemaining} Plätze frei`
                        : 'Keine Plätze frei'}
                    </span>
                    {currentUtilizationLabel ? (
                      <span className={currentToneClasses.label}>
                        {currentUtilizationLabel}
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Eingetragen ({getShiftLabel(activeShiftIndex, activeShift.start)})
                  </h4>
                  <div className="space-y-4">
                    <VolunteerList
                      key={activeShift.id}
                      volunteers={activeShift.volunteers}
                      tone={currentTone}
                    />
                    {activeShift.volunteers.length < activeShift.maxSpots && (
                      <SignupForm
                        key={`signup-${activeShift.id}`}
                        value={shiftInputValues[activeShiftIndex] ?? ''}
                        onChange={(event) => onShiftInputChange(activeShiftIndex, event)}
                        onSubmit={(event) => onShiftSubmit(activeShiftIndex, event)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
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
