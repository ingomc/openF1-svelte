import type { Meeting, Session, Circuit, MeetingWithSessions, SessionResult, Driver } from './types';

const BASE_URL = 'https://api.openf1.org/v1';

export class OpenF1Service {
  private async fetch<T>(endpoint: string, useDelay: boolean = false): Promise<T> {
    try {
      if (useDelay) {
        // Nur bei Session Results ein kleines Delay
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`Rate Limit erreicht. Bitte warten Sie einen Moment. (Status: ${response.status})`);
        }
        if (response.status === 401) {
          throw new Error(`Authentifizierung erforderlich oder Daten nicht verfügbar (Status: ${response.status})`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async getMeetings(year: number = new Date().getFullYear()): Promise<Meeting[]> {
    return this.fetch<Meeting[]>(`/meetings?year=${year}`);
  }

  async getSessions(meetingKey: number): Promise<Session[]> {
    return this.fetch<Session[]>(`/sessions?meeting_key=${meetingKey}`);
  }

  async getCircuits(): Promise<Circuit[]> {
    return this.fetch<Circuit[]>('/circuits');
  }

  async getSessionResults(sessionKey: number): Promise<SessionResult[]> {
    return this.fetch<SessionResult[]>(`/session_result?session_key=${sessionKey}`, true);
  }

  async getDrivers(sessionKey: number): Promise<Driver[]> {
    return this.fetch<Driver[]>(`/drivers?session_key=${sessionKey}`, true);
  }

  async getMeetingsWithDetails(year: number = new Date().getFullYear()): Promise<MeetingWithSessions[]> {
    const meetings = await this.getMeetings(year);
    const circuits = await this.getCircuits();
    
    const meetingsWithDetails = await Promise.all(
      meetings.map(async (meeting) => {
        try {
          const sessions = await this.getSessions(meeting.meeting_key);
          const circuit = circuits.find(c => c.circuit_key === meeting.circuit_key);
          
          const now = new Date();
          // Bestimme das Vergleichsdatum basierend auf dem Jahr
          let testDate: Date;
          if (year === 2025) {
            testDate = new Date('2025-07-07'); // Festes Datum für 2025 Testing
          } else if (year <= 2024) {
            testDate = new Date('2025-01-01'); // Alle 2024 und frühere Rennen als vergangen
          } else {
            testDate = now;
          }
          
          const meetingStart = new Date(meeting.date_start);
          const isUpcoming = meetingStart > testDate;
          
          console.log(`Meeting: ${meeting.meeting_name}, Start: ${meetingStart.toISOString()}, Test Date: ${testDate.toISOString()}, isUpcoming: ${isUpcoming}`);
          
          return {
            ...meeting,
            sessions,
            circuit,
            isUpcoming
          };
        } catch (error) {
          console.error(`Error fetching details for meeting ${meeting.meeting_key}:`, error);
          return {
            ...meeting,
            sessions: [],
            isUpcoming: false
          };
        }
      })
    );

    // Sort by date
    return meetingsWithDetails.sort((a, b) => 
      new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );
  }
}

export const openF1Service = new OpenF1Service();
