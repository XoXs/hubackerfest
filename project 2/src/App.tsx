import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { addVolunteer, dataSourceLabel, dataSourceNote, fetchStations, subscribeToDataChanges } from './lib/dataSource';
import type { Station } from './types';

function App() {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());

  useEffect(() => {
    void fetchData();

    const unsubscribe = subscribeToDataChanges(() => {
      void fetchData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const getVolunteerCount = (station: Station) => {
    if (station.shifts) {
      return station.shifts.reduce((acc, shift) => acc + shift.volunteers.length, 0);
    }
    return station.volunteers.length;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Lade Daten...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#007448] mb-4">Hubackerfest 2025</h1>
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              <span>29. Mai 2025</span>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="mr-2" />
              <span>Festplatz am Hubacker</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
            <span className="font-medium text-gray-900">{dataSourceLabel}:</span> {dataSourceNote}
          </div>
          {errorMessage && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-6">Stationsübersicht</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stations.map((station) => {
              const volunteerCount = getVolunteerCount(station);
              const maxSpots = station.shifts 
                ? station.shifts.reduce((acc, shift) => acc + shift.maxSpots, 0)
                : station.maxSpots;
              const percentage = Math.round((volunteerCount / maxSpots) * 100);
              const isExpanded = expandedStations.has(station.id);

              return (
                <div key={station.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleStation(station.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            {station.name}
                            {station.date && (
                              <span className="ml-2 text-sm text-gray-500">({station.date})</span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="ml-2 h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
                            )}
                          </h3>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users size={16} className="mr-1" />
                              <span>{volunteerCount}/{maxSpots}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: percentage >= 100 ? '#ef4444' : percentage >= 75 ? '#eab308' : '#007448'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t">
                      {station.description && (
                        <p className="text-sm text-gray-600 mb-4">{station.description}</p>
                      )}
                      {station.time && (
                        <div className="flex items-center mb-4 text-sm text-gray-600">
                          <Clock size={16} className="mr-2" />
                          <span>{station.time}</span>
                        </div>
                      )}

                      {station.shifts ? (
                        <div className="space-y-6">
                          {station.shifts.map((shift, index) => (
                            <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center text-sm">
                                  <Clock size={16} className="mr-2" />
                                  <span className="font-medium">
                                    {shift.start === '14:30' ? 'Springer: ' : `Schicht ${index + 1}: `}
                                    {shift.start} - {shift.end}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-600">
                                  {shift.volunteers.length}/{shift.maxSpots} Helfer
                                </span>
                              </div>

                              {shift.volunteers.length > 0 && (
                                <div className="mb-3 pl-6">
                                  {shift.volunteers.map((volunteer, i) => (
                                    <div key={i} className="text-sm text-gray-600">{volunteer}</div>
                                  ))}
                                </div>
                              )}

                              {shift.volunteers.length < shift.maxSpots && (
                                <form 
                                  className="flex gap-2 max-w-sm pl-6"
                                  onSubmit={(e) => handleVolunteerSubmit(e, station.id, index)}
                                >
                                  <input
                                    type="text"
                                    placeholder="Dein Name"
                                    value={inputValues[`${station.id}-${index}`] || ''}
                                    onChange={(e) => handleInputChange(e, station.id, index)}
                                    className="flex-1 min-w-0 px-3 py-1.5 border rounded-md text-base focus:ring-1 focus:ring-[#007448] focus:border-[#007448]"
                                  />
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-[#007448] text-white rounded-md hover:bg-[#006038] text-base whitespace-nowrap"
                                  >
                                    Eintragen
                                  </button>
                                </form>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {station.volunteers.length > 0 && (
                            <div className="mb-3">
                              {station.volunteers.map((volunteer, i) => (
                                <div key={i} className="text-sm text-gray-600">{volunteer}</div>
                              ))}
                            </div>
                          )}

                          {station.volunteers.length < station.maxSpots && (
                            <form 
                              className="flex gap-2 max-w-sm"
                              onSubmit={(e) => handleVolunteerSubmit(e, station.id)}
                            >
                              <input
                                type="text"
                                placeholder="Dein Name"
                                value={inputValues[station.id] || ''}
                                onChange={(e) => handleInputChange(e, station.id)}
                                className="flex-1 min-w-0 px-3 py-1.5 border rounded-md text-base focus:ring-1 focus:ring-[#007448] focus:border-[#007448]"
                              />
                              <button
                                type="submit"
                                className="px-3 py-1.5 bg-[#007448] text-white rounded-md hover:bg-[#006038] text-base whitespace-nowrap"
                              >
                                Eintragen
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
