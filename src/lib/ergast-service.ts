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

export interface ErgastDriver {
  driverId: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  permanentNumber?: string;
  code?: string;
}

export interface ErgastConstructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface ErgastCircuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

export interface ErgastDriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: ErgastDriver;
  Constructors: ErgastConstructor[];
}

export interface ErgastConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: ErgastConstructor;
}

export interface ErgastFastestLap {
  race: ErgastRace;
  Driver: ErgastDriver;
  Constructor: ErgastConstructor;
  Time: {
    time: string;
  };
  AverageSpeed: {
    units: string;
    speed: string;
  };
}

export interface ErgastSeasonResult {
  season: string;
  championDriver?: ErgastDriver;
  championConstructor?: ErgastConstructor;
  totalRaces: number;
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

  // Standings
  async getDriverStandings(year: number, round?: number): Promise<ErgastDriverStanding[]> {
    const endpoint = round ? `/${year}/${round}/driverStandings` : `/${year}/driverStandings`;
    const data = await this.fetch<any>(endpoint);
    return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
  }

  async getConstructorStandings(year: number, round?: number): Promise<ErgastConstructorStanding[]> {
    const endpoint = round ? `/${year}/${round}/constructorStandings` : `/${year}/constructorStandings`;
    const data = await this.fetch<any>(endpoint);
    return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
  }

  // Drivers
  async getDrivers(year: number): Promise<ErgastDriver[]> {
    const data = await this.fetch<any>(`/${year}/drivers`);
    return data.MRData.DriverTable.Drivers ?? [];
  }

  async getDriver(driverId: string): Promise<ErgastDriver | null> {
    const data = await this.fetch<any>(`/drivers/${driverId}`);
    return data.MRData.DriverTable.Drivers[0] ?? null;
  }

  async getDriverResults(year: number, driverId: string): Promise<ErgastRaceResult[]> {
    const data = await this.fetch<any>(`/${year}/drivers/${driverId}/results`);
    const races = data.MRData.RaceTable.Races ?? [];
    return races.flatMap((race: any) => race.Results ?? []);
  }

  // Constructors/Teams
  async getConstructors(year: number): Promise<ErgastConstructor[]> {
    const data = await this.fetch<any>(`/${year}/constructors`);
    return data.MRData.ConstructorTable.Constructors ?? [];
  }

  async getConstructor(constructorId: string): Promise<ErgastConstructor | null> {
    const data = await this.fetch<any>(`/constructors/${constructorId}`);
    return data.MRData.ConstructorTable.Constructors[0] ?? null;
  }

  async getConstructorResults(year: number, constructorId: string): Promise<ErgastRaceResult[]> {
    const data = await this.fetch<any>(`/${year}/constructors/${constructorId}/results`);
    const races = data.MRData.RaceTable.Races ?? [];
    return races.flatMap((race: any) => race.Results ?? []);
  }

  // Circuits
  async getCircuits(year?: number): Promise<ErgastCircuit[]> {
    const endpoint = year ? `/${year}/circuits` : '/circuits';
    const data = await this.fetch<any>(endpoint);
    return data.MRData.CircuitTable.Circuits ?? [];
  }

  async getCircuit(circuitId: string): Promise<ErgastCircuit | null> {
    const data = await this.fetch<any>(`/circuits/${circuitId}`);
    return data.MRData.CircuitTable.Circuits[0] ?? null;
  }

  async getCircuitResults(circuitId: string, year?: number): Promise<ErgastRaceResult[]> {
    const endpoint = year ? `/${year}/circuits/${circuitId}/results` : `/circuits/${circuitId}/results`;
    const data = await this.fetch<any>(endpoint);
    const races = data.MRData.RaceTable.Races ?? [];
    return races.flatMap((race: any) => race.Results ?? []);
  }

  // Fastest Laps
  async getFastestLaps(year: number, round?: number): Promise<ErgastFastestLap[]> {
    const data = await this.fetch<any>(`/${year}/fastest/1/results`);
    const races = data.MRData.RaceTable.Races ?? [];
    
    return races.map((race: any) => {
      const result = race.Results[0];
      return {
        race: {
          ...race,
          Results: undefined
        },
        Driver: result.Driver,
        Constructor: result.Constructor,
        Time: result.FastestLap.Time,
        AverageSpeed: result.FastestLap.AverageSpeed
      };
    });
  }

  // Statistics and History
  async getSeasonWinners(): Promise<ErgastSeasonResult[]> {
    const data = await this.fetch<any>('/driverStandings/1');
    const standings = data.MRData.StandingsTable.StandingsLists ?? [];
    
    return Promise.all(standings.map(async (season: any) => {
      const year = season.season;
      const championDriver = season.DriverStandings[0]?.Driver;
      
      // Get constructor champion for this year
      const constructorData = await this.fetch<any>(`/${year}/constructorStandings/1`);
      const championConstructor = constructorData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings[0]?.Constructor;
      
      // Get total races for this year
      const raceData = await this.fetch<any>(`/${year}/races`);
      const totalRaces = raceData.MRData.RaceTable.Races?.length ?? 0;
      
      return {
        season: year,
        championDriver,
        championConstructor,
        totalRaces
      };
    }));
  }

  async getOnThisDay(month: string, day: string): Promise<ErgastRace[]> {
    // Get races that happened on this day in history
    try {
      const data = await this.fetch<any>('/races');
      const allRaces = data.MRData.RaceTable.Races ?? [];
      
      return allRaces.filter((race: ErgastRace) => {
        const raceDate = new Date(race.date);
        const raceMonth = String(raceDate.getMonth() + 1).padStart(2, '0');
        const raceDay = String(raceDate.getDate()).padStart(2, '0');
        return raceMonth === month && raceDay === day;
      });
    } catch (error) {
      console.error('Error fetching on this day data:', error);
      return [];
    }
  }

  // Lap Times (wenn verfügbar)
  async getLapTimes(year: number, round: number, lap: number): Promise<any[]> {
    const data = await this.fetch<any>(`/${year}/${round}/laps/${lap}`);
    return data.MRData.RaceTable.Races[0]?.Laps[0]?.Timings ?? [];
  }

  // Pit Stops
  async getPitStops(year: number, round: number, stop?: number): Promise<any[]> {
    const endpoint = stop ? `/${year}/${round}/pitstops/${stop}` : `/${year}/${round}/pitstops`;
    const data = await this.fetch<any>(endpoint);
    return data.MRData.RaceTable.Races[0]?.PitStops ?? [];
  }
}

export const ergastService = new ErgastService();
