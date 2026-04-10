import logoUrl from '../logo.png';

const legalLinks = [
  { label: 'Impressum', href: 'https://tv-lautenbach.de/impressum' },
  { label: 'Datenschutz', href: 'https://tv-lautenbach.de/datenschutz' },
  {
    label: 'Die Satzung des TVL',
    href: 'https://drive.google.com/file/d/1WljRFSuNHbClvEf0TYzHnPxD3MPd7tmr/view?usp=sharing',
  },
];

export function AppFooter() {
  return (
    <footer className="mt-16 border-t border-emerald-100 bg-emerald-50/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={logoUrl} alt="TV Lautenbach" className="h-14 w-14 rounded-xl object-contain" />
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900">TV Lautenbach</div>
              <div className="text-sm text-slate-600">Arbeitsplan Hubackerfest</div>
            </div>
          </div>

          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-emerald-700"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-emerald-100 pt-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>©2026 TV-Lautenbach</p>
          <p>
            Erstellt von{' '}
            <a
              href="https://webdesign-am.de/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              Andreas Müller
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
