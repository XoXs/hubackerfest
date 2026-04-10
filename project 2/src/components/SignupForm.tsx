import type React from 'react';
import { User } from 'lucide-react';

type SignupFormProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function SignupForm({ value, onChange, onSubmit }: SignupFormProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Jetzt eintragen
      </h4>
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
        <div className="relative flex-1">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Dein Name"
            value={value}
            onChange={onChange}
            className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 active:scale-[0.99]"
        >
          Eintragen
        </button>
      </form>
    </div>
  );
}
