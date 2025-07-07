// OpenF1 API Types
export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  meeting_year: number;
}

export interface Session {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  meeting_key: number;
}

export interface Circuit {
  circuit_key: number;
  circuit_short_name: string;
  circuit_name: string;
  circuit_length: number;
  country_key: number;
  country_code: string;
  country_name: string;
  location: string;
  number_of_turns: number;
  year_first_race: number;
}

export interface SessionResult {
  position: number;
  driver_number: number;
  time_gap: number | null;
  number_of_laps: number;
  meeting_key: number;
  session_key: number;
}

export interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string;
  headshot_url?: string;
}

export interface SessionWithResults extends Session {
  results?: SessionResult[];
  drivers?: Driver[];
  isLoadingResults?: boolean;
}

export interface MeetingWithSessions extends Meeting {
  sessions: SessionWithResults[];
  circuit?: Circuit;
  isUpcoming?: boolean;
}
