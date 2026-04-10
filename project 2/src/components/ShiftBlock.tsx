import type React from 'react';
import { Clock, Users } from 'lucide-react';
import { SignupForm } from './SignupForm';
import { VolunteerList } from './VolunteerList';
import {
  getOccupancyPercentage,
  getRemainingSlots,
  getStatusTone,
  getToneClasses,
  getUtilizationLabel,
} from '../lib/ui';

type Shift = {
  id: string;
  start: string;
  end: string;
  maxSpots: number;
  volunteers: string[];
};

type ShiftBlockProps = {
  shift: Shift;
  index: number;
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function ShiftBlock({ shift, index, inputValue, onInputChange, onSubmit }: ShiftBlockProps) {
  const volunteerCount = shift.volunteers.length;
  const percentage = getOccupancyPercentage(volunteerCount, shift.maxSpots);
  const remaining = getRemainingSlots(volunteerCount, shift.maxSpots);
  const tone = getStatusTone(percentage);
  const toneClasses = getToneClasses(tone);
  const shiftLabel = shift.start === '14:30' ? 'Springer' : `Schicht ${index + 1}`;
  const utilizationLabel = getUtilizationLabel(percentage);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>
              {shiftLabel}: {shift.start} - {shift.end}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold ${toneClasses.badge}`}>
          <Users className={`h-4 w-4 ${toneClasses.icon}`} />
          <span>
            {volunteerCount}/{shift.maxSpots}
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full transition-all duration-500 ${toneClasses.progress}`} style={{ width: `${percentage}%` }} />
        </div>
        <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span>{remaining > 0 ? `Noch ${remaining} Plätze frei` : 'Keine Plätze frei'}</span>
          {utilizationLabel ? <span className={toneClasses.label}>{utilizationLabel}</span> : <span />}
        </div>
      </div>

      <div className="space-y-4">
        <VolunteerList volunteers={shift.volunteers} tone={tone} />
        {volunteerCount < shift.maxSpots && (
          <SignupForm value={inputValue} onChange={onInputChange} onSubmit={onSubmit} />
        )}
      </div>
    </div>
  );
}
