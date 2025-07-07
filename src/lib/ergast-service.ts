// Ergast F1 API Service
const ERGAST_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export interface ErgastRace {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time?: string;
  Qualifying?: {
    date: string;
    time: string;
  };
  FirstPractice?: {
    date: string;
    time: string;
  };
  SecondPractice?: {
    date: string;
    time: string;
  };
  ThirdPractice?: {
    date: string;
    time: string;
  };
  Sprint?: {
    date: string;
    time: string;
  };
}

export interface ErgastQualifyingResult {
  number: string;
  position: string;
  Driver: {
    driverId: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructor: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  };
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface ErgastRaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: {
    driverId: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructor: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  };
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
}

export interface ProcessedSession {
  type: 'practice1' | 'practice2' | 'practice3' | 'qualifying' | 'sprint' | 'race';
  name: string;
  date: string;
  time?: string;
  results?: any[];
  isLoaded: boolean;
  isLoading: boolean;
}

export interface ProcessedRace extends ErgastRace {
  sessions: ProcessedSession[];
  isUpcoming: boolean;
  weekendStart: string;
}

export class ErgastService {
  private async fetch<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}${endpoint}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async getRaces(year: number): Promise<ProcessedRace[]> {
    const data = await this.fetch<any>(`/${year}/races`);
    const races = data.MRData.RaceTable.Races;
    
    return races.map((race: ErgastRace) => this.processRace(race));
  }

  private processRace(race: ErgastRace): ProcessedRace {
    const sessions: ProcessedSession[] = [];
    
    // Practice Sessions
    if (race.FirstPractice) {
      sessions.push({
        type: 'practice1',
        name: 'Freies Training 1',
        date: race.FirstPractice.date,
        time: race.FirstPractice.time,
        isLoaded: false,
        isLoading: false
      });
    }
    
    if (race.SecondPractice) {
      sessions.push({
        type: 'practice2',
        name: 'Freies Training 2',
        date: race.SecondPractice.date,
        time: race.SecondPractice.time,
        isLoaded: false,
        isLoading: false
      });
    }
    
    if (race.ThirdPractice) {
      sessions.push({
        type: 'practice3',
        name: 'Freies Training 3',
        date: race.ThirdPractice.date,
        time: race.ThirdPractice.time,
        isLoaded: false,
        isLoading: false
      });
    }
    
    // Sprint (wenn vorhanden)
    if (race.Sprint) {
      sessions.push({
        type: 'sprint',
        name: 'Sprint',
        date: race.Sprint.date,
        time: race.Sprint.time,
        isLoaded: false,
        isLoading: false
      });
    }
    
    // Qualifying
    if (race.Qualifying) {
      sessions.push({
        type: 'qualifying',
        name: 'Qualifying',
        date: race.Qualifying.date,
        time: race.Qualifying.time,
        isLoaded: false,
        isLoading: false
      });
    }
    
    // Race
    sessions.push({
      type: 'race',
      name: 'Rennen',
      date: race.date,
      time: race.time,
      isLoaded: false,
      isLoading: false
    });
    
    // Sortiere Sessions nach Datum
    sessions.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });
    
    const now = new Date();
    const raceDate = new Date(`${race.date}T${race.time || '23:59:59'}`);
    const isUpcoming = raceDate > now;
    
    // Bestimme Wochenende-Start (normalerweise Freitag)
    const weekendStart = sessions.length > 0 ? sessions[0].date : race.date;
    
    return {
      ...race,
      sessions,
      isUpcoming,
      weekendStart
    };
  }

  async getQualifyingResults(year: number, round: number): Promise<ErgastQualifyingResult[]> {
    const data = await this.fetch<any>(`/${year}/${round}/qualifying`);
    return data.MRData.RaceTable.Races[0]?.QualifyingResults || [];
  }

  async getRaceResults(year: number, round: number): Promise<ErgastRaceResult[]> {
    const data = await this.fetch<any>(`/${year}/${round}/results`);
    return data.MRData.RaceTable.Races[0]?.Results || [];
  }

  async getSprintResults(year: number, round: number): Promise<ErgastRaceResult[]> {
    const data = await this.fetch<any>(`/${year}/${round}/sprint`);
    return data.MRData.RaceTable.Races[0]?.SprintResults || [];
  }
}

export const ergastService = new ErgastService();
