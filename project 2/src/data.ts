import { Station } from './types';

export const stations: Station[] = [
  {
    id: 'aufbau',
    name: 'Aufbau',
    description: 'Aufbauarbeiten rund um Lager und Festgelände.',
    date: 'Mi 13.5',
    time: '',
    maxSpots: 18,
    shifts: [
      {
        start: '17:00',
        end: 'Treffpunkt am Lager',
        maxSpots: 6,
        volunteers: []
      },
      {
        start: '17:30',
        end: 'Treffpunkt am Festgelände',
        maxSpots: 12,
        volunteers: []
      }
    ],
    volunteers: []
  },
  {
    id: 'vorbereitungen',
    name: 'Vorbereitungen',
    description: 'Letzte Aufbau Arbeiten/ Vorbereitungen vor Festbeginn',
    date: 'Do 14.5',
    time: 'vor Festbeginn',
    maxSpots: 4,
    volunteers: []
  },
  {
    id: 'kuchenannahme-turnhalle',
    name: 'Kuchenannahme Turnhalle',
    description: 'Annahme/Lagern der Kuchen in der Turnhalle und verladen fürs Fest.',
    date: 'Do 14.5',
    time: '8:45 - 11:00 Uhr',
    maxSpots: 2,
    volunteers: []
  },
  {
    id: 'abraeumen',
    name: 'Abräumen',
    date: 'Fr',
    time: 'ab 13:00 Uhr',
    maxSpots: 20,
    volunteers: []
  },
  {
    id: 'aufraeumen',
    name: 'Aufräumteam',
    date: '',
    time: 'ab 18:00 Uhr',
    maxSpots: 6,
    volunteers: []
  },
  {
    id: 'kuechenzelt',
    name: 'Küchenzelt',
    date: 'Do',
    time: '',
    maxSpots: 12,
    shifts: [
      {
        start: '11:00',
        end: '15:30',
        maxSpots: 6,
        volunteers: []
      },
      {
        start: '15:30',
        end: 'Schluss',
        maxSpots: 6,
        volunteers: []
      }
    ],
    volunteers: []
  },
  {
    id: 'getraenkeausschank',
    name: 'Getränkeausschank',
    date: 'Do',
    time: '',
    maxSpots: 16,
    shifts: [
      {
        start: '11:00',
        end: '15:30',
        maxSpots: 8,
        volunteers: []
      },
      {
        start: '15:30',
        end: 'Schluss',
        maxSpots: 8,
        volunteers: []
      }
    ],
    volunteers: []
  },
  {
    id: 'spuelzelt',
    name: 'Spülzelt',
    date: 'Do',
    time: '',
    maxSpots: 16,
    shifts: [
      {
        start: '11:00',
        end: '15:30',
        maxSpots: 8,
        volunteers: []
      },
      {
        start: '15:30',
        end: 'Schluss',
        maxSpots: 8,
        volunteers: []
      }
    ],
    volunteers: []
  },
  {
    id: 'ausschankwagen1',
    name: 'Ausschankwagen 1',
    date: 'Do',
    time: '',
    maxSpots: 24,
    shifts: [
      {
        start: '11:00',
        end: '15:30',
        maxSpots: 12,
        volunteers: []
      },
      {
        start: '15:30',
        end: 'Schluss',
        maxSpots: 12,
        volunteers: []
      }
    ],
    volunteers: []
  },
  {
    id: 'ausschankwagen2',
    name: 'Ausschankwagen 2',
    date: 'Do',
    time: '',
    maxSpots: 24,
    shifts: [
      {
        start: '11:00',
        end: '15:30',
        maxSpots: 12,
        volunteers: []
      },
      {
        start: '15:30',
        end: 'Schluss',
        maxSpots: 12,
        volunteers: []
      }
    ],
    volunteers: []
  },
  {
    id: 'springer',
    name: 'Springer/Hüpfburg',
    date: 'Do',
    time: '',
    maxSpots: 12,
    shifts: [
      {
        start: '11:00',
        end: '15:30',
        maxSpots: 6,
        volunteers: []
      },
      {
        start: '15:30',
        end: 'Schluss',
        maxSpots: 6,
        volunteers: []
      }
    ],
    volunteers: []
  }
];
