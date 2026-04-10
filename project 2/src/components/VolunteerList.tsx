import { getInitials, getToneClasses, type StatusTone } from '../lib/ui';

type VolunteerListProps = {
  volunteers: string[];
  tone: StatusTone;
};

export function VolunteerList({ volunteers, tone }: VolunteerListProps) {
  const toneClasses = getToneClasses(tone);

  if (volunteers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-500">
        Noch niemand eingetragen.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {volunteers.map((volunteer) => (
        <li
          key={volunteer}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${toneClasses.initial}`}
          >
            {getInitials(volunteer)}
          </div>
          <span className="text-sm font-medium text-slate-700">{volunteer}</span>
        </li>
      ))}
    </ul>
  );
}
