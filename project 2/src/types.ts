export interface Station {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  maxSpots: number;
  shifts?: {
    id: string;
    start: string;
    end: string;
    maxSpots: number;
    volunteers: string[];
  }[];
  volunteers: string[];
}
