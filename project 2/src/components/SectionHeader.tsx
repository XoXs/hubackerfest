export function SectionHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 md:text-2xl">
        Stationsübersicht
        <span className="relative ml-1 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
      </h2>
    </div>
  );
}
