import React, { useEffect, useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { SectionHeader } from './components/SectionHeader';
import { StationCard } from './components/StationCard';
import { addVolunteer, fetchStations, subscribeToDataChanges } from './lib/dataSource';
import { getOverallStats } from './lib/ui';
import type { Station } from './types';

const EMBED_RESIZE_MESSAGE = 'hubackerfest:resize';

function App() {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    const embedded = window.self !== window.top;
    setIsEmbedded(embedded);

    if (!embedded) {
      return;
    }

    document.documentElement.dataset.embedded = 'true';
    document.body.dataset.embedded = 'true';

    return () => {
      delete document.documentElement.dataset.embedded;
      delete document.body.dataset.embedded;
    };
  }, []);

  useEffect(() => {
    void fetchData();

    const unsubscribe = subscribeToDataChanges(() => {
      void fetchData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isEmbedded) {
      return;
    }

    let frameId = 0;
    let lastReportedHeight = 0;

    const reportHeight = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

        if (Math.abs(height - lastReportedHeight) < 2) {
          return;
        }

        lastReportedHeight = height;

        window.parent.postMessage(
          {
            type: EMBED_RESIZE_MESSAGE,
            height,
          },
          '*'
        );
      });
    };

    const resizeObserver = new ResizeObserver(reportHeight);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    window.addEventListener('load', reportHeight);
    window.addEventListener('resize', reportHeight);
    reportHeight();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('load', reportHeight);
      window.removeEventListener('resize', reportHeight);
    };
  }, [isEmbedded, stations, expandedStations, loading, errorMessage]);

  const fetchData = async () => {
    try {
      setErrorMessage(null);
      const nextStations = await fetchStations();
      setStations(nextStations);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Die Daten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerSubmit = async (e: React.FormEvent, stationId: string, shiftIndex?: number) => {
    e.preventDefault();
    const inputKey = shiftIndex !== undefined ? `${stationId}-${shiftIndex}` : stationId;
    const name = inputValues[inputKey]?.trim();
    
    if (!name) return;

    try {
      setErrorMessage(null);
      const station = stations.find((entry) => entry.id === stationId);
      let shiftId: string | null = null;

      if (typeof shiftIndex === 'number') {
        shiftId = station?.shifts?.[shiftIndex]?.id ?? null;
      }

      await addVolunteer({
        stationId,
        shiftId,
        name,
      });

      setInputValues(prev => ({
        ...prev,
        [inputKey]: ''
      }));

      await fetchData();
    } catch (error) {
      console.error('Error adding volunteer:', error);
      setErrorMessage('Der Eintrag konnte nicht gespeichert werden.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, stationId: string, shiftIndex?: number) => {
    const inputKey = shiftIndex !== undefined ? `${stationId}-${shiftIndex}` : stationId;
    setInputValues(prev => ({
      ...prev,
      [inputKey]: e.target.value
    }));
  };

  const toggleStation = (stationId: string) => {
    setExpandedStations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stationId)) {
        newSet.delete(stationId);
      } else {
        newSet.add(stationId);
      }
      return newSet;
    });
  };

  const overallStats = getOverallStats(stations);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)]">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-600 shadow-sm">
          Lade Daten...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--page-bg)] text-slate-800">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-emerald-50/80 to-transparent" />

      <DashboardHeader
        title="Hubackerfest 2026"
        dateLabel="14. Mai 2026"
        locationLabel="Festplatz am Hubacker"
        utilization={overallStats.utilization}
        errorMessage={errorMessage}
        sticky={!isEmbedded}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <section>
          <SectionHeader />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {stations.map((station) => {
              const isExpanded = expandedStations.has(station.id);

              return (
                <StationCard
                  key={station.id}
                  station={station}
                  expanded={isExpanded}
                  stationInputValue={inputValues[station.id] || ''}
                  shiftInputValues={Object.fromEntries(
                    (station.shifts ?? []).map((_, index) => [index, inputValues[`${station.id}-${index}`] || ''])
                  )}
                  onToggle={() => toggleStation(station.id)}
                  onStationInputChange={(event) => handleInputChange(event, station.id)}
                  onStationSubmit={(event) => handleVolunteerSubmit(event, station.id)}
                  onShiftInputChange={(index, event) => handleInputChange(event, station.id, index)}
                  onShiftSubmit={(index, event) => handleVolunteerSubmit(event, station.id, index)}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
