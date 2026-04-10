import { CalendarDays, MapPin } from 'lucide-react';

type DashboardHeaderProps = {
  title: string;
  dateLabel: string;
  locationLabel: string;
  utilization: number;
  errorMessage?: string | null;
  sticky?: boolean;
};

export function DashboardHeader({
  title,
  dateLabel,
  locationLabel,
  utilization,
  errorMessage,
  sticky = true,
}: DashboardHeaderProps) {
  return (
    <header
      data-dashboard-header="true"
      className={[
        'z-30 border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-md',
        sticky ? 'sticky top-0' : 'relative',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">{title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <span>{dateLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{locationLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 md:self-auto">
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Aktuell belegt
              </div>
              <div className="text-lg font-bold text-slate-900">{utilization}%</div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}
      </div>
    </header>
  );
}
